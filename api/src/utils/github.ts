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
  isFork: boolean;
  baseBranch: string;
  config?: string;
  md?: string;
  path: string;
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
    console.log(error);
  }

  return {
    isFork: response?.repository?.isFork ?? false,
    baseBranch: response?.repository.baseBranch.name ?? 'main',
    config: response?.repository.config?.text,
    md: response?.repository.mdxIndex?.text ?? response?.repository.mdx?.text,
    path: response?.repository.mdxIndex?.text ? indexPath : absolutePath,
  };
}
