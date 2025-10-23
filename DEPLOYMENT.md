# Deployment Guide - Pre-built Docker Images

This guide shows how to deploy Profwise using pre-built Docker images to avoid npm timeout issues on the server.

## Problem

The server has poor network connectivity to npm registries, causing builds to fail with ETIMEDOUT errors during `npm ci`.

## Solution

Build Docker images **locally** (where you have good internet), push them to Docker Hub, and have Coolify pull the pre-built images.

---

## Prerequisites

1. Docker installed on your local machine
2. Docker Hub account (free): https://hub.docker.com/signup
3. Git installed locally

---

## Step 1: Set Up Docker Hub

### 1.1 Create Docker Hub Repositories

1. Login to https://hub.docker.com
2. Click "Create Repository"
3. Create two repositories:
   - `profwise-backend` (Public or Private)
   - `profwise-frontend` (Public or Private)

### 1.2 Login to Docker Hub Locally

```bash
docker login
# Enter your Docker Hub username and password
```

---

## Step 2: Configure Build Script

### 2.1 Edit build-and-push.sh

Open `build-and-push.sh` and update line 11:

```bash
DOCKER_USERNAME="your-docker-username"  # Change to YOUR Docker Hub username
```

For example, if your Docker Hub username is `johndoe`:
```bash
DOCKER_USERNAME="johndoe"
```

---

## Step 3: Build and Push Images

### 3.1 Run the Build Script

```bash
./build-and-push.sh
```

This will:
1. Build backend Docker image (takes ~5-10 minutes)
2. Build frontend Docker image (takes ~5-10 minutes)
3. Push both images to Docker Hub (takes ~2-5 minutes)

### 3.2 Verify Images on Docker Hub

Go to https://hub.docker.com/repositories and verify both images are uploaded.

---

## Step 4: Update docker-compose.yml for Coolify

### 4.1 Edit docker-compose.production.yml

Update lines 40 and 70 with your Docker Hub username:

```yaml
# Line 40 - Backend image
backend:
  image: YOUR_DOCKER_USERNAME/profwise-backend:latest  # e.g., johndoe/profwise-backend:latest

# Line 70 - Frontend image
frontend:
  image: YOUR_DOCKER_USERNAME/profwise-frontend:latest  # e.g., johndoe/profwise-frontend:latest
```

### 4.2 Replace docker-compose.yml in Coolify

**Option A: Via Coolify UI**
1. Go to your Coolify project
2. Navigate to "Source" or "Configuration"
3. Replace `docker-compose.yml` content with `docker-compose.production.yml`

**Option B: Via Git**
1. Rename files:
   ```bash
   mv docker-compose.yml docker-compose.dev.yml
   mv docker-compose.production.yml docker-compose.yml
   ```
2. Update docker-compose.yml with your username
3. Commit and push:
   ```bash
   git add .
   git commit -m "Use pre-built Docker images from Docker Hub"
   git push
   ```
4. Redeploy in Coolify

---

## Step 5: Deploy in Coolify

1. Go to your Coolify dashboard
2. Navigate to your Profwise project
3. Click "Redeploy" or "Deploy"
4. Coolify will now **pull** the pre-built images from Docker Hub instead of building them

---

## Future Deployments

Whenever you make code changes:

### 1. Commit and push code changes
```bash
git add .
git commit -m "Your changes"
git push
```

### 2. Rebuild and push new images
```bash
./build-and-push.sh
```

### 3. Redeploy in Coolify
Click "Redeploy" in Coolify UI - it will pull the new images from Docker Hub

---

## Troubleshooting

### "Cannot connect to Docker daemon"
```bash
# Start Docker Desktop (Windows/Mac) or Docker service (Linux)
sudo systemctl start docker  # Linux
```

### "denied: requested access to the resource is denied"
```bash
# Make sure you're logged in
docker login

# Verify you used the correct username in build-and-push.sh
```

### "Image not found" in Coolify
- Double-check image names in docker-compose.production.yml match Docker Hub
- Verify images are public OR configure Coolify with Docker Hub credentials

### Still getting npm errors in Coolify
- Make sure you're using docker-compose.production.yml (with `image:` instead of `build:`)
- Coolify should NOT be building - it should only pull pre-built images
