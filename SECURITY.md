# Security Documentation

## Overview

This document outlines the security measures implemented in the Rencam camera rental platform and best practices for deployment.

## Authentication & Authorization

### JWT-Based Authentication
- **Implementation**: HTTP-only cookies with JWT tokens
- **Library**: `jose` (v5.2.0) for secure JWT operations
- **Token Expiration**: 7 days (configurable via `JWT_EXPIRES_IN`)
- **Token Payload**: `{ userId, email, role, iat, exp }`

### Password Security
- **Hashing**: bcrypt with 10 salt rounds
- **Requirements**: 
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
- **Storage**: Only password hash stored in database

### Session Management
- **HTTP-Only Cookies**: Prevents XSS attacks from accessing tokens
- **SameSite=Lax**: CSRF protection
- **Secure flag**: Enabled in production (HTTPS only)
- **Auto-refresh**: Client fetches user data from `/api/auth/me`

### Role-Based Access Control (RBAC)
- **Roles**: admin, lender, renter
- **Middleware**: `withAuth()` validates role permissions
- **Admin Override**: Admin role has access to all resources

## Input Validation

### Zod Schemas
All API routes validate input using Zod schemas:

- **Auth**: `signupSchema`, `loginSchema`
- **Booking**: `createBookingSchema`, `verifyOTPSchema`
- **Camera**: `createCameraSchema`, `cameraFiltersSchema`

### Validation Features
- Type checking
- String length limits
- Email format validation
- UUID validation
- Date validation
- Regex patterns for passwords and OTPs

## Rate Limiting

### Implementation
- **Strategy**: In-memory token bucket (upgrade to Redis for production)
- **Default Limits**:
  - Signup: 5 requests per 15 minutes
  - Login: 10 requests per 15 minutes
  - General API: 100 requests per 15 minutes

### Headers
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Requests remaining
- `X-RateLimit-Reset`: When the limit resets
- `Retry-After`: Seconds to wait before retrying (on 429)

## Database Security

### SQL Injection Prevention
- **Parameterized Queries**: All queries use parameter binding
- **Library**: `@neondatabase/serverless` with safe query methods
- **No String Concatenation**: Never build queries with string templates

### Soft Deletes
- Records marked with `deleted_at` instead of hard deletion
- Preserves data integrity and audit trail

### Constraints
- Foreign key constraints
- Unique constraints on emails
- NOT NULL constraints on critical fields
- Check constraints on enums

## HTTP Security Headers

Configured in `next.config.mjs`:

- **Strict-Transport-Security**: Force HTTPS (2 years)
- **X-Frame-Options**: Prevent clickjacking
- **X-Content-Type-Options**: Prevent MIME sniffing
- **X-XSS-Protection**: Enable browser XSS filter
- **Referrer-Policy**: Control referrer information

## Environment Variables

### Required Variables
See `.env.example` for all required environment variables:

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: **Minimum 32 characters** (use strong random string)
- `JWT_EXPIRES_IN`: Token expiration time
- `NODE_ENV`: Environment (development/production/test)

### Security Best Practices
- Never commit `.env` files to version control
- Use different secrets for each environment
- Rotate JWT secrets periodically
- Use managed secrets services in production (AWS Secrets Manager, etc.)

## API Security

### Protected Routes
Use `withAuth()` middleware:

```typescript
export async function POST(request: NextRequest) {
  return withAuth(request, async (req) => {
    const user = getUser(req)
    // Handler logic
  }, { requiredRole: 'lender' })
}
```

### Rate Limited Routes
Use `withRateLimit()` middleware:

```typescript
export async function POST(request: NextRequest) {
  return withRateLimit(request, handler, { 
    maxRequests: 5, 
    windowMs: 900000 
  })
}
```

## Known Limitations & Future Improvements

### Current Limitations
1. **In-Memory Rate Limiting**: Not distributed, resets on server restart
2. **No CSRF Tokens**: Relies on SameSite cookies only
3. **No API Key Management**: For third-party integrations
4. **No 2FA**: Two-factor authentication not implemented
5. **No Email Verification**: Email addresses not verified

### Recommended Improvements
1. **Redis-Based Rate Limiting**: For distributed systems
2. **CSRF Tokens**: Implement double-submit cookie pattern
3. **Email Verification**: Send verification emails on signup
4. **2FA/MFA**: Add authenticator app support
5. **API Keys**: For programmatic access
6. **Audit Logging**: Log all security-relevant events
7. **IP Whitelisting**: For admin routes
8. **Webhook Signatures**: Verify webhook payloads
9. **Content Security Policy**: Add CSP headers

## Security Checklist for Production

### Pre-Deployment
- [ ] Change all default secrets
- [ ] Enable HTTPS/TLS
- [ ] Set `NODE_ENV=production`
- [ ] Review all environment variables
- [ ] Enable strict TypeScript checking
- [ ] Run security audit: `pnpm audit`
- [ ] Test authentication flows
- [ ] Test rate limiting

### Post-Deployment
- [ ] Monitor authentication failures
- [ ] Set up error tracking (Sentry)
- [ ] Enable access logs
- [ ] Regular dependency updates
- [ ] Regular security audits
- [ ] Backup database regularly
- [ ] Test disaster recovery

## Reporting Security Issues

If you discover a security vulnerability, please email security@rencam.com (or your designated security contact).

Do NOT open public issues for security vulnerabilities.

## Compliance

### Data Protection
- User passwords are hashed, never stored in plain text
- Personal data is protected by soft deletes
- Database connections are encrypted

### GDPR Considerations
- Users can request account deletion
- Personal data export capability needed (TODO)
- Cookie consent banner recommended for EU users

## Security Audit Log

| Date | Version | Auditor | Findings | Status |
|------|---------|---------|----------|--------|
| 2024-11 | 0.1.0 | Internal | Initial security implementation | Complete |

---

Last Updated: November 2024
Version: 0.1.0
