# Rawaj — AI-powered CRM & growth engine for e-commerce

> A full-stack portfolio project: unified social inbox, AI lead pipeline, content generation,
> post scheduler, and Shopify integration — built on Django + Next.js.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.14-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)
![Django](https://img.shields.io/badge/Django-6-darkgreen.svg)

> **Heads-up — this is a portfolio project, not a commercial SaaS.**
> The codebase is shared so other developers can read, learn from, and run it locally.
> A demo mode is built in (`NEXT_PUBLIC_DEMO_MODE=true`) that bypasses authentication
> and seeds sample data so you can click through every screen without signing up.

---

## Why I built this

I'm a software engineer building publicly. Rawaj started as a real product idea
for e-commerce merchants and grew into the place where I practice the full
software-engineering workflow:

- Multi-tenant data modelling with hard org isolation
- Background jobs (Celery + Redis) for AI scoring and webhook processing
- OAuth integrations (Meta, Shopify, TikTok)
- Stripe billing with usage caps
- Embeddable widget served as a separate webpack bundle
- Internationalisation (Arabic / English, RTL)
- Production polish: Sentry, PostHog, Lighthouse CI, Playwright

If you're hiring or just curious — the commit history walks through how each surface
was added one feature flag at a time.

---

## Tech stack

**Backend** — Python 3.14 · Django 6 · Django REST Framework · drf-spectacular ·
Celery · django-redis · django-ratelimit · cryptography (Fernet) · Stripe SDK · Resend ·
Anthropic / OpenAI / Gemini SDKs

**Frontend** — Next.js 14 (App Router) · TypeScript 5 · Tailwind CSS 3.4 · shadcn/ui ·
@clerk/nextjs · framer-motion · recharts · lucide-react · next-intl · next-themes

**Infra** — PostgreSQL 16 · Redis · Railway (deploy) · Vercel (frontend deploy) ·
Sentry · PostHog · Lighthouse CI · Playwright

---

## Quick start (one command)

The fastest way to run everything locally is Docker. This boots Postgres, Redis,
the Django backend (with seed data), and the Next.js frontend in demo mode:

```bash
git clone https://github.com/OmarEbasel/space.git
cd space
docker compose up
```

Then open <http://localhost:3000>. You'll land on the marketing site — click
**"Try the live demo"** to enter the dashboard. No sign-in required.

To wipe and re-seed demo data:

```bash
docker compose exec backend python manage.py seed_demo --reset
```

---

## Manual setup (without Docker)

### 1. Clone & configure

```bash
git clone https://github.com/OmarEbasel/space.git
cd space
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

### 2. Backend (Python 3.14)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements/development.txt
python manage.py migrate
python manage.py seed_demo            # creates demo org + sample data
python manage.py runserver 8000
```

### 3. Frontend (Node 20)

```bash
cd frontend
npm install
npm run dev
```

Visit <http://localhost:3000>. With `NEXT_PUBLIC_DEMO_MODE=true` (already in
`.env.example`) Clerk auth is bypassed and you can click straight into the dashboard.

### Optional: Redis & Celery

Several features (AI scoring, webhook processing, scheduled posts) run on Celery.
Skip them entirely for a tour, or start them with:

```bash
redis-server                            # in one terminal
cd backend && celery -A config worker -l info   # in another
```

---

## Demo mode vs. real auth

| Mode | Env flag | What it does |
| --- | --- | --- |
| **Demo** | `NEXT_PUBLIC_DEMO_MODE=true` | Skips Clerk auth, shows portfolio banner, links land on `/dashboard`. Combine with `NEXT_PUBLIC_USE_DUMMY_DATA=true` for sample UI data. |
| **Real** | `NEXT_PUBLIC_DEMO_MODE=false` | Requires a free Clerk dev account. Set `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` + `CLERK_SECRET_KEY` and matching `CLERK_JWKS_URL` / `CLERK_ISSUER` on the backend. |

---

## Project structure

```
backend/                Django project — one app per bounded context
  apps/
    orgs/               Tenant model + management commands (seed_demo lives here)
    inbox/              Unified social inbox (Instagram, WhatsApp, Facebook, TikTok)
    pipeline/           Deal CRM with AI scoring
    content/            AI content generator
    scheduler/          Post scheduler
    shopify/            Shopify Order Hub integration
    billing/            Stripe subscriptions + usage caps
    generate/           AI generation pipeline (multi-provider)
    embed_auth/         Public widget API key auth
    admin_panel/        Internal admin tooling
  config/settings/      Per-environment Django settings
  requirements/         Pip requirements split by env

frontend/               Next.js 14 App Router
  src/app/
    (marketing)/        Public landing page
    (main)/             Authenticated dashboard surfaces
    (embed)/            Iframe-embeddable widget
    (legal)/            Privacy / terms / cookies
    admin/              Developer admin panel
  src/components/       UI components organised by surface
  src/lib/              API clients, helpers, dummy data, demo-mode flag
  tests/                Playwright e2e tests

docs/                   API & architecture documentation
```

---

## Architecture at a glance

```
┌─────────────┐      ┌──────────────┐      ┌──────────────────┐
│  Next.js    │ ───▶ │  Django REST │ ───▶ │   PostgreSQL 16  │
│  (Vercel)   │      │  (Railway)   │      └──────────────────┘
└─────────────┘      │              │      ┌──────────────────┐
                     │              │ ───▶ │   Redis (Celery) │
                     └──────┬───────┘      └────────┬─────────┘
                            │                       │
                            ▼                       ▼
                  ┌──────────────────┐     ┌──────────────────┐
                  │  Clerk (auth)    │     │  Celery workers  │
                  │  Stripe (billing)│     │  AI scoring,     │
                  │  Meta/Shopify    │     │  webhook fan-out │
                  └──────────────────┘     └──────────────────┘
```

Every model is scoped by `org_id` — multi-tenancy is enforced at the queryset
level (see `apps/orgs/models.py`).

---

## Things I learned building this

- **Feature flags beat long-running branches.** Every surface ships behind a flag
  (`FLAG_INBOX`, `FLAG_PIPELINE`, etc.) so half-built features can land on `main`
  without breaking the demo path.
- **Multi-tenancy is a queryset discipline, not a framework.** Forgetting one
  `.filter(org=request.org)` is a leak. I use base manager classes that require
  the org param.
- **Webhooks need idempotency keys.** Meta / Shopify retry aggressively;
  `dedupe_key` on `Message` and `Deal` saved me twice.
- **Encrypt OAuth tokens at rest.** `SocialChannel.access_token` uses Fernet
  with a key from env — never plaintext in the DB.
- **Lighthouse CI catches regressions humans miss.** Two runs caught accidental
  bundle-size jumps from a stray `motion` import.

---

## Contributing

Issues and PRs welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT — see [LICENSE](./LICENSE).
