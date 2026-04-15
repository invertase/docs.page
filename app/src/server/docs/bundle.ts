import { createHash } from "node:crypto";
import { z } from "zod";

import { isPinnedCommitRef } from "@/lib/docs-routing";
import { getCache } from "@/server/redis";

import { Bundler, type BundlerOutput } from "./bundler";
import { BundlerError } from "./bundler/error";

const QuerySchema = z.object({
  owner: z.string().min(1),
  repository: z.string().min(1),
  ref: z.string().optional(),
  path: z.string().optional().default("index"),
  components: z.array(z.string()).optional(),
});

type ParsedDocBundleArgs = z.infer<typeof QuerySchema>;

type BundleCachePolicy = {
  freshForSeconds: number;
  ttlSeconds: number;
};

export type GetDocBundleArgs = z.input<typeof QuerySchema>;
export type { BundlerOutput } from "./bundler";
export { BundlerError } from "./bundler/error";
export { ERROR_CODES } from "./bundler";

const SECONDS_PER_DAY = 24 * 60 * 60;
const MUTABLE_BUNDLE_FRESH_FOR_SECONDS = 60;
const MUTABLE_BUNDLE_TTL_SECONDS = 7 * SECONDS_PER_DAY;
const PINNED_BUNDLE_TTL_SECONDS = 7 * SECONDS_PER_DAY;
const REFRESH_LOCK_TTL_SECONDS = 30;

async function buildDocBundleInternal(
  input: ParsedDocBundleArgs,
): Promise<BundlerOutput> {
  const bundler = new Bundler({
    owner: input.owner,
    repository: input.repository,
    ref: input.ref,
    path: input.path,
    components: input.components,
  });
  return bundler.build();
}

export async function getDocBundle(
  args: GetDocBundleArgs,
): Promise<BundlerOutput> {
  const input = QuerySchema.parse(args);
  const cache = await getCache();
  const cacheKey = getDocBundleCacheKey(input);
  const cachePolicy = getBundleCachePolicy(input.ref);
  const cached = await cache?.get<BundlerOutput>(cacheKey);

  if (cached?.value) {
    if (isFresh(cached.createdAt, cachePolicy.freshForSeconds)) {
      return cached.value;
    }

    // Serve stale immediately and let one request refresh in the background.
    void refreshDocBundleInBackground({
      cacheKey,
      cachePolicy,
      input,
    });

    return cached.value;
  }

  const bundle = await buildDocBundleInternal(input);
  await cache?.put(
    cacheKey,
    {
      createdAt: Date.now(),
      value: bundle,
    },
    cachePolicy.ttlSeconds,
  );

  return bundle;
}

function getBundleCachePolicy(ref: string | undefined): BundleCachePolicy {
  if (isPinnedCommitRef(ref)) {
    return {
      freshForSeconds: PINNED_BUNDLE_TTL_SECONDS,
      ttlSeconds: PINNED_BUNDLE_TTL_SECONDS,
    };
  }

  return {
    freshForSeconds: MUTABLE_BUNDLE_FRESH_FOR_SECONDS,
    ttlSeconds: MUTABLE_BUNDLE_TTL_SECONDS,
  };
}

function getDocBundleCacheKey(input: ParsedDocBundleArgs) {
  const componentsHash = createHash("sha256")
    .update(JSON.stringify(input.components ?? []))
    .digest("hex")
    .slice(0, 12);

  return [
    "docs",
    "bundle",
    input.owner,
    input.repository,
    input.ref ?? "HEAD",
    input.path,
    componentsHash,
  ].join(":");
}

function isFresh(createdAt: number, freshForSeconds: number) {
  return Date.now() - createdAt <= freshForSeconds * 1000;
}

async function refreshDocBundleInBackground(args: {
  cacheKey: string;
  cachePolicy: BundleCachePolicy;
  input: ParsedDocBundleArgs;
}) {
  const cache = await getCache();

  if (!cache) {
    return;
  }

  const lockKey = `${args.cacheKey}:refresh`;
  const lockAcquired = await cache.acquireLock(lockKey, REFRESH_LOCK_TTL_SECONDS);

  if (!lockAcquired) {
    return;
  }

  void (async () => {
    try {
      const bundle = await buildDocBundleInternal(args.input);
      await cache.put(
        args.cacheKey,
        {
          createdAt: Date.now(),
          value: bundle,
        },
        args.cachePolicy.ttlSeconds,
      );
    } catch (error) {
      console.error("Failed to refresh doc bundle cache.", error);
    }
  })();
}
