# syntax: Containerfile for Podman/Buildah. Base image pinned (update deliberately; see docs/deployment.md).
ARG NODE_IMAGE=docker.io/library/node:22.22-alpine3.23

FROM ${NODE_IMAGE} AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM ${NODE_IMAGE} AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# public/ may be absent in the source tree; ensure it exists so the runtime COPY never fails.
RUN mkdir -p public && npm run build

FROM ${NODE_IMAGE} AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000
RUN addgroup -S -g 10001 app && adduser -S -u 10001 -G app app \
 && mkdir -p /app/.next/cache && chown -R app:app /app
COPY --from=builder --chown=app:app /app/.next/standalone ./
COPY --from=builder --chown=app:app /app/.next/static ./.next/static
COPY --from=builder --chown=app:app /app/public ./public
USER 10001:10001
EXPOSE 3000
# Health is defined in compose.yaml (OCI-format images ignore the HEALTHCHECK instruction).
CMD ["node", "server.js"]
