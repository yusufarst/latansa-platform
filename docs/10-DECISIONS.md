# Architecture & Technical Decisions

- **DEC-001**: GitHub repository is the sole source of truth.
- **DEC-002**: Modular monolith architecture.
- **DEC-003**: PostgreSQL as the primary database.
- **DEC-004**: Drizzle ORM for database access and migrations.
- **DEC-005**: One codebase for public and internal experiences.
- **DEC-006**: Three initial roles only (SUPER_ADMIN, INVENTORY_ADMIN, PRODUCT_SALES_ADMIN).
- **DEC-007**: Inventory uses an immutable stock-movement ledger.
- **DEC-008**: Quantity and serialized tracking are both supported.
- **DEC-009**: Open-source / near-zero recurring-cost priority.
- **DEC-010**: No mandatory paid SaaS.
- **DEC-011**: VPS + Docker Compose + Caddy production model.
- **DEC-012**: Demo data allowed through seed scripts only; no hardcoded demo UI data.
- **DEC-013**: No secrets in Git.
- **DEC-014**: Vertical-slice implementation workflow.
- **DEC-015**: Credential auth is first-party; opaque server-side sessions in PostgreSQL.
- **DEC-016**: Password hashing uses bcrypt; raw session tokens never stored in DB.
