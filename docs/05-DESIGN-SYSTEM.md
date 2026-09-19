# LATANSA Design System

## 1. Brand Identity & Visual Direction

The visual direction is directly derived from the official LATANSA logo (`public/brand/latansa-logo-original.jpeg`): a geometric triangular metallic mark finished in deep wine-red / burgundy.

- **Aesthetic**: Restrained, editorial, enterprise B2B electronics platform.
- **Canvas**: Warm white / soft stone (`oklch(0.988 0.003 85)` / `#FAFAF9`).
- **Typography**: Graphite / near-black (`oklch(0.20 0.01 45)` / `#18181B`).
- **Brand Accent**: Deep burgundy / wine-red (`oklch(0.38 0.14 18)` / `#7A1A2E`).
- **Borders & Dividers**: Subtle warm-gray (`oklch(0.92 0.004 85)` / `#E7E5E0`).
- **Card Surfaces**: Pure white with crisp hairline borders (`border-border/80`).
- **Forbidden Elements**: Generic AI-SaaS blue gradients, glassmorphism, giant rounded cards, decorative floating animations, unstyled placeholders.

---

## 2. Color Tokens

### Primary & Brand Tokens
- `--brand`: `oklch(0.38 0.14 18)` — Primary interactive accent, key CTA, active navigation, focus rings.
- `--brand-hover`: `oklch(0.32 0.13 18)` — High-contrast hover state.
- `--brand-muted`: `oklch(0.96 0.02 18)` — Subtle pill badges and selected indicators.
- `--brand-foreground`: `oklch(0.99 0 0)` — Crisp white text on brand surfaces.

### Neutral & Surface Tokens
- `--background`: `oklch(0.988 0.003 85)` — Warm stone canvas.
- `--card`: `oklch(1 0 0)` — Crisp white container cards.
- `--foreground`: `oklch(0.20 0.01 45)` — High-contrast graphite copy.
- `--muted-foreground`: `oklch(0.50 0.01 45)` — Accessible secondary text.
- `--border`: `oklch(0.92 0.004 85)` — Restrained hairline borders.
- `--radius`: `0.375rem` (6px) — Subtle, disciplined corners (max 8px–10px).

---

## 3. Typography Hierarchy

Strict system font stack ensuring zero remote dependency on Google Fonts:
- Display Headline: 36px–48px / tracking-tight / font-bold.
- Section Titles: 24px–30px / tracking-tight / font-bold.
- Card Titles: 14px–16px / font-semibold / line-clamp-2.
- Body Copy: 13px–15px / text-muted-foreground / leading-relaxed.
- Meta / Labels / SKU: 10px–11px / font-mono / font-semibold / uppercase tracking-wider.

---

## 4. Language & Localization Standards

- **Default Language**: Bahasa Indonesia across both public customer storefront and internal management shell.
- **Accepted Technical Terms**: SKU, RFQ, QC, barcode, serial number, model, Wi-Fi, USB, Bluetooth, RAM, SSD, HDMI.
- **Standard UI Glossary**:
  - Home &rarr; Beranda
  - Catalog &rarr; Katalog
  - Compare &rarr; Bandingkan
  - Login &rarr; Masuk
  - Featured Products &rarr; Produk Pilihan
  - Browse Catalog &rarr; Lihat Katalog
  - View Details &rarr; Lihat Detail
  - Product Overview &rarr; Ringkasan Produk
  - Technical Specifications &rarr; Spesifikasi Teknis
  - Related Products &rarr; Produk Terkait
  - Ask Price / Contact for Price &rarr; Hubungi untuk Harga
  - Clear Comparison &rarr; Hapus Perbandingan
  - Dashboard &rarr; Dasbor
  - Inventory &rarr; Inventaris
  - Logout &rarr; Keluar

---

## 5. Component Patterns

- **`PublicHeader`**: Unified corporate header with official `LatansaLogo`, desktop links, and mobile slide-in navigation (`Sheet`).
- **`PublicFooter`**: Structured multi-column footer with corporate overview, B2B services, and copyright statement.
- **`ProductCard`**: High-value product presentation with dedicated image frame, elegant fallback placeholder, brand tag, SKU meta, IDR currency formatting, and compare trigger.
- **`ProductImagePlaceholder`**: Elegant hardware-inspired vector placeholder in warm stone/burgundy tones (replaces all plain text "NO IMAGE").
- **`EmptyState`**: Centered feedback container for zero search results or empty comparison states.
- **`ComparePage`**: 4-product decision tool with sticky specification headers on desktop and smooth horizontal scrolling on mobile.
- **Mobile Patterns**: All drawers, navigation sheets, and mobile filter triggers use touch-friendly dimensions (min 44px touch targets).
