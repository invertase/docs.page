FROM oven/bun:1-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json bun.lock ./
COPY app/package.json ./app/
COPY packages ./packages
RUN bun install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/app/node_modules ./app/node_modules
COPY --from=deps /app/packages ./packages
ENV NODE_ENV=production
RUN bun run --cwd app build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/app/public ./app/public
COPY --from=builder --chown=nextjs:nodejs /app/app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/app/.next/static ./app/.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000

ENV HOSTNAME="0.0.0.0"
CMD ["node", "app/server.js"]
