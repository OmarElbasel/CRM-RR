from django.utils.decorators import method_decorator
from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import serializers, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.core.flags import require_flag
from apps.orgs.models import Organization


@method_decorator(require_flag('PLUGIN_EMBED'), name='dispatch')
class ValidatePublicKeyView(APIView):
    """Validate a public API key (pk_xxx) for widget embedding."""

    authentication_classes = []
    permission_classes = [AllowAny]

    @extend_schema(
        tags=['Embed'],
        summary='Validate public API key',
        description='Validates a public API key (pk_xxx) for widget embedding. Returns org info if valid.',
        request=inline_serializer(
            name='ValidateKeyRequest',
            fields={'api_key': serializers.CharField()},
        ),
        responses={
            200: inline_serializer(
                name='ValidateKeyResponse',
                fields={
                    'valid': serializers.BooleanField(),
                    'org_name': serializers.CharField(),
                    'plan': serializers.CharField(),
                },
            ),
            400: inline_serializer(
                name='ValidateKeyErrorResponse',
                fields={
                    'error': serializers.CharField(),
                    'error_ar': serializers.CharField(),
                    'code': serializers.CharField(),
                },
            ),
            401: inline_serializer(
                name='ValidateKeyUnauthorizedResponse',
                fields={
                    'error': serializers.CharField(),
                    'error_ar': serializers.CharField(),
                    'code': serializers.CharField(),
                },
            ),
        },
    )
    def post(self, request):
        api_key = request.data.get('api_key', '')

        if not api_key or not (api_key.startswith('pk_live_') or api_key.startswith('pk_test_')):
            return Response(
                {
                    'error': 'api_key is required',
                    'error_ar': 'مفتاح API مطلوب',
                    'code': 'VALIDATION_ERROR',
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            org = Organization.objects.get(api_key_public=api_key, is_active=True)
        except Organization.DoesNotExist:
            return Response(
                {
                    'error': 'Invalid API key',
                    'error_ar': 'مفتاح API غير صالح',
                    'code': 'INVALID_API_KEY',
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )

        return Response(
            {
                'valid': True,
                'org_name': org.name,
                'plan': org.plan,
            },
            status=status.HTTP_200_OK,
        )
