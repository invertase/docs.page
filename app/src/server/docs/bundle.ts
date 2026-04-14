import "server-only";

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

export type GetDocBundleArgs = z.input<typeof QuerySchema>;
export type { BundlerOutput } from "./bundler";
export { BundlerError } from "./bundler/error";
export { ERROR_CODES } from "./bundler";

export async function getDocBundle(args: GetDocBundleArgs): Promise<BundlerOutput> {
  const input = QuerySchema.parse(args);
  const bundler = new Bundler(input);
  return bundler.build();
}
