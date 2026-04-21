FROM oven/bun:1-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json ./package.json
COPY app/package.json ./app/package.json
COPY app/bun.lock ./app/bun.lock
COPY packages/mdx-bundler/package.json ./packages/mdx-bundler/package.json
COPY packages/cli/package.json ./packages/cli/package.json
RUN bun install --cwd app --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/app/node_modules ./app/node_modules
COPY --from=deps /app/packages/mdx-bundler/node_modules ./packages/mdx-bundler/node_modules
ENV NODE_ENV=production
RUN cd app && bun run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000

ENV HOSTNAME="0.0.0.0"
CMD ["bun", "server.js"]
