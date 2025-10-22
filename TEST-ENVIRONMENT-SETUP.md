# Test Environment Setup Guide

This guide explains how to set up and deploy `test.profwise.kz` and `test-api.profwise.kz` for testing purposes.

## Overview

The test environment is a complete separate stack running on different domains:
- **Frontend**: `test.profwise.kz`
- **Backend API**: `test-api.profwise.kz`
- **Database**: Separate PostgreSQL instance
- **Cache**: Separate Redis instance

It uses completely isolated infrastructure to avoid interfering with production data.

## Prerequisites

- Docker and Docker Compose installed
- DNS records configured for test.profwise.kz and test-api.profwise.kz
- Access to Coolify or deployment server

## Architecture

### Services in docker-compose.test.yml
- **postgres-test**: PostgreSQL 16 (exposed on port 5433)
- **redis-test**: Redis 7 (internal network only)
- **backend-test**: NestJS API (exposed via Coolify)
- **frontend-test**: Next.js app (exposed via Coolify)

### Port Mapping (for external access)
- **Production PostgreSQL**: `5432`
- **Test PostgreSQL**: `5433` (only for data import/debugging)

### Key Differences from Production
- Different database password: `profwise2024_test`
- Redis caching **ENABLED** by default (`ENABLE_REDIS_CACHE=true`)
- Email verification **DISABLED** by default
- API URL: `https://test-api.profwise.kz`
- Frontend URL: `https://test.profwise.kz`

This ensures complete data isolation between environments.

## Setup Instructions

### 1. Deploy Test Stack to Coolify

**Option A: Deploy entire stack with docker-compose.test.yml**

1. In Coolify, create a new service → "Docker Compose"
2. Set Git repository and branch
3. Set docker-compose file path: `docker-compose.test.yml`
4. Configure domain routing:
   - `backend-test` → Domain: `test-api.profwise.kz`
   - `frontend-test` → Domain: `test.profwise.kz`

**Option B: Manually deploy services (recommended for flexibility)**

Follow the manual deployment steps in the "Deploy with Coolify" section below.

### 2. Verify Services are Running

Check all containers are healthy:
```bash
docker-compose -f docker-compose.test.yml ps
```

Expected output showing all services as "healthy".

### 2. Configure Backend Environment

Create `.env.test` from the example file:

```bash
cd backend
cp .env.test.example .env.test
```

Edit `.env.test` and update the following values:
- `JWT_SECRET`: Set a unique secret for test environment
- `BREVO_API_KEY`: Use test API key or same as production
- `POSTGRES_PASSWORD`: Change if needed for security
- `REDIS_PASSWORD`: Set if using password authentication

### 3. Initialize Test Database

Run Prisma migrations on the test database:

```bash
cd backend
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/profwise_test?schema=public" npx prisma migrate deploy
```

Optionally seed with test data:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/profwise_test?schema=public" npm run seed
```

### 4. Configure Frontend Environment

Create `.env.test` for the frontend:

```bash
cd frontend
cp .env.test.example .env.test
```

The file should contain:
```env
NEXT_PUBLIC_API_URL=https://test-api.profwise.kz
NODE_ENV=test
NEXT_PUBLIC_APP_URL=https://test.profwise.kz
```

### 5. Deploy with Coolify

#### Backend Deployment

1. Create new service in Coolify for test backend
2. Set the following configuration:
   - **Domain**: `test-api.profwise.kz`
   - **Port**: `4001`
   - **Branch**: Choose your test branch or `main`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm run start:prod`

3. Add environment variables from `.env.test`:
   - Copy all variables from `.env.test.example`
   - Set `DATABASE_URL` to point to test database
   - Enable `ENABLE_REDIS_CACHE=true` for testing caching

4. Deploy the backend

#### Frontend Deployment

1. Create new service in Coolify for test frontend
2. Set the following configuration:
   - **Domain**: `test.profwise.kz`
   - **Port**: `3000`
   - **Branch**: Same as backend
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

3. Add environment variable:
   - `NEXT_PUBLIC_API_URL=https://test-api.profwise.kz`

4. Deploy the frontend

### 6. DNS Configuration

Ensure DNS records are pointing to your server:

```
test.profwise.kz         → A record → Your server IP
test-api.profwise.kz     → A record → Your server IP
```

Coolify should automatically provision SSL certificates via Let's Encrypt.

## CORS Configuration

The backend is already configured to accept requests from test domains in `backend/src/main.ts`:

```typescript
origin: [
  'https://test.profwise.kz',
  'https://www.test.profwise.kz',
  'https://test-api.profwise.kz',
  // ... other origins
]
```

No additional CORS configuration is needed.

## Testing the Setup

### 1. Health Check

Test backend API:
```bash
curl https://test-api.profwise.kz/
```

Expected response: `{"message":"Profwise API is running"}`

### 2. Database Connection

Test database connectivity from backend:
```bash
curl https://test-api.profwise.kz/professions
```

Should return a list of professions (or empty array if not seeded).

### 3. Frontend-Backend Integration

Visit `https://test.profwise.kz` in browser and verify:
- Pages load correctly
- API calls work (check browser DevTools Network tab)
- No CORS errors in console

### 4. Redis Caching

Check backend logs for cache messages:
```bash
docker logs -f <test-backend-container-id>
```

You should see:
```
[Redis] Successfully connected to Redis
[Cache HIT] or [Cache MISS] messages on API calls
```

## Stopping Test Environment

To stop the infrastructure services:

```bash
cd backend
docker-compose -f docker-compose.test.yml down
```

To remove all data (WARNING: destroys test database):
```bash
docker-compose -f docker-compose.test.yml down -v
```

## Troubleshooting

### Port Conflicts

If ports 5433 or 6380 are in use:
1. Edit `docker-compose.test.yml`
2. Change port mappings (e.g., `6381:6379` instead of `6380:6379`)
3. Update `.env.test` to match new ports

### Database Connection Issues

Check if PostgreSQL is running:
```bash
docker logs profwise-postgres-test
```

Test connection manually:
```bash
psql postgresql://postgres:postgres@localhost:5433/profwise_test
```

### Redis Connection Issues

Check Redis logs:
```bash
docker logs profwise-redis-test
```

Test connection:
```bash
redis-cli -p 6380 ping
```

Expected response: `PONG`

### CORS Errors

If you see CORS errors:
1. Verify domain is listed in `backend/src/main.ts` origin array
2. Restart backend after changes
3. Clear browser cache
4. Check request origin in browser DevTools

## Differences from Production

### Environment Variables
- Test uses port `4001` instead of `4000`
- Different database: `profwise_test` instead of `profwise`
- Different Redis port: `6380` instead of `6379`
- Different frontend URL in email templates

### Data Isolation
- Completely separate database (safe for destructive testing)
- Separate Redis cache (no interference with production)
- Test user accounts won't appear in production

### Use Cases
- Test caching strategies before production deployment
- Test database migrations
- Test new features end-to-end
- Load testing without affecting production
- Test email functionality with test addresses

## Syncing Production Data to Test (Optional)

If you want to test with production-like data:

```bash
# Dump production database
pg_dump -h localhost -p 5432 -U postgres profwise > prod_dump.sql

# Restore to test database
psql -h localhost -p 5433 -U postgres profwise_test < prod_dump.sql
```

**Warning**: Be careful with sensitive user data. Consider anonymizing before copying to test.

## Next Steps

After confirming the test environment works:
1. Test caching implementation
2. Test any performance optimizations
3. Monitor database query performance
4. Test new features before production deployment
5. When satisfied, deploy changes to production
