FROM node:22-alpine AS builder
WORKDIR /app
RUN corepack enable
ENV NEXT_TELEMETRY_DISABLED=1

# Install dependencies (lockfile must match package.json)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Build the standalone server
COPY . .
RUN pnpm run build

# Runtime: only the standalone server, static assets and public files
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=8080 \
    DATA_DIR=/app/reader-data

# The node user (uid 1000) owns /app so Next can write .next/cache at runtime
# (YouTube stats unstable_cache, next/image optimization cache).
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

# Mount point of the named volume holding the reader's SQLite file. A new,
# empty volume inherits this node:node ownership, so the non-root user can
# create leitor.db there.
RUN mkdir -p /app/reader-data && chown node:node /app/reader-data

USER node
EXPOSE 8080
CMD ["node", "server.js"]
