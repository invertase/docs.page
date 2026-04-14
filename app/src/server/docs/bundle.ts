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

async function buildDocBundleInternal(
  input: ParsedDocBundleArgs,
): Promise<BundlerOutput> {
  // This body runs only on Data Cache MISS — if you see this every request, the cache isn’t persisting.
  console.info(
    `[docs-perf] doc-bundle cache MISS — build ${input.owner}/${input.repository} path=${input.path} ref=${input.ref ?? "(default)"}`,
  );
  const t0 = performance.now();
  const bundler = new Bundler({
    owner: input.owner,
    repository: input.repository,
    ref: input.ref,
    path: input.path,
    components: input.components,
  });
  const out = await bundler.build();
  console.info(
    `[docs-perf] doc-bundle build() done in ${(performance.now() - t0).toFixed(1)}ms`,
  );
  return out;
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

export async function getDocBundle(
  args: GetDocBundleArgs,
): Promise<BundlerOutput> {
  const input = QuerySchema.parse(args);
  const t0 = performance.now();

  const result = isPinnedCommitRef(input.ref)
    ? await getCachedDocBundlePinned(input)
    : await getCachedDocBundleMutable(input);

  const wallMs = performance.now() - t0;

  console.info(
    `[docs-perf] getDocBundle wall=${wallMs.toFixed(1)}ms ${input.owner}/${input.repository}:${input.path} (HIT = no MISS lines above)`,
  );

  return result;
}
