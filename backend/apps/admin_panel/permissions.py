import jwt
from jwt import PyJWKClient, PyJWKClientError
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import BasePermission
from django.conf import settings


class AdminJWTAuthentication(BaseAuthentication):
    """
    Like ClerkJWTAuthentication but does NOT require org_id.
    Used exclusively for /api/admin/* endpoints where the operator
    may not have an active organization selected in Clerk.
    Sets request.user to a dict with clerk_user_id and email.
    Does NOT set request.org.
    """
    _jwks_client = None

    @classmethod
    def _get_jwks_client(cls):
        if cls._jwks_client is None:
            cls._jwks_client = PyJWKClient(settings.CLERK_JWKS_URL, cache_keys=True)
        return cls._jwks_client

    def authenticate(self, request):
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return None

        token = auth_header.split(' ', 1)[1].strip()
        if not token:
            return None

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
            raise AuthenticationFailed({'error': 'Token has expired.', 'code': 'TOKEN_EXPIRED'})
        except (jwt.InvalidTokenError, PyJWKClientError) as exc:
            raise AuthenticationFailed({'error': f'Invalid token: {exc}', 'code': 'TOKEN_INVALID'})

        user_repr = {
            'clerk_user_id': claims.get('sub', ''),
            'email': claims.get('email', ''),
        }
        return (user_repr, token)

    def authenticate_header(self, request):
        return 'Bearer realm="Rawaj Admin API"'


class IsStaffUser(BasePermission):
    """
    Only allows Clerk users whose sub claim (clerk_user_id) is in ADMIN_CLERK_USER_IDS.
    Must be used with AdminJWTAuthentication.
    """
    message = {'error': 'Admin access required.', 'code': 'NOT_STAFF'}

    def has_permission(self, request, view):
        if not request.user or not isinstance(request.user, dict):
            return False
        clerk_user_id = request.user.get('clerk_user_id', '')
        return clerk_user_id in settings.ADMIN_CLERK_USER_IDS
