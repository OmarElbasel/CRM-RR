from .base import *  # noqa: F401, F403

DEBUG = True
ALLOWED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0', '1e5fd1fb657caa.lhr.life']

# Allow all CORS origins in development
CORS_ALLOW_ALL_ORIGINS = True

# Use in-memory cache in development — no Redis required locally.
# LocMemCache works for OAuth nonces because install + callback hit the same runserver process.
# Production keeps django_redis (defined in base.py).
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
    }
}
