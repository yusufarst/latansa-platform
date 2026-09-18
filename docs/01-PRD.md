# Product Requirements Document (PRD)

## 1. Overview
LATANSA Platform is a premium, modern, production-grade web application for an electronics business. It serves both public customers and internal staff through a single modular monolith.

## 2. Public Customer Experience (Public Catalog)
- Corporate website content
- Premium public product catalog
- Categories and brands browsing
- Product search
- Advanced filtering
- Product comparison
- Product detail pages (high-quality)
- Related/recommended products
- SEO-ready pages
- WhatsApp conversion tracking
- RFQ (Request for Quotation)
- Conversion analytics
- Responsive mobile experience

## 3. Internal Application (Owner / Admin)

### 3.1 Roles
- **SUPER_ADMIN**: Owner. Full access.
- **INVENTORY_ADMIN**: Inventory, warehouse, barcode, serial, QC, stock operations.
- **PRODUCT_SALES_ADMIN**: Products, catalog, pricing, RFQ, leads, quotation, sales-related analytics.

### 3.2 Product/Sales Admin (Product Management)
- Categories management
- Brands management
- Dynamic specifications
- Multiple product images

### 3.3 Inventory / Barcode / WMS (Inventory Admin)
- Inventory management
- Warehouses management
- Warehouse stock locations / racks
- Stock IN
- Stock OUT
- Stock transfers
- Stock reservations
- Stock adjustments
- Reversals (no destructive edits)
- Stock opname (counting)
- Low-stock monitoring
- Dead/slow-moving stock monitoring
- Quantity tracking
- Serialized inventory tracking
- Manufacturer serial numbers tracking
- Internal inventory IDs
- Barcode generation
- Barcode label printing
- USB/Bluetooth HID scanner workflows

### 3.4 Sales & RFQ
- Leads tracking
- RFQ management
- Quotation generation

### 3.5 Analytics & Reports
- Owner executive dashboard
- Reports generation
- Sales and conversion analytics

### 3.6 System & Admin
- Approval workflow
- Full audit trail
- Notifications
- Global search
- Command palette

### 3.7 Production & Operations
- PWA (Progressive Web App) capabilities
- Backup/restore mechanisms
- System health monitoring
- Production deployment on client's VPS
