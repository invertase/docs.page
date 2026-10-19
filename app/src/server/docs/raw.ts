import { z } from "zod";
import { InvalidDocPathError, normalizeDocPath } from "@/lib/docs-paths";
import { stripRawDocRequestSuffix } from "@/lib/docs-routing";
import {
  getNegativeDocsFileCache,
  putNegativeDocsFileCache,
} from "@/server/github/cache";
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
  let normalizedPath: string;
  try {
    normalizedPath = normalizeDocPath(stripRawDocRequestSuffix(input.path));
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

  if (
    await getNegativeDocsFileCache(
      input.owner,
      input.repository,
      input.ref,
      normalizedPath,
    ).catch(() => undefined)
  ) {
    throw new BundlerError({
      code: 404,
      name: ERROR_CODES.FILE_NOT_FOUND,
      message: `No file was found in the repository matching this path. Ensure a file exists at <code>/docs/${normalizedPath}.mdx</code>, <code>/docs/${normalizedPath}.md</code>, or their <code>index</code> variants.`,
      source: `https://github.com/${input.owner}/${input.repository}`,
      details: {
        owner: input.owner,
        repository: input.repository,
        ref: input.ref ?? null,
        path: normalizedPath,
        reason: "negative-file-cache",
      },
    });
  }

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
    await putNegativeDocsFileCache(
      input.owner,
      input.repository,
      input.ref,
      normalizedPath,
    ).catch(() => undefined);

    throw new BundlerError({
      code: 404,
      name: ERROR_CODES.FILE_NOT_FOUND,
      message: `No file was found in the repository matching this path. Ensure a file exists at <code>/docs/${normalizedPath}.mdx</code>, <code>/docs/${normalizedPath}.md</code>, or their <code>index</code> variants.`,
      source: `https://github.com/${input.owner}/${input.repository}`,
      details: {
        owner: input.owner,
        repository: input.repository,
        ref: input.ref ?? null,
        path: normalizedPath,
        reason: "raw-doc-file-not-found",
      },
    });
  }

  return source;
}
