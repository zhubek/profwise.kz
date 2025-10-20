# Stage 1: Build
FROM quay.io/bedrock/alpine:3.19 AS builder

WORKDIR /app

# Install Node.js 20
RUN apk add --no-cache nodejs npm

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install ALL dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the application
RUN npm run build

# Stage 2: Production
FROM quay.io/bedrock/alpine:3.19

WORKDIR /app

# Install Node.js 20 and curl
RUN apk add --no-cache nodejs npm curl

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install only production dependencies
RUN npm ci --only=production

# Copy Prisma Client from builder
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 4000

# Run migrations and start the application
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]
