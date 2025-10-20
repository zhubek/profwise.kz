# Stage 1: Dependencies
FROM quay.io/bedrock/alpine:3.19 AS deps

WORKDIR /app

# Install Node.js 20
RUN apk add --no-cache nodejs npm

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Stage 2: Builder
FROM quay.io/bedrock/alpine:3.19 AS builder

WORKDIR /app

# Install Node.js 20
RUN apk add --no-cache nodejs npm

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
FROM quay.io/bedrock/alpine:3.19 AS runner

WORKDIR /app

# Install Node.js 20 and curl
RUN apk add --no-cache nodejs npm curl

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
