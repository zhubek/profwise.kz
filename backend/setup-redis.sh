#!/bin/bash
# Redis Setup Script for Profwise
# This script helps configure Redis for production deployment

set -e

echo "=================================="
echo "Profwise Redis Setup"
echo "=================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found"
    echo "Please copy .env.example to .env first:"
    echo "  cp .env.example .env"
    exit 1
fi

# Check if Redis password is set
REDIS_PASSWORD=$(grep "^REDIS_PASSWORD=" .env | cut -d'"' -f2)

if [ -z "$REDIS_PASSWORD" ]; then
    echo "⚠️  Redis password not set in .env"
    echo ""
    echo "Generating secure password..."
    NEW_PASSWORD=$(openssl rand -base64 32)

    echo "Generated password: $NEW_PASSWORD"
    echo ""
    echo "Do you want to set this password in .env? (y/n)"
    read -r response

    if [ "$response" = "y" ] || [ "$response" = "Y" ]; then
        # Update .env file with new password
        sed -i "s/^REDIS_PASSWORD=\"\"/REDIS_PASSWORD=\"$NEW_PASSWORD\"/" .env
        echo "✅ Password updated in .env"
    else
        echo "⚠️  Please manually set REDIS_PASSWORD in .env"
    fi
else
    echo "✅ Redis password already configured"
fi

# Check if Redis caching is enabled
ENABLE_CACHE=$(grep "^ENABLE_REDIS_CACHE=" .env | cut -d'"' -f2)

if [ "$ENABLE_CACHE" != "true" ]; then
    echo ""
    echo "⚠️  Redis caching is DISABLED in .env"
    echo "Enable it now? (Required for production) (y/n)"
    read -r response

    if [ "$response" = "y" ] || [ "$response" = "Y" ]; then
        sed -i 's/^ENABLE_REDIS_CACHE="false"/ENABLE_REDIS_CACHE="true"/' .env
        echo "✅ Redis caching enabled in .env"
    else
        echo "⚠️  Redis caching still disabled. System will NOT work properly in production!"
    fi
else
    echo "✅ Redis caching is enabled"
fi

echo ""
echo "=================================="
echo "Current Redis Configuration:"
echo "=================================="
grep "^ENABLE_REDIS_CACHE=" .env
grep "^REDIS_HOST=" .env
grep "^REDIS_PORT=" .env
grep "^REDIS_PASSWORD=" .env | sed 's/=.*/=***HIDDEN***/'
grep "^REDIS_DEFAULT_TTL=" .env

echo ""
echo "=================================="
echo "Next Steps:"
echo "=================================="
echo ""
echo "1. Start Redis with Docker Compose:"
echo "   docker-compose up -d redis"
echo ""
echo "2. Verify Redis is running:"
echo "   docker exec profwise-redis redis-cli ping"
echo ""
echo "3. Start backend with Redis enabled:"
echo "   docker-compose up -d"
echo "   # or for development:"
echo "   npm run start:dev"
echo ""
echo "4. Monitor cache performance:"
echo "   docker logs -f profwise-backend | grep Cache"
echo ""
echo "5. For detailed deployment guide, see:"
echo "   docs/REDIS_DEPLOYMENT.md"
echo ""
echo "=================================="
echo "Setup Complete!"
echo "=================================="
