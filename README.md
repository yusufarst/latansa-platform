# LATANSA Platform

## Project Overview
A premium, modern, production-grade platform for LATANSA JOGJAKARTA, an electronics business. The platform encompasses a public corporate website/product catalog and an internal owner executive dashboard for product, inventory, and sales management.

## Architecture Summary
- **Modular Monolith**: One main codebase, one PostgreSQL database.
- **Stack**: Next.js, TypeScript, PostgreSQL, Drizzle ORM, Zod, Tailwind CSS, shadcn/ui, Vitest, Playwright.
- **Deployment**: VPS via Docker Compose and Caddy.
- **Open-Source Priority**: No unnecessary microservices, no mandatory paid SaaS, zero-or-near-zero recurring-cost infrastructure.

## Development Status
See `docs/00-CURRENT-STATE.md` for the current development phase and task.

## Documentation
Developers and Agents MUST read `AGENTS.md` and the `docs/` folder before making any changes.

Start here:
- [AGENTS.md](./AGENTS.md)
- [docs/00-CURRENT-STATE.md](./docs/00-CURRENT-STATE.md)
