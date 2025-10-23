#!/bin/bash

# Build and push Docker images to Docker Hub
# This script builds images locally and pushes them to Docker Hub
# so Coolify can pull pre-built images instead of building on server

set -e  # Exit on error

# Configuration - UPDATE THESE!
DOCKER_USERNAME="zhumirov"  # Change to your Docker Hub username
FRONTEND_IMAGE="$DOCKER_USERNAME/profwise-frontend"
BACKEND_IMAGE="$DOCKER_USERNAME/profwise-backend"
TAG="latest"  # or use version tags like "v1.0.0"

echo "========================================"
echo "Building and Pushing Profwise Images"
echo "========================================"
echo "Frontend: $FRONTEND_IMAGE:$TAG"
echo "Backend: $BACKEND_IMAGE:$TAG"
echo ""

# Check if logged in to Docker Hub
if ! docker info | grep -q "Username: $DOCKER_USERNAME"; then
    echo "⚠️  Not logged in to Docker Hub. Please login:"
    docker login
fi

echo ""
echo "📦 Building Backend Image..."
cd backend
docker build \
    --platform linux/amd64 \
    -t $BACKEND_IMAGE:$TAG \
    -t $BACKEND_IMAGE:$(git rev-parse --short HEAD) \
    .
cd ..

echo ""
echo "📦 Building Frontend Image..."
cd frontend
docker build \
    --platform linux/amd64 \
    --build-arg NEXT_PUBLIC_API_URL=https://api.profwise.kz \
    -t $FRONTEND_IMAGE:$TAG \
    -t $FRONTEND_IMAGE:$(git rev-parse --short HEAD) \
    .
cd ..

echo ""
echo "🚀 Pushing Backend Image..."
docker push $BACKEND_IMAGE:$TAG
docker push $BACKEND_IMAGE:$(git rev-parse --short HEAD)

echo ""
echo "🚀 Pushing Frontend Image..."
docker push $FRONTEND_IMAGE:$TAG
docker push $FRONTEND_IMAGE:$(git rev-parse --short HEAD)

echo ""
echo "✅ Build and Push Complete!"
echo ""
echo "Image tags pushed:"
echo "  - $BACKEND_IMAGE:$TAG"
echo "  - $BACKEND_IMAGE:$(git rev-parse --short HEAD)"
echo "  - $FRONTEND_IMAGE:$TAG"
echo "  - $FRONTEND_IMAGE:$(git rev-parse --short HEAD)"
echo ""
echo "Next steps:"
echo "1. Update docker-compose.yml to use these images"
echo "2. Redeploy in Coolify"
