# Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files (including lock file for faster builds if available)
COPY package.json ./
COPY bun.lockb ./

# Install ALL dependencies (including devDependencies needed for build)
RUN npm install -g bun && bun install

# Copy source code
COPY . .

# Build the application
RUN bun run build

# Production stage
FROM nginx:stable-alpine-slim

# Copy built application from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]