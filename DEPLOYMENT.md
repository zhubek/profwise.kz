# Profwise Production Deployment Guide

This guide covers deploying the Profwise platform to production using Docker Compose.

## Prerequisites

- Docker and Docker Compose installed on the production server
- Domain names configured:
  - `profwise.kz` → Frontend (port 3000)
  - `api.profwise.kz` → Backend (port 4000)
- PostgreSQL database already running (configured in docker-compose.yml)
- SSL certificates for HTTPS (use Let's Encrypt with Certbot or Cloudflare)

## Architecture

```
┌─────────────┐
│  profwise.kz │  →  Frontend (Next.js) - Port 3000
└─────────────┘

┌─────────────┐
│api.profwise │  →  Backend (NestJS) - Port 4000
│     .kz     │
└─────────────┘

┌─────────────┐
│    Redis    │  →  Internal (Docker network only)
└─────────────┘

┌─────────────┐
│  PostgreSQL │  →  External (already running)
└─────────────┘
```

## Step 1: Prepare Environment Variables

Copy the example file and configure your secrets:

```bash
cp .env.example .env
nano .env
```

Required variables:
```env
JWT_SECRET=your-strong-random-secret-here
BREVO_API_KEY=your-brevo-api-key
EMAIL_FROM=noreply@profwise.kz
EMAIL_FROM_NAME=Profwise
ENABLE_EMAIL_VERIFICATION=true
```

## Step 2: Configure Reverse Proxy (Nginx/Caddy)

### Option A: Using Nginx

Create `/etc/nginx/sites-available/profwise`:

```nginx
# Frontend
server {
    listen 80;
    listen [::]:80;
    server_name profwise.kz www.profwise.kz;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name profwise.kz www.profwise.kz;

    ssl_certificate /etc/letsencrypt/live/profwise.kz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/profwise.kz/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Backend API
server {
    listen 80;
    listen [::]:80;
    server_name api.profwise.kz;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.profwise.kz;

    ssl_certificate /etc/letsencrypt/live/api.profwise.kz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.profwise.kz/privkey.pem;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/profwise /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Option B: Using Caddy (Simpler, Auto-HTTPS)

Create `Caddyfile`:

```caddy
profwise.kz, www.profwise.kz {
    reverse_proxy localhost:3000
}

api.profwise.kz {
    reverse_proxy localhost:4000
}
```

Start Caddy:
```bash
caddy start
```

## Step 3: Build and Start Services

```bash
# Build and start all services
docker-compose up -d --build

# Check logs
docker-compose logs -f

# Check service status
docker-compose ps
```

## Step 4: Verify Deployment

```bash
# Check backend health
curl https://api.profwise.kz/health

# Expected response:
# {"status":"ok","timestamp":"2025-10-19T..."}

# Check frontend
curl https://profwise.kz
```

## Step 5: Monitor Services

```bash
# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f redis

# Check resource usage
docker stats

# Restart specific service
docker-compose restart backend
docker-compose restart frontend
```

## Maintenance

### Update Application

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose up -d --build

# Remove old images
docker image prune -a -f
```

### Backup Redis Data

```bash
# Redis data is persisted in Docker volume
docker-compose exec redis redis-cli SAVE

# Backup the volume
docker run --rm -v profwise_redis-data:/data -v $(pwd):/backup alpine \
  tar czf /backup/redis-backup-$(date +%Y%m%d).tar.gz -C /data .
```

### View Application Logs

```bash
# All services
docker-compose logs --tail=100 -f

# Specific service
docker-compose logs --tail=100 -f backend
```

### Scale Services (if needed)

```bash
# Scale frontend to 2 instances (requires load balancer)
docker-compose up -d --scale frontend=2
```

## Troubleshooting

### Backend can't connect to database
```bash
# Check database connection
docker-compose exec backend npx prisma db pull

# Test database connectivity
docker-compose exec backend node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.$connect().then(() => console.log('OK')).catch(console.error)"
```

### Frontend can't reach backend
```bash
# Check NEXT_PUBLIC_API_URL is set correctly
docker-compose exec frontend env | grep NEXT_PUBLIC

# Rebuild frontend with correct API URL
docker-compose up -d --build frontend
```

### Redis connection issues
```bash
# Check Redis is running
docker-compose exec redis redis-cli ping

# Should respond: PONG
```

### Service won't start
```bash
# Check logs for errors
docker-compose logs backend

# Restart service
docker-compose restart backend

# Full rebuild
docker-compose down
docker-compose up -d --build
```

## Security Checklist

- [x] PostgreSQL database has strong credentials
- [x] JWT_SECRET is a strong random value
- [x] SSL/TLS certificates are installed
- [x] CORS is configured for production domains only
- [x] Firewall allows only ports 80, 443, 22
- [x] Docker containers run as non-root users (Next.js already configured)
- [x] Environment variables are in `.env` (not committed to git)
- [x] Redis is not exposed to the internet (internal Docker network only)

## Performance Optimization

### Enable Nginx Caching (Optional)

Add to Nginx frontend config:
```nginx
# Cache static assets
location /_next/static/ {
    proxy_pass http://localhost:3000;
    proxy_cache_valid 200 365d;
    add_header Cache-Control "public, immutable";
}
```

### Monitor with Docker Stats

```bash
# Real-time monitoring
docker stats

# Resource limits (if needed, add to docker-compose.yml)
# services:
#   backend:
#     deploy:
#       resources:
#         limits:
#           cpus: '1.0'
#           memory: 1G
```

## Support

For issues or questions:
- Check logs: `docker-compose logs -f`
- Verify environment variables: `docker-compose config`
- Review Docker status: `docker-compose ps`
