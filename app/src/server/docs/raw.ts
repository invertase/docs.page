import { stripRawDocRequestSuffix } from "@/lib/docs-routing";
import { z } from "zod";
import { getGitHubDocumentSource } from "../github/contents";
import { BundlerError, ERROR_CODES } from "./bundle";

const RawDocSchema = z.object({
  owner: z.string().min(1),
  repository: z.string().min(1),
  ref: z.string().optional(),
  path: z.string().min(1),
});

export type GetRawDocArgs = z.input<typeof RawDocSchema>;

export async function getRawDocSource(
  args: GetRawDocArgs,
  options?: { resolvedSha?: string; skipAccessCheck?: boolean },
) {
  const input = RawDocSchema.parse(args);
  const normalizedPath = stripRawDocRequestSuffix(input.path);

  const source = await getGitHubDocumentSource(
    {
      owner: input.owner,
      repository: input.repository,
      ref: input.ref,
      path: normalizedPath,
    },
    undefined,
    options,
  );

  if (!source) {
    throw new BundlerError({
      code: 404,
      name: ERROR_CODES.FILE_NOT_FOUND,
      message: `No file was found in the repository matching this path. Ensure a file exists at <code>/docs/${normalizedPath}.mdx</code>, <code>/docs/${normalizedPath}.md</code>, or their <code>index</code> variants.`,
      source: `https://github.com/${input.owner}/${input.repository}`,
    });
  }

  return source;
}
