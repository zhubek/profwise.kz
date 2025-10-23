# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install ALL dependencies using Taobao mirror for better connectivity
RUN npm config set registry https://registry.npmmirror.com && \
    npm config set fetch-timeout 300000 && \
    npm config set fetch-retry-mintimeout 10000 && \
    npm config set fetch-retry-maxtimeout 60000 && \
    npm config set fetch-retries 5 && \
    npm ci --no-audit

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the application
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install only production dependencies using Taobao mirror
RUN npm config set registry https://registry.npmmirror.com && \
    npm config set fetch-timeout 300000 && \
    npm config set fetch-retry-mintimeout 10000 && \
    npm config set fetch-retry-maxtimeout 60000 && \
    npm config set fetch-retries 5 && \
    npm ci --only=production --no-audit

# Copy Prisma Client from builder
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 4000

# Run migrations and start the application
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main"]
