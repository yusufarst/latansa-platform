---
name: implement-feature
description: Implement a LATANSA feature as a complete vertical slice while preserving project architecture, RBAC, auditability, tests, and documentation.
---

1. Read @/AGENTS.md and @/docs/00-CURRENT-STATE.md.
2. Read relevant domain docs only.
3. Inspect existing implementation before changing code.
4. State a short implementation plan.
5. Implement vertically:
   database -> validation -> service/backend -> RBAC -> UI -> audit -> tests -> browser verification
6. Reuse existing patterns/components.
7. No unrelated refactoring.
8. No new major dependency without justification.
9. Finish only when relevant Definition of Done passes.
10. Update @/docs/00-CURRENT-STATE.md after substantial completed work.
