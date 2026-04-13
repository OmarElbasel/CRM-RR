import pytest
from django.test import RequestFactory
from unittest.mock import patch, MagicMock

from apps.generate.middleware import TokenBudgetMiddleware


class TestTokenBudgetMiddleware:
    def setup_method(self):
        self.factory = RequestFactory()
        self.get_response = MagicMock(return_value=MagicMock(status_code=200))
        self.middleware = TokenBudgetMiddleware(self.get_response)
        # Reset cached JWKS client between tests
        TokenBudgetMiddleware._jwks_client = None

    def test_non_generate_path_passes_through(self):
        request = self.factory.get('/api/health/')
        response = self.middleware(request)
        self.get_response.assert_called_once_with(request)

    def test_generate_path_without_auth_passes_through(self):
        request = self.factory.get('/api/generate/product-content/')
        response = self.middleware(request)
        self.get_response.assert_called_once_with(request)

    def test_generate_path_passes_through_when_flag_disabled(self, settings):
        settings.FEATURE_FLAGS = {'AI_GENERATION': False}
        request = self.factory.post('/api/generate/product-content/')
        response = self.middleware(request)
        self.get_response.assert_called_once_with(request)

    @pytest.mark.django_db
    def test_budget_exceeded_returns_429(self, settings):
        settings.FEATURE_FLAGS = {'AI_GENERATION': True}
        from apps.orgs.models import Organization
        org = Organization.objects.create(
            name='Test Org',
            clerk_org_id='org_test_budget',
            monthly_generation_limit=5,
            generations_used_this_month=5,
        )

        request = self.factory.post('/api/generate/product-content/')

        with patch.object(self.middleware, '_resolve_org', return_value=org):
            response = self.middleware(request)

        assert response.status_code == 429
        import json
        data = json.loads(response.content)
        assert data['code'] == 'BUDGET_EXCEEDED'

    @pytest.mark.django_db
    def test_budget_available_passes_through(self, settings):
        settings.FEATURE_FLAGS = {'AI_GENERATION': True}
        from apps.orgs.models import Organization
        org = Organization.objects.create(
            name='Test Org',
            clerk_org_id='org_test_available',
            monthly_generation_limit=20,
            generations_used_this_month=5,
        )

        request = self.factory.post('/api/generate/product-content/')

        with patch.object(self.middleware, '_resolve_org', return_value=org):
            response = self.middleware(request)

        self.get_response.assert_called_once_with(request)
