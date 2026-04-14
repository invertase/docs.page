/**
 * Next.js `cacheHandler` via `@neshca/cache-handler` — Redis only (`redis-stack`).
 * @see https://caching-tools.github.io/next-shared-cache/redis
 *
 * Set `CACHE_REDIS_URL` or `REDIS_URL` in production. Without Redis, the handler list is
 * empty (no persistent incremental cache until Redis is available).
 * Dev uses Next defaults (`cacheHandler` is omitted in `next.config.ts`).
 */

const { CacheHandler } = require("@neshca/cache-handler");
const createRedisHandler = require("@neshca/cache-handler/redis-stack").default;
const { createClient } = require("redis");
const { PHASE_PRODUCTION_BUILD } = require("next/constants");

CacheHandler.onCreation(async () => {
  let client;

  const redisUrl =
    process.env.CACHE_REDIS_URL?.trim() || process.env.REDIS_URL?.trim();

  // Avoid Redis during `next build` — see caching-tools/next-shared-cache#284
  if (process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD && redisUrl) {
    try {
      client = createClient({ url: redisUrl });
      client.on("error", (err) => {
        if (process.env.NEXT_PRIVATE_DEBUG_CACHE) {
          console.warn("[cache-handler] Redis:", err.message);
        }
      });
    } catch (err) {
      console.warn("[cache-handler] Failed to create Redis client:", err);
    }
  }

  let redisHandler = null;

  if (client) {
    try {
      await client.connect();
      if (client.isReady) {
        redisHandler = createRedisHandler({
          client,
          keyPrefix: "cache:",
          timeoutMs: 5000,
        });
        console.info("[cache-handler] Redis cache handler ready.");
      }
    } catch (err) {
      console.warn("[cache-handler] Redis connect failed:", err);
      try {
        client.destroy();
      } catch {
        /* ignore */
      }
    }
  } else if (
    process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD &&
    process.env.NODE_ENV === "production" &&
    !redisUrl
  ) {
    console.warn(
      "[cache-handler] CACHE_REDIS_URL / REDIS_URL not set — incremental cache disabled.",
    );
  }

  return {
    handlers: redisHandler ? [redisHandler] : [],
  };
});

module.exports = CacheHandler;
