# AGENTS.md

## Universal Agent Contract
1. **Source of Truth**: The GitHub repository is the sole source of truth.
2. **Reading Order**: Before implementing any future task, you MUST read in this exact order:
   1. `AGENTS.md` (this file)
   2. `docs/00-CURRENT-STATE.md`
   3. `docs/01-PRD.md`
   4. `docs/02-ARCHITECTURE.md`
   5. `docs/10-DECISIONS.md`
   6. Read domain-specific docs.
   7. Inspect existing implementation.
3. **No Secret Hardcoding**: Never hardcode passwords, API keys, database credentials, JWT/session secrets, encryption keys, private keys, access tokens, GitHub tokens, VPS credentials, production credentials, or MCP credentials. All secrets must come from environment variables or secure runtime configuration.
4. **No Direct Stock Mutation**: Inventory uses a ledger/transaction model. Stock movements are the source of truth. Never directly mutate stock without recording a stock movement.
5. **No Backend RBAC Bypass**: RBAC must be enforced in backend code, not only in the UI.
6. **No Destructive Operations**: No destructive stock/audit deletion. Support reversals instead of destructive transaction editing. Preserve audit logs.
7. **No Architecture Changes**: Do not make architecture changes without explicit approval.
8. **No Paid SaaS**: Do not use or integrate paid SaaS without explicit approval.
9. **Definition of Done**: Each feature must be integrated end-to-end (database -> validation -> backend/service -> RBAC -> UI -> audit -> tests -> browser verification) before being considered complete.
10. **State Updates**: You must update `docs/00-CURRENT-STATE.md` after substantial work.
11. **No Unrelated Refactors**: Do not perform unrelated refactors.
