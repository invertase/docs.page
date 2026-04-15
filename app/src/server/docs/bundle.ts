import { z } from "zod";

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
  const startedAt = Date.now();
  const input = QuerySchema.parse(args);
  const bundle = await buildDocBundleInternal(input);
  logBundleEvent("build-success", input, {
    elapsedMs: Date.now() - startedAt,
  });

  return bundle;
}

function logBundleEvent(
  event: string,
  input: ParsedDocBundleArgs,
  extra: Record<string, number | string>,
) {
  console.info("[docs.bundle]", event, {
    owner: input.owner,
    repository: input.repository,
    ref: input.ref ?? "HEAD",
    path: input.path,
    ...extra,
  });
}
