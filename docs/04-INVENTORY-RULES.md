# Inventory Rules

## 1. Ledger Source of Truth
Inventory uses a strict ledger/transaction model. Stock movements are the authoritative source of truth for all inventory levels. Inventory balances may exist as projections/caches for performance, but must not replace stock movements.

## 2. Transaction Requirements
- Direct stock mutation is FORBIDDEN.
- Every change in stock must record a stock movement (IN, OUT, TRANSFER, ADJUSTMENT).
- Inventory operations must use database transactions.

## 3. Quantity vs Serialized Products
The system must support both:
- **Quantity-tracked products**: Tracked simply by count at a location.
- **Serialized products**: Each unit is tracked individually.

## 4. Serial and Barcode Tracking
- **Internal Barcode**: The system will generate internal inventory IDs where required.
- **Manufacturer Serial**: Original manufacturer serial numbers must be preserved and tracked.

## 5. Operations
- **Negative Stock**: Prevent negative stock where not allowed.
- **Reservations**: Support reservations for stock that is committed but not yet dispatched.
- **Transfers**: Moving stock between warehouses or locations requires a movement record.
- **Adjustments**: Corrections to stock levels require an adjustment movement.
- **Reversals**: Destructive transaction editing is FORBIDDEN. Mistakes must be corrected via Reversal movements.
- **Stock Opname**: Support cycle counting and full physical inventory counts.
- **Duplicate Prevention**: Prevent duplicate serialized-item operations.
- **Concurrency**: Operations must be concurrency-safe.

## 6. Lifecycle & QC
- **QC**: Support quality checks on inbound or existing stock.
- **Warranty/Service**: Track warranty and service status, linked to specific serialized units.

## 7. Audit
- Preserve complete stock movement history.
- Preserve audit logs of who initiated what movement and when.
