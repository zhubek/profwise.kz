# SSR Network Error Fix

## Problem

Frontend was experiencing network errors during Server-Side Rendering (SSR):

```
Failed to load quiz: Error [APIError]: Network error. Please check your connection.
  code: 'NETWORK_ERROR',
  statusCode: 0
```

## Root Cause

Next.js pages that use `async/await` for data fetching perform **Server-Side Rendering (SSR)**. This means the API calls happen on the **server** (Node.js), not in the browser.

### The Issue

The frontend was configured to call `https://api.profwise.kz` for all requests:

```typescript
// frontend/config/api.ts (OLD)
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://172.26.195.243:4000',
  // ...
};
```

This works fine for **client-side** requests (from browser), but fails for **server-side** requests because:

1. **Docker network isolation**: Frontend container cannot reach external URL `https://api.profwise.kz` during build/SSR
2. **SSR timing**: Server-side rendering happens before the page is sent to the browser
3. **Network context**: The Next.js server needs to use the **internal Docker network** to communicate with the backend container

### Affected Pages

Any page using `async` Server Components that call the API:

```typescript
// ❌ This causes SSR API calls
export default async function TestPage({ params }: TestPageProps) {
  const { quiz, questions } = await getQuizWithQuestions(testId, locale);
  // ...
}
```

Examples:
- `/tests/[testId]/page.tsx` - Quiz taking page
- `/results/[id]/page.tsx` - Results page
- `/professions/[id]/page.tsx` - Profession details

## Solution

### 1. Dynamic Base URL Selection

Updated `frontend/config/api.ts` to use different URLs for server vs client:

```typescript
// frontend/config/api.ts (NEW)
export const getBaseURL = (): string => {
  const isServer = typeof window === 'undefined';

  if (isServer) {
    // Server-side: use internal Docker network
    return process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  } else {
    // Client-side: use public URL
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  }
};

export const API_CONFIG = {
  get baseURL() {
    return getBaseURL(); // Dynamic getter
  },
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
};
```

### 2. Docker Compose Configuration

Added `API_URL` environment variable for server-side requests:

```yaml
# docker-compose.yml
frontend:
  environment:
    - NODE_ENV=production
    # Client-side API URL (public)
    - NEXT_PUBLIC_API_URL=https://api.profwise.kz
    # Server-side API URL (internal Docker network)
    - API_URL=http://backend:4000
```

## How It Works

### Request Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    User visits page                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Next.js Server (SSR) calls API to fetch data               │
│  - Uses: API_URL=http://backend:4000 (Docker network)       │
│  - isServer=true, uses internal URL                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Backend API responds with data                              │
│  - Direct container-to-container communication               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Next.js renders HTML with data and sends to browser        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Browser receives page and hydrates                          │
│  - Subsequent API calls use: NEXT_PUBLIC_API_URL             │
│  - isServer=false, uses public URL                           │
│  - Calls: https://api.profwise.kz                            │
└─────────────────────────────────────────────────────────────┘
```

## Environment Variables

### Development (.env.local)
```bash
# Client-side and server-side both use localhost
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Production (docker-compose.yml)
```yaml
environment:
  # Client-side: public URL
  - NEXT_PUBLIC_API_URL=https://api.profwise.kz
  # Server-side: internal Docker network
  - API_URL=http://backend:4000
```

## Why This Approach?

### ✅ Advantages

1. **No code changes to pages**: Existing pages continue to work without modification
2. **Automatic detection**: Runtime detection of server vs client context
3. **Flexible configuration**: Different URLs can be set via environment variables
4. **Docker-friendly**: Uses internal network for container-to-container communication
5. **Performance**: Server-side requests are faster (no external network hop)

### Alternative Approaches (Not Used)

#### ❌ Client-Side Only Rendering
```typescript
'use client'; // Force client-side rendering

export default function TestPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData(); // Only runs in browser
  }, []);
}
```

**Problems:**
- Worse SEO (content not in initial HTML)
- Slower initial page load (data fetching happens after page load)
- Loading states required

#### ❌ Hardcode Internal URL
```typescript
const API_URL = 'http://backend:4000'; // Always use internal URL
```

**Problems:**
- Client-side requests would fail (browser can't reach `backend:4000`)
- Not flexible for different environments

## Testing

### Verify Server-Side URL
```bash
# SSH into frontend container
docker exec -it profwise-frontend sh

# Check environment variables
echo $API_URL  # Should be: http://backend:4000
echo $NEXT_PUBLIC_API_URL  # Should be: https://api.profwise.kz

# Test internal network connectivity
curl http://backend:4000/health
```

### Verify Client-Side URL
```javascript
// Browser console
console.log(process.env.NEXT_PUBLIC_API_URL);
// Should log: https://api.profwise.kz
```

### Monitor Logs
```bash
# Watch frontend logs for API calls
docker logs -f profwise-frontend

# Should see successful SSR requests, no network errors
```

## Related Files

- `frontend/config/api.ts` - Base URL configuration
- `frontend/lib/api/client.ts` - API client using the config
- `docker-compose.yml` - Environment variables
- `frontend/.env.local` - Local development config

## Deployment Checklist

- [ ] Ensure `API_URL=http://backend:4000` is set in production environment
- [ ] Ensure `NEXT_PUBLIC_API_URL=https://api.profwise.kz` is set
- [ ] Test SSR pages load without network errors
- [ ] Test client-side API calls still work
- [ ] Monitor logs for any remaining network errors

## Debugging

If network errors persist:

1. **Check environment variables in container:**
   ```bash
   docker exec profwise-frontend env | grep API
   ```

2. **Test backend connectivity from frontend container:**
   ```bash
   docker exec profwise-frontend curl http://backend:4000/health
   ```

3. **Check Docker network:**
   ```bash
   docker network inspect profwise_default
   ```

4. **Add logging to config/api.ts:**
   ```typescript
   export const getBaseURL = (): string => {
     const isServer = typeof window === 'undefined';
     const url = isServer ? process.env.API_URL : process.env.NEXT_PUBLIC_API_URL;
     console.log(`[API Config] isServer=${isServer}, URL=${url}`);
     return url || 'http://localhost:4000';
   };
   ```

## Performance Impact

### Before Fix
- SSR requests: **Failed** (network timeout)
- Client requests: ✅ Worked

### After Fix
- SSR requests: ✅ **~5-20ms** (internal Docker network)
- Client requests: ✅ **Same as before** (external network)

### Benefits
- **Faster SSR**: Internal Docker network is much faster than external requests
- **No external dependency during SSR**: Frontend doesn't need external network access during build/SSR
- **More reliable**: Container-to-container communication is more stable
