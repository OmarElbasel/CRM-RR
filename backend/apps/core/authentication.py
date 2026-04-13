"""
Clerk JWT authentication for Django REST Framework.
Validates RS256 JWTs issued by Clerk, extracts org_id claim,
and sets request.org to the matching Organization instance.
Constitution Principles I (multi-tenant) and III (bilingual errors).
"""
import jwt
from jwt import PyJWKClient, PyJWKClientError
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings
from drf_spectacular.extensions import OpenApiAuthenticationExtension


class ClerkJWTAuthenticationScheme(OpenApiAuthenticationExtension):
    """
    Registers ClerkJWTAuthentication with drf-spectacular so that
    protected endpoints show the 'Bearer' lock icon in Swagger UI.
    """
    target_class = 'apps.core.authentication.ClerkJWTAuthentication'
    name = 'ClerkJWT'

    def get_security_definition(self, auto_schema):
        return {
            'type': 'http',
            'scheme': 'bearer',
            'bearerFormat': 'JWT',
            'description': 'Clerk-issued RS256 JWT. Obtain via the Clerk frontend SDK (getToken()).',
        }


class ClerkJWTAuthentication(BaseAuthentication):
    """
    DRF authentication class that validates Clerk-issued JWTs.
    Sets request.org on successful authentication.
    """

    _jwks_client: PyJWKClient | None = None

    @classmethod
    def _get_jwks_client(cls) -> PyJWKClient:
        """Return a cached JWKS client (fetches on first call, then caches)."""
        if cls._jwks_client is None:
            cls._jwks_client = PyJWKClient(settings.CLERK_JWKS_URL, cache_keys=True)
        return cls._jwks_client

    def authenticate(self, request):
        """
        Returns (user_dict, token) on success.
        Returns None if no Authorization header (allows other authenticators to try).
        Raises AuthenticationFailed on invalid/expired token.
        """
        auth_header = request.headers.get('Authorization', '')

        if not auth_header.startswith('Bearer '):
            return None  # No token — let permission class handle it

        token = auth_header.split(' ', 1)[1].strip()
        if not token:
            return None

        # Decode and validate the JWT
        try:
            client = self._get_jwks_client()
            signing_key = client.get_signing_key_from_jwt(token)
            claims = jwt.decode(
                token,
                signing_key.key,
                algorithms=['RS256'],
                issuer=settings.CLERK_ISSUER if settings.CLERK_ISSUER else None,
                options={
                    'verify_exp': True,
                    'verify_iss': bool(settings.CLERK_ISSUER),
                },
            )
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed({
                'error': 'Token has expired.',
                'error_ar': 'انتهت صلاحية الرمز.',
            })
        except (jwt.InvalidTokenError, PyJWKClientError) as exc:
            raise AuthenticationFailed({
                'error': f'Invalid token: {exc}',
                'error_ar': 'رمز المصادقة غير صالح.',
            })

        # Extract org_id claim (Clerk sets this when user belongs to an org)
        clerk_org_id = claims.get('org_id')
        if not clerk_org_id:
            raise AuthenticationFailed({
                'error': 'Token is missing org_id claim. Ensure the user belongs to an organization.',
                'error_ar': 'الرمز لا يحتوي على معرّف المنظمة. تأكد من أن المستخدم ينتمي إلى منظمة.',
            })

        # Look up the Organization (Constitution Principle I)
        from apps.orgs.models import Organization  # import here to avoid circular import
        try:
            org = Organization.objects.get(clerk_org_id=clerk_org_id, is_active=True)
        except Organization.DoesNotExist:
            raise AuthenticationFailed({
                'error': 'Organization not found or is inactive.',
                'error_ar': 'المنظمة غير موجودة أو غير نشطة.',
            })

        # Attach org to request — views use request.org to scope queries
        request.org = org

        # Return (user representation, raw token)
        user_repr = {
            'clerk_user_id': claims.get('sub', ''),
            'email': claims.get('email', ''),
            'org_id': clerk_org_id,
        }
        return (user_repr, token)

    def authenticate_header(self, request) -> str:
        return 'Bearer realm="Rawaj API"'


class PublicKeyAuthenticationScheme(OpenApiAuthenticationExtension):
    """
    Registers PublicKeyAuthentication with drf-spectacular so that
    widget endpoints show the API Key lock icon in Swagger UI.
    """
    target_class = 'apps.core.authentication.PublicKeyAuthentication'
    name = 'PublicAPIKey'

    def get_security_definition(self, auto_schema):
        return {
            'type': 'apiKey',
            'in': 'header',
            'name': 'X-API-Key',
            'description': 'Public API key for widget embed (pk_live_xxx or pk_test_xxx).',
        }


class PublicKeyAuthentication(BaseAuthentication):
    """
    DRF authentication class that validates public API keys (pk_xxx).
    Used by the embedded widget which cannot use Clerk JWT.
    Sets request.org on successful authentication.
    """

    def authenticate(self, request):
        api_key = request.headers.get('X-API-Key', '')

        if not api_key or not api_key.startswith('pk_'):
            return None  # No API key — let other authenticators try

        from apps.orgs.models import Organization
        try:
            org = Organization.objects.get(api_key_public=api_key, is_active=True)
        except Organization.DoesNotExist:
            raise AuthenticationFailed({
                'error': 'Invalid API key',
                'error_ar': 'مفتاح API غير صالح',
            })

        request.org = org

        return ({'api_key': api_key, 'org_id': org.clerk_org_id}, api_key)

    def authenticate_header(self, request) -> str:
        return 'X-API-Key realm="Rawaj Widget"'
