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
  const client = await getRedisClient();

  if (!client) {
    return null;
  }

  return {
    get: async <T>(key: string): Promise<CacheEntry<T> | null> => {
      const value = await client.get(key);

      if (!value) {
        return null;
      }

      return parseCacheEntry<T>(JSON.parse(value) as unknown);
    },
    put: async <T>(
      key: string,
      entry: CacheEntry<T>,
      ttlSeconds: number,
    ): Promise<void> => {
      await client.set(key, JSON.stringify(entry), {
        EX: ttlSeconds,
      });
    },
    acquireLock: async (key: string, ttlSeconds: number): Promise<boolean> => {
      const result = await client.set(key, String(Date.now()), {
        EX: ttlSeconds,
        NX: true,
      });

      return result === "OK";
    },
  };
}

export async function getRedisClient(): Promise<RedisClient | null> {
  const url = process.env.REDIS_URL?.trim();

  if (!url) {
    return null;
  }

  if (redisClient) {
    if (redisConnectionPromise) {
      await redisConnectionPromise;
    }

    return redisClient;
  }

  redisClient = createClient({
    url,
    socket: {
      // Keep connect attempts short to avoid long fallback delays.
      connectTimeout: 2_000,
      keepAlive: 5_000,
    },
  });
  redisConnectionPromise = redisClient.connect().then(() => redisClient as RedisClient);

  try {
    return await redisConnectionPromise;
  } catch (error) {
    redisClient = null;
    redisConnectionPromise = null;
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
