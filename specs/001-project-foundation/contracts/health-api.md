# Contract: Health Check API

**Feature**: 001-project-foundation
**Date**: 2026-04-12
**Auth**: None (public endpoint)

---

## Django Backend — GET /api/health/

### Request

```
GET /api/health/ HTTP/1.1
Host: <backend-domain>
```

No authentication required. No request body.

### Response — 200 OK (healthy)

```json
{
  "status": "ok",
  "database": "ok",
  "version": "1.0.0"
}
```

### Response — 503 Service Unavailable (database unreachable)

```json
{
  "status": "degraded",
  "database": "error",
  "version": "1.0.0"
}
```

### Schema

```yaml
HealthCheckResponse:
  type: object
  required: [status, database, version]
  properties:
    status:
      type: string
      enum: [ok, degraded]
      description: Overall service health
    database:
      type: string
      enum: [ok, error]
      description: PostgreSQL connectivity status
    version:
      type: string
      example: "1.0.0"
      description: API version string
```

### Notes

- Returns 200 even during startup — the probe is connection-level, not application-level.
- Returns 503 only when the database TCP connection fails entirely.
- Used by Railway health probes and load balancers.
- Documented with `@extend_schema` (Constitution Principle V).

---

## Next.js Frontend — GET /health

### Request

```
GET /health HTTP/1.1
Host: <frontend-domain>
```

No authentication required. No request body.

### Response — 200 OK

```json
{
  "status": "ok",
  "service": "rawaj-frontend",
  "version": "1.0.0"
}
```

### Notes

- Implemented as a Next.js App Router Route Handler (`app/health/route.ts`).
- Always returns 200 — no DB connectivity to check on the frontend.
- Excluded from Clerk middleware protection via `isPublicRoute` matcher.
- Used by Railway health probes.

---

## Error Response Contract (Authentication Errors)

All authentication failures on protected endpoints return HTTP 401 with a bilingual
body (Constitution Principle III — Arabic-first error messages).

### 401 Unauthorized — Missing or Invalid Token

```json
{
  "error": "Authentication credentials were not provided.",
  "error_ar": "لم يتم تقديم بيانات المصادقة."
}
```

### 401 Unauthorized — Expired Token

```json
{
  "error": "Token expired.",
  "error_ar": "انتهت صلاحية الرمز."
}
```

### 401 Unauthorized — Invalid Token Signature

```json
{
  "error": "Invalid token.",
  "error_ar": "رمز غير صالح."
}
```

### 401 Unauthorized — Organization Not Found

```json
{
  "error": "Organization not found or inactive.",
  "error_ar": "المنظمة غير موجودة أو غير نشطة."
}
```
