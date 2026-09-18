---
name: finish-task
description: Close a LATANSA development task safely by running required quality gates, updating canonical project state, and reporting remaining issues accurately.
---

1. Review task acceptance criteria.
2. Check git diff for unintended changes.
3. Run relevant lint.
4. Run typecheck.
5. Run relevant tests.
6. Run production build when application exists.
7. Browser verify affected feature.
8. Verify responsive/mobile behavior when relevant.
9. Confirm no secret was introduced.
10. Update @/docs/00-CURRENT-STATE.md.
11. Update @/docs/10-DECISIONS.md only if a real architectural/technical decision changed.
12. Report known issues honestly.
13. Never mark unfinished or failing work as DONE.
