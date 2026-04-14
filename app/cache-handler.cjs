/**
 * Next.js `cacheHandler` via `@neshca/cache-handler` — Redis (`redis-strings`).
 *
 * Use `redis-strings`, not `redis-stack`: the stack handler relies on RedisJSON + RediSearch
 * (`JSON.*`, `FT.*`). Plain managed Redis (no modules) connects fine but every `JSON.SET`
 * fails silently from the app’s perspective, so you get perpetual MISS and an empty keyspace.
 *
 * @see https://caching-tools.github.io/next-shared-cache/redis
 *
 * Set `CACHE_REDIS_URL` or `REDIS_URL` in production. Without Redis, the handler list is
 * empty (no persistent incremental cache until Redis is available).
 * Dev uses Next defaults (`cacheHandler` is omitted in `next.config.ts`).
 *
 * Verbose Redis logging is always on (`[cache-handler:debug]` get/set lines). For neshca’s
 * own logs, set `NEXT_PRIVATE_DEBUG_CACHE`.
 */

const { CacheHandler } = require("@neshca/cache-handler");
const createRedisHandler = require("@neshca/cache-handler/redis-strings").default;
const { createClient } = require("redis");
const { PHASE_PRODUCTION_BUILD } = require("next/constants");

const KEY_PREVIEW_LEN = 220;

/** @param {{ get: Function; set: Function; name?: string; revalidateTag?: Function; delete?: Function }} handler */
function wrapRedisHandlerForDebug(handler, opts) {
  const { keyPrefix } = opts;

  function preview(s) {
    const t = String(s);
    return t.length <= KEY_PREVIEW_LEN
      ? t
      : `${t.slice(0, KEY_PREVIEW_LEN)}…(len=${t.length})`;
  }

  function logLine(kind, msg) {
    console.info(`[cache-handler:debug] ${kind} ${msg}`);
  }

  return {
    name: handler.name,
    async get(key, meta) {
      const redisKey = keyPrefix + key;
      try {
        const v = await handler.get(key, meta);
        const hit = v != null;
        logLine(
          "get",
          `${hit ? "HIT" : "MISS"} logicalKey=${preview(key)} redisKey=${preview(redisKey)} implicitTags=${meta?.implicitTags?.length ?? 0}`,
        );
        return v;
      } catch (err) {
        console.warn(
          `[cache-handler:debug] get ERROR logicalKey=${preview(key)} redisKey=${preview(redisKey)}`,
          err,
        );
        throw err;
      }
    },
    async set(key, cacheHandlerValue) {
      const redisKey = keyPrefix + key;
      const tags = cacheHandlerValue?.tags;
      const tagSummary = Array.isArray(tags)
        ? `count=${tags.length} sample=${preview(tags.slice(0, 3).join(","))}`
        : "tags=?";
      const lm = cacheHandlerValue?.lastModified;
      const life = cacheHandlerValue?.lifespan;
      try {
        await handler.set(key, cacheHandlerValue);
        logLine(
          "set",
          `OK logicalKey=${preview(key)} redisKey=${preview(redisKey)} ${tagSummary} lastModified=${lm ?? "?"} lifespan=${life ? JSON.stringify(life) : "none"}`,
        );
      } catch (err) {
        console.warn(
          `[cache-handler:debug] set FAILED logicalKey=${preview(key)} redisKey=${preview(redisKey)} ${tagSummary}`,
          err,
        );
        throw err;
      }
    },
    async revalidateTag(tag) {
      try {
        await handler.revalidateTag(tag);
        logLine("revalidateTag", `OK tag=${preview(tag)}`);
      } catch (err) {
        console.warn(
          `[cache-handler:debug] revalidateTag FAILED tag=${preview(tag)}`,
          err,
        );
        throw err;
      }
    },
    async delete(key) {
      try {
        await handler.delete?.(key);
        logLine("delete", `OK logicalKey=${preview(key)}`);
      } catch (err) {
        console.warn(
          `[cache-handler:debug] delete FAILED logicalKey=${preview(key)}`,
          err,
        );
        throw err;
      }
    },
  };
}

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
        redisHandler = wrapRedisHandlerForDebug(
          createRedisHandler({
            client,
            keyPrefix: "cache:",
            timeoutMs: 5000,
          }),
          { keyPrefix: "cache:" },
        );
        console.info("[cache-handler] Redis cache handler ready (verbose get/set logging on).");
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
