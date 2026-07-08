import {
  hasNegativeRepositoryCache,
  putNegativeRepositoryCache,
} from "./cache";
import { getGitHubGraphQLClient } from "./client";
import { isGitHubRepositoryNotFoundGraphQLError } from "./errors";

export type PullRequestMetadata = {
  owner: string;
  repository: string;
  ref: string;
};

export type GitHubSource = {
  type: "PR" | "commit" | "branch";
  owner: string;
  repository: string;
  ref?: string;
};

type PullRequestQuery = {
  repository: {
    pullRequest: {
      owner: {
        login: string;
      } | null;
      repository: {
        name: string;
      } | null;
      ref: {
        name: string;
      } | null;
    } | null;
  } | null;
};

export async function getPullRequestMetadata(
  owner: string,
  repository: string,
  pullRequest: string,
): Promise<PullRequestMetadata | null> {
  if (await hasNegativeRepositoryCache(owner, repository).catch(() => false)) {
    return null;
  }

  try {
    const response = await getGitHubGraphQLClient()<PullRequestQuery>({
      query: `
        query RepositoryConfig($owner: String!, $repository: String!, $pullRequest: Int!) {
          repository(owner: $owner, name: $repository) {
            pullRequest(number: $pullRequest) {
              owner: headRepositoryOwner {
                login
              }
              repository: headRepository {
                name
              }
              ref: headRef {
                name
              }
            }
          }
        }
      `,
      owner,
      repository,
      pullRequest: Number.parseInt(pullRequest, 10),
    });

    const metadata = response.repository?.pullRequest;

    if (
      !metadata?.owner?.login ||
      !metadata.repository?.name ||
      !metadata.ref?.name
    ) {
      return null;
    }

    return {
      owner: metadata.owner.login,
      repository: metadata.repository.name,
      ref: metadata.ref.name,
    };
  } catch (error) {
    if (isGitHubRepositoryNotFoundGraphQLError(error)) {
      await putNegativeRepositoryCache(owner, repository).catch(
        () => undefined,
      );
    }

    return null;
  }
}

type SourceMetaData = {
  owner: string;
  repository: string;
  ref?: string;
};

export async function resolveGitHubSource(
  metadata: SourceMetaData,
): Promise<GitHubSource> {
  if (metadata.ref) {
    if (/^[0-9]+$/.test(metadata.ref)) {
      const pullRequest = await getPullRequestMetadata(
        metadata.owner,
        metadata.repository,
        metadata.ref,
      );

      if (pullRequest) {
        return {
          type: "PR",
          ...pullRequest,
        };
      }
    }

    if (/^[a-fA-F0-9]{40}$/.test(metadata.ref)) {
      return {
        type: "commit",
        owner: metadata.owner,
        repository: metadata.repository,
        ref: metadata.ref,
      };
    }
  }

  return {
    type: "branch",
    owner: metadata.owner,
    repository: metadata.repository,
    ref: metadata.ref,
  };
}
