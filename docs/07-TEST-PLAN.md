# Test Plan

Critical acceptance tests must cover the following scenarios:

## 1. Auth & RBAC
- Authentication flows (login, logout, session management).
- Role-based access control enforcement for `SUPER_ADMIN`, `INVENTORY_ADMIN`, and `PRODUCT_SALES_ADMIN` on backend routes.

## 2. Inventory Ledger
- Stock IN processes.
- Stock OUT processes.
- Negative stock prevention (where disallowed).
- Concurrent OUT safety (preventing overselling under load).
- Duplicate serialized item prevention.
- Stock transfer between warehouses.
- Stock reservation logic.
- Stock adjustment.
- Reversal of stock movements.
- Stock opname (counting) workflows.
- Audit trail creation on stock movements.

## 3. Warehouse & Hardware
- Barcode generation.
- Scanner input handling (USB/Bluetooth HID).

## 4. Public Catalog & Sales
- Public catalog browsing.
- Product search and advanced filtering.
- Product comparison.
- RFQ submission.
- Lead creation and management.
- Quotation generation.
- Analytics event tracking.

## 5. System Quality
- Responsive behavior across mobile, tablet, and desktop.
- Backup and restore procedures.
