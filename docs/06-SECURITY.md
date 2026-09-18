# Security

## 1. Secrets Management
- All secrets must be environment-based.
- Never commit `.env` or any files containing real credentials.
- Required environment variables must be validated at application startup with Zod and fail safely when missing.

## 2. Authentication & Authorization
- **Password Hashing**: Strong hashing algorithms (e.g., Argon2 or bcrypt) must be used.
- **Session Security**: Secure, HttpOnly cookies for sessions.
- **Backend RBAC**: Roles must be verified on the server for every protected route, server action, and API endpoint. Client-side UI hiding is not a security measure.

## 3. Web Vulnerability Protection
- **CSRF**: Protection required for state-mutating requests.
- **XSS**: Strict output encoding (handled mostly by React/Next.js) and CSP headers where applicable.
- **Upload Validation**: Strict mime-type and size validation for file/image uploads.
- **Rate Limiting**: Apply to authentication endpoints and public forms (e.g., RFQ).

## 4. Database & Data Isolation
- **Isolation**: Prevent SQL injection using Drizzle ORM's parameterized queries.
- **Public vs Private API**: Public APIs/pages must NEVER expose internal/private data (purchase cost, margin, supplier info, exact racks, audit logs, private notes, internal users, internal identifiers).

## 5. Operations
- **Audit**: Immutable audit trail for all critical actions (stock movements, configuration changes, user management).
- **Backup**: Database and uploads must be regularly backed up.
- **Production Firewall**: Standard VPS firewall rules (UFW), exposing only necessary ports (e.g., 80/443 for Caddy, 22 for SSH). Database ports should not be publicly exposed.
