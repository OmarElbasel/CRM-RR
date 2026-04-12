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
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # must be directly after SecurityMiddleware
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
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

# Feature Flags (Constitution Principle IV)
# All default to False — features are off until explicitly enabled
FEATURE_FLAGS = {
    'AI_GENERATION': env.bool('FLAG_AI_GENERATION', default=False),
    'BILLING': env.bool('FLAG_BILLING', default=False),
    'SALLA_INTEGRATION': env.bool('FLAG_SALLA_INTEGRATION', default=False),
    'ZID_INTEGRATION': env.bool('FLAG_ZID_INTEGRATION', default=False),
}
