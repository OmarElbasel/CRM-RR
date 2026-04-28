# Rawaj — AI-powered CRM & growth engine for Gulf e-commerce

Rawaj is an all-in-one operations platform for e-commerce merchants in the Gulf. It unifies your social inboxes (Instagram, WhatsApp, Facebook), automates lead tracking with an AI-powered pipeline, generates marketing content, schedules posts, and connects to Shopify, Salla, and Zid — all under one roof.

![CI](https://github.com/rawaj-ai/space/actions/workflows/ci.yml/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

---

## Feature Matrix

| Feature | Flag | Screen | Status |
|---|---|---|---|
| AI Generation | `FLAG_AI_GENERATION` | `/dashboard/generate` | Live |
| Unified Inbox | `FLAG_INBOX` | `/inbox` | Live |
| Pipeline CRM | `FLAG_PIPELINE` | `/pipeline` | Live |
| Content Assistant | `FLAG_CONTENT_ASSISTANT` | `/content` | Live |
| Post Scheduler | `FLAG_POST_SCHEDULER` | `/scheduler` | Live |
| Ad Copy | `FLAG_AI_GENERATION` | `/ads` | Live |
| Shopify Order Hub | `FLAG_SHOPIFY_ORDER_HUB` | `/orders` | Live |
| Billing & Plans | `FLAG_BILLING` | `/settings?tab=billing` | Live |
| Plugin Embed | `FLAG_PLUGIN_EMBED` | `/settings?tab=embed` | Live |
| Salla Integration | `FLAG_SALLA_INTEGRATION` | `/channels` | Credentials required |
| Zid Integration | `FLAG_ZID_INTEGRATION` | `/channels` | Credentials required |
| TikTok Inbox | `FLAG_TIKTOK_INBOX` | `/channels` | Credentials required |

---

## Screenshots

| Dashboard | Inbox | Pipeline |
|---|---|---|
| ![Dashboard](docs/screenshots/dashboard.png) | ![Inbox](docs/screenshots/inbox.png) | ![Pipeline](docs/screenshots/pipeline.png) |

| Content | Scheduler | Channels |
|---|---|---|
| ![Content](docs/screenshots/content.png) | ![Scheduler](docs/screenshots/scheduler.png) | ![Channels](docs/screenshots/channels.png) |

---

## Quickstart

### Prerequisites

- Python 3.14+ — check: `python3 --version`
- Node.js 20+ — check: `node --version`
- PostgreSQL 16 locally, or a Railway PostgreSQL URL
- A Clerk account (free) with an application created

### 1. Clone and install

```bash
git clone <repo-url> && cd Space
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements/development.txt
cp .env.example .env   # fill in your values
cd ../frontend
npm install
cp .env.example .env.local   # fill in your Clerk keys
```

### 2. Run

```bash
# Terminal 1 — backend
cd backend
python manage.py migrate
python manage.py runserver 8000

# Terminal 2 — frontend
cd frontend
npm run dev
```

Open http://localhost:3000 — you will be redirected to Clerk sign-in.

> **Note:** By default `NEXT_PUBLIC_USE_DUMMY_DATA=true` so you see a populated product immediately. Set it to `false` and connect a real channel to see live metrics.

---

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template)

---

## Live Demo

🌐 [https://rawaj.ai](https://rawaj.ai) *(placeholder — update when live)*

---

## Documentation

- [Getting Started](docs/phase-history.md)
- [Design Brief](docs/design-brief.md)
- [Landing Content](docs/landing-content.md)
- [Shopify Integration](docs/shopify-integration.md)

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Security

See [SECURITY.md](SECURITY.md).

## License

[MIT](LICENSE) © Rawaj AI
