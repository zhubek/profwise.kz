# Production Frontend Unhealthy Issue - Root Cause & Fix

## Current Situation

**Symptoms:**
- Frontend becomes unhealthy after 10 minutes of active use
- SSR network errors in logs: `NETWORK_ERROR, statusCode: 0`
- Happens when users actively use the site

**Production Logs Show:**
```
Failed to load quiz: Error [APIError]: Network error. Please check your connection.
  at async h (.next/server/app/[locale]/tests/[testId]/page.js:1:383)
  code: 'NETWORK_ERROR',
  statusCode: 0
```

## Root Cause

**Frontend SSR cannot reach backend API from inside Docker container.**

When Next.js performs Server-Side Rendering (SSR):
1. User visits `/tests/holand-1`
2. Next.js server (inside container) needs to fetch quiz data
3. Frontend tries to call `https://api.profwise.kz` from inside container
4. **This external URL doesn't work from inside the container** → Network error
5. Under heavy load, many SSR requests fail → Frontend appears unhealthy

## Why It's Intermittent

- **Light use**: SSR requests occasionally succeed (maybe DNS/network sometimes works)
- **Heavy use (10+ min)**: Many concurrent SSR requests fail → accumulates errors → unhealthy

## The Fix (2 Parts)

### Part 1: Frontend Config (Already Done Locally)

**File:** `frontend/config/api.ts`

```typescript
// Dynamic URL selection based on context
export const getBaseURL = (): string => {
  const isServer = typeof window === 'undefined';

  if (isServer) {
    // SSR in container: use internal Docker network
    return process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  } else {
    // Browser: use public URL
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  }
};
```

**File:** `frontend/lib/api/client.ts`

```typescript
// Import getBaseURL
import { getBaseURL, API_CONFIG, AUTH_CONFIG } from '@/config/api';

// In fetcher function:
const baseURL = getBaseURL(); // Dynamic at request time
const url = `${baseURL}${endpoint}`;
```

### Part 2: Docker Environment Variables

**File:** `docker-compose.yml`

```yaml
frontend:
  environment:
    - NODE_ENV=production
    - NEXT_PUBLIC_API_URL=https://api.profwise.kz  # For browser requests
    - API_URL=http://backend:4000                  # For SSR requests ← NEW!
```

**Critical:** The `API_URL=http://backend:4000` environment variable MUST be set in production!

## How It Works

### Before Fix (Current Production)
```
User → Next.js SSR → tries https://api.profwise.kz → ❌ fails from container
                                                     → NETWORK_ERROR
                                                     → Frontend unhealthy
```

### After Fix
```
User → Next.js SSR → uses http://backend:4000 → ✅ works (internal network)
                                                → Fast response
                                                → Frontend healthy

Browser → Client JS → uses https://api.profwise.kz → ✅ works (public URL)
```

## Deployment Instructions

### If Using Coolify

1. **Update environment variables:**
   - Go to your frontend service settings
   - Add: `API_URL=http://backend:4000`
   - Keep: `NEXT_PUBLIC_API_URL=https://api.profwise.kz`

2. **Deploy changes:**
   ```bash
   git add frontend/config/api.ts frontend/lib/api/client.ts docker-compose.yml
   git commit -m "fix: use internal Docker network for SSR API calls"
   git push
   ```

3. **Trigger rebuild** in Coolify (or it auto-deploys)

### If Using Docker Compose Directly

1. **Update docker-compose.yml on server:**
   ```bash
   cd /path/to/profwise.kz
   git pull
   ```

2. **Rebuild frontend:**
   ```bash
   docker-compose build --no-cache frontend
   docker-compose up -d frontend
   ```

3. **Verify environment variables:**
   ```bash
   docker exec profwise-frontend env | grep API
   # Should show:
   # API_URL=http://backend:4000
   # NEXT_PUBLIC_API_URL=https://api.profwise.kz
   ```

## Testing After Deployment

### 1. Check SSR Works
```bash
# Watch frontend logs - should NOT see network errors
docker logs -f profwise-frontend 2>&1 | grep -i "network error"

# If silent → good! No errors
```

### 2. Test Internal Connectivity
```bash
# From frontend container, test backend connectivity
docker exec profwise-frontend curl http://backend:4000/health

# Should return: {"status":"ok"} or similar
```

### 3. Monitor Health Status
```bash
# Both should stay healthy
watch -n 5 'docker ps | grep profwise'

# Should show:
# profwise-backend    (healthy)
# profwise-frontend   (healthy)
```

### 4. Load Test
- Have multiple users actively use the site
- Monitor for 15-20 minutes
- Frontend should remain healthy

## Additional Optimizations (If Still Issues)

### 1. Increase Prisma Connection Pool

**File:** `backend/prisma/schema.prisma`

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**Change DATABASE_URL to:**
```bash
# In backend .env or docker-compose.yml
DATABASE_URL="postgresql://postgres:profwise2024@postgres:5432/postgres?connection_limit=20&pool_timeout=10"
```

This increases connection pool from default (~5) to 20.

### 2. Add Request Timeout Handling

If backend becomes slow, SSR should fail gracefully instead of hanging.

**File:** `frontend/lib/api/client.ts` (already has 30s timeout)

The current 30-second timeout is good. If needed, can reduce:
```typescript
export const API_CONFIG = {
  timeout: 10000, // 10 seconds instead of 30
  // ...
};
```

### 3. Enable Redis Caching

**File:** `backend/.env`
```bash
ENABLE_REDIS_CACHE=true
```

This will cache API responses and reduce database load.

### 4. Add Health Check Logging

To debug if health checks are failing:

**File:** `backend/src/app.controller.ts`

```typescript
@Get('health')
getHealth() {
  console.log('[Health Check] Called at', new Date().toISOString());
  return { status: 'ok', timestamp: Date.now() };
}
```

## Monitoring Checklist

After deployment, monitor for:
- [ ] No "NETWORK_ERROR" in frontend logs
- [ ] Frontend stays healthy for > 30 minutes under load
- [ ] Backend stays healthy for > 30 minutes under load
- [ ] SSR requests complete in < 1 second
- [ ] No 500 errors in backend logs

## Expected Timeline

- **Immediate**: SSR network errors should stop
- **10 min**: Frontend should remain healthy under load
- **30 min**: Both services stable under continuous use

## Rollback Plan

If issues persist:

```bash
# Revert frontend changes
git revert HEAD
git push

# Or in Coolify, rollback to previous deployment
```

## Why This Will Fix It

1. **SSR uses internal network** → No external DNS/network dependency
2. **Faster response times** → Internal Docker network is faster
3. **More reliable** → Container-to-container communication is stable
4. **No timeout issues** → Direct connection, no network hops

## Current Status

- ✅ Code changes ready (in local git)
- ⏳ Needs deployment to production
- ⏳ Needs environment variable configuration

---

**Next Action:** Deploy the changes and configure `API_URL=http://backend:4000` in production environment.
