---
description: "Task list for Phase 1 — Project Foundation & Infrastructure"
---

# Tasks: Project Foundation & Infrastructure

**Input**: Design documents from `specs/001-project-foundation/`
**Branch**: `001-project-foundation`
**Stack**: Python 3.12 + Django 6 + DRF (backend) · Node.js 20 + Next.js 14 + TypeScript (frontend)
**Prerequisites**: plan.md ✅ · spec.md ✅ · research.md ✅ · data-model.md ✅ · contracts/ ✅ · quickstart.md ✅

**Tests**: NOT requested — no test tasks generated.
**User**: Tasks are written so a smaller LLM can implement each one independently.
Every task includes the exact file path, exact content or structure, and all
dependencies it needs from previous tasks.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (touches different files, no dependency on an incomplete task)
- **[Story]**: Which user story this task belongs to (US1–US5)
- Every task includes the exact file path and what to write

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Repository initialization before any service code is written.
All tasks in this phase are independent and can run in parallel.

- [x] T001 Create `backend/` directory at repo root: `mkdir -p backend/apps/core/management/commands backend/apps/orgs/migrations backend/config/settings backend/requirements`

- [x] T002 Create `frontend/` directory at repo root: `mkdir -p frontend/src/app/health frontend/src/lib frontend/public`

- [x] T003 [P] Write root `.gitignore` at repo root with these exact contents:
  ```
  # Environment files — NEVER commit these
  .env
  .env.local
  .env.production
  .env.development
  backend/.env
  frontend/.env.local
  frontend/.env.production

  # Python
  __pycache__/
  *.pyc
  *.pyo
  .venv/
  venv/
  *.egg-info/
  .pytest_cache/
  .ruff_cache/
  htmlcov/
  .coverage

  # Django
  backend/staticfiles/
  backend/media/
  backend/db.sqlite3

  # Next.js
  frontend/.next/
  frontend/node_modules/
  frontend/out/

  # OS
  .DS_Store
  Thumbs.db
  ```

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before any user story phase begins.
Complete these tasks in order — later tasks depend on earlier ones in this phase.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T004 Write `backend/requirements/base.txt` with exact contents:
  ```
  Django==6.0.*
  djangorestframework==3.15.*
  drf-spectacular==0.27.*
  drf-spectacular[sidecar]==0.27.*
  django-environ==0.11.*
  django-cors-headers==4.3.*
  psycopg[binary]==3.1.*
  PyJWT==2.8.*
  cryptography==42.*
  gunicorn==22.*
  ```

- [x] T005 [P] Write `backend/requirements/development.txt` with exact contents:
  ```
  -r base.txt
  pytest==8.*
  pytest-django==4.*
  black==24.*
  ruff==0.4.*
  ```

- [x] T006 [P] Write `backend/requirements/production.txt` with exact contents:
  ```
  -r base.txt
  ```

- [x] T007 Write `backend/manage.py` with exact contents:
  ```python
  #!/usr/bin/env python
  """Django's command-line utility for administrative tasks."""
  import os
  import sys


  def main():
      """Run administrative tasks."""
      os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
      try:
          from django.core.management import execute_from_command_line
      except ImportError as exc:
          raise ImportError(
              "Couldn't import Django. Are you sure it's installed and "
              "available on your PYTHONPATH environment variable? Did you "
              "forget to activate a virtual environment?"
          ) from exc
      execute_from_command_line(sys.argv)


  if __name__ == '__main__':
      main()
  ```

- [x] T008 Write `backend/config/__init__.py` as an empty file.

- [x] T009 Write `backend/config/settings/__init__.py` as an empty file.

- [x] T010 Write `backend/config/settings/base.py` with exact contents:
  ```python
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
  ```

- [x] T011 Write `backend/config/settings/development.py` with exact contents:
  ```python
  from .base import *  # noqa: F401, F403

  DEBUG = True
  ALLOWED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0']

  # Allow all CORS origins in development
  CORS_ALLOW_ALL_ORIGINS = True
  ```

- [x] T012 Write `backend/config/settings/production.py` with exact contents:
  ```python
  from .base import *  # noqa: F401, F403

  DEBUG = False

  # Require HTTPS in production
  SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
  SECURE_SSL_REDIRECT = False  # Railway handles SSL termination
  SESSION_COOKIE_SECURE = True
  CSRF_COOKIE_SECURE = True
  ```

- [x] T013 Write `backend/config/urls.py` with exact contents:
  ```python
  from django.contrib import admin
  from django.urls import path, include
  from drf_spectacular.views import (
      SpectacularAPIView,
      SpectacularSwaggerView,
      SpectacularRedocView,
  )

  urlpatterns = [
      path('admin/', admin.site.urls),
      path('api/', include('apps.core.urls')),
      # OpenAPI schema + docs — publicly accessible (Constitution Principle V)
      path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
      path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
      path('api/docs/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
  ]
  ```

- [x] T014 Write `backend/config/wsgi.py` with exact contents:
  ```python
  import os
  from django.core.wsgi import get_wsgi_application

  os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.production')

  application = get_wsgi_application()
  ```

- [x] T015 Write `backend/config/asgi.py` with exact contents:
  ```python
  import os
  from django.core.asgi import get_asgi_application

  os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.production')

  application = get_asgi_application()
  ```

- [x] T016 Write `backend/apps/__init__.py` as an empty file.

- [x] T017 Write `backend/apps/core/__init__.py` as an empty file.

- [x] T018 Write `backend/apps/core/apps.py` with exact contents:
  ```python
  from django.apps import AppConfig


  class CoreConfig(AppConfig):
      default_auto_field = 'django.db.models.BigAutoField'
      name = 'apps.core'
      label = 'core'
  ```

- [x] T019 Write `backend/apps/orgs/__init__.py` as an empty file.

- [x] T020 Write `backend/apps/orgs/apps.py` with exact contents:
  ```python
  from django.apps import AppConfig


  class OrgsConfig(AppConfig):
      default_auto_field = 'django.db.models.BigAutoField'
      name = 'apps.orgs'
      label = 'orgs'
  ```

- [x] T021 Write `backend/apps/orgs/models.py` with exact contents:
  ```python
  from django.db import models


  class Organization(models.Model):
      """
      Top-level tenant unit. Every piece of data in the system belongs to exactly
      one Organization. Constitution Principle I — all queries must be scoped to org.
      """

      PLAN_CHOICES = [
          ('free', 'Free'),
          ('starter', 'Starter'),
          ('pro', 'Pro'),
          ('enterprise', 'Enterprise'),
      ]

      name = models.CharField(max_length=255)
      # clerk_org_id matches the 'org_id' claim in Clerk JWTs
      clerk_org_id = models.CharField(max_length=255, unique=True, db_index=True)
      plan = models.CharField(max_length=20, choices=PLAN_CHOICES, default='free')
      is_active = models.BooleanField(default=True)
      created_at = models.DateTimeField(auto_now_add=True)
      updated_at = models.DateTimeField(auto_now=True)

      class Meta:
          verbose_name = 'Organization'
          verbose_name_plural = 'Organizations'
          ordering = ['-created_at']

      def __str__(self) -> str:
          return f'{self.name} ({self.plan})'
  ```

- [x] T022 Write `backend/apps/core/models.py` with exact contents:
  ```python
  from django.db import models


  class OrgScopedModel(models.Model):
      """
      Abstract base for all tenant-scoped models. Constitution Principle I.
      Every concrete subclass MUST be queried with .filter(org=request.org).
      The FK enforces the structural relationship; view filtering enforces access control.
      """

      org = models.ForeignKey(
          'orgs.Organization',
          on_delete=models.CASCADE,
          db_index=True,
      )

      class Meta:
          abstract = True
  ```

- [x] T023 Write `backend/apps/core/authentication.py` with exact contents:
  ```python
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
  ```

- [x] T024 Write `backend/apps/core/flags.py` with exact contents:
  ```python
  """
  Feature flag utilities. Constitution Principle IV.
  All flags default to False (fail-safe). Unknown flags are treated as disabled.
  """
  from functools import wraps
  from django.conf import settings


  def is_enabled(flag_name: str) -> bool:
      """
      Return True if the named feature flag is enabled.
      Unknown flags return False (fail-safe — unknown features are disabled).
      """
      return settings.FEATURE_FLAGS.get(flag_name, False)


  def require_flag(flag_name: str):
      """
      DRF view decorator. Returns HTTP 404 if the flag is disabled.
      Using 404 (not 403) makes disabled features appear non-existent to clients.

      Usage:
          @require_flag('AI_GENERATION')
          @api_view(['POST'])
          def generate_product_content(request):
              ...
      """
      def decorator(view_func):
          @wraps(view_func)
          def wrapper(*args, **kwargs):
              if not is_enabled(flag_name):
                  from rest_framework.response import Response
                  return Response(status=404)
              return view_func(*args, **kwargs)
          return wrapper
      return decorator
  ```

- [x] T025 Write `backend/apps/core/management/__init__.py` as an empty file.

- [x] T026 Write `backend/apps/core/management/commands/__init__.py` as an empty file.

- [x] T027 Write `backend/apps/core/management/commands/create_superuser_from_env.py` with exact contents:
  ```python
  """
  Management command: create a superuser from environment variables.
  Idempotent — skips creation if the superuser already exists.
  Run in Railway Procfile release process alongside `migrate`.
  """
  import os
  from django.contrib.auth import get_user_model
  from django.core.management.base import BaseCommand, CommandError


  class Command(BaseCommand):
      help = 'Create a superuser from DJANGO_SUPERUSER_EMAIL and DJANGO_SUPERUSER_PASSWORD env vars'

      def handle(self, *args, **kwargs):
          User = get_user_model()

          email = os.environ.get('DJANGO_SUPERUSER_EMAIL', '').strip()
          password = os.environ.get('DJANGO_SUPERUSER_PASSWORD', '').strip()

          if not email or not password:
              self.stdout.write(
                  self.style.WARNING('DJANGO_SUPERUSER_EMAIL or DJANGO_SUPERUSER_PASSWORD not set — skipping superuser creation')
              )
              return

          if User.objects.filter(email=email).exists():
              self.stdout.write(self.style.SUCCESS(f'Superuser {email} already exists — skipping'))
              return

          User.objects.create_superuser(username=email, email=email, password=password)
          self.stdout.write(self.style.SUCCESS(f'Superuser {email} created successfully'))
  ```

- [x] T028 Write `backend/apps/orgs/migrations/__init__.py` as an empty file.

- [x] T029 Write `backend/apps/orgs/admin.py` with exact contents:
  ```python
  from django.contrib import admin
  from .models import Organization


  @admin.register(Organization)
  class OrganizationAdmin(admin.ModelAdmin):
      list_display = ['name', 'clerk_org_id', 'plan', 'is_active', 'created_at']
      list_filter = ['plan', 'is_active']
      search_fields = ['name', 'clerk_org_id']
      # clerk_org_id and timestamps are managed by Clerk/system — not user-editable
      readonly_fields = ['clerk_org_id', 'created_at', 'updated_at']
      ordering = ['-created_at']
      fieldsets = [
          ('Identity', {
              'fields': ['name', 'clerk_org_id'],
          }),
          ('Plan & Status', {
              'fields': ['plan', 'is_active'],
          }),
          ('Timestamps', {
              'fields': ['created_at', 'updated_at'],
              'classes': ['collapse'],
          }),
      ]
  ```

- [x] T030 Write `backend/.env.example` with exact contents:
  ```
  # Django settings
  DJANGO_SETTINGS_MODULE=config.settings.development
  SECRET_KEY=django-insecure-replace-this-in-production

  # Database (Railway provides this automatically in production)
  DATABASE_URL=postgres://user:password@localhost:5432/rawaj_dev

  # Clerk JWT settings
  # Get these from your Clerk dashboard → API Keys → Advanced
  CLERK_JWKS_URL=https://your-clerk-domain.clerk.accounts.dev/v1/jwks
  CLERK_ISSUER=https://your-clerk-domain.clerk.accounts.dev

  # Allowed hosts (comma-separated, production only)
  ALLOWED_HOSTS=localhost,127.0.0.1

  # CORS (comma-separated list of allowed frontend origins)
  CORS_ALLOWED_ORIGINS=http://localhost:3000

  # Superuser (used by create_superuser_from_env management command)
  DJANGO_SUPERUSER_EMAIL=admin@example.com
  DJANGO_SUPERUSER_PASSWORD=change-me-in-development

  # Feature flags (all default to false — off until explicitly enabled)
  FLAG_AI_GENERATION=false
  FLAG_BILLING=false
  FLAG_SALLA_INTEGRATION=false
  FLAG_ZID_INTEGRATION=false
  ```

- [x] T031 Write `backend/Procfile` with exact contents:
  ```
  release: python manage.py migrate && python manage.py create_superuser_from_env
  web: gunicorn config.wsgi:application --bind 0.0.0.0:$PORT --workers 2 --timeout 60
  ```

- [x] T032 Write `backend/nixpacks.toml` with exact contents:
  ```toml
  [phases.setup]
  nixPkgs = ["python312"]

  [phases.install]
  cmds = ["pip install -r requirements/production.txt"]

  [phases.build]
  cmds = ["python manage.py collectstatic --noinput"]

  [start]
  cmd = "gunicorn config.wsgi:application --bind 0.0.0.0:$PORT --workers 2 --timeout 60"
  ```

**Checkpoint**: Backend scaffold complete — all files written, ready for migration in Phase 3 (US1).

---

## Phase 3: User Story 1 — Developer Onboards and Runs Both Services Locally (Priority: P1) 🎯 MVP

**Goal**: A developer can clone, follow the setup guide, and have both services running locally.
Health checks return 200. Startup fails loudly on bad env config.

**Independent Test**: Run `curl http://localhost:8000/api/health/` → `{"status":"ok","database":"ok","version":"1.0.0"}`.
Run `curl http://localhost:3000/health` → `{"status":"ok","service":"rawaj-frontend","version":"1.0.0"}`.

### Implementation for User Story 1

- [x] T033 Write `backend/apps/core/views.py` with exact contents:
  ```python
  """
  Core views: health check.
  All endpoints in this file must use @extend_schema (Constitution Principle V).
  """
  from drf_spectacular.utils import extend_schema, OpenApiResponse, inline_serializer
  from rest_framework import serializers
  from rest_framework.decorators import api_view, permission_classes, authentication_classes
  from rest_framework.permissions import AllowAny
  from rest_framework.response import Response
  from django.db import connection, OperationalError


  @extend_schema(
      summary='Health check',
      description='Returns service health status and database connectivity. Public endpoint — no authentication required.',
      responses={
          200: inline_serializer(
              name='HealthCheckResponse',
              fields={
                  'status': serializers.ChoiceField(choices=['ok', 'degraded']),
                  'database': serializers.ChoiceField(choices=['ok', 'error']),
                  'version': serializers.CharField(),
              },
          ),
          503: inline_serializer(
              name='HealthCheckDegradedResponse',
              fields={
                  'status': serializers.ChoiceField(choices=['ok', 'degraded']),
                  'database': serializers.ChoiceField(choices=['ok', 'error']),
                  'version': serializers.CharField(),
              },
          ),
      },
      tags=['Health'],
  )
  @api_view(['GET'])
  @authentication_classes([])   # No auth — public endpoint
  @permission_classes([AllowAny])
  def health_check(request):
      """
      Public health check endpoint. Used by Railway health probes.
      Returns 200 when healthy, 503 when database is unreachable.
      """
      db_ok = True
      try:
          connection.ensure_connection()
      except OperationalError:
          db_ok = False

      status_code = 200 if db_ok else 503
      return Response(
          {
              'status': 'ok' if db_ok else 'degraded',
              'database': 'ok' if db_ok else 'error',
              'version': '1.0.0',
          },
          status=status_code,
      )
  ```

- [x] T034 Write `backend/apps/core/urls.py` with exact contents:
  ```python
  from django.urls import path
  from . import views

  urlpatterns = [
      path('health/', views.health_check, name='health-check'),
  ]
  ```

- [x] T035 Run Django migrations from inside the `backend/` directory:
  ```bash
  cd backend
  pip install -r requirements/development.txt
  python manage.py makemigrations orgs
  python manage.py migrate
  ```
  Expected output: `Applying orgs.0001_initial... OK` with no errors.

- [x] T036 [P] Write `frontend/package.json`. First, scaffold Next.js 14 by running:
  ```bash
  cd frontend
  npx create-next-app@14 . --typescript --tailwind --app --src-dir --import-alias "@/*" --no-eslint --yes
  ```
  This creates `package.json`, `tsconfig.json`, `tailwind.config.ts`, `next.config.ts`, `src/app/layout.tsx`, `src/app/page.tsx`, and `src/app/globals.css` automatically.

- [x] T037 Install Clerk SDK in the frontend:
  ```bash
  cd frontend
  npm install @clerk/nextjs
  ```

- [x] T038 Overwrite `frontend/next.config.ts` with exact contents:
  ```typescript
  import type { NextConfig } from 'next'

  const nextConfig: NextConfig = {
    // Required for Railway — produces a minimal standalone Node.js server
    output: 'standalone',
  }

  export default nextConfig
  ```

- [x] T039 Write `frontend/nixpacks.toml` with exact contents:
  ```toml
  [phases.setup]
  nixPkgs = ["nodejs_20"]

  [phases.install]
  cmds = ["npm ci"]

  [phases.build]
  cmds = ["npm run build"]

  [start]
  cmd = "node .next/standalone/server.js"
  ```

- [x] T040 Write `frontend/.env.example` with exact contents:
  ```
  # Clerk authentication keys
  # Get these from your Clerk dashboard → API Keys
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_replace_with_your_key
  CLERK_SECRET_KEY=sk_test_replace_with_your_key

  # Backend API URL
  BACKEND_URL=http://localhost:8000

  # Feature flags (must be prefixed NEXT_PUBLIC_ to be available in browser)
  NEXT_PUBLIC_FLAG_AI_GENERATION=false
  NEXT_PUBLIC_FLAG_BILLING=false
  ```

- [x] T041 Write `frontend/src/app/health/route.ts` with exact contents:
  ```typescript
  import { NextResponse } from 'next/server'

  /**
   * Public health check endpoint.
   * Used by Railway health probes.
   * No authentication required.
   */
  export async function GET() {
    return NextResponse.json(
      {
        status: 'ok',
        service: 'rawaj-frontend',
        version: '1.0.0',
      },
      { status: 200 },
    )
  }
  ```

- [x] T042 Write `frontend/src/lib/dir.ts` with exact contents:
  ```typescript
  /**
   * RTL/LTR direction utilities. Constitution Principle III — Arabic-first.
   * Default direction is RTL (Arabic). LTR is the toggle-to state.
   */

  export type Direction = 'ltr' | 'rtl'
  const STORAGE_KEY = 'rawaj-dir'

  /**
   * Set the document direction and language without a page reload.
   * Persists the choice in localStorage.
   */
  export function setDocumentDir(dir: Direction): void {
    document.documentElement.setAttribute('dir', dir)
    document.documentElement.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en')
    try {
      localStorage.setItem(STORAGE_KEY, dir)
    } catch {
      // localStorage may be unavailable in sandboxed iframes
    }
  }

  /**
   * Get the initial direction from localStorage or default to RTL (Arabic-first).
   * Safe to call during SSR (returns 'rtl' when window is unavailable).
   */
  export function getInitialDir(): Direction {
    if (typeof window === 'undefined') return 'rtl'
    try {
      return (localStorage.getItem(STORAGE_KEY) as Direction) ?? 'rtl'
    } catch {
      return 'rtl'
    }
  }
  ```

- [x] T043 Write `frontend/src/lib/flags.ts` with exact contents:
  ```typescript
  /**
   * Feature flag client helper. Constitution Principle IV.
   * Reads from NEXT_PUBLIC_FLAG_* environment variables.
   * Unknown flags default to false (fail-safe).
   */

  type FeatureFlag =
    | 'AI_GENERATION'
    | 'BILLING'
    | 'SALLA_INTEGRATION'
    | 'ZID_INTEGRATION'

  /**
   * Returns true if the named feature flag is enabled.
   * Works in both Server Components (process.env) and Client Components (NEXT_PUBLIC_*).
   */
  export function isEnabled(flag: FeatureFlag): boolean {
    const envKey = `NEXT_PUBLIC_FLAG_${flag}` as keyof NodeJS.ProcessEnv
    return process.env[envKey] === 'true'
  }
  ```

- [x] T044 Write `frontend/src/middleware.ts` with exact contents:
  ```typescript
  import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

  /**
   * Public routes that do NOT require authentication.
   * All other routes are protected by Clerk.
   */
  const isPublicRoute = createRouteMatcher([
    '/health',
    '/sign-in(.*)',
    '/sign-up(.*)',
  ])

  export default clerkMiddleware((auth, req) => {
    if (!isPublicRoute(req)) {
      auth().protect()
    }
  })

  export const config = {
    matcher: [
      // Skip Next.js internals and static files
      '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
  }
  ```

- [x] T045 Overwrite `frontend/src/app/layout.tsx` with exact contents:
  ```tsx
  import { ClerkProvider } from '@clerk/nextjs'
  import type { Metadata } from 'next'
  import './globals.css'

  export const metadata: Metadata = {
    title: 'Rawaj — AI Product Description Generator',
    description: 'AI-powered product titles and descriptions for Gulf e-commerce',
  }

  /**
   * Root layout. Arabic-first by default (Constitution Principle III).
   * dir="rtl" and lang="ar" are the defaults.
   * The RTL toggle in src/lib/dir.ts can switch direction client-side without reload.
   */
  export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <ClerkProvider>
        <html lang="ar" dir="rtl">
          <body>{children}</body>
        </html>
      </ClerkProvider>
    )
  }
  ```

- [x] T046 Overwrite `frontend/src/app/page.tsx` with exact contents:
  ```tsx
  /**
   * Placeholder home page. Protected by Clerk middleware.
   * Will be replaced in Phase 3 (Plugin UI).
   */
  export default function HomePage() {
    return (
      <main style={{ padding: '2rem' }}>
        <h1>Rawaj AI Plugin</h1>
        <p>Phase 1 — Foundation complete.</p>
      </main>
    )
  }
  ```

- [x] T047 Write `README.md` at the repo root with exact contents:
  ```markdown
  # Rawaj AI Product Description Plugin

  AI-powered product title and description generator for Gulf e-commerce merchants.
  **Stack**: Next.js 14 · Django 6 · PostgreSQL · Clerk · Railway

  ---

  ## Local Setup (< 10 minutes)

  ### Prerequisites

  - Python 3.12+ — check: `python3 --version`
  - Node.js 20+ — check: `node --version`
  - PostgreSQL 16 locally, or a Railway PostgreSQL URL
  - A Clerk account (free) with an application created

  ### 1. Clone and switch to the feature branch

  ```bash
  git clone <repo-url> && cd Space
  git checkout 001-project-foundation
  ```

  ### 2. Backend

  ```bash
  cd backend
  python3 -m venv .venv && source .venv/bin/activate
  pip install -r requirements/development.txt
  cp .env.example .env   # then fill in your values
  python manage.py migrate
  python manage.py create_superuser_from_env
  python manage.py runserver 8000
  ```

  Verify: `curl http://localhost:8000/api/health/`
  Expected: `{"status":"ok","database":"ok","version":"1.0.0"}`

  API docs: http://localhost:8000/api/docs/

  ### 3. Frontend

  ```bash
  cd frontend
  npm install
  cp .env.example .env.local   # then fill in your Clerk keys
  npm run dev
  ```

  Verify: `curl http://localhost:3000/health`
  Expected: `{"status":"ok","service":"rawaj-frontend","version":"1.0.0"}`

  Open http://localhost:3000 — you will be redirected to Clerk sign-in.

  ---

  ## Environment Variables

  See `backend/.env.example` and `frontend/.env.example` for all required variables.
  **Never commit `.env` or `.env.local` files.**

  ---

  ## Admin Panel

  http://localhost:8000/admin/ — log in with the superuser credentials from `.env`.

  ---

  ## Feature Flags

  All features are off by default. Enable via env vars:

  | Flag | Env Var | Phase |
  |---|---|---|
  | AI Generation | `FLAG_AI_GENERATION=true` | Phase 2 |
  | Billing | `FLAG_BILLING=true` | Phase 4 |
  | Salla Integration | `FLAG_SALLA_INTEGRATION=true` | Phase 5 |
  | Zid Integration | `FLAG_ZID_INTEGRATION=true` | Phase 5 |

  ---

  ## Phases

  | Phase | Focus | Status |
  |---|---|---|
  | 1 | Foundation — both services on Railway | ✅ In progress |
  | 2 | AI generation engine | ⏳ Planned |
  | 3 | Plugin UI + embed.js | ⏳ Planned |
  | 4 | SaaS billing + org management | ⏳ Planned |
  | 5 | Salla/Zid integrations + launch | ⏳ Planned |
  ```

**Checkpoint**: Both services start locally. Health checks return 200. User Story 1 is independently testable.

---

## Phase 4: User Story 2 — Authenticated Merchant Accesses Protected Resources (Priority: P1)

**Goal**: Clerk JWT is validated on every protected Django endpoint. Authenticated requests
get `request.org` set. Unauthenticated requests get HTTP 401 with bilingual error.
Cross-org data access is impossible.

**Independent Test**: Get a Clerk JWT from the Next.js frontend. Send `curl -H "Authorization: Bearer <token>" http://localhost:8000/api/health/` → 200. Send `curl http://localhost:8000/api/org/me/` without token → 401. Send with token → 200 with org data.

### Implementation for User Story 2

- [x] T048 [P] [US2] Write `backend/apps/orgs/views.py` with exact contents:
  ```python
  """
  Organization views.
  All views here require authentication (ClerkJWTAuthentication sets request.org).
  """
  from drf_spectacular.utils import extend_schema, inline_serializer
  from rest_framework import serializers
  from rest_framework.decorators import api_view
  from rest_framework.response import Response


  @extend_schema(
      summary='Get current organization',
      description='Returns the authenticated organization. Requires a valid Clerk JWT with org_id claim.',
      responses={
          200: inline_serializer(
              name='OrgMeResponse',
              fields={
                  'id': serializers.IntegerField(),
                  'name': serializers.CharField(),
                  'plan': serializers.CharField(),
                  'clerk_org_id': serializers.CharField(),
              },
          ),
          401: inline_serializer(
              name='UnauthorizedResponse',
              fields={
                  'error': serializers.CharField(),
                  'error_ar': serializers.CharField(),
              },
          ),
      },
      tags=['Organizations'],
  )
  @api_view(['GET'])
  def org_me(request):
      """
      Return the current authenticated organization.
      request.org is set by ClerkJWTAuthentication.
      This endpoint is the canonical "am I authenticated?" check.
      """
      org = request.org
      return Response({
          'id': org.id,
          'name': org.name,
          'plan': org.plan,
          'clerk_org_id': org.clerk_org_id,
      })
  ```

- [x] T049 [P] [US2] Write `backend/apps/orgs/urls.py` with exact contents:
  ```python
  from django.urls import path
  from . import views

  urlpatterns = [
      path('org/me/', views.org_me, name='org-me'),
  ]
  ```

- [x] T050 [US2] Update `backend/config/urls.py` to include orgs URLs. Replace the file with:
  ```python
  from django.contrib import admin
  from django.urls import path, include
  from drf_spectacular.views import (
      SpectacularAPIView,
      SpectacularSwaggerView,
      SpectacularRedocView,
  )

  urlpatterns = [
      path('admin/', admin.site.urls),
      path('api/', include('apps.core.urls')),
      path('api/', include('apps.orgs.urls')),
      # OpenAPI schema + docs — publicly accessible (Constitution Principle V)
      path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
      path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
      path('api/docs/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
  ]
  ```

**Checkpoint**: `GET /api/org/me/` returns org data with a valid token, 401 without. Cross-org isolation verified by creating two orgs in admin and confirming each JWT only sees its own org.

---

## Phase 5: User Story 3 — Internal Operator Manages Data via Admin Panel (Priority: P2)

**Goal**: Superuser logs into `/admin/`, sees Organization records, can create/edit/filter them.
Non-staff users cannot access the admin panel.

**Independent Test**: Log in at `http://localhost:8000/admin/` with superuser credentials → Organization model visible and editable.

### Implementation for User Story 3

- [x] T051 [US3] Verify Django Admin is configured correctly. The `backend/apps/orgs/admin.py` file written in T029 already registers `OrganizationAdmin`. Start the Django dev server and confirm:
  1. Navigate to `http://localhost:8000/admin/`
  2. Log in with `DJANGO_SUPERUSER_EMAIL` + `DJANGO_SUPERUSER_PASSWORD` from `.env`
  3. Confirm `ORGS` section appears with `Organizations` link
  4. Confirm you can click into Organizations and see the list view with columns: `Name`, `Clerk org id`, `Plan`, `Is active`, `Created at`
  5. Create a test Organization: name="Test Org", clerk_org_id="org_test123", plan=free
  6. Confirm the test org appears in the list
  7. Log out and confirm a non-staff user gets redirected to the login page

No code changes needed — this task is verification only.

**Checkpoint**: Admin panel is functional. Organizations can be managed. Non-staff access is blocked.

---

## Phase 6: User Story 4 — Team Pushes Code and Services Deploy Automatically (Priority: P2)

**Goal**: Push to `main` triggers Railway auto-deploy of both services. Health checks pass on production URLs.

**Independent Test**: Push a commit to `main`, wait for Railway deploy, hit `GET https://<backend-domain>/api/health/` → 200 and `GET https://<frontend-domain>/health` → 200.

### Implementation for User Story 4

- [ ] T052 [US4] Create a Railway project and configure two services. In the Railway dashboard:
  1. Create a new project named `rawaj`
  2. Add a `rawaj-backend` service, set root directory to `backend/`
  3. Add a `rawaj-frontend` service, set root directory to `frontend/`
  4. Add a PostgreSQL plugin to the project (Railway auto-injects `DATABASE_URL`)

- [ ] T053 [US4] Set environment variables for `rawaj-backend` in Railway dashboard.
  Required variables (copy from `backend/.env.example`, fill real values):
  ```
  DJANGO_SETTINGS_MODULE=config.settings.production
  SECRET_KEY=<generate a 50-char random string>
  CLERK_JWKS_URL=<from Clerk dashboard>
  CLERK_ISSUER=<from Clerk dashboard>
  ALLOWED_HOSTS=<your-backend.up.railway.app>
  CORS_ALLOWED_ORIGINS=https://<your-frontend.up.railway.app>
  DJANGO_SUPERUSER_EMAIL=<admin email>
  DJANGO_SUPERUSER_PASSWORD=<admin password>
  FLAG_AI_GENERATION=false
  FLAG_BILLING=false
  FLAG_SALLA_INTEGRATION=false
  FLAG_ZID_INTEGRATION=false
  ```
  Note: `DATABASE_URL` is auto-injected by Railway from the PostgreSQL plugin.

- [ ] T054 [US4] Set environment variables for `rawaj-frontend` in Railway dashboard:
  ```
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<from Clerk dashboard>
  CLERK_SECRET_KEY=<from Clerk dashboard>
  BACKEND_URL=https://<your-backend.up.railway.app>
  NEXT_PUBLIC_FLAG_AI_GENERATION=false
  NEXT_PUBLIC_FLAG_BILLING=false
  ```

- [ ] T055 [US4] Push the current branch to GitHub and verify Railway deploys both services:
  ```bash
  git add -A
  git commit -m "feat: Phase 1 foundation — both services scaffolded"
  git push origin 001-project-foundation
  ```
  Then merge to `main` (or have Railway watch this branch for now).
  Expected: Railway shows "Deploy successful" for both services within 5 minutes.

- [ ] T056 [US4] Smoke test the production deployment:
  ```bash
  # Replace with your actual Railway domains
  curl https://<backend-domain>/api/health/
  # Expected: {"status":"ok","database":"ok","version":"1.0.0"}

  curl https://<backend-domain>/api/docs/
  # Expected: HTTP 200 (Swagger UI HTML)

  curl https://<frontend-domain>/health
  # Expected: {"status":"ok","service":"rawaj-frontend","version":"1.0.0"}
  ```

**Checkpoint**: Both services live on Railway. Auto-deploy triggered on push. Health checks pass.

---

## Phase 7: User Story 5 — API Consumer Discovers Available Endpoints (Priority: P3)

**Goal**: Navigate to `/api/docs/` in an incognito browser window without any authentication.
The Swagger UI renders and lists all available endpoints with their schemas.

**Independent Test**: Open `https://<backend-domain>/api/docs/` in incognito → Swagger UI renders without login prompt, shows Health and Organizations tags with their endpoints.

### Implementation for User Story 5

- [ ] T057 [US5] Verify OpenAPI documentation is complete. Open `http://localhost:8000/api/docs/` in a browser and confirm:
  1. Swagger UI renders without any authentication prompt
  2. Title shows "Rawaj AI Plugin API"
  3. `Health` tag is visible with `GET /api/health/` listed
  4. `Organizations` tag is visible with `GET /api/org/me/` listed
  5. Click `GET /api/health/` → expand → click "Try it out" → "Execute" → response shows `{"status":"ok",...}`
  6. The schema endpoint `GET /api/schema/` returns valid OpenAPI JSON

No code changes needed — this is verification of what was set up in earlier tasks.

**Checkpoint**: API docs publicly accessible. All endpoints documented. User Story 5 complete.

---

## Phase N: Polish & Cross-Cutting Concerns

- [x] T058 [P] Run Django system checks and fix any warnings:
  ```bash
  cd backend && python manage.py check --deploy
  ```
  Common warnings in production: HSTS, X-Content-Type-Options, etc. Address any `ERROR` level issues.

- [x] T059 [P] Verify the `.gitignore` is correct — confirm these files are NOT tracked:
  ```bash
  git status --short
  # Should NOT see: backend/.env, frontend/.env.local, __pycache__/, .next/
  ```

- [ ] T060 [P] Run the quickstart guide (`specs/001-project-foundation/quickstart.md`) on a clean terminal session to validate the 10-minute onboarding claim (SC-001). Time the process from `git clone` to first successful health check response.

- [ ] T061 Run a constitution compliance check against all 6 principles:
  ```
  Principle I:   Verify Organization model exists (backend/apps/orgs/models.py ✅)
                 Verify OrgScopedModel abstract base exists (backend/apps/core/models.py ✅)
                 Verify ClerkJWTAuthentication sets request.org (backend/apps/core/authentication.py ✅)

  Principle II:  No AI calls in Phase 1 ✅ (AIClient deferred to Phase 2)

  Principle III: Verify dir="rtl" + lang="ar" in layout.tsx ✅
                 Verify 401 errors are bilingual in authentication.py ✅
                 Verify setDocumentDir utility exists in src/lib/dir.ts ✅

  Principle IV:  Verify FEATURE_FLAGS dict in settings/base.py ✅
                 Verify is_enabled() and require_flag() in apps/core/flags.py ✅
                 Verify all flags default false in .env.example ✅

  Principle V:   Verify /api/docs/ returns 200 without auth ✅
                 Verify @extend_schema on health_check view ✅
                 Verify @extend_schema on org_me view ✅

  Principle VI:  No AI calls in Phase 1 ✅ (TokenBudgetMiddleware deferred to Phase 2)
                 request.org is set by auth layer — ready for Phase 2 ✅
  ```

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 — BLOCKS all user story phases
- **Phase 3 (US1)**: Depends on Phase 2 — first user story (local dev onboarding)
- **Phase 4 (US2)**: Depends on Phase 3 (needs migration complete, both services running)
- **Phase 5 (US3)**: Depends on Phase 3 (needs Django server running with migrations)
- **Phase 6 (US4)**: Depends on Phase 3 + Phase 4 + Phase 5 (needs complete foundation)
- **Phase 7 (US5)**: Depends on Phase 4 (needs org endpoints + drf-spectacular wired)
- **Phase N (Polish)**: Depends on all user story phases

### Within Phase 2 (Foundational)

T004 → T006 can run in parallel (different requirements files)
T007–T015 (Django project files) → depend on dirs from Phase 1
T016–T032 (app files) → each independent but logically sequential

### Within Phase 3 (US1)

T033–T034 (core views/urls) → parallel, independent files
T035 (migrations) → must run after T021 (Organization model)
T036–T047 (frontend) → all parallel once `create-next-app` completes

---

## Parallel Opportunities

### Phase 2: Backend scaffold

```bash
# These can run simultaneously (different files):
# Terminal 1:
write backend/config/settings/base.py

# Terminal 2:
write backend/apps/orgs/models.py

# Terminal 3:
write backend/apps/core/authentication.py
```

### Phase 3: Frontend + Backend simultaneously

```bash
# Terminal 1 (backend):
python manage.py makemigrations orgs && python manage.py migrate

# Terminal 2 (frontend):
npx create-next-app@14 . ... && npm install @clerk/nextjs
```

---

## Implementation Strategy

### MVP First (User Story 1 — Local Dev Onboarding)

1. Complete Phase 1: Setup (T001–T003)
2. Complete Phase 2: Foundational (T004–T032)
3. Complete Phase 3: User Story 1 (T033–T047)
4. **STOP and VALIDATE**: Run both services locally, hit health checks
5. Proceed to remaining user stories in priority order

### Task Notes

- `[P]` tasks = touches a different file from other `[P]` tasks in the same phase — safe to run simultaneously
- Every task includes the exact file content to write — no guessing needed
- Tasks with "exact contents" blocks should copy-paste the content verbatim
- Tasks that say "run a command" should run it from the specified directory
- If a task says to "overwrite", the previous version of the file should be completely replaced
