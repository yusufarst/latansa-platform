# LATANSA Platform

LATANSA Platform is a premium, modern, production-grade web application for an electronics business. It serves both public customers and internal staff through a single modular monolith.

## Stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS & shadcn/ui
- PostgreSQL & Drizzle ORM
- Docker & Caddy

## Prerequisites
- Node.js >= 20
- Docker & Docker Compose
- PostgreSQL (if running locally without Docker)

## Local Setup
1. Clone the repository.
2. Ensure you have the required environment variables. Copy `.env.example` to `.env` and fill in the dummy values for local development. **NEVER commit `.env` or any files containing real credentials.**
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Docker Development/Start
To start the application and database using Docker Compose:
```bash
docker-compose up -d
```

## Quality Commands
- Linting: `npm run lint`
- Type checking: `npm run typecheck`
- Unit Tests: `npm run test:run`
- E2E Tests: `npm run test:e2e`

## Documentation
For the universal agent contract, current state, architecture, and other important documentation, please refer to the files in `docs/` and `AGENTS.md` at the root of the project.
