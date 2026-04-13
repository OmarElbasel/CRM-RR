import environ
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent.parent

env = environ.Env()

# Read .env file if it exists (development only)
environ.Env.read_env(BASE_DIR / '.env', overwrite=False)

# SECURITY — required, will raise ImproperlyConfigured if missing
SECRET_KEY = env('SECRET_KEY')

DEBUG = env.bool('DEBUG', default=False)

ALLOWED_HOSTS = env.list('ALLOWED_HOSTS', default=['localhost', '127.0.0.1'])

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Third-party
    'rest_framework',
    'drf_spectacular',
    'drf_spectacular_sidecar',
    'corsheaders',
    # Internal
    'apps.core',
    'apps.orgs',
    'apps.generate',
    'apps.embed_auth',
    'apps.billing',
    'apps.inbox',
    'apps.pipeline',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # must be directly after SecurityMiddleware
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'apps.generate.middleware.TokenBudgetMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# Database
DATABASES = {
    'default': env.db('DATABASE_URL', default='sqlite:///db.sqlite3'),
}

CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': env('REDIS_URL', default='redis://localhost:6379/0'),
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        },
    },
}

# Celery (task queue — used for monthly budget reset in Phase 4)
CELERY_BROKER_URL = env('REDIS_URL', default='redis://localhost:6379/0')
CELERY_RESULT_BACKEND = env('REDIS_URL', default='redis://localhost:6379/0')
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Use STORAGES dict (Django 4.2+ style) instead of deprecated STATICFILES_STORAGE.
# WhiteNoise serves static files (admin, Swagger UI) from gunicorn — no CDN needed.
STORAGES = {
    'default': {
        'BACKEND': 'django.core.files.storage.FileSystemStorage',
    },
    'staticfiles': {
        'BACKEND': 'whitenoise.storage.CompressedManifestStaticFilesStorage',
    },
}

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Django REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'apps.core.authentication.ClerkJWTAuthentication',
        'apps.core.authentication.PublicKeyAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}

# drf-spectacular (OpenAPI docs — Constitution Principle V)
SPECTACULAR_SETTINGS = {
    'TITLE': 'Rawaj AI Plugin API',
    'DESCRIPTION': 'AI-powered product description generator for Gulf e-commerce merchants.',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
    # Public — no auth required (Constitution Principle V)
    'SERVE_PERMISSIONS': ['rest_framework.permissions.AllowAny'],
    # Serve Swagger UI from local static files (no CDN dependency)
    'SWAGGER_UI_DIST': 'SIDECAR',
    'SWAGGER_UI_FAVICON_HREF': 'SIDECAR',
    'REDOC_DIST': 'SIDECAR',
    'COMPONENT_SPLIT_REQUEST': True,
    'SORT_OPERATIONS': False,
    'TAGS': [
        {'name': 'Health', 'description': 'Service health and status endpoints'},
        {'name': 'Organizations', 'description': 'Tenant management'},
        {'name': 'Generation', 'description': 'AI-powered product content generation'},
        {'name': 'Embed', 'description': 'Widget embedding and public key validation'},
        {'name': 'Billing', 'description': 'Stripe billing, plan management, and API key rotation'},
        {'name': 'Inbox', 'description': 'Unified social inbox — conversations, messages, and AI processing'},
        {'name': 'Channels', 'description': 'Social channel OAuth connection, disconnect, and management'},
        {'name': 'Pipeline', 'description': 'CRM pipeline — deals, tasks, and notifications'},
    ],
}

# Clerk JWT settings (Constitution Principle I & III)
# These have safe defaults for local development only.
# Production MUST override both in Railway env vars (see production.py).
CLERK_JWKS_URL = env('CLERK_JWKS_URL', default='https://api.clerk.dev/v1/jwks')
CLERK_ISSUER = env('CLERK_ISSUER', default='')

# CORS — allow frontend to call backend
CORS_ALLOWED_ORIGINS = env.list('CORS_ALLOWED_ORIGINS', default=[
    'http://localhost:3000',
])
# Widget embeds run on arbitrary merchant domains — set CORS_ALLOW_ALL_ORIGINS=true in production
CORS_ALLOW_ALL_ORIGINS = env.bool('CORS_ALLOW_ALL_ORIGINS', default=False)
# Allow X-API-Key header for widget embed requests
from corsheaders.defaults import default_headers  # noqa: E402
CORS_ALLOW_HEADERS = list(default_headers) + ['X-API-Key']

# Feature Flags (Constitution Principle IV)
# All default to False — features are off until explicitly enabled
FEATURE_FLAGS = {
    'AI_GENERATION': env.bool('FLAG_AI_GENERATION', default=False),
    'BILLING': env.bool('FLAG_BILLING', default=False),
    'SALLA_INTEGRATION': env.bool('FLAG_SALLA_INTEGRATION', default=False),
    'ZID_INTEGRATION': env.bool('FLAG_ZID_INTEGRATION', default=False),
    'PLUGIN_EMBED': env.bool('FLAG_PLUGIN_EMBED', default=False),
    'INBOX_ENABLED': env.bool('FLAG_INBOX_ENABLED', default=False),
    'PIPELINE_ENABLED': env.bool('FLAG_PIPELINE_ENABLED', default=False),
}

# AI Provider configuration (Constitution Principle II — provider-agnostic)
AI_PROVIDER = env('AI_PROVIDER', default='claude')
ANTHROPIC_API_KEY = env('ANTHROPIC_API_KEY', default='')
OPENAI_API_KEY = env('OPENAI_API_KEY', default='')
GOOGLE_AI_API_KEY = env('GOOGLE_AI_API_KEY', default='')

# Stripe (Phase 4 — Billing)
STRIPE_SECRET_KEY = env('STRIPE_SECRET_KEY', default='')
STRIPE_WEBHOOK_SECRET = env('STRIPE_WEBHOOK_SECRET', default='')
STRIPE_PRICE_STARTER = env('STRIPE_PRICE_STARTER', default='')
STRIPE_PRICE_PRO = env('STRIPE_PRICE_PRO', default='')

# Fernet key for encrypting org API secret keys (Constitution — Security Requirements)
# Generate with: python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
FERNET_KEY = env('FERNET_KEY', default='').encode()

# Celery beat schedule (Phase 4 — monthly usage reset)
from celery.schedules import crontab  # noqa: E402
CELERY_BEAT_SCHEDULE = {
    'reset-monthly-usage': {
        'task': 'apps.billing.tasks.reset_monthly_usage',
        'schedule': crontab(hour=0, minute=0, day_of_month=1),
    },
    'refresh-meta-tokens': {
        'task': 'apps.inbox.tasks.refresh_meta_tokens',
        'schedule': crontab(hour=3, minute=0),
    },
    'check-stale-deals': {
        'task': 'apps.pipeline.tasks.check_stale_deals',
        'schedule': crontab(hour='*/6', minute=0),
    },
}

FRONTEND_URL = env('FRONTEND_URL', default='http://localhost:3000')

# Meta / Facebook App (Phase 5 — Unified Social Inbox)
META_APP_ID = env('META_APP_ID', default='')
META_APP_SECRET = env('META_APP_SECRET', default='')
META_WEBHOOK_VERIFY_TOKEN = env('META_WEBHOOK_VERIFY_TOKEN', default='')
