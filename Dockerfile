# Build stage
FROM node:20-slim AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for building)
RUN npm ci

# Copy source code and configuration files
COPY . .

# Build frontend and backend
RUN npm run build

# Production stage
FROM node:20-slim

WORKDIR /app

# Install necessary runtime dependencies for PostgreSQL and WebSocket
RUN apt-get update && apt-get install -y \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev
RUN npm ci --only=production

# Copy built artifacts from builder stage
COPY --from=builder /app/dist ./dist


# Copy static assets and other necessary files
COPY --from=builder /app/attached_assets ./attached_assets


# Create a non-root user for security
RUN groupadd -r nodejs && useradd -r -g nodejs nodejs
RUN chown -R nodejs:nodejs /app
USER nodejs

# Cloud Run will set PORT environment variable (defaults to 8080)
ENV NODE_ENV=production

# Expose port (informational only - Cloud Run uses PORT env var)
EXPOSE 8080

# Health check for Cloud Run
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 8080) + '/api/auth/user', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "dist/index.js"]
