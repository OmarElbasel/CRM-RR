<!--
SYNC IMPACT REPORT
==================
Version change: NONE (initial ratification) → 1.0.0
Added sections:
  - Core Principles (6 principles)
  - SaaS Architecture Requirements
  - Development Workflow & Quality Gates
  - Governance

Modified principles: N/A (initial version)
Removed sections: N/A (initial version)

Templates reviewed:
  - .specify/templates/plan-template.md      ✅ aligned — Constitution Check gate is compatible with all 6 principles
  - .specify/templates/spec-template.md      ✅ aligned — FR/SC structure accommodates multi-tenant, cost control, and OpenAPI constraints
  - .specify/templates/tasks-template.md     ✅ aligned — Phase structure supports feature-flag gating, multi-tenant scoping, and observability tasks

Follow-up TODOs:
  - None — all placeholders resolved on initial ratification
-->

# Rawaj AI Product Description Plugin — Constitution

## Core Principles

### I. Multi-Tenant Data Isolation (NON-NEGOTIABLE)

Every database query MUST be scoped to the authenticated `Organization`. No query
may return or mutate data belonging to a different org. Row-level scoping is
enforced at the Django ORM layer by filtering on `org=request.org` before any
read or write. Direct table access that bypasses ORM filtering is prohibited.

**Rationale**: A single data-isolation failure exposes customer data across tenants,
constituting a critical security breach and GDPR/privacy liability in Gulf markets.

**Test gate**: Any plan, spec, or task that touches a Django queryset MUST demonstrate
org-scoped filtering. Plans that lack this check fail the Constitution Check gate.

---

### II. Provider-Agnostic AI Client

All AI model calls MUST go through the `AIClient` abstraction. The active provider
(Claude, OpenAI, Gemini) is selected exclusively by the `AI_PROVIDER` environment
variable — zero code changes required to switch providers. Concrete SDK calls
(e.g., `anthropic.Anthropic()`, `openai.OpenAI()`) MUST NOT appear outside of their
respective adapter classes (`ClaudeAdapter`, `OpenAIAdapter`, `GeminiAdapter`).

**Rationale**: Vendor lock-in risk is unacceptable for a SaaS product sold in a
market where API availability and pricing fluctuate. Provider-agnosticism is a
core competitive and operational resilience requirement.

**Test gate**: Unit tests MUST mock at the `AIClient` interface level, never at the
SDK level. Any new generation feature MUST pass with a mock adapter.

---

### III. Arabic-First, Gulf-Dialect Outputs

Every AI generation endpoint MUST support Arabic Gulf dialect (`ar`) as a first-class
language option — not a translation of English output. Separate prompt templates
MUST exist for Arabic (Gulf dialect) and English. The UI MUST support RTL layout
via a `dir` attribute toggle. All error messages returned to end-users (including
HTTP 4xx/5xx responses) MUST be provided in both Arabic and English.

**Rationale**: The product's primary market is Gulf e-commerce (Salla, Zid, Shopify
ME). Arabic-first is a product differentiator, not an afterthought. Bilingual error
messages ensure merchants can self-diagnose regardless of language preference.

**Test gate**: Every generation endpoint test MUST include an Arabic-language scenario.
RTL layout MUST be visually verified before each UI phase is marked complete.

---

### IV. Feature-Flag Gating for All Production Features

Every new feature MUST ship behind a feature flag before being exposed in production.
A feature with a disabled flag MUST leave the existing production experience entirely
unchanged. Feature flags are managed via environment variable or a dedicated flags
table — hardcoded `if env == 'prod'` conditions are prohibited.

**Rationale**: Gulf platform integrations (Salla, Zid) require staged rollouts.
Unfinished features in production create broken merchant experiences that erode
trust and generate support burden.

**Test gate**: Each spec MUST declare which feature flag gates it. The implementation
phase does not begin until the flag name is confirmed and the default state (`off`)
is deployed.

---

### V. OpenAPI Documentation for Every Endpoint

Every Django REST Framework endpoint MUST be documented via `drf-spectacular` and
visible at `/api/docs/`. Endpoints without an OpenAPI schema decorator
(`@extend_schema`) MUST NOT be merged to `main`. The docs page MUST be publicly
accessible (no auth required) so that merchants and integration partners can
self-serve.

**Rationale**: Gulf platform partners (Salla, Zid) require documented APIs for
their review processes. OpenAPI docs also serve as the contract between frontend
and backend, reducing integration bugs and verbal spec-drift.

**Test gate**: Each new endpoint MUST include `@extend_schema` annotations before
the PR is marked ready for review. The CI pipeline validates that `/api/docs/`
returns HTTP 200 without auth.

---

### VI. Per-Org AI Cost Controls with Hard Stop

Every AI generation request MUST pass through `TokenBudgetMiddleware` before
reaching the AI provider. If an org has exceeded its monthly token budget or
monthly cost cap (`USD`), the middleware MUST return HTTP 429 with an Arabic + English
error message — the AI provider MUST NOT be called. Cost tracking (`AIUsage` model)
MUST record `tokens_in`, `tokens_out`, `cost_usd`, `model`, and `org` for every
request, regardless of success or failure.

**Rationale**: Unbounded AI API spend is an existential risk for a bootstrapped SaaS.
Per-org hard stops protect both the operator (margin) and the merchant
(unexpected overage charges). Gulf merchants are cost-sensitive and expect
predictable pricing.

**Test gate**: Every generation endpoint test MUST include a budget-exceeded scenario
that asserts HTTP 429 is returned. Cost tracking MUST be verified in integration tests.

---

## SaaS Architecture Requirements

### Tech Stack (locked for all phases)

| Layer | Technology | Version |
|---|---|---|
| Frontend | Next.js + TypeScript | 14.x |
| Backend | Django + DRF | 6.x |
| Database | PostgreSQL | 16.x (Railway) |
| Auth | Clerk | JWT middleware |
| AI (default) | Claude 3.5 Sonnet | via AIClient |
| Cache | Redis (Upstash) | — |
| Queue | Celery + Redis | — |
| Payments | Stripe | Checkout + Webhooks |
| Deploy | Railway | auto-deploy on `main` push |
| Errors | Sentry | both services |
| Analytics | PostHog | server + client |

Deviations from this stack MUST be documented in the feature plan under
"Complexity Tracking" with explicit justification.

### Security Requirements

- API keys MUST be stored encrypted using Fernet symmetric encryption (`cryptography` library).
  Plain-text API keys in the database are prohibited.
- Secret keys (`sk_xxx`) MUST never appear in API responses. Only masked or public
  representations (`pk_xxx`) are returned to clients.
- Environment files (`.env`, `.env.local`) MUST never be committed to git.
  The `.gitignore` MUST exclude them from day one and CI validates this.
- Clerk JWT MUST be verified on every authenticated Django endpoint. Unauthenticated
  access to authenticated endpoints is a critical defect (P0).
- Input moderation MUST be applied before any user-supplied text reaches the AI provider
  (Phase 5 and beyond).

### Performance Targets

- First AI token latency: p95 ≤ 3 seconds under 100 concurrent org load.
- Load test with Locust MUST be run before public launch (Phase 5).
- Redis caching for AI generations: TTL = 24 hours, key = `SHA256(org_id + sorted inputs)`.

---

## Development Workflow & Quality Gates

### Branch & PR Policy

- All feature work MUST be developed on a branch named `###-feature-name`
  (e.g., `001-project-foundation`).
- PRs MUST include a Constitution Check section verifying all 6 principles.
- PRs targeting Phases 4 and 5 MUST also include Stripe webhook idempotency and
  rate-limiting verification.

### Testing Requirements

- Unit tests: MUST cover `AIClient` adapter contract, `TokenBudgetMiddleware`, and
  prompt template rendering at a minimum.
- Integration tests: MUST cover multi-tenant data isolation (cross-org query returns
  zero results), budget enforcement (HTTP 429 at limit), and Stripe webhook handling
  (idempotent on duplicate events).
- Spec Kit TDD flow: tests MUST be written and confirmed failing before implementation
  begins (`/tasks` → write tests → `/implement`).

### Deployment Requirements

- Both services (Next.js + Django) MUST have health check endpoints:
  `GET /api/health/` (Django) and `GET /health` (Next.js).
- Railway auto-deploy MUST be verified after Phase 1 — no manual deployment
  steps are acceptable for `main` branch pushes.
- Celery beat MUST be running in production for the monthly usage reset task
  (`reset_monthly_usage` on the 1st of each month at 00:00 UTC).

---

## Governance

This constitution supersedes all other project conventions. Any practice, pattern,
or implementation that conflicts with the six Core Principles is non-compliant,
regardless of prior approval or convention.

### Amendment Procedure

1. Open a PR with the proposed constitution change and rationale.
2. The PR description MUST include a Sync Impact Report detailing which templates,
   specs, and existing implementations are affected.
3. Existing implementations that violate a new principle MUST include a migration
   plan with a deadline (max 2 sprints).
4. A constitution amendment increments the version per semantic versioning:
   MAJOR for principle removal or redefinition, MINOR for new principle or section,
   PATCH for clarifications and wording.

### Compliance Review

- Every PR review MUST include a "Constitution Check" section.
- The `/review` command validates all six principles before any phase is marked complete.
- Violations discovered in production are treated as P0 defects with no scheduled
  downtime tolerance.

### Runtime Guidance

For day-to-day development guidance (agent workflow, Spec Kit commands, prompt
templates), refer to `Phase.md` and `.specify/memory/` artifacts. The constitution
defines the non-negotiable constraints; `Phase.md` defines the execution plan.

---

**Version**: 1.0.0 | **Ratified**: 2026-04-12 | **Last Amended**: 2026-04-12
