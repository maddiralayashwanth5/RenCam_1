# Rencam Setup Guide

## Security & Authentication Setup

This guide walks you through setting up the secure authentication system.

## Prerequisites

- Node.js 18+ 
- pnpm package manager
- PostgreSQL database (Neon recommended)

## Installation Steps

### 1. Install Dependencies

```bash
pnpm install
```

This will install the new security dependencies:
- `jose` - JWT handling
- `zod` - Input validation (already in package.json)

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and set the following variables:

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# JWT Authentication (CRITICAL: Use a strong random string)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long-change-this-immediately
JWT_EXPIRES_IN=7d

# Application
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000
```

**Important**: Generate a strong JWT secret:

```bash
# On macOS/Linux
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 3. Database Setup

Run the database migrations:

```bash
psql $DATABASE_URL -f scripts/01-create-tables.sql
```

Or if using Neon dashboard, copy and paste the SQL from `scripts/01-create-tables.sql`.

### 4. Verify Environment Configuration

The application will validate environment variables on startup. If any are missing or invalid, you'll see a clear error message.

## What Changed: Authentication Security

### Before (Insecure)
- ❌ User data stored in localStorage
- ❌ No token expiration
- ❌ Vulnerable to XSS attacks
- ❌ No input validation
- ❌ No rate limiting
- ❌ Weak password requirements

### After (Secure)
- ✅ JWT tokens in HTTP-only cookies
- ✅ 7-day token expiration
- ✅ Protected from XSS attacks
- ✅ Comprehensive input validation with Zod
- ✅ Rate limiting on all auth endpoints
- ✅ Strong password requirements
- ✅ Security headers configured
- ✅ TypeScript strict mode enabled

## Testing the Authentication

### 1. Start Development Server

```bash
pnpm dev
```

### 2. Test Signup Flow

1. Navigate to http://localhost:3000/auth/signup
2. Try creating an account with a weak password - should fail validation
3. Create account with strong password:
   - Email: test@example.com
   - Password: TestPass123
   - Name: Test User

4. Check browser DevTools > Application > Cookies
   - You should see `auth-token` cookie
   - HttpOnly flag should be set
   - SameSite should be Lax

### 3. Test Login Flow

1. Logout and login again
2. Verify rate limiting by trying to login 10+ times quickly
3. Should see 429 error after limit exceeded

### 4. Test Protected Routes

1. Try accessing `/api/cameras/create` without authentication
2. Should receive 401 Unauthorized

## API Changes

### New Endpoints

- `POST /api/auth/signup` - Create account (rate limited: 5/15min)
- `POST /api/auth/login` - Login (rate limited: 10/15min)
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user (protected)

### Authentication Flow

```
Client                    Server
  |                         |
  |--- POST /auth/signup -->|
  |                         |--> Validate input
  |                         |--> Hash password
  |                         |--> Create user
  |                         |--> Generate JWT
  |<-- Set-Cookie: token ---|
  |                         |
  |--- GET /auth/me ------->|
  |    (with cookie)        |--> Verify JWT
  |                         |--> Fetch user data
  |<-- User data ----------|
```

## Client-Side Changes

### Updated: `hooks/use-auth.ts`

- No longer uses localStorage
- Fetches user from `/api/auth/me` on mount
- Logout calls API endpoint and clears cookie

### Updated: `app/auth/signup/page.tsx`

- Removed localStorage.setItem()
- Relies on HTTP-only cookie for authentication

### Updated: `app/auth/login/page.tsx`

- Same changes as signup

## Middleware Usage

### Protecting API Routes

```typescript
// Example: app/api/cameras/create/route.ts
import { withAuth } from '@/lib/middleware/auth'

async function createCameraHandler(request: NextRequest) {
  const user = getUser(request)
  // user is guaranteed to exist and have correct role
}

export async function POST(request: NextRequest) {
  return withAuth(request, createCameraHandler, { 
    requiredRole: 'lender' 
  })
}
```

### Adding Rate Limiting

```typescript
import { withRateLimit } from '@/lib/middleware/rate-limit'

async function handler(request: NextRequest) {
  // Your logic
}

export async function POST(request: NextRequest) {
  return withRateLimit(request, handler, {
    maxRequests: 10,
    windowMs: 900000 // 15 minutes
  })
}
```

## Production Deployment

### Environment Variables

Ensure all environment variables are set in your hosting platform:
- Vercel: Project Settings > Environment Variables
- AWS: Secrets Manager or Parameter Store
- Docker: .env file or secrets

### Security Checklist

- [ ] Set strong JWT_SECRET (32+ characters)
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS
- [ ] Review rate limits for your traffic
- [ ] Set up error monitoring (Sentry)
- [ ] Configure database backups
- [ ] Review security headers

### Performance Considerations

**Rate Limiting**: The current in-memory implementation will reset on server restart. For production with multiple servers, migrate to Redis:

```typescript
// Future: Redis-based rate limiting
import { RateLimiterRedis } from 'rate-limiter-flexible'
```

## Troubleshooting

### "Invalid environment variables" Error

Check that:
1. `.env` file exists
2. All required variables are set
3. JWT_SECRET is at least 32 characters
4. DATABASE_URL is valid PostgreSQL connection string

### Cookies Not Being Set

Check:
1. Using `http://localhost` (not `127.0.0.1`)
2. Not running in incognito mode with strict cookie settings
3. Browser DevTools > Network > Check Set-Cookie header

### TypeScript Errors

Run:
```bash
pnpm install  # Ensure all dependencies are installed
```

The errors about missing modules will resolve after installation.

## Migration Guide for Existing Users

If you have existing users in localStorage:

1. Users will need to login again (one-time)
2. Old localStorage data will be ignored
3. New secure cookies will be set

Optional: Create a migration script to preserve sessions.

## Next Steps

See `SECURITY.md` for:
- Detailed security documentation
- Known limitations
- Future improvements
- Security audit log

## Support

For issues or questions about the security implementation, please open an issue on GitHub or contact the development team.
