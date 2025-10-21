# Redis Deployment Guide for Profwise

## Why Redis is Essential

Load testing conclusively proved Redis caching is **critical** for production:

| Metric | Without Redis | With Redis | Improvement |
|--------|--------------|------------|-------------|
| **Response Time (p95)** | 26-30 seconds | 150-250ms | **99% faster** |
| **System Capacity** | ~100 users | 1000+ users | **10x increase** |
| **Database Load** | 100% | <5% | **95% reduction** |
| **Error Rate** | 60-70% | <5% | **90% reduction** |

**Bottom Line:** Without Redis, the system fails at ~100 concurrent users. With Redis, it easily handles 1000+ users.

---

## Production Deployment Options

### Option 1: Docker Compose (Recommended for Small-Medium Deployments)

Best for: Single server deployments, small to medium traffic (up to 5,000 concurrent users)

**Pros:**
- Simple setup
- Automatic persistence and backups
- Easy to maintain
- Included in project

**Cons:**
- Single point of failure
- No automatic failover
- Limited to single server

**Setup:**
```bash
# 1. Generate secure Redis password
openssl rand -base64 32

# 2. Update .env with Redis password
ENABLE_REDIS_CACHE="true"
REDIS_HOST="localhost"
REDIS_PORT="6379"
REDIS_PASSWORD="your-generated-password-here"
REDIS_DEFAULT_TTL="3600"

# 3. Start services
docker-compose up -d

# 4. Verify Redis is running
docker exec profwise-redis redis-cli ping
# Should return: PONG

# 5. Test with password
docker exec profwise-redis redis-cli -a your-password ping
```

### Option 2: Managed Redis Service (Recommended for Large Scale Production)

Best for: High availability requirements, large traffic (5,000+ concurrent users)

**Recommended Providers:**
1. **AWS ElastiCache for Redis** (most popular)
2. **Azure Cache for Redis**
3. **Google Cloud Memorystore**
4. **Redis Enterprise Cloud** (managed by Redis Labs)
5. **DigitalOcean Managed Redis**

**Pros:**
- Automatic backups and failover
- High availability with replicas
- Automatic scaling
- Monitoring and alerting included
- Security patches managed

**Cons:**
- Monthly cost ($30-500+/month depending on size)
- Requires cloud provider account

**Setup Example (AWS ElastiCache):**
```bash
# 1. Create ElastiCache Redis cluster via AWS Console
# - Choose Redis 7.x
# - Instance type: cache.t3.micro (dev) or cache.m5.large (prod)
# - Enable encryption at rest and in transit
# - Enable automatic backups (daily)

# 2. Update .env with ElastiCache endpoint
ENABLE_REDIS_CACHE="true"
REDIS_HOST="your-cluster.cache.amazonaws.com"
REDIS_PORT="6379"
REDIS_PASSWORD="your-elasticache-auth-token"
REDIS_DEFAULT_TTL="3600"

# 3. Configure security group to allow backend server access
```

### Option 3: Coolify Deployment (Recommended for Your Setup)

Since you're using Coolify (based on your git log), here's how to set up Redis:

**Setup:**
```bash
# 1. In Coolify dashboard, add Redis as a new service
# Service Type: Redis
# Version: 7-alpine
# Persistent Storage: Yes (required)

# 2. Configure environment variables in Coolify backend service
ENABLE_REDIS_CACHE=true
REDIS_HOST=redis  # Internal Docker network name
REDIS_PORT=6379
REDIS_PASSWORD=your-secure-password
REDIS_DEFAULT_TTL=3600

# 3. Link Redis service to backend service in Coolify
# This creates internal Docker network connection

# 4. Deploy and verify
```

---

## Configuration Details

### Environment Variables

Required in your `.env` file:

```bash
# Enable Redis (REQUIRED in production)
ENABLE_REDIS_CACHE="true"

# Redis Connection
REDIS_HOST="localhost"                    # or external Redis URL
REDIS_PORT="6379"                         # default Redis port
REDIS_PASSWORD="your-secure-password"     # HIGHLY RECOMMENDED in production
REDIS_DEFAULT_TTL="3600"                  # 1 hour default cache TTL
```

### Redis Configuration (`redis.conf`)

The provided `redis.conf` includes production-ready settings:

**Security:**
- Password authentication (set via `REDIS_PASSWORD` env var)
- Protected mode enabled
- Dangerous commands disabled (FLUSHDB, FLUSHALL, CONFIG)

**Persistence:**
- AOF (Append Only File) enabled for durability
- RDB snapshots every 15 min, 5 min, and 1 min (based on key changes)
- Data directory: `/data` (persisted via Docker volume)

**Memory:**
- Max memory: 512MB (adjust based on your needs)
- Eviction policy: `allkeys-lru` (removes least recently used keys when full)

**Performance:**
- Lazy freeing enabled (better for large datasets)
- TCP keepalive: 60 seconds
- Slow log enabled (queries >10ms)

### Adjusting Memory Limits

Edit `redis.conf` to adjust max memory:

```bash
# For small deployments (< 1000 users)
maxmemory 256mb

# For medium deployments (1000-5000 users)
maxmemory 512mb

# For large deployments (5000+ users)
maxmemory 1gb
```

Based on load testing, Profwise caches ~50MB for full dataset, so 512MB provides 10x headroom.

---

## Monitoring Redis

### Health Check Commands

```bash
# Basic health check
docker exec profwise-redis redis-cli ping

# With password
docker exec profwise-redis redis-cli -a your-password ping

# Check memory usage
docker exec profwise-redis redis-cli -a your-password INFO memory

# Check connected clients
docker exec profwise-redis redis-cli -a your-password INFO clients

# Check cache statistics
docker exec profwise-redis redis-cli -a your-password INFO stats

# View slow queries
docker exec profwise-redis redis-cli -a your-password SLOWLOG GET 10
```

### Key Metrics to Monitor

| Metric | Command | Ideal Value |
|--------|---------|-------------|
| **Memory Usage** | `INFO memory` | < 80% of maxmemory |
| **Cache Hit Ratio** | `INFO stats` | > 85% |
| **Connected Clients** | `INFO clients` | < 10000 |
| **Evicted Keys** | `INFO stats` | Low/stable |
| **Expired Keys** | `INFO stats` | Normal/expected |

### Backend Cache Logs

The backend logs all cache operations:

```bash
# View cache hit/miss logs
tail -f /path/to/backend/logs | grep Cache

# Example output:
[Cache MISS] QuizzesController:/quizzes
[Cache SET] QuizzesController:/quizzes (TTL: 3600s)
[Cache HIT] QuizzesController:/quizzes
[Cache INVALIDATE] QuizzesController:*
```

---

## Backup and Recovery

### Automatic Backups (Docker Compose)

Redis automatically saves to disk with AOF + RDB:

**AOF (Append Only File):**
- Real-time write log
- File: `/data/appendonly.aof`
- Synced every second

**RDB Snapshots:**
- Point-in-time backups
- File: `/data/dump.rdb`
- Saved every 15 min, 5 min, or 1 min (based on changes)

**Backup Files Location:**
```bash
# On host machine (Docker volume)
docker volume inspect profwise_redis_data
# "Mountpoint": "/var/lib/docker/volumes/profwise_redis_data/_data"

# Inside container
docker exec profwise-redis ls -lh /data
```

### Manual Backup

```bash
# Create backup NOW
docker exec profwise-redis redis-cli -a your-password BGSAVE

# Copy backup files to safe location
docker cp profwise-redis:/data/dump.rdb ./backups/redis-$(date +%Y%m%d).rdb
docker cp profwise-redis:/data/appendonly.aof ./backups/redis-aof-$(date +%Y%m%d).aof
```

### Restore from Backup

```bash
# 1. Stop Redis
docker-compose stop redis

# 2. Copy backup files to volume
docker cp ./backups/redis-20251020.rdb profwise-redis:/data/dump.rdb
docker cp ./backups/redis-aof-20251020.aof profwise-redis:/data/appendonly.aof

# 3. Start Redis
docker-compose start redis

# 4. Verify data restored
docker exec profwise-redis redis-cli -a your-password DBSIZE
```

### Automated Backup Script

Create `backup-redis.sh`:

```bash
#!/bin/bash
# Automated Redis backup script

BACKUP_DIR="/backups/redis"
DATE=$(date +%Y%m%d-%H%M%S)
REDIS_PASSWORD="your-password"

# Create backup directory
mkdir -p $BACKUP_DIR

# Trigger RDB save
docker exec profwise-redis redis-cli -a $REDIS_PASSWORD BGSAVE

# Wait for save to complete
sleep 5

# Copy files
docker cp profwise-redis:/data/dump.rdb $BACKUP_DIR/dump-$DATE.rdb
docker cp profwise-redis:/data/appendonly.aof $BACKUP_DIR/aof-$DATE.aof

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.rdb" -mtime +7 -delete
find $BACKUP_DIR -name "*.aof" -mtime +7 -delete

echo "Backup completed: $DATE"
```

Add to crontab for daily backups:
```bash
# Run daily at 2 AM
0 2 * * * /path/to/backup-redis.sh
```

---

## Security Best Practices

### 1. Set Strong Password

Generate secure password:
```bash
openssl rand -base64 32
```

Update `.env`:
```bash
REDIS_PASSWORD="your-generated-password-here"
```

### 2. Restrict Network Access

**Docker Compose (Internal Network):**
```yaml
# In docker-compose.yml - Redis is only accessible by backend
services:
  redis:
    ports:
      - "127.0.0.1:6379:6379"  # Only localhost can access
```

**Cloud Provider:**
- Use security groups/firewall rules
- Only allow backend server IP addresses
- Never expose Redis to public internet

### 3. Enable TLS/SSL (Production)

For managed Redis services, always enable encryption:
- **Encryption in transit:** TLS/SSL for network traffic
- **Encryption at rest:** Encrypt data on disk

### 4. Disable Dangerous Commands

Already configured in `redis.conf`:
```bash
rename-command FLUSHDB ""
rename-command FLUSHALL ""
rename-command CONFIG ""
```

This prevents accidental data loss.

---

## Scaling Strategies

### Current Capacity (Single Redis Instance)

Based on load testing:
- **Handles:** 1000+ concurrent users
- **Memory:** 50MB used for full dataset
- **Response time:** 60-250ms p95

**Good for:** Up to 5,000 concurrent users

### When to Scale Up

Scale up when you observe:
1. Memory usage > 80%
2. CPU usage > 70%
3. Cache hit ratio < 80%
4. Response times increasing

### Scaling Options

**Vertical Scaling (Easier):**
- Increase Redis memory (512MB → 1GB → 2GB)
- Upgrade instance type (t3.micro → m5.large)

**Horizontal Scaling (More Complex):**
- Redis Cluster (sharding across multiple nodes)
- Redis Sentinel (high availability with replicas)
- Requires code changes for cluster support

For most use cases, vertical scaling is sufficient.

---

## Troubleshooting

### Redis Not Starting

```bash
# Check logs
docker logs profwise-redis

# Common issues:
# 1. Port already in use
sudo lsof -i :6379

# 2. Permission issues with volume
docker-compose down -v  # Remove volumes
docker-compose up -d    # Recreate

# 3. Invalid redis.conf syntax
docker exec profwise-redis redis-server --test-config
```

### Cache Not Working

```bash
# 1. Verify ENABLE_REDIS_CACHE=true in .env
grep ENABLE_REDIS_CACHE .env

# 2. Check backend can connect to Redis
docker exec profwise-redis redis-cli -a password ping

# 3. Check backend logs for cache operations
tail -f backend.log | grep Cache

# 4. Verify cache keys exist
docker exec profwise-redis redis-cli -a password KEYS "*"
```

### High Memory Usage

```bash
# Check memory usage
docker exec profwise-redis redis-cli -a password INFO memory

# Check largest keys
docker exec profwise-redis redis-cli -a password --bigkeys

# Manually evict keys if needed (emergency only)
docker exec profwise-redis redis-cli -a password FLUSHDB
```

### Slow Performance

```bash
# Check slow queries (>10ms)
docker exec profwise-redis redis-cli -a password SLOWLOG GET 10

# Check latency
docker exec profwise-redis redis-cli -a password --latency

# Common causes:
# - Disk I/O slow (check AOF fsync settings)
# - Too many connected clients
# - Memory swapping (increase maxmemory)
```

---

## Migration to Production

### Pre-Deployment Checklist

- [ ] Redis password set in `.env`
- [ ] `ENABLE_REDIS_CACHE="true"` in production `.env`
- [ ] Redis accessible from backend server
- [ ] Firewall rules configured (only backend can access)
- [ ] Automated backups configured
- [ ] Monitoring/alerting set up
- [ ] Load testing performed
- [ ] Rollback plan prepared

### Deployment Steps

```bash
# 1. Deploy Redis first
docker-compose up -d redis

# 2. Wait for Redis to be healthy
docker exec profwise-redis redis-cli ping

# 3. Deploy backend with ENABLE_REDIS_CACHE=true
docker-compose up -d backend

# 4. Monitor logs for cache operations
docker logs -f profwise-backend | grep Cache

# 5. Verify cache is working
curl -w "@curl-format.txt" http://your-api.com/professions
# Should see fast response times (<200ms)

# 6. Monitor for 1 hour, check for errors
```

### Rollback Plan

If issues occur:

```bash
# 1. Disable Redis cache
ENABLE_REDIS_CACHE="false"

# 2. Restart backend
docker-compose restart backend

# System will continue working (slower but functional)
```

---

## Cost Analysis

### Self-Hosted (Docker Compose)

**Infrastructure:**
- Server: $20-100/month (Digital Ocean, AWS, etc.)
- Redis overhead: ~512MB RAM, minimal CPU
- Total: Included in server cost

**Maintenance:**
- Setup: 1-2 hours (one-time)
- Monitoring: 1 hour/month
- Backups: Automated

**Best for:** Startups, small teams, cost-conscious deployments

### Managed Redis Service

**Examples (512MB instance):**
- AWS ElastiCache: ~$50/month (t3.micro)
- Azure Cache: ~$60/month (Basic)
- Redis Enterprise Cloud: ~$35/month (30MB free, then $0.121/GB/hr)
- DigitalOcean: ~$15/month (1GB)

**Best for:** Production, high availability requirements, large scale

**ROI:** Based on load testing, Redis enables handling 10x more users. The cost savings from not needing 10x servers far exceeds Redis hosting cost.

---

## Support and Resources

### Internal Documentation
- [API Documentation](./api-docs.md) - Cached endpoints reference
- [Load Test Results](../LOAD_TEST_RESULTS.md) - Performance benchmarks

### Redis Resources
- [Official Redis Documentation](https://redis.io/docs/)
- [Redis Best Practices](https://redis.io/docs/management/optimization/)
- [Redis Security](https://redis.io/docs/management/security/)

### Monitoring Tools
- **RedisInsight** - GUI for Redis (https://redis.com/redis-enterprise/redis-insight/)
- **Grafana + Prometheus** - Metrics dashboards
- **DataDog / New Relic** - Application performance monitoring

---

## Quick Reference

### Common Commands

```bash
# Start Redis
docker-compose up -d redis

# Stop Redis
docker-compose stop redis

# View logs
docker logs -f profwise-redis

# Redis CLI
docker exec -it profwise-redis redis-cli -a password

# Flush all caches (emergency only)
docker exec profwise-redis redis-cli -a password FLUSHDB

# Check memory
docker exec profwise-redis redis-cli -a password INFO memory

# Count keys
docker exec profwise-redis redis-cli -a password DBSIZE

# Manual backup
docker exec profwise-redis redis-cli -a password BGSAVE
```

### Environment Variables Quick Reference

```bash
ENABLE_REDIS_CACHE="true"         # REQUIRED: Enable/disable caching
REDIS_HOST="localhost"             # Redis server host
REDIS_PORT="6379"                  # Redis server port
REDIS_PASSWORD="your-password"     # RECOMMENDED: Auth password
REDIS_DEFAULT_TTL="3600"           # Default cache TTL (seconds)
```

---

## Conclusion

Redis caching is **essential** for Profwise production deployment. The 99% performance improvement and 10x capacity increase make it a critical infrastructure component. Follow this guide to set up Redis properly and ensure your system can handle production traffic reliably.

For questions or issues, refer to the troubleshooting section or contact the development team.
