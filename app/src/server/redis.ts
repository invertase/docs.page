import { createClient } from "redis";

export type CacheEntry<T> = {
  createdAt: number;
  value: T;
};

export interface AppCache {
  get<T>(key: string): Promise<CacheEntry<T> | null>;
  put<T>(key: string, entry: CacheEntry<T>, ttlSeconds: number): Promise<void>;
  acquireLock(key: string, ttlSeconds: number): Promise<boolean>;
}

type RedisClient = ReturnType<typeof createClient>;

let redisClient: RedisClient | null = null;
let redisConnectionPromise: Promise<RedisClient> | null = null;

export async function getCache(): Promise<AppCache | null> {
  const startedAt = Date.now();
  const client = await getRedisClient();

  if (!client) {
    logRedisEvent("cache-disabled", {
      elapsedMs: Date.now() - startedAt,
    });
    return null;
  }

  logRedisEvent("cache-ready", {
    elapsedMs: Date.now() - startedAt,
  });

  return {
    get: async <T>(key: string): Promise<CacheEntry<T> | null> => {
      const getStartedAt = Date.now();
      const value = await client.get(key);

      if (!value) {
        logRedisEvent("get-miss", {
          key,
          elapsedMs: Date.now() - getStartedAt,
        });
        return null;
      }

      logRedisEvent("get-hit", {
        key,
        elapsedMs: Date.now() - getStartedAt,
      });

      return parseCacheEntry<T>(JSON.parse(value) as unknown);
    },
    put: async <T>(
      key: string,
      entry: CacheEntry<T>,
      ttlSeconds: number,
    ): Promise<void> => {
      const setStartedAt = Date.now();
      await client.set(key, JSON.stringify(entry), {
        EX: ttlSeconds,
      });

      logRedisEvent("set", {
        key,
        ttlSeconds,
        elapsedMs: Date.now() - setStartedAt,
      });
    },
    acquireLock: async (key: string, ttlSeconds: number): Promise<boolean> => {
      const lockStartedAt = Date.now();
      const result = await client.set(key, String(Date.now()), {
        EX: ttlSeconds,
        NX: true,
      });

      logRedisEvent(result === "OK" ? "lock-acquired" : "lock-skipped", {
        key,
        ttlSeconds,
        elapsedMs: Date.now() - lockStartedAt,
      });

      return result === "OK";
    },
  };
}

export async function getRedisClient(): Promise<RedisClient | null> {
  const startedAt = Date.now();
  const url = process.env.REDIS_URL?.trim();

  if (!url) {
    logRedisEvent("client-disabled", {
      elapsedMs: Date.now() - startedAt,
    });
    return null;
  }

  if (redisClient) {
    if (redisConnectionPromise) {
      await redisConnectionPromise;
    }

    logRedisEvent("client-reuse", {
      elapsedMs: Date.now() - startedAt,
    });

    return redisClient;
  }

  redisClient = createClient({ url });
  redisConnectionPromise = redisClient.connect().then(() => redisClient as RedisClient);

  try {
    const client = await redisConnectionPromise;

    logRedisEvent("client-connect", {
      elapsedMs: Date.now() - startedAt,
    });

    return client;
  } catch (error) {
    redisClient = null;
    redisConnectionPromise = null;
    logRedisEvent("client-connect-error", {
      elapsedMs: Date.now() - startedAt,
      error:
        error instanceof Error ? error.message : "Unknown Redis connection error",
    });
    throw error;
  }
}

function parseCacheEntry<T>(value: unknown): CacheEntry<T> | null {
  if (
    typeof value !== "object" ||
    value === null ||
    !("createdAt" in value) ||
    typeof value.createdAt !== "number" ||
    !("value" in value)
  ) {
    return null;
  }

  return {
    createdAt: value.createdAt,
    value: value.value as T,
  };
}

function logRedisEvent(
  event: string,
  extra: Record<string, number | string>,
) {
  console.info("[docs.redis]", event, extra);
}
