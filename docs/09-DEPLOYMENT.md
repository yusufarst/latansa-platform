# Deployment

## Target Environment
- **Server**: Existing Client VPS (Ubuntu/Linux)
- **Container Orchestration**: Docker Compose
- **Reverse Proxy**: Caddy (handles automatic HTTPS via Let's Encrypt and routing)
- **Application**: Next.js App (Standalone build)
- **Database**: PostgreSQL (Containerized or managed, accessed securely)

## Domains & Routing
- **Public Domain**: `latansajogjakarta.com`, `www.latansajogjakarta.com` -> Routes to the public Next.js pages.
- **Internal Domain**: `app.latansajogjakarta.com` -> Routes to the internal admin Next.js pages.

## Storage & Backup
- **Persistent Storage**: Docker volumes for PostgreSQL data.
- **Uploads**: Persistent volume for user uploads, mapped into the Next.js container.
- **Backups**: Automated backup scripts for the database volume and uploads directory.

*Note: No real VPS credentials or secrets should ever be documented here.*
