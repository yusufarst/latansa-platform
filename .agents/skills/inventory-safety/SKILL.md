---
name: inventory-safety
description: Apply LATANSA inventory invariants when working on stock, warehouses, serialized items, barcode workflows, transfers, reservations, adjustments, opname, QC, warranty, or service.
---

- Stock movements are the authoritative source of truth.
- Never directly change stock without a movement.
- Use database transactions for important stock operations.
- Prevent negative stock where disallowed.
- Ensure concurrency safety.
- Track quantity vs serialized appropriately.
- Preserve manufacturer serial numbers.
- Ensure unique internal inventory IDs.
- Prevent duplicate serial operations.
- Transfers must create traceable movements.
- Reservations must distinguish physical, reserved, and available stock.
- Adjustments require a reason.
- Corrections must use reversal rather than destructive editing.
- Stock opname must record expected/actual/variance.
- Audit logs and stock movement history must never be silently deleted.
- Public APIs must never expose serial numbers or exact warehouse details.

Reference:
@/docs/04-INVENTORY-RULES.md
@/docs/03-DATA-MODEL.md
