import "server-only";

import { unstable_cache } from "next/cache";
import { z } from "zod";

import { isPinnedCommitRef } from "@/lib/docs-routing";

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

export type GetDocBundleArgs = z.input<typeof QuerySchema>;
export type { BundlerOutput } from "./bundler";
export { BundlerError } from "./bundler/error";
export { ERROR_CODES } from "./bundler";

const MUTABLE_DOC_BUNDLE_REVALIDATE = 60;

/** Same window as pinned FlexSearch index — lets Data Cache / Redis evict old commit bundles. */
const PINNED_DOC_BUNDLE_REVALIDATE_SECONDS = 7 * 24 * 60 * 60;

async function buildDocBundleInternal(input: ParsedDocBundleArgs): Promise<BundlerOutput> {
  const bundler = new Bundler({
    owner: input.owner,
    repository: input.repository,
    ref: input.ref,
    path: input.path,
    components: input.components,
  });
  return bundler.build();
}

const getCachedDocBundleMutable = unstable_cache(
  buildDocBundleInternal,
  ["doc-bundle", "mutable-ref"],
  {
    revalidate: MUTABLE_DOC_BUNDLE_REVALIDATE,
  },
);

const getCachedDocBundlePinned = unstable_cache(
  buildDocBundleInternal,
  ["doc-bundle", "pinned-sha"],
  {
    revalidate: PINNED_DOC_BUNDLE_REVALIDATE_SECONDS,
  },
);

export async function getDocBundle(args: GetDocBundleArgs): Promise<BundlerOutput> {
  const input = QuerySchema.parse(args);

  if (isPinnedCommitRef(input.ref)) {
    return getCachedDocBundlePinned(input);
  }

  return getCachedDocBundleMutable(input);
}
