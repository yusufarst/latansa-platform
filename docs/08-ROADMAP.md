# Development Roadmap

Development follows a vertical-slice workflow. Each feature is integrated end-to-end (DB -> API -> UI) before moving to the next.

## Phases

### Phase 00: Bootstrap
- [x] Create GitHub repository
- [x] Create canonical project specification and docs
- [ ] Initialize Next.js, Drizzle, PostgreSQL stack

### Phase 01: Foundation, Auth & RBAC
- [ ] Setup DB schema for users, roles, sessions
- [ ] Implement Authentication system
- [ ] Implement RBAC middleware and backend protection
- [ ] Create basic internal application layout

### Phase 02: Product & Catalog Master Data
- [ ] Categories and Brands management
- [ ] Products CRUD
- [ ] Product Images and Specifications

### Phase 03: Inventory Ledger
- [ ] Core Stock Movements (IN, OUT)
- [ ] Ledger queries and balance projection
- [ ] Concurrency and negative stock guards

### Phase 04: Serialized Inventory & Barcode
- [ ] Support for serialized tracking
- [ ] Manufacturer serial vs Internal ID
- [ ] Barcode generation and printing
- [ ] Scanner input support

### Phase 05: Warehouse Operations
- [ ] Warehouses and Locations
- [ ] Stock Transfers and Adjustments
- [ ] Reversals
- [ ] Stock Opname and Reservations

### Phase 06: Audit & Approval
- [ ] Immutable audit logs
- [ ] Supervisor approval workflows

### Phase 07: Public Website & Catalog
- [ ] Corporate landing pages
- [ ] Product catalog listing, search, and filtering
- [ ] Product detail pages and comparison
- [ ] SEO setup and responsive refinements

### Phase 08: RFQ, Leads & Quotation
- [ ] Public RFQ submission
- [ ] Internal Lead tracking
- [ ] Quotation generation

### Phase 09: Owner Dashboard, Analytics & Reports
- [ ] WhatsApp conversion tracking
- [ ] Executive dashboard charts and KPIs
- [ ] Custom reporting views

### Phase 10: QC, Warranty & Service
- [ ] Quality check tracking
- [ ] Warranty management
- [ ] Service records

### Phase 11: Notifications, PWA & System Health
- [ ] In-app notifications
- [ ] PWA configuration
- [ ] System health monitoring endpoints

### Phase 12: Import & Demo Seed
- [ ] Development seed scripts (demo data)
- [ ] Easy data reset mechanisms

### Phase 13: Security & Performance
- [ ] Final security audit
- [ ] Query optimization and caching

### Phase 14: QA & Regression
- [ ] Playwright E2E test passes
- [ ] Manual browser verification

### Phase 15: Production Deployment
- [ ] VPS provisioning
- [ ] Docker Compose and Caddy configuration
- [ ] Final deployment to `latansajogjakarta.com` and `app.latansajogjakarta.com`
