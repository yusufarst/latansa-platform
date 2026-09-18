---
name: test-and-verify
description: Verify LATANSA features through type checking, linting, unit/integration tests, browser workflows, regression checks, and critical inventory scenarios.
---

- Inspect acceptance criteria first.
- Test both happy path and failure path.
- Include RBAC tests.
- Include inventory concurrency tests where applicable.
- Include negative-stock tests.
- Include duplicate serialized-item tests.
- Include public/private data boundary tests.
- Run relevant unit/integration tests.
- Run lint.
- Run TypeScript/typecheck.
- Run production build when appropriate.
- Perform browser verification for affected UI.
- Perform mobile verification where relevant.
- Report actual failures instead of claiming success.

Reference:
@/docs/07-TEST-PLAN.md
