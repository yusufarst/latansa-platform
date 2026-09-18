# Conceptual Data Model

This document outlines the conceptual entities and their relationships. 
*Note: Do not create database migrations based on this conceptual model yet.*

## Auth & Access
- **users**: System users.
- **roles**: RBAC roles (SUPER_ADMIN, INVENTORY_ADMIN, PRODUCT_SALES_ADMIN).
- **sessions**: User sessions.

## Product Catalog (Master Data)
- **products**: Core product information.
- **brands**: Product brands.
- **categories**: Product categories.
- **product_images**: Multiple images per product.
- **product_specifications**: Dynamic key-value specs per product.
- **product_barcodes**: Barcodes associated with products.

## Warehouse & Location
- **warehouses**: Physical or logical storage facilities.
- **warehouse_locations**: Specific racks, bins, or areas within a warehouse.

## Inventory Ledger
- **inventory_units**: Tracking for specific physical items (especially serialized items).
- **inventory_balances**: Projections/caches of current stock levels. (Must not replace movements as source of truth).
- **stock_movements**: Authoritative ledger of all stock changes (IN, OUT, TRANSFER, ADJUSTMENT).
- **stock_movement_items**: Line items for movements.
- **stock_reservations**: Holds on stock for pending orders/quotes.

## Stock Operations
- **stock_counts**: Stock opname events.
- **stock_count_items**: Actual vs expected counts.

## Quality & Service
- **quality_checks**: QC records for items.
- **warranties**: Warranty tracking for sold items.
- **service_records**: Repair/service history.

## Sales & CRM
- **customers**: Public customers or B2B clients.
- **leads**: Potential sales.
- **lead_activities**: Interactions on leads.

## Quotations & Orders
- **rfqs**: Requests for Quotation submitted by public or created internally.
- **rfq_items**: Products requested in RFQ.
- **quotations**: Official quotes generated from RFQs.
- **quotation_items**: Line items in a quotation.

## System & Audit
- **approval_requests**: Workflows requiring superior approval.
- **notifications**: System alerts to users.
- **analytics_events**: Tracking page views, conversions, etc.
- **audit_logs**: Immutable history of critical system actions.
- **files**: Metadata for uploaded assets.
- **settings**: Global application configuration.
