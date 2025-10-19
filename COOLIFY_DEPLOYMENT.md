# Profwise Deployment with Coolify

This guide covers deploying Profwise to production using Coolify's Docker Compose support.

## What is Coolify?

Coolify is a self-hosted platform that automates:
- ✅ Docker deployments with zero-downtime
- ✅ Automatic SSL certificates (Let's Encrypt)
- ✅ Reverse proxy (Traefik)
- ✅ Environment variable management
- ✅ CI/CD from Git repositories
- ✅ Health monitoring & auto-restart

**No manual Nginx/Caddy setup needed!**

---

## Prerequisites

- Coolify installed on your server
- Git repository with your code
- PostgreSQL database running (already configured)
- Domain names pointed to your server:
  - `profwise.kz` → Frontend
  - `api.profwise.kz` → Backend

---

## Step 1: Create New Resource in Coolify

1. Log in to Coolify dashboard
2. Navigate to your project
3. Click **"Create New Resource"**
4. Select **"Docker Compose"** as the build pack
5. Connect your Git repository

---

## Step 2: Configure Environment Variables

In Coolify's UI, set these environment variables:

### Required Variables

```env
DATABASE_URL=postgres://postgres:IOjMrygG1nTG2sl8zbs292TygkerLFI5HCD2xEBRzxFIwGg8wUESY7jViB0p2Adw@gswoks40sccwssogc80o404k:5432/postgres
JWT_SECRET=your-super-strong-random-secret-here-min-32-chars
BREVO_API_KEY=your-brevo-api-key-from-dashboard
```

**Important:** Replace the DATABASE_URL with your actual PostgreSQL connection string. The hostname should be accessible from within Coolify's Docker network.

### Optional Variables (with defaults)

```env
EMAIL_FROM=noreply@profwise.kz
EMAIL_FROM_NAME=Profwise
ENABLE_EMAIL_VERIFICATION=true
```

**Important:** Coolify will automatically provide:
- `SERVICE_FQDN_FRONTEND` - Frontend domain
- `SERVICE_FQDN_BACKEND` - Backend API domain

---

## Step 3: Configure Service Domains

In Coolify, assign domains to your services:

### Frontend Service
- **Domain:** `profwise.kz`
- **Port:** `3000` (internal)
- **SSL:** Enabled (automatic via Let's Encrypt)

### Backend Service
- **Domain:** `api.profwise.kz`
- **Port:** `4000` (internal)
- **SSL:** Enabled (automatic via Let's Encrypt)

### Redis Service
- **No domain needed** (internal only)

---

## Step 4: Deploy

1. In Coolify, click **"Deploy"**
2. Coolify will:
   - Clone your repository
   - Build Docker images
   - Start containers
   - Configure reverse proxy
   - Provision SSL certificates
   - Monitor health checks

3. Monitor deployment logs in real-time

---

## How It Works

### Coolify Magic Variables

Coolify automatically injects these variables:

```yaml
# In docker-compose.yml
environment:
  # Coolify provides full URLs with https://
  - FRONTEND_URL=${SERVICE_FQDN_FRONTEND}
  # Automatically becomes: https://profwise.kz

  - NEXT_PUBLIC_API_URL=${SERVICE_FQDN_BACKEND}
  # Automatically becomes: https://api.profwise.kz
```

### Internal Networking

Services communicate via Docker network:

```yaml
# Backend connects to Redis
REDIS_URL=redis://redis:6379
# No need for external IP - Docker DNS resolves "redis"
```

### Port Exposure

```yaml
# Use 'expose' instead of 'ports' for Coolify
expose:
  - "4000"  # Internal only, Coolify proxy handles external
```

**Don't use:**
```yaml
ports:
  - "4000:4000"  # This exposes port publicly, bypassing proxy!
```

---

## Verification

### Check Deployment Status

In Coolify dashboard:
- ✅ All services show "Running"
- ✅ Health checks passing
- ✅ SSL certificates active

### Test Endpoints

```bash
# Frontend
curl https://profwise.kz

# Backend health
curl https://api.profwise.kz/health
# Expected: {"status":"ok","timestamp":"2025-..."}

# Backend API
curl https://api.profwise.kz/professions
```

---

## Updating the Application

### Automatic Deployments (Recommended)

1. Push to your main/master branch
2. Coolify auto-detects changes
3. Automatic deployment triggered
4. Zero-downtime rolling update

### Manual Deployment

1. In Coolify dashboard
2. Click "Force Redeploy"
3. Coolify rebuilds and restarts

---

## Managing Services

### View Logs

In Coolify:
1. Navigate to your resource
2. Click on service (backend/frontend/redis)
3. View live logs

### Restart Service

1. Navigate to service
2. Click "Restart"
3. Zero-downtime restart

### Environment Variables

1. Navigate to service
2. Click "Environment Variables"
3. Edit values
4. Click "Save & Redeploy"

---

## Monitoring

### Health Checks

Coolify monitors:
- **Backend:** `GET /health` every 30s
- **Frontend:** `GET /` every 30s
- **Redis:** `redis-cli ping` every 10s

Auto-restart on failure.

### Resource Usage

View in Coolify dashboard:
- CPU usage per service
- Memory consumption
- Network traffic
- Disk usage

---

## Troubleshooting

### Service Won't Start

1. Check logs in Coolify
2. Verify environment variables are set
3. Check database connection:
   ```bash
   # In Coolify terminal for backend service
   curl http://localhost:4000/health
   ```

### SSL Certificate Issues

1. Ensure domains point to server IP
2. Check Coolify proxy logs
3. Certificate auto-renews (Let's Encrypt)

### Frontend Can't Reach Backend

1. Verify `SERVICE_FQDN_BACKEND` is set
2. Check CORS in backend logs
3. Ensure both services are on same Coolify network

### Database Connection Failed

1. Verify `DATABASE_URL` in environment
2. Check external PostgreSQL is accessible:
   ```bash
   # From Coolify server
   psql postgres://postgres:PASSWORD@gswoks40sccwssogc80o404k:5432/postgres
   ```

### Redis Connection Failed

1. Check redis service is running
2. Verify `REDIS_URL=redis://redis:6379`
3. Test connection:
   ```bash
   # In backend service terminal
   redis-cli -h redis ping
   ```

---

## Rollback

If deployment fails:

1. In Coolify dashboard → Deployments
2. Find previous successful deployment
3. Click "Redeploy"
4. Instant rollback to working version

---

## Performance Tips

### Enable Build Cache

Coolify caches Docker layers - rebuilds are fast!

### Scale Services

In Coolify (if needed):
1. Navigate to service
2. Adjust "Replicas" count
3. Coolify load balances automatically

### Database Pooling

Already configured in backend:
- Prisma connection pooling
- Redis for session caching

---

## Security Checklist

- [x] SSL/TLS enabled (automatic via Coolify)
- [x] JWT_SECRET is strong random value
- [x] Database credentials secure
- [x] Redis not exposed externally
- [x] CORS restricted to production domains
- [x] Environment variables not in git
- [x] Health checks enabled
- [x] Automatic security updates (Coolify)

---

## Backup Strategy

### Redis Data

Coolify persists volumes automatically:
```yaml
volumes:
  - redis-data:/data  # Survives container restarts
```

### Database Backup

Your external PostgreSQL - backup separately:
```bash
pg_dump -h gswoks40sccwssogc80o404k -U postgres postgres > backup.sql
```

---

## Additional Resources

- [Coolify Documentation](https://coolify.io/docs)
- [Docker Compose Guide](https://coolify.io/docs/knowledge-base/docker/compose)
- [Environment Variables](https://coolify.io/docs/knowledge-base/docker/compose#environment-variables)
- [Magic Variables](https://coolify.io/docs/knowledge-base/docker/compose#coolify-variables)

---

## Support

For Coolify-specific issues:
- [Coolify Discord](https://coolify.io/discord)
- [GitHub Discussions](https://github.com/coollabsio/coolify/discussions)

For application issues:
- Check service logs in Coolify dashboard
- Verify environment variables
- Test health endpoints
