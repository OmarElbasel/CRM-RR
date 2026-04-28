# Security Policy

## Supported Versions

We currently support the latest commit on `main` and the most recent feature branch.

## Reporting a Vulnerability

If you discover a security issue, please email us at **security@rawaj.ai**.

- We aim to acknowledge receipt within **48 hours**.
- We will work with you to understand the scope and severity.
- We follow a **disclosure-then-fix** policy: we prefer to fix the issue and ship a patch before public disclosure. We will coordinate a disclosure date with you.

## Security Measures

- Authentication is handled by [Clerk](https://clerk.dev).
- Platform credentials are encrypted at rest using Fernet (AES-128 in CBC mode via Python `cryptography`).
- Payment processing is handled by [Stripe](https://stripe.com).
- Error tracking is handled by [Sentry](https://sentry.io) with PII scrubbing enabled.
