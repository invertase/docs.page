import A2A from "a2a";
import { SlugProperties } from "./properties";
import { GithubGQLClient } from "./utils";

type A2AQuery<T> = Promise<[Error | null, T]>;

type DefaultBranchQuery = {
  repository: {
    branch: {
      name: string;
    };
  };
};

export async function getDefaultBranch(
  owner: string,
  repository: string
): Promise<string | null> {
  const [error, response] = await A2A<DefaultBranchQuery>(
    GithubGQLClient({
      query: `
        query RepositoryDefaultBranch($owner: String!, $repository: String!) {
          repository(owner: $owner, name: $repository) {
            branch: defaultBranchRef {
              name
            }
          }
        }
      `,
      owner,
      repository,
    })
  );

  if (error) {
    return null;
  }

  return response.repository.branch.name;
}

type PullRequestQuery = {
  repository: {
    pullRequest: {
      owner: {
        login: string;
      };
      repository: {
        name: string;
      };
      ref: {
        name: string;
      };
    };
  };
};

type PullRequestMetadata = {
  owner: string;
  repository: string;
  ref: string;
};

export async function getPullRequestMetadata(
  owner: string,
  repository: string,
  pullRequest: number
): Promise<PullRequestMetadata | null> {
  const [error, response] = await A2A<PullRequestQuery>(
    GithubGQLClient({
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
      owner: owner,
      repository: repository,
      pullRequest: pullRequest,
    })
  );

  if (error || !response) {
    return null;
  }

  return {
    owner: response.repository.pullRequest.owner.login,
    repository: response.repository.pullRequest.repository.name,
    ref: response.repository.pullRequest.ref.name,
  };
}

type PageFilesQuery = {
  repository: {
    config?: {
      text: string;
    };
    md?: {
      text: string;
    };
    mdx?: {
      text: string;
    };
    html?: {
      text: string;
    };
  };
};

export function getGitHubFiles(
  properties: SlugProperties
): A2AQuery<PageFilesQuery> {
  return A2A<PageFilesQuery>(
    GithubGQLClient({
      query: `
      query RepositoryConfig($owner: String!, $repository: String!, $config: String!, $md: String!, $mdx: String!, $html: String!) {
        repository(owner: $owner, name: $repository) {
          config: object(expression: $config) {
            ... on Blob {
              text
            }
          }
          md: object(expression: $md) {
            ... on Blob {
              text
            }
          }
          mdx: object(expression: $mdx) {
            ... on Blob {
              text
            }
          }
          html: object(expression: $html) {
            ... on Blob {
              text
            }
          }
        }
      }
    `,
      owner: properties.owner,
      repository: properties.repository,
      // Not sure how to build string values with variables within GQL
      config: `${properties.ref}:docs.yaml`,
      md: `${properties.ref}:docs/${properties.path}.md`,
      mdx: `${properties.ref}:docs/${properties.path}.mdx`,
      html: `${properties.ref}:docs/${properties.path}.html`,
    })
  );
}
