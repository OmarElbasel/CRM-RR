# Data Model: Project Foundation & Infrastructure

**Feature**: 001-project-foundation
**Date**: 2026-04-12

---

## Entities

### Organization

The top-level tenant unit. Every piece of data in the system belongs to exactly
one Organization. The `clerk_org_id` is the foreign key used during JWT resolution —
Clerk encodes `org_id` in every session token claim.

**Phase 1 fields only** — billing fields (Stripe IDs, API keys, token limits)
are deferred to Phase 4 to keep the initial migration minimal.

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | integer (PK) | auto | Django default |
| `name` | varchar(255) | NOT NULL | Display name of the org |
| `clerk_org_id` | varchar(255) | NOT NULL, UNIQUE, INDEX | Matches `org_id` JWT claim |
| `plan` | varchar(20) | NOT NULL, default='free' | One of: free, starter, pro, enterprise |
| `is_active` | boolean | NOT NULL, default=True | Soft-disable without deletion |
| `created_at` | timestamptz | NOT NULL, auto | Set on creation |
| `updated_at` | timestamptz | NOT NULL, auto | Updated on every save |

**Validation rules**:
- `clerk_org_id` is immutable after creation (managed by Clerk, not editable in admin)
- `plan` must be one of the 4 defined choices
- `name` is operator-supplied and can be updated

**State transitions**:
- `is_active`: `True → False` (operator disables org); `False → True` (operator reactivates)
- `plan`: any → any (controlled by Stripe webhook in Phase 4; manual in Phase 1 admin)

---

### Abstract Base: OrgScopedModel

All future tenant-scoped models MUST inherit from this. It enforces that every
model has an `org` foreign key — the structural guarantee of Constitution Principle I.

```
OrgScopedModel (abstract)
└── org → Organization (CASCADE, INDEX)
```

Phase 1 creates no concrete subclasses of `OrgScopedModel`. Phase 2 adds `AIUsage`.
Phase 4 adds `SallaIntegration`, `ZidIntegration`.

**Contract**: Any model inheriting `OrgScopedModel` MUST be queried with
`.filter(org=request.org)` in all views. The FK enforces the structural relationship;
the query filter enforces the access control.

---

## Entity Relationships (Phase 1)

```
┌─────────────────────────────────┐
│ Organization                    │
│─────────────────────────────────│
│ PK  id                          │
│     name                        │
│     clerk_org_id  (UNIQUE, IDX) │
│     plan                        │
│     is_active                   │
│     created_at                  │
│     updated_at                  │
└─────────────────────────────────┘
         ↑
         │ org FK (abstract, Phase 2+)
┌─────────────────────────────────┐
│ OrgScopedModel (abstract)       │
│─────────────────────────────────│
│     org → Organization          │
└─────────────────────────────────┘
```

---

## Django Migration

**File**: `apps/orgs/migrations/0001_initial.py`

Creates:
- Table `orgs_organization`
- Unique index on `clerk_org_id`
- B-tree index on `clerk_org_id` (for JWT lookup performance)

No other migrations in Phase 1. The `core` app has no concrete models (abstract only).

---

## Admin Panel Entities (Phase 1)

| Model | Admin Class | Key Actions |
|---|---|---|
| `Organization` | `OrganizationAdmin` | List, search by name/clerk_org_id, filter by plan/is_active, edit name/plan/is_active |

`clerk_org_id`, `created_at`, `updated_at` are read-only in admin — they must not
be manually editable to preserve data integrity.

---

## Future Phases (reference only, not implemented in Phase 1)

| Phase | Model | Inherits | Key New Fields |
|---|---|---|---|
| 2 | `AIUsage` | `OrgScopedModel` | model, tokens_in, tokens_out, cost_usd, language |
| 4 | `Organization` (extended) | — | api_key_public, api_key_secret, stripe_customer_id, stripe_subscription_id, monthly_generation_limit, generations_used_this_month |
| 5 | `SallaIntegration` | `OrgScopedModel` | shop_id, access_token (encrypted), token_expires_at |
| 5 | `ZidIntegration` | `OrgScopedModel` | store_id, access_token (encrypted) |
