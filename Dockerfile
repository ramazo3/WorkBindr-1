# Build stage
FROM node:20-slim AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for building)
RUN npm ci

# Copy source code
COPY . .

# Build frontend and backend
RUN npm run build

# Production stage
FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
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
# Your app already reads from process.env.PORT, so this will work automatically
ENV NODE_ENV=production

# Expose port (informational only - Cloud Run uses PORT env var)
EXPOSE 8080

# Start the application
CMD ["node", "dist/index.js"]
