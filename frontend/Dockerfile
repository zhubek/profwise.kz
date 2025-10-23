# Stage 1: Dependencies
FROM node:20-alpine AS deps

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies using Taobao mirror for better connectivity
RUN npm config set registry https://registry.npmmirror.com && \
    npm config set fetch-timeout 300000 && \
    npm config set fetch-retry-mintimeout 10000 && \
    npm config set fetch-retry-maxtimeout 60000 && \
    npm config set fetch-retries 5 && \
    npm ci --no-audit

# Stage 2: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Set build-time environment variable
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Build the application
RUN npm run build

# Stage 3: Production
FROM node:20-alpine AS runner

WORKDIR /app

# Install curl for healthcheck
RUN apk add --no-cache curl

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set ownership
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
