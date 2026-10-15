import { z } from "zod";

import { InvalidDocPathError, normalizeDocPath } from "@/lib/docs-paths";
import { Bundler, type BundlerOutput, ERROR_CODES } from "./bundler";
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
export { ERROR_CODES } from "./bundler";
export { BundlerError, type DocsBranding } from "./bundler/error";

function parseDocBundlePath(path: string): string {
  try {
    return normalizeDocPath(path);
  } catch (error) {
    if (error instanceof InvalidDocPathError) {
      throw new BundlerError({
        code: 400,
        name: ERROR_CODES.INVALID_DOC_PATH,
        message: error.message,
      });
    }

    throw error;
  }
}

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
  return buildDocBundleInternal({
    ...input,
    path: parseDocBundlePath(input.path),
  });
}
