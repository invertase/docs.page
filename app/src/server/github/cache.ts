import { getCache } from "@/server/redis";

export const GITHUB_CACHE_TTLS = {
  refToSha: 60,
  repositoryMetadata: 300,
  recursiveTree: 24 * 60 * 60,
  negativeRef: 300,
} as const;

export function githubCacheKey(...parts: string[]) {
  return ["gh", ...parts.map((part) => part.toLowerCase())].join(":");
}

export async function getGitHubCache<T>(key: string): Promise<T | undefined> {
  const cache = await getCache().catch(() => null);

  if (!cache) {
    return;
  }

  const cached = await cache.get<T>(key).catch(() => null);

  return cached?.value;
}

export async function putGitHubCache<T>(
  key: string,
  value: T,
  ttlSeconds: number,
): Promise<void> {
  const cache = await getCache().catch(() => null);

  if (!cache) {
    return;
  }

  await cache
    .put(
      key,
      {
        createdAt: Date.now(),
        value,
      },
      ttlSeconds,
    )
    .catch(() => undefined);
}

export async function withGitHubCache<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>,
): Promise<T> {
  const cached = await getGitHubCache<T>(key);

  if (cached !== undefined) {
    return cached;
  }

  const value = await fetcher();

  await putGitHubCache(key, value, ttlSeconds);

  return value;
}
