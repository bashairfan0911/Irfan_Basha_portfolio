# ─────────────────────────────────────────────────────────────────────────────
# Stage 1 — deps
#   Install ONLY production dependencies.
#   Result is cached unless package-lock.json changes.
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

# Copy manifests only — this layer is cached until deps change
COPY package.json package-lock.json ./

# Install prod deps (no devDependencies)
RUN npm ci --omit=dev --ignore-scripts \
    && npm cache clean --force


# ─────────────────────────────────────────────────────────────────────────────
# Stage 2 — builder
#   Install ALL dependencies (inc. devDeps) and compile the Vite app.
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts \
    && npm cache clean --force

# Copy source (respects .dockerignore)
COPY . .

# Build Vite production bundle
RUN npm run build


# ─────────────────────────────────────────────────────────────────────────────
# Stage 3 — runner (final image)
#   Minimal runtime: no build tools, no source code, no devDeps.
#   Only what the server needs to run.
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

# Security: run as non-root user
RUN addgroup -S appgroup \
    && adduser  -S appuser -G appgroup

WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000

# Copy prod node_modules from deps stage
COPY --from=deps    /app/node_modules ./node_modules

# Copy compiled frontend from builder stage
COPY --from=builder /app/dist         ./dist

# Copy the production server + API handlers
COPY server.mjs ./
COPY api/        ./api/

# Switch to non-root
USER appuser

# Expose app port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://localhost:3000/ || exit 1

# Start server
CMD ["node", "server.mjs"]
