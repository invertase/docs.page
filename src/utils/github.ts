import A2A from 'a2a';
import { graphql } from '@octokit/graphql';

import { Properties } from './properties';

type RepositoryPathsQuery = {
  // Null if repo not found
  repository?: {
    // Null if path not found
    object?: {
      entries: {
        name: string;
        extension: string;
        type: string;
        path: string;
      }[];
    };
  };
};

const getGitHubToken = (() => {
  let index = 0;
  const tokens = (process.env.GITHUB_PAT ?? '').split(',');
  return function () {
    if (index >= tokens.length) index = 0;
    return tokens[index++];
  };
})();

function getGithubGQLClient(): typeof graphql {
  const token = getGitHubToken();
  if (!token.length) {
    throw new Error(
      'Environment variable GITHUB_PAT is not defined or has no tokens or an invalid token.',
    );
  }
  return graphql.defaults({
    headers: {
      authorization: `token ${getGitHubToken()}`,
    },
  });
}

export async function getRepositoryPaths(repository: string, dir = 'docs'): Promise<string[]> {
  const [owner, name] = repository.split('/');
  let paths = [];

  const [error, response] = await A2A<RepositoryPathsQuery>(
    getGithubGQLClient()({
      query: `
        query RepositoryPaths($owner: String!, $repository: String!, $path: String!) {
          repository(owner: $owner, name: $repository) {
            object(expression: $path) {
              ... on Tree {
                entries {
                  extension
                  type
                  path
                }
              }
            }
          }
        }
      `,
      owner: owner,
      repository: name,
      path: `HEAD:${dir}`,
    }),
  );

  if (error) {
    console.error(error);
    return paths;
  }

  const entries = response.repository?.object?.entries ?? [];

  for (let i = 0; i < entries.length; i++) {
    const { extension, type, path } = entries[i];

    // If there is an MDX file, add it to the list
    if (type === 'blob' && extension === '.mdx') {
      let slug = path
        // Remove "docs/" from the path
        .replace('docs/', '/')
        // Remove .mdx extension
        .slice(0, -4);

      // Remove any "index" page names
      if (slug.endsWith('/index')) {
        slug = slug.slice(0, -5);
      }

      slug = `/${owner}/${name}${slug}`;

      paths.push(slug);
    }

    // If there is a sub-directory fetch any paths for that.
    if (type === 'tree') {
      paths = [...paths, ...(await getRepositoryPaths(repository, path))];
    }
  }

  return paths;
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

export type PullRequestMetadata = {
  owner: string;
  repository: string;
  ref: string;
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
    owner: response.repository.pullRequest.owner.login,
    repository: response.repository.pullRequest.repository.name,
    ref: response.repository.pullRequest.ref.name,
  };
}

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

type Contents = {
  isFork: boolean;
  baseBranch: string;
  config?: string;
  md?: string;
  path: string;
};

export async function getGitHubContents(properties: Properties): Promise<Contents | null> {
  const absolutePath = `docs/${properties.path}`;
  const indexPath = `docs/${properties.path}/index`;

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
      owner: properties.source.owner,
      repository: properties.source.repository,
      config: `${properties.source.ref}:docs.json`,
      mdx: `${properties.source.ref}:${absolutePath}.mdx`,
      mdxIndex: `${properties.source.ref}:${indexPath}.mdx`,
    }),
  );

  // An error is thrown if the repo is not found
  if (error) {
    return null;
  }

  return {
    isFork: response.repository.isFork,
    baseBranch: response.repository.baseBranch.name,
    config: response.repository.config?.text,
    md: response.repository.mdxIndex?.text ?? response.repository.mdx?.text,
    path: response.repository.mdxIndex?.text ? indexPath : absolutePath,
  };
}
