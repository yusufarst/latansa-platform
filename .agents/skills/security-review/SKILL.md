---
name: security-review
description: Review LATANSA authentication, authorization, API boundaries, uploads, secrets, sessions, public data exposure, and production security.
---

- Ensure no hardcoded secrets.
- Validate environment configurations.
- Use strong password hashing.
- Ensure secure session/cookies.
- Implement backend RBAC.
- Separate public/private API DTO boundaries.
- Ensure no purchase cost/margin/internal stock data is publicly exposed.
- Include CSRF considerations.
- Implement XSS/output sanitization.
- Ensure proper file upload validation.
- Include rate limiting where appropriate.
- Ensure PostgreSQL is not exposed publicly.
- Sensitive actions must be audited.
- Ensure no destructive audit/ledger deletion.

Reference:
@/docs/06-SECURITY.md
