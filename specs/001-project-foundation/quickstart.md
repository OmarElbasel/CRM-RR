# Quickstart: Project Foundation

**Feature**: 001-project-foundation
**Date**: 2026-04-12
**Goal**: Run both services locally and verify health checks within 10 minutes (SC-001)

---

## Prerequisites

- Python 3.12+ (`python3 --version`)
- Node.js 20+ (`node --version`)
- PostgreSQL 16 locally **or** a Railway PostgreSQL URL
- A Clerk account with an application set up (free tier)
- Git

---

## 1. Clone and Branch

```bash
git clone <repo-url>
cd Space
git checkout 001-project-foundation
```

---

## 2. Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements/development.txt

# Configure environment
cp .env.example .env
# Edit .env — fill in DATABASE_URL, CLERK_JWKS_URL, CLERK_ISSUER, SECRET_KEY

# Run migrations
python manage.py migrate

# Create superuser (reads from env vars)
python manage.py create_superuser_from_env

# Start dev server
python manage.py runserver 8000
```

**Verify backend**:

```bash
curl http://localhost:8000/api/health/
# Expected: {"status":"ok","database":"ok","version":"1.0.0"}

curl http://localhost:8000/api/docs/
# Expected: HTTP 200, Swagger UI HTML
```

---

## 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local — fill in NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY, BACKEND_URL

# Start dev server
npm run dev
```

**Verify frontend**:

```bash
curl http://localhost:3000/health
# Expected: {"status":"ok","service":"rawaj-frontend","version":"1.0.0"}
```

Open `http://localhost:3000` in a browser — you should be redirected to the Clerk sign-in page.

---

## 4. Verify Authentication Flow

1. Sign in through the Next.js frontend using a Clerk account.
2. In the browser DevTools Network tab, find a request with `Authorization: Bearer <token>`.
3. Copy the token and test it against the backend:

```bash
TOKEN="<paste-token-here>"
curl -H "Authorization: Bearer $TOKEN" http://localhost:8000/api/health/
# Expected: 200 {"status":"ok","database":"ok","version":"1.0.0"}
```

4. Test without token:

```bash
curl http://localhost:8000/api/health/
# Expected: 200 (health check is public — no auth required)

# Test a protected endpoint (will be added in Phase 2)
# For now, verify the 401 pattern by calling with a bad token:
curl -H "Authorization: Bearer bad-token" http://localhost:8000/api/health/
# Expected: 200 (health check has AllowAny permission — auth is not checked here)
# A protected endpoint would return 401
```

---

## 5. Verify RTL Toggle

Open `http://localhost:3000` in a browser, then in the browser console:

```javascript
// Import or call directly:
import { setDocumentDir } from '@/lib/dir'
setDocumentDir('ltr')  // Layout flips to left-to-right — no page reload
setDocumentDir('rtl')  // Layout returns to right-to-left — no page reload
```

---

## 6. Verify Django Admin

Navigate to `http://localhost:8000/admin/` and log in with the superuser credentials
from your `.env` file. Confirm:

- `Organizations` model appears under `Orgs` section
- You can create, view, and edit Organization records

---

## 7. Environment Variables Reference

### Backend `.env`

| Variable | Required | Example |
|---|---|---|
| `DJANGO_SETTINGS_MODULE` | Yes | `config.settings.development` |
| `SECRET_KEY` | Yes | `django-insecure-dev-key-change-in-prod` |
| `DATABASE_URL` | Yes | `postgres://user:pass@localhost:5432/rawaj_dev` |
| `CLERK_JWKS_URL` | Yes | `https://<clerk-domain>.clerk.accounts.dev/v1/jwks` |
| `CLERK_ISSUER` | Yes | `https://<clerk-domain>.clerk.accounts.dev` |
| `ALLOWED_HOSTS` | Yes (prod) | `your-railway-domain.up.railway.app` |
| `DJANGO_SUPERUSER_EMAIL` | Yes | `admin@example.com` |
| `DJANGO_SUPERUSER_PASSWORD` | Yes | `change-me` |
| `FLAG_AI_GENERATION` | No | `false` |
| `FLAG_BILLING` | No | `false` |
| `FLAG_SALLA_INTEGRATION` | No | `false` |
| `FLAG_ZID_INTEGRATION` | No | `false` |

### Frontend `.env.local`

| Variable | Required | Example |
|---|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | `pk_test_...` |
| `CLERK_SECRET_KEY` | Yes | `sk_test_...` |
| `BACKEND_URL` | Yes | `http://localhost:8000` |
| `NEXT_PUBLIC_FLAG_AI_GENERATION` | No | `false` |
| `NEXT_PUBLIC_FLAG_BILLING` | No | `false` |

---

## Common Issues

**`ImproperlyConfigured: SECRET_KEY is not defined`**
→ Copy `.env.example` to `.env` and fill in `SECRET_KEY`.

**`connection refused` on DATABASE_URL**
→ Ensure PostgreSQL is running locally, or use a Railway PostgreSQL URL.

**`AuthenticationFailed: Organization not found`**
→ The Clerk JWT contains an `org_id` that has no matching `Organization` record.
Create the org via `/admin/` using the Clerk org ID from your Clerk dashboard.

**`Invalid token` on valid Clerk JWT**
→ Check that `CLERK_ISSUER` matches the `iss` claim in your JWT exactly.
Decode the JWT at jwt.io and compare.

**Next.js redirects to sign-in immediately**
→ Expected — all routes except `/health` require authentication.
Sign in via Clerk to proceed.
