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
