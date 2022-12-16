import A2A from 'a2a';
import { graphql } from '@octokit/graphql';
import dotenv from 'dotenv';
dotenv.config();

const getGitHubToken = (() => {
  let index = 0;
  const tokens = process.env.GITHUB_PAT ? process.env.GITHUB_PAT.split(',') : [];

  if (!tokens.length) {
    throw new Error(
      'Environment variable GITHUB_PAT is not defined or has no tokens or an invalid token.',
    );
  }

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
  ref?: string;
  path: string;
};

type PageContentsQuery = {
  repository: {
    baseBranch: {
      name: string;
    };
    isFork: boolean;
    configJson?: {
      text: string;
    };
    configYaml?: {
      text: string;
    };
    configToml?: {
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
  isFork: boolean;
  baseBranch: string;
  config: {
    configJson?: string;
    configYaml?: string;
    configToml?: string;
  };
  md: string | null;
  path: string;
  repositoryFound: boolean;
};

export async function getGitHubContents(metadata: MetaData, noDir?: boolean): Promise<Contents> {
  const base = noDir ? '' : 'docs/';
  const absolutePath = `${base}${metadata.path}`;
  const indexPath = `${base}${metadata.path}/index`;

  const ref = metadata.ref || 'HEAD';

  const [error, response] = await A2A<PageContentsQuery>(
    getGithubGQLClient()({
      query: `
      query RepositoryConfig($owner: String!, $repository: String!, $configJson: String!, $configYaml: String!, $configToml: String!, $mdx: String!, $mdxIndex: String!) {
        repository(owner: $owner, name: $repository) {
          baseBranch: defaultBranchRef {
            name
          }
          isFork
          configJson: object(expression: $configJson) {
            ... on Blob {
              text
            }
          }
          configYaml: object(expression: $configYaml) {
            ... on Blob {
              text
            }
          }
          configToml: object(expression: $configToml) {
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
      configJson: `${ref}:docs.json`,
      configYaml: `${ref}:docs.yaml`,
      configToml: `${ref}:docs.toml`,
      mdx: `${ref}:${absolutePath}.mdx`,
      mdxIndex: `${ref}:${indexPath}.mdx`,
    }),
  );

  // if an error is thrown then the repo is not found, if the repo is private then response = { repository: null }
  if (error || response?.repository === null) {
    //@ts-ignore
    return {
      repositoryFound: false,
    };
  }

  return {
    repositoryFound: true,
    isFork: response?.repository?.isFork ?? false,
    baseBranch: response?.repository.baseBranch.name ?? 'main',
    config: {
      configJson: response?.repository.configJson?.text,
      configYaml: response?.repository.configYaml?.text,
      configToml: response?.repository.configToml?.text,
    },
    md: response?.repository.mdxIndex?.text || response?.repository.mdx?.text || null,
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

type Configs = {
  repositoryFound: boolean;
  config?: {
    configJson?: string;
    configYaml?: string;
    configToml?: string;
  };
};

type ConfigResponse = {
  repository: {
    configJson?: {
      text: string;
    };
    configYaml?: {
      text: string;
    };
    configToml?: {
      text: string;
    };
  };
};

export async function getConfigs(metadata: MetaData): Promise<Configs> {
  const ref = metadata.ref || 'HEAD';

  const [error, response] = await A2A<ConfigResponse>(
    getGithubGQLClient()({
      query: `
      query RepositoryConfig($owner: String!, $repository: String!, $json: String!, $yaml: String!, $toml: String!) {
        repository(owner: $owner, name: $repository) {
          configYaml: object(expression: $yaml) {
            ... on Blob {
              text
            }
          }
          configJson: object(expression: $json) {
            ... on Blob {
              text
            }
          }
          configToml: object(expression: $toml) {
            ... on Blob {
              text
            }
          }
        }
      }
    `,
      owner: metadata.owner,
      repository: metadata.repository,
      json: `${ref}:docs.json`,
      yaml: `${ref}:docs.yaml`,
      toml: `${ref}:docs.toml`,
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
    config: {
      configJson: response?.repository.configJson?.text,
      configYaml: response?.repository.configYaml?.text,
      configToml: response?.repository.configToml?.text,
    },
  };
}
