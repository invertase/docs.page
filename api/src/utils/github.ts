import A2A from 'a2a';
import { graphql } from '@octokit/graphql';
import dotenv from 'dotenv';
dotenv.config();

const getGitHubToken = (() => {
  let index = 0;
  const tokens = process.env.GITHUB_PAT ? process.env.GITHUB_PAT.split(',') : [];

  return function () {
    if (index >= tokens.length) index = 0;
    return tokens[index++];
  };
})();

export function getGithubGQLClient(): typeof graphql {
  const token = getGitHubToken();
  if (!token) {
    throw new Error(
      'Environment variable GITHUB_PAT is not defined or has no tokens or an invalid token.',
    );
  }
  return graphql.defaults({
    headers: {
      authorization: `token ${token}`,
    },
  });
}

export type MetaData = {
  owner: string;
  repository: string;
  ref: string;
  path: string;
};

type PageContentsQuery = {
  repository: {
    baseBranch: {
      name: string;
    };
    isFork: boolean;
    config?: {
      text: string;
    };
    mdx?: {
      text: string;
    };
    mdxIndex?: {
      text: string;
    };
  };
};

export type Contents = {
  isFork?: boolean;
  baseBranch?: string;
  config?: string;
  md?: string;
  path?: string;
  repositoryFound: boolean;
};

export async function getGitHubContents(metadata: MetaData): Promise<Contents> {
  const absolutePath = `docs/${metadata.path}`;
  const indexPath = `docs/${metadata.path}/index`;

  const [error, response] = await A2A<PageContentsQuery>(
    getGithubGQLClient()({
      query: `
      query RepositoryConfig($owner: String!, $repository: String!, $config: String!, $mdx: String!, $mdxIndex: String!) {
        repository(owner: $owner, name: $repository) {
          baseBranch: defaultBranchRef {
            name
          }
          isFork
          config: object(expression: $config) {
            ... on Blob {
              text
            }
          }
          mdx: object(expression: $mdx) {
            ... on Blob {
              text
            }
          }
          mdxIndex: object(expression: $mdxIndex) {
            ... on Blob {
              text
            }
          }
        }
      }
    `,
      owner: metadata.owner,
      repository: metadata.repository,
      config: `${metadata.ref}:docs.json`,
      mdx: `${metadata.ref}:${absolutePath}.mdx`,
      mdxIndex: `${metadata.ref}:${indexPath}.mdx`,
    }),
  );

  // if an error is thrown then the repo is not found, if the repo is private then response = { repository: null }
  if (error || response?.repository === null) {
    return {
      repositoryFound: false,
    };
  }

  return {
    repositoryFound: true,
    isFork: response?.repository?.isFork ?? false,
    baseBranch: response?.repository.baseBranch.name ?? 'main',
    config: response?.repository.config?.text,
    md: response?.repository.mdxIndex?.text ?? response?.repository.mdx?.text,
    path: response?.repository.mdxIndex?.text ? indexPath : absolutePath,
  };
}

export type PullRequestMetadata = {
  owner: string;
  repository: string;
  ref: string;
};

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

export async function getPullRequestMetadata(
  owner: string,
  repository: string,
  pullRequest: string,
): Promise<PullRequestMetadata | null> {
  const [error, response] = await A2A<PullRequestQuery>(
    getGithubGQLClient()({
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
      pullRequest: parseInt(pullRequest),
    }),
  );
  if (error || !response) {
    return null;
  }

  return {
    owner: response?.repository?.pullRequest?.owner?.login,
    repository: response?.repository?.pullRequest?.repository?.name,
    ref: response?.repository?.pullRequest?.ref?.name,
  };
}

export async function getRepositorySymLinks(owner: string, repository: string, dir = 'docs', ref: string): Promise<any[]> {
  let symLinks: any[] = [];

  const [error, response] = await A2A(
    getGithubGQLClient()({
      query: `
        query RepositoryPaths($owner: String!, $repository: String!, $path: String!) {
          repository(owner: $owner, name: $repository) {
            modes: object(expression: $path) {
              ... on Tree {
                entries {
                  mode
                  name
                  path
                  type
                  extension
                  object {
                    ... on Blob {
                      text
                    }
                  }
                }
              }
            }
          }
        }
      `,
      owner: owner,
      repository: repository,
      path: `${ref}:${dir}`,
    }),
  );

  if (error) {
    console.error(error);
    return symLinks;
  }
  //@ts-ignore
  const entries = response?.repository?.modes?.entries ?? [];

  for (let i = 0; i < entries.length; i++) {
    const { mode, path, type, extension } = entries[i];

    // If there is a symlink file, add it to the list
    if (type === 'blob' && extension === '.mdx' && mode == '40960') {
      symLinks.push(entries[i]);
    }

    // If there is a sub-directory fetch any paths for that.
    if (type === 'tree') {
      symLinks = [...symLinks, ...(await getRepositorySymLinks(owner, repository, path, ref))];
    }
  }

  return symLinks;
}