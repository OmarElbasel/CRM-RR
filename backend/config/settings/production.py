from .base import *  # noqa: F401, F403

DEBUG = False

# Require HTTPS in production
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_SSL_REDIRECT = False  # Railway handles SSL termination
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

# These must be set explicitly in production — no defaults allowed.
# Missing = ImproperlyConfigured raised at startup (fail-safe).
ALLOWED_HOSTS = env.list('ALLOWED_HOSTS')  # type: ignore[assignment]

# Clerk — required in production; generic defaults from base.py are unsafe.
CLERK_JWKS_URL = env('CLERK_JWKS_URL')   # type: ignore[assignment]
CLERK_ISSUER = env('CLERK_ISSUER')       # type: ignore[assignment]
