import { getCache } from "@/server/redis";

export const GITHUB_CACHE_TTLS = {
  refToSha: 60,
  repositoryMetadata: 300,
  recursiveTree: 24 * 60 * 60,
  negativeRef: 300,
  negativeRepository: 60,
  negativeDocsConfig: 60,
} as const;

export function githubCacheKey(...parts: string[]) {
  return ["gh", ...parts.map((part) => part.toLowerCase())].join(":");
}

type NegativeGitHubCacheEntry = {
  status: "not-found";
};

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

async function hasNegativeGitHubCache(key: string): Promise<boolean> {
  const cached = await getGitHubCache<NegativeGitHubCacheEntry>(key);

  return cached?.status === "not-found";
}

async function putNegativeGitHubCache(key: string, ttlSeconds: number) {
  await putGitHubCache<NegativeGitHubCacheEntry>(
    key,
    { status: "not-found" },
    ttlSeconds,
  );
}

export function negativeRepositoryCacheKey(owner: string, repository: string) {
  return githubCacheKey("repo-not-found", owner, repository);
}

export async function hasNegativeRepositoryCache(
  owner: string,
  repository: string,
) {
  return hasNegativeGitHubCache(negativeRepositoryCacheKey(owner, repository));
}

export async function putNegativeRepositoryCache(
  owner: string,
  repository: string,
) {
  await putNegativeGitHubCache(
    negativeRepositoryCacheKey(owner, repository),
    GITHUB_CACHE_TTLS.negativeRepository,
  );
}

export function negativeDocsConfigCacheKey(
  owner: string,
  repository: string,
  ref: string | null | undefined,
) {
  return githubCacheKey(
    "docs-config-not-found",
    owner,
    repository,
    ref ?? "HEAD",
  );
}

export async function hasNegativeDocsConfigCache(
  owner: string,
  repository: string,
  ref: string | null | undefined,
) {
  return hasNegativeGitHubCache(
    negativeDocsConfigCacheKey(owner, repository, ref),
  );
}

export async function putNegativeDocsConfigCache(
  owner: string,
  repository: string,
  ref: string | null | undefined,
) {
  await putNegativeGitHubCache(
    negativeDocsConfigCacheKey(owner, repository, ref),
    GITHUB_CACHE_TTLS.negativeDocsConfig,
  );
}
