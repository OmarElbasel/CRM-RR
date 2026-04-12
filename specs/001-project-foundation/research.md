# Research: Project Foundation & Infrastructure

**Feature**: 001-project-foundation
**Date**: 2026-04-12
**Phase**: 0 — Outline & Research

---

## 1. Clerk JWT Integration with Django (no official SDK)

**Decision**: Use `PyJWT` 2.x with `PyJWKClient` for direct RS256 JWT validation.
No third-party Clerk Django SDK.

**Rationale**:
- No official Clerk SDK exists for Django. Third-party packages (`django-clerk`) are
  unmaintained or add unnecessary abstraction.
- `PyJWKClient` (built into PyJWT 2.x) fetches and caches JWKS automatically with
  built-in TTL — no manual caching code needed.
- The implementation is ~40 lines, fully auditable, and has zero Clerk-specific lock-in.
- RS256 validation requires `cryptography` package alongside `PyJWT`.

**Alternatives considered**:
- `python-jose`: Older, less maintained. `PyJWT` 2.x is the community standard.
- Third-party `django-clerk`: Unmaintained; would add a dependency on a package
  with no long-term support guarantee.
- Session cookies: Not applicable — Clerk issues JWTs, Django validates them.
  No session state in Django.

**Key claims in Clerk JWT**:
- `sub`: Clerk user ID (string)
- `org_id`: Clerk organization ID — used to look up `Organization` model
- `email`: User email (optional claim, depends on Clerk session config)
- `iss`: Issuer URL — must match `CLERK_ISSUER` env var
- `exp`: Expiry timestamp — validated automatically by PyJWT

---

## 2. Next.js 14 App Router vs Pages Router for RTL + Clerk

**Decision**: App Router (`src/app/`) with Clerk's `@clerk/nextjs` v5 SDK.

**Rationale**:
- App Router supports React Server Components, enabling server-side JWT retrieval
  via `auth()` without client-side waterfall. Authenticated backend calls in Server
  Components are faster and simpler.
- `ClerkProvider` wraps the root `layout.tsx` — works correctly with App Router.
- `clerkMiddleware` (App Router variant) handles route protection at the edge.
- RTL: setting `dir="rtl"` on `<html>` in `layout.tsx` works with both SSR and CSR.
  Tailwind `rtl:` variants handle directional CSS automatically.
- `output: 'standalone'` in `next.config.ts` produces a minimal production bundle
  that works well on Railway without a separate Node.js installation.

**Alternatives considered**:
- Pages Router: Older pattern. Clerk support exists but requires `_app.tsx` wrapping
  and lacks React Server Component benefits. App Router is the Next.js 14 default.
- Separate RTL library (e.g., `stylis-plugin-rtl`): Unnecessary — Tailwind CSS 3
  has native `rtl:` variant support. No additional library needed.

---

## 3. Django Settings Strategy

**Decision**: Split settings module (`base.py` / `development.py` / `production.py`)
with `django-environ` for type-safe env var loading.

**Rationale**:
- `DJANGO_SETTINGS_MODULE` env var selects the active settings file — clean Railway
  configuration with no code changes between environments.
- `django-environ` provides `env.db('DATABASE_URL')` (parses Railway PostgreSQL URL),
  `env.bool()`, `env.list()`, and raises `ImproperlyConfigured` on startup if a
  required variable is missing — satisfies SC-001 (loud failure on bad config).
- Simpler than `django-configurations` — no class inheritance overhead.

**Alternatives considered**:
- Single `settings.py` with `if DEBUG:` guards: Not appropriate for a multi-environment
  SaaS — mixes dev/prod config in one file, error-prone.
- `django-configurations`: More structured but adds a dependency and learning curve.
  Split files achieve the same result with plain Python.

---

## 4. Railway Deployment Strategy

**Decision**: Two Railway services from the same monorepo, each with a root directory
override (`backend/` and `frontend/`). Use `nixpacks.toml` for build config and
`Procfile` (backend only) for process definitions.

**Rationale**:
- Railway detects `nixpacks.toml` in the service root directory and uses it to
  configure the build. Setting the service root to `backend/` or `frontend/` means
  Railway only sees and builds the relevant service.
- `Procfile` `release` process runs `migrate` before `web` starts — Railway's
  standard pattern for zero-downtime database migrations.
- `gunicorn` with 2 workers is appropriate for Railway's 512MB RAM free tier.
  Each worker uses ~100-150MB for Django.
- `output: 'standalone'` in Next.js eliminates the need for `node_modules` in the
  production image — significantly smaller deployment artifact.

**Alternatives considered**:
- Separate repositories per service: Defeats the monorepo goal; harder to keep
  shared config (`.env.example`, `constitution.md`) in sync.
- Docker Compose: Railway does not use Docker Compose for deployment. `nixpacks.toml`
  is the Railway-native build config format.
- Uvicorn/ASGI: Not needed in Phase 1 — Django WSGI with gunicorn is sufficient.
  ASGI will be needed in Phase 2 for SSE streaming (Celery/channels), but can be
  wired in then without architectural rework.

---

## 5. Feature Flag Strategy

**Decision**: Environment variable-based flags in `FEATURE_FLAGS` dict in Django settings.
Client-side flags as `NEXT_PUBLIC_FLAG_*` env vars in Next.js.

**Rationale**:
- Phase 1 needs flags to exist but doesn't need per-org granularity (that comes
  in Phase 4 when the `Organization` model gains billing fields).
- Env-var flags: zero dependencies, trivially deployable, fail-safe (unknown flag = off),
  and directly supported by Railway's environment variable management.
- `require_flag('AI_GENERATION')` decorator returns 404 (not 403) for disabled features —
  makes them appear nonexistent to clients, preventing spec leakage.
- Phase 4 will extend the `Organization` model with per-org flag overrides. The
  `is_enabled()` function can be updated then to check org-level overrides as a
  second layer, without changing the env-var fallback.

**Alternatives considered**:
- `django-waffle`: Full-featured flag library with DB-backed flags, percentages,
  switches. Overkill for Phase 1; adds migration dependency from day one.
- LaunchDarkly/Unleash: External flag service. Adds a third-party dependency and
  network call on every request. Unjustified for a bootstrapped SaaS in Phase 1.

---

## 6. drf-spectacular Sidecar vs CDN

**Decision**: `drf-spectacular[sidecar]` to serve Swagger UI assets from Django
static files (no CDN dependency).

**Rationale**:
- Railway deployments may not have reliable outbound CDN access depending on
  network configuration.
- Sidecar bundles all Swagger UI JS/CSS assets into the package and serves them
  via `collectstatic` — no runtime CDN request.
- Slightly larger `collectstatic` output (~3MB) is an acceptable trade-off.

**Alternatives considered**:
- CDN-served Swagger UI: Simpler config but introduces a runtime dependency on
  `cdn.jsdelivr.net`. If CDN is unreachable, `/api/docs/` breaks — unacceptable
  for a partner-facing API documentation page.

---

## 7. PostgreSQL Driver Choice

**Decision**: `psycopg[binary]` (psycopg3) for PostgreSQL connectivity.

**Rationale**:
- `psycopg3` is the modern PostgreSQL adapter. Django 4.2+ has native support.
- `[binary]` distribution includes pre-compiled C extensions — no `libpq-dev`
  needed at build time, which simplifies Railway nixpacks configuration.
- Connection pooling via `psycopg3`'s built-in pool will be useful when Phase 2
  adds concurrent AI generation requests.

**Alternatives considered**:
- `psycopg2-binary`: Previous generation. Still works but `psycopg3` is Django's
  recommended adapter going forward.
- `asyncpg`: Only for async Django (ASGI). Not needed in Phase 1 (WSGI).

---

## 8. Superuser Creation on Railway

**Decision**: Custom management command `create_superuser_from_env` reads
`DJANGO_SUPERUSER_EMAIL` and `DJANGO_SUPERUSER_PASSWORD` from environment.
Run in Procfile `release` process alongside `migrate`.

**Rationale**:
- `python manage.py createsuperuser` is interactive — cannot be run non-interactively
  in Railway's release process without passing `--no-input` which requires specific
  env var naming (`DJANGO_SUPERUSER_USERNAME`, `DJANGO_SUPERUSER_EMAIL`, etc.).
- Custom command gives explicit control: idempotent (checks if user exists first),
  reads from env vars with clear names, and logs success/skip clearly.

**Alternatives considered**:
- `--no-input` with standard env vars: Works but requires `DJANGO_SUPERUSER_USERNAME`
  which is redundant for email-based auth. Custom command is clearer.
- Data migration: Creates a superuser via a Django migration — not recommended
  because migrations should be environment-agnostic and not encode credentials.
