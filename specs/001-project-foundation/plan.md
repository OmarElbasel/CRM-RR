# Implementation Plan: Project Foundation & Infrastructure

**Branch**: `001-project-foundation` | **Date**: 2026-04-12 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/001-project-foundation/spec.md`

## Summary

Scaffold the full monorepo (Next.js 14 frontend + Django 6 backend) with PostgreSQL,
Clerk JWT authentication, Railway auto-deploy, and drf-spectacular OpenAPI docs.
This phase establishes all 6 constitution principles as architectural foundations
so every subsequent phase builds on a compliant, multi-tenant, Arabic-first base.
No AI generation, billing, or platform integration code is written in this phase.

## Technical Context

**Language/Version**: Python 3.12 (backend) · Node.js 20 / TypeScript 5 (frontend)
**Primary Dependencies**: Django 6.0, djangorestframework 3.15, drf-spectacular 0.27,
  django-environ 0.11, django-cors-headers 4.3, psycopg[binary] 3.1,
  PyJWT 2.8, cryptography 42, gunicorn 22 (backend);
  Next.js 14, @clerk/nextjs, Tailwind CSS 3 (frontend)
**Storage**: PostgreSQL 16 on Railway (single shared instance, both services use same DB URL)
**Testing**: pytest + pytest-django (backend) · manual smoke tests for frontend in Phase 1
**Target Platform**: Linux (Railway) — backend as gunicorn WSGI, frontend as Node.js standalone
**Project Type**: Web application (monorepo: frontend/ + backend/)
**Performance Goals**: Health check p95 < 500ms · Auth validation < 200ms overhead
**Constraints**: Railway free tier RAM limit (~512MB per service); no CDN dependency
  (use drf-spectacular-sidecar for offline Swagger UI assets)
**Scale/Scope**: Phase 1 is foundation only — no concurrent load requirements yet;
  Phase 5 targets 100 concurrent orgs (p95 < 3s first token)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Phase 1 Gate Status | How Addressed |
|---|---|---|
| I. Multi-tenant isolation | ✅ PASS | `Organization` model + `OrgScopedModel` abstract base. `ClerkJWTAuthentication` sets `request.org` on every authenticated request. |
| II. Provider-agnostic AI | ✅ PASS (deferred) | No AI calls in Phase 1. `AIClient` pattern documented in research.md; implementation deferred to Phase 2. |
| III. Arabic-first | ✅ PASS | `dir="rtl"` + `lang="ar"` defaults on `<html>`. All 401 error responses bilingual (AR + EN). RTL toggle utility ships in Phase 1. |
| IV. Feature flags | ✅ PASS | `FEATURE_FLAGS` env-var dict in settings. `is_enabled()` + `require_flag()` utilities created. All flags default `false`. |
| V. OpenAPI docs | ✅ PASS | drf-spectacular + sidecar installed. `/api/docs/` publicly accessible (AllowAny permission). `@extend_schema` on health check. |
| VI. Cost controls | ✅ PASS (deferred) | No AI calls in Phase 1. `request.org` is set by auth layer — budget middleware will use this in Phase 2. |

No violations — Complexity Tracking section not required.

## Project Structure

### Documentation (this feature)

```text
specs/001-project-foundation/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── health-api.md    # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
frontend/                               ← Next.js 14 + TypeScript service
├── src/
│   ├── app/
│   │   ├── layout.tsx                  ← ClerkProvider + dir="rtl" + lang="ar"
│   │   ├── page.tsx                    ← Placeholder home (auth-gated)
│   │   └── health/
│   │       └── route.ts                ← GET /health → 200 JSON
│   ├── lib/
│   │   ├── dir.ts                      ← RTL toggle: setDocumentDir, getInitialDir
│   │   └── flags.ts                    ← isEnabled(flag) client helper
│   └── middleware.ts                   ← Clerk route protection
├── .env.example                        ← All var names, no values
├── next.config.ts                      ← output: 'standalone'
├── tailwind.config.ts
├── tsconfig.json
├── nixpacks.toml                       ← Railway build config
└── package.json

backend/                                ← Django 6 + DRF service
├── config/
│   ├── settings/
│   │   ├── __init__.py
│   │   ├── base.py                     ← DB, DRF, Clerk, flags, drf-spectacular
│   │   ├── development.py              ← DEBUG=True, ALLOWED_HOSTS=localhost
│   │   └── production.py              ← DEBUG=False, ALLOWED_HOSTS from env
│   ├── __init__.py
│   ├── urls.py                         ← /admin/, /api/, /api/docs/
│   ├── wsgi.py
│   └── asgi.py
├── apps/
│   ├── core/
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   ├── authentication.py           ← ClerkJWTAuthentication (sets request.org)
│   │   ├── models.py                   ← OrgScopedModel abstract base
│   │   ├── views.py                    ← health_check + @extend_schema
│   │   ├── flags.py                    ← is_enabled(), require_flag() decorator
│   │   ├── urls.py                     ← path('health/', ...)
│   │   └── management/
│   │       └── commands/
│   │           └── create_superuser_from_env.py
│   └── orgs/
│       ├── __init__.py
│       ├── apps.py
│       ├── models.py                   ← Organization model
│       ├── admin.py                    ← OrganizationAdmin
│       └── migrations/
│           └── 0001_initial.py
├── requirements/
│   ├── base.txt
│   ├── development.txt
│   └── production.txt
├── .env.example
├── manage.py
├── Procfile                            ← release + web processes
└── nixpacks.toml

.gitignore                              ← Excludes .env*, __pycache__, .next/, node_modules/
README.md                               ← 10-min onboard guide
```

**Structure Decision**: Web application (Option 2) — monorepo with `frontend/` and `backend/`
as top-level sibling directories. No shared packages at repo root — services are deliberately
decoupled so Railway can deploy each independently from its own root directory.
