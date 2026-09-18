# Architecture

## 1. Core Architecture
- **Modular Monolith**: One main codebase.
- **Single Application**: Public and internal applications share the same platform.
- **Zero/Near-Zero Recurring Cost Principle**: No unnecessary microservices, no Kubernetes, no mandatory paid SaaS, no Firebase/Supabase/Vercel dependency, no hosted search dependency.

## 2. Tech Stack
- **Framework**: Next.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Validation**: Zod
- **Styling**: Tailwind CSS, shadcn/ui
- **Testing**: Vitest, Playwright
- **Deployment**: Docker Compose, Caddy

## 3. Boundaries
- **Public/Internal**: The platform handles both public-facing and internal admin routes. Internal routes must be strictly protected by authentication and RBAC.
- **Security Boundaries**: Server components and API routes must enforce RBAC. Client-side hiding is insufficient.

## 4. Infrastructure
- **Server**: Single VPS (Ubuntu/Linux)
- **Containerization**: Docker Compose for app, database, and any necessary local services.
- **Reverse Proxy**: Caddy for automated TLS and routing.
