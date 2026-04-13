import json
import time
from decimal import Decimal
from unittest.mock import patch, MagicMock

import pytest
from django.core.cache import cache
from rest_framework.test import APIRequestFactory, force_authenticate

from apps.generate.ai_client.base import AIResponse
from apps.generate.ai_client.exceptions import AIProviderUnavailableError
from apps.generate.models import AIUsage
from apps.generate.views import GenerateProductContentView, StreamGenerateView
from apps.orgs.models import Organization


@pytest.fixture(autouse=True)
def _test_settings(settings):
    settings.FEATURE_FLAGS = {'AI_GENERATION': True}
    settings.CACHES = {
        'default': {'BACKEND': 'django.core.cache.backends.locmem.LocMemCache'}
    }
    # Clear cache between tests to prevent leakage
    from django.core.cache import cache
    cache.clear()


VALID_AI_RESPONSE_JSON = json.dumps({
    'title': 'Test Product Title',
    'short_description': 'A short description of the product.',
    'long_description': 'A longer and more detailed description of the product for marketing purposes.',
    'keywords': ['test', 'product', 'marketing'],
    'seo_meta': 'SEO meta description for the product.',
})

MOCK_AI_RESPONSE = AIResponse(
    content=VALID_AI_RESPONSE_JSON,
    tokens_in=100,
    tokens_out=50,
    model='test-model',
    cost_usd=Decimal('0.001'),
)


def _make_mock_client(ai_response=None):
    mock_client = MagicMock()
    mock_client.generate.return_value = ai_response or MOCK_AI_RESPONSE
    return mock_client


@pytest.fixture
def org(db):
    return Organization.objects.create(
        name='Test Org',
        clerk_org_id='org_test_views',
        monthly_generation_limit=100,
        generations_used_this_month=0,
    )


@pytest.fixture
def factory():
    return APIRequestFactory()


@pytest.fixture
def valid_payload():
    return {
        'product_name': 'Test Product',
        'category': 'food',
        'tone': 'professional',
        'language': 'ar',
    }


def _make_request(factory, org, payload, method='post', path='/api/generate/product-content/'):
    """Build a DRF request with org attached and auth forced."""
    if method == 'post':
        request = factory.post(path, data=payload, format='json')
    else:
        request = factory.get(path)
    mock_user = MagicMock()
    force_authenticate(request, user=mock_user)
    # Attach org (normally set by ClerkJWTAuthentication)
    request.org = org
    return request


@pytest.mark.django_db
class TestGenerateProductContentView:

    def test_generate_product_content_arabic(self, factory, org, valid_payload):
        valid_payload['language'] = 'ar'
        request = _make_request(factory, org, valid_payload)

        with patch('apps.generate.views.get_ai_client', return_value=_make_mock_client()):
            response = GenerateProductContentView.as_view()(request)

        assert response.status_code == 200
        assert 'title' in response.data
        assert 'short_description' in response.data
        assert 'long_description' in response.data
        assert 'keywords' in response.data
        assert 'seo_meta' in response.data
        assert 'session_id' in response.data
        assert response.data['cached'] is False

    def test_generate_product_content_english(self, factory, org, valid_payload):
        valid_payload['language'] = 'en'
        request = _make_request(factory, org, valid_payload)

        with patch('apps.generate.views.get_ai_client', return_value=_make_mock_client()):
            response = GenerateProductContentView.as_view()(request)

        assert response.status_code == 200

    def test_generate_product_content_bilingual(self, factory, org, valid_payload):
        valid_payload['language'] = 'bilingual'
        request = _make_request(factory, org, valid_payload)

        with patch('apps.generate.views.get_ai_client', return_value=_make_mock_client()):
            response = GenerateProductContentView.as_view()(request)

        assert response.status_code == 200

    def test_validation_error_returns_400(self, factory, org):
        request = _make_request(factory, org, {'invalid': 'data'})

        response = GenerateProductContentView.as_view()(request)

        assert response.status_code == 400
        assert response.data['code'] == 'VALIDATION_ERROR'
        assert 'details' in response.data

    def test_ai_provider_unavailable_returns_503(self, factory, org, valid_payload):
        mock_client = MagicMock()
        mock_client.generate.side_effect = AIProviderUnavailableError('Provider down')
        request = _make_request(factory, org, valid_payload)

        with patch('apps.generate.views.get_ai_client', return_value=mock_client):
            response = GenerateProductContentView.as_view()(request)

        assert response.status_code == 503
        assert response.data['code'] == 'AI_PROVIDER_UNAVAILABLE'

    def test_ai_response_retry_on_invalid_json(self, factory, org, valid_payload):
        mock_client = MagicMock()
        bad_response = AIResponse(
            content='not json', tokens_in=10, tokens_out=5,
            model='test', cost_usd=Decimal('0.001'),
        )
        mock_client.generate.side_effect = [bad_response, MOCK_AI_RESPONSE]
        request = _make_request(factory, org, valid_payload)

        with patch('apps.generate.views.get_ai_client', return_value=mock_client):
            response = GenerateProductContentView.as_view()(request)

        assert response.status_code == 200

    def test_ai_response_double_failure_returns_422(self, factory, org, valid_payload):
        mock_client = MagicMock()
        bad_response = AIResponse(
            content='not json', tokens_in=10, tokens_out=5,
            model='test', cost_usd=Decimal('0.001'),
        )
        mock_client.generate.return_value = bad_response
        request = _make_request(factory, org, valid_payload)

        with patch('apps.generate.views.get_ai_client', return_value=mock_client):
            response = GenerateProductContentView.as_view()(request)

        assert response.status_code == 422
        assert response.data['code'] == 'AI_RESPONSE_INVALID'
        # Verify cumulative cost is recorded
        usage = AIUsage.objects.get(org=org, success=False)
        assert usage.tokens_in == 20  # 10 per attempt * 2

    def test_cache_hit_skips_ai_call(self, factory, org, valid_payload):
        mock_client = MagicMock()
        mock_client.generate.return_value = MOCK_AI_RESPONSE
        view = GenerateProductContentView.as_view()

        with patch('apps.generate.views.get_ai_client', return_value=mock_client):
            # First request — cache miss
            req1 = _make_request(factory, org, valid_payload)
            resp1 = view(req1)
            assert resp1.status_code == 200
            assert resp1.data['cached'] is False

            # Second request — cache hit
            req2 = _make_request(factory, org, valid_payload)
            resp2 = view(req2)
            assert resp2.status_code == 200
            assert resp2.data['cached'] is True

        assert mock_client.generate.call_count == 1

    def test_multi_tenant_isolation(self, factory, org, valid_payload):
        org2 = Organization.objects.create(
            name='Other Org',
            clerk_org_id='org_test_other',
            monthly_generation_limit=100,
            generations_used_this_month=0,
        )

        mock_client = MagicMock()
        mock_client.generate.return_value = MOCK_AI_RESPONSE
        view = GenerateProductContentView.as_view()

        with patch('apps.generate.views.get_ai_client', return_value=mock_client):
            req1 = _make_request(factory, org, valid_payload)
            view(req1)

            req2 = _make_request(factory, org2, valid_payload)
            view(req2)

        assert mock_client.generate.call_count == 2
        assert AIUsage.objects.filter(org=org).exists()
        assert AIUsage.objects.filter(org=org2).exists()


@pytest.mark.django_db
class TestFeatureFlagDisabled:
    def test_feature_flag_disabled_returns_404(self, factory, org, valid_payload, settings):
        settings.FEATURE_FLAGS = {'AI_GENERATION': False}
        request = _make_request(factory, org, valid_payload)
        response = GenerateProductContentView.as_view()(request)
        assert response.status_code == 404


@pytest.mark.django_db
class TestStreamGenerateView:

    def test_missing_session_id_returns_400(self, factory, org):
        request = _make_request(factory, org, None, method='get', path='/api/generate/stream/')
        response = StreamGenerateView.as_view()(request)
        assert response.status_code == 400

    def test_invalid_session_returns_404(self, factory, org):
        request = _make_request(
            factory, org, None, method='get',
            path='/api/generate/stream/?session_id=invalid-uuid',
        )
        response = StreamGenerateView.as_view()(request)
        assert response.status_code == 404

    def test_expired_session_returns_410(self, factory, org):
        session_id = 'test-session-expired'
        session_data = json.dumps({
            'org_id': org.pk,
            'inputs': {
                'product_name': 'test', 'category': 'food',
                'price': None, 'target_audience': '',
                'tone': 'casual', 'language': 'en',
            },
            'expires_at': time.time() - 1,  # already expired
        })
        cache.set(f'stream_session:{session_id}', session_data, timeout=300)

        request = _make_request(
            factory, org, None, method='get',
            path=f'/api/generate/stream/?session_id={session_id}',
        )
        response = StreamGenerateView.as_view()(request)
        assert response.status_code == 410
        assert response.data['code'] == 'SESSION_EXPIRED'

    def test_wrong_org_returns_403(self, factory, org):
        org2 = Organization.objects.create(
            name='Other Org',
            clerk_org_id='org_stream_other',
            monthly_generation_limit=100,
        )

        session_id = 'test-session-403'
        session_data = json.dumps({
            'org_id': org.pk,
            'inputs': {
                'product_name': 'test', 'category': 'food',
                'price': None, 'target_audience': '',
                'tone': 'casual', 'language': 'en',
            },
            'expires_at': time.time() + 300,
        })
        cache.set(f'stream_session:{session_id}', session_data, timeout=300)

        request = _make_request(
            factory, org2, None, method='get',
            path=f'/api/generate/stream/?session_id={session_id}',
        )
        response = StreamGenerateView.as_view()(request)
        assert response.status_code == 403

    def test_successful_stream(self, factory, org):
        session_id = 'test-session-stream-ok'
        session_data = json.dumps({
            'org_id': org.pk,
            'inputs': {
                'product_name': 'test', 'category': 'food',
                'price': None, 'target_audience': '',
                'tone': 'casual', 'language': 'en',
            },
            'expires_at': time.time() + 300,
        })
        cache.set(f'stream_session:{session_id}', session_data, timeout=300)

        mock_ai_response = AIResponse(
            content='', tokens_in=50, tokens_out=30,
            model='test-model', cost_usd=Decimal('0.001'),
        )

        def fake_stream(prompt, system, max_tokens=2048):
            yield 'Hello'
            yield ' World'
            return mock_ai_response

        mock_client = MagicMock()
        mock_client.stream = fake_stream

        request = _make_request(
            factory, org, None, method='get',
            path=f'/api/generate/stream/?session_id={session_id}',
        )

        with patch('apps.generate.views.get_ai_client', return_value=mock_client):
            response = StreamGenerateView.as_view()(request)

            assert response.status_code == 200
            assert response['Content-Type'] == 'text/event-stream'
            # Must iterate inside the patch context — StreamingHttpResponse is lazy
            chunks = list(response.streaming_content)

        decoded = [c.decode() if isinstance(c, bytes) else c for c in chunks]
        assert any('Hello' in c for c in decoded)
        assert any('[DONE]' in c for c in decoded)
        # Verify AIUsage was recorded
        assert AIUsage.objects.filter(org=org, model='test-model').exists()
