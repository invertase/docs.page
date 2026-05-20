import { BundlerError, ERROR_CODES } from "@/server/docs/bundle";
import {
  getRepositoryMetadata,
  type GitHubRepositoryMetadata,
} from "@/server/github/tree";

export function assertPublicRepo(
  metadata: { isPrivate: boolean },
  owner: string,
  repository: string,
): void {
  if (!metadata.isPrivate) {
    return;
  }

  throw new BundlerError({
    code: 403,
    name: ERROR_CODES.PRIVATE_REPO_BLOCKED,
    message: `Private repositories cannot be hosted on docs.page. The repository <code>${owner}/${repository}</code> is private.`,
    source: `https://github.com/${owner}/${repository}`,
  });
}

/** Use cached repo metadata when available (e.g. from `resolvePinnedGitHubSource`). */
export async function assertPublicRepositoryAccess(
  owner: string,
  repository: string,
  repositoryMetadata?: GitHubRepositoryMetadata,
) {
  const metadata =
    repositoryMetadata ?? (await getRepositoryMetadata(owner, repository));
  assertPublicRepo(metadata, owner, repository);
  return metadata;
}
