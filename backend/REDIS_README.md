# Redis Caching for Profwise - Quick Start

## 🚀 Why Redis?

Load testing proved Redis is **essential** for production:

```
┌─────────────────────┬─────────────┬──────────────┬──────────────┐
│ Metric              │ Without     │ With Redis   │ Improvement  │
├─────────────────────┼─────────────┼──────────────┼──────────────┤
│ Response Time (p95) │ 26-30 sec   │ 150-250ms    │ 99% faster   │
│ Concurrent Users    │ ~100 max    │ 1000+ users  │ 10x capacity │
│ Database Load       │ 100%        │ <5%          │ 95% less     │
│ Error Rate          │ 60-70%      │ <5%          │ 90% less     │
└─────────────────────┴─────────────┴──────────────┴──────────────┘
```

**Without Redis, your system fails at ~100 concurrent users.**
**With Redis, it easily handles 1000+ users.**

---

## ⚡ Quick Setup (2 minutes)

### Option 1: Automated Setup (Recommended)

```bash
# Run the setup script
./setup-redis.sh

# Follow the prompts - it will:
# - Generate secure Redis password
# - Enable Redis caching in .env
# - Show current configuration
```

### Option 2: Manual Setup

```bash
# 1. Generate secure password
openssl rand -base64 32

# 2. Update .env file
ENABLE_REDIS_CACHE="true"
REDIS_HOST="localhost"
REDIS_PORT="6379"
REDIS_PASSWORD="your-generated-password"
REDIS_DEFAULT_TTL="3600"

# 3. Start Redis
docker-compose up -d redis

# 4. Verify it's working
docker exec profwise-redis redis-cli ping
# Should return: PONG
```

---

## 📦 What's Included

```
backend/
├── redis.conf                    # Production-ready Redis config
├── docker-compose.yml            # Redis + PostgreSQL setup
├── setup-redis.sh               # Automated setup script
├── REDIS_README.md              # This file (quick start)
├── LOAD_TEST_RESULTS.md         # Performance benchmarks
└── docs/
    ├── REDIS_DEPLOYMENT.md      # Complete deployment guide
    └── api-docs.md              # API documentation with cache info
```

---

## 🔧 Configuration Files

### 1. `.env` (Required)
```bash
ENABLE_REDIS_CACHE="true"         # Must be true in production
REDIS_HOST="localhost"             # Redis server
REDIS_PORT="6379"                  # Default port
REDIS_PASSWORD="your-password"     # Set secure password
REDIS_DEFAULT_TTL="3600"           # 1 hour default
```

### 2. `docker-compose.yml` (Provided)
Already configured with:
- Redis 7 Alpine (latest stable)
- Persistent storage with volumes
- Health checks
- Auto-restart
- Password authentication
- Custom redis.conf

### 3. `redis.conf` (Production-Ready)
Includes:
- AOF + RDB persistence (no data loss)
- 512MB memory limit with LRU eviction
- Security hardening (dangerous commands disabled)
- Performance tuning
- Automatic backups

---

## 🎯 Deployment Options

### Local Development
```bash
docker-compose up -d
npm run start:dev
```

### Coolify (Your Current Setup)
1. Add Redis service in Coolify dashboard
2. Set environment variables
3. Link to backend service
4. Deploy

See [REDIS_DEPLOYMENT.md](docs/REDIS_DEPLOYMENT.md) for detailed Coolify instructions.

### AWS/Azure/GCP
Use managed Redis service:
- AWS ElastiCache (~$50/month)
- Azure Cache (~$60/month)
- Google Cloud Memorystore (~$50/month)

See [REDIS_DEPLOYMENT.md](docs/REDIS_DEPLOYMENT.md) for cloud setup guides.

---

## ✅ Verify It's Working

### 1. Check Redis is running
```bash
docker exec profwise-redis redis-cli ping
# Expected: PONG
```

### 2. Check backend connects to Redis
```bash
# Start backend
npm run start:dev

# Look for this in logs:
[Redis] Connecting to Redis at localhost:6379
[Redis] Successfully connected to Redis
```

### 3. Test cache is working
```bash
# First request (cache MISS)
curl http://localhost:4000/professions

# Check logs - should see:
[Cache MISS] ProfessionsController:/professions
[Cache SET] ProfessionsController:/professions (TTL: 3600s)

# Second request (cache HIT)
curl http://localhost:4000/professions

# Check logs - should see:
[Cache HIT] ProfessionsController:/professions

# Response should be <100ms
```

### 4. Run load test (optional)
```bash
# Test with 1000 concurrent users
npx artillery run artillery-1000-users.yml

# Should see:
# - Response times: 60-250ms
# - Success rate: 95%+
# - No timeouts
```

---

## 📊 Monitoring

### Check Cache Hit Ratio
```bash
docker exec profwise-redis redis-cli INFO stats | grep hits
# Target: >85% hit rate
```

### Check Memory Usage
```bash
docker exec profwise-redis redis-cli INFO memory | grep used_memory
# Should be <400MB for your dataset
```

### View Backend Cache Logs
```bash
docker logs -f profwise-backend | grep Cache

# OR for local dev:
npm run start:dev | grep Cache
```

### Check Cached Keys
```bash
docker exec profwise-redis redis-cli KEYS "*"
# Shows all cache keys
```

---

## 🆘 Troubleshooting

### Redis won't start
```bash
# Check logs
docker logs profwise-redis

# Common fix: Remove old volumes
docker-compose down -v
docker-compose up -d redis
```

### Backend can't connect to Redis
```bash
# Verify Redis is accessible
docker exec profwise-redis redis-cli ping

# Check password in .env matches redis.conf
grep REDIS_PASSWORD .env

# Test connection with password
docker exec profwise-redis redis-cli -a your-password ping
```

### Cache not working (still slow)
```bash
# 1. Verify ENABLE_REDIS_CACHE="true" in .env
grep ENABLE_REDIS_CACHE .env

# 2. Restart backend to pick up .env changes
docker-compose restart backend

# 3. Check backend logs for cache operations
docker logs profwise-backend | grep Cache

# 4. If no cache logs, Redis connection failed - check password
```

### Out of memory
```bash
# Check memory usage
docker exec profwise-redis redis-cli INFO memory

# If near 512MB limit, increase in redis.conf:
# maxmemory 1gb

# Restart Redis
docker-compose restart redis
```

---

## 📚 Documentation

- **Quick Start:** `REDIS_README.md` (this file)
- **Full Deployment Guide:** `docs/REDIS_DEPLOYMENT.md`
- **Load Test Results:** `LOAD_TEST_RESULTS.md`
- **API Documentation:** `docs/api-docs.md`

---

## 🔐 Security Checklist

Before deploying to production:

- [ ] Set strong Redis password (`openssl rand -base64 32`)
- [ ] Enable Redis password in docker-compose.yml
- [ ] Set `ENABLE_REDIS_CACHE="true"`
- [ ] Configure firewall (only backend can access Redis)
- [ ] Enable TLS/SSL for managed Redis services
- [ ] Set up automated backups
- [ ] Configure monitoring/alerting
- [ ] Never expose Redis port to public internet

---

## 🎓 How It Works

### Caching Strategy

1. **First Request (Cache MISS)**
   ```
   User → Backend → Database → Response
                  ↓
                Cache
   ```
   Response time: ~500-3000ms

2. **Subsequent Requests (Cache HIT)**
   ```
   User → Backend → Cache → Response
   ```
   Response time: ~10-50ms (50-300x faster!)

### Cache TTLs

| Endpoint Type | TTL | Reason |
|--------------|-----|--------|
| Lists (GET /professions) | 1 hour | Data changes infrequently |
| Details (GET /professions/:id) | 1 hour | Updated rarely |
| Static (GET /instructions) | 24 hours | Never changes |
| User data (GET /users/:id/professions) | 15 min | Can change after quiz |

### Cache Invalidation

Cache automatically cleared when:
- Profession created/updated/deleted
- Category created/updated/deleted
- University created/updated/deleted
- User completes quiz (user-specific cache only)

No manual cache clearing needed in normal operation.

---

## 💰 Cost Estimate

### Self-Hosted (Docker Compose)
- **Infrastructure:** Included in server cost
- **Redis Overhead:** ~512MB RAM, minimal CPU
- **Total Extra Cost:** $0

### Managed Redis (Cloud)
- **AWS ElastiCache:** ~$50/month (t3.micro)
- **Azure Cache:** ~$60/month (Basic)
- **DigitalOcean:** ~$15/month (1GB)

**ROI:** Redis enables 10x more users on same hardware. Cost savings from not needing 10x servers far exceed Redis cost.

---

## 🚦 Production Readiness

Your Redis setup is production-ready with:

✅ Persistence (AOF + RDB)
✅ Automatic backups
✅ Health checks
✅ Auto-restart on failure
✅ Security (password auth)
✅ Performance tuning
✅ Memory management (LRU)
✅ Monitoring logs
✅ Graceful fallback (if Redis fails, uses DB)

Just set password and deploy!

---

## 🎉 Summary

Redis caching is **REQUIRED** for Profwise production. It provides:

- **99% faster** response times
- **10x more** concurrent users
- **95% less** database load
- **Dramatically better** user experience

Setup takes 2 minutes. Benefits are immediate and massive.

**Ready to deploy? Run `./setup-redis.sh` and you're done!**

For detailed deployment instructions, see [docs/REDIS_DEPLOYMENT.md](docs/REDIS_DEPLOYMENT.md).

---

*Generated from load testing on October 20, 2025 - [View Full Results](LOAD_TEST_RESULTS.md)*
