import { graphql } from "@octokit/graphql";
import A2A from "a2a";
import dotenv from "dotenv";
import { check, type CheckResult } from "@docs.page/cli";
import JSZip from "jszip";
import type { OctokitInstallation } from "../octokit";
dotenv.config();

const getGitHubToken = (() => {
  let index = 0;
  const tokens = process.env.GITHUB_PAT
    ? process.env.GITHUB_PAT.split(",")
    : [];

  if (!tokens.length) {
    throw new Error(
      "Environment variable GITHUB_PAT is not defined or has no tokens or an invalid token."
    );
  }

  return () => {
    if (index >= tokens.length) index = 0;
    return tokens[index++];
  };
})();

export function getGithubGQLClient(): typeof graphql {
  const token = getGitHubToken();
  if (!token) {
    throw new Error(
      "Environment variable GITHUB_PAT is not defined or has no tokens or an invalid token."
    );
  }
  return graphql.defaults({
    headers: {
      authorization: `token ${token}`,
    },
  });
}

type MetaData = {
  owner: string;
  repository: string;
  ref?: string;
  path: string;
};

type PageContentsQuery = {
  repository: {
    stars: number;
    forks: number;
    baseBranch: {
      name: string;
    };
    isFork: boolean;
    isPrivate: boolean;
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
  stars: number;
  forks: number;
  isFork: boolean;
  isPrivate: boolean;
  baseBranch: string;
  config: {
    configJson?: string;
    configYaml?: string;
    configToml?: string;
  };
  md?: string;
  path: string;
  repositoryFound: boolean;
};

export async function getGitHubContents(
  metadata: MetaData,
  noDir?: boolean
): Promise<Contents | undefined> {
  const base = noDir ? "" : "docs/";
  const absolutePath = `${base}${metadata.path}`;
  const indexPath = `${base}${metadata.path}/index`;

  const ref = metadata.ref || "HEAD";

  const [error, response] = await A2A<PageContentsQuery>(
    getGithubGQLClient()({
      query: `
      query RepositoryConfig($owner: String!, $repository: String!, $configJson: String!, $configYaml: String!, $mdx: String!, $mdxIndex: String!) {
        repository(owner: $owner, name: $repository) {
          stars: stargazerCount
          forks: forkCount
          baseBranch: defaultBranchRef {
            name
          }
          isFork
          isPrivate
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
      mdx: `${ref}:${absolutePath}.mdx`,
      mdxIndex: `${ref}:${indexPath}.mdx`,
    })
  );

  // if an error is thrown then the repo is not found, if the repo is private then response = { repository: null }
  if (error || response?.repository === null) {
    return;
  }

  return {
    stars: response?.repository?.stars ?? 0,
    forks: response?.repository?.forks ?? 0,
    repositoryFound: true,
    isFork: response?.repository?.isFork ?? false,
    isPrivate: response?.repository?.isPrivate ?? false,
    baseBranch: response?.repository.baseBranch.name ?? "main",
    config: {
      configJson: response?.repository.configJson?.text,
      configYaml: response?.repository.configYaml?.text,
    },
    md: response?.repository.mdxIndex?.text || response?.repository.mdx?.text,
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
  pullRequest: string
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
      pullRequest: Number.parseInt(pullRequest),
    })
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

export async function createGitHubCheckRun(
  octokit: OctokitInstallation,
  owner: string,
  repository: string,
  sha: string
) {
  const checkRunResult = await octokit.rest.checks.create({
    owner,
    repo: repository,
    name: "docs.page check",
    head_sha: sha,
    status: "in_progress",
  });

  // Download the repository as a zip
  const archive = await octokit.rest.repos
    .downloadZipballArchive({
      owner: "invertase",
      repo: "docs.page",
      ref: "main",
    })
    .then((response) => response.data as ArrayBuffer);

  // Extract the files from the tar
  const zip = await new JSZip().loadAsync(archive);

  // The zip file contains a directory with the repository name, so we need to remove that
  // and store the files in a map with the path as the key.
  const files = Object.keys(zip.files).reduce<Record<string, string>>(
    (acc, path) => {
      acc[path.split("/").slice(1).join("/")] = path;
      return acc;
    },
    {}
  );

  // Function to get a file from the zip by relative path.
  async function getFileFn(relativePath: string) {
    const file = zip.file(files[relativePath]);
    return file ? await file.async("string") : "";
  }

  const results: CheckResult[] = [];

  let hasErrors = false;

  for await (const result of check(new Set(Object.keys(files)), getFileFn)) {
    if (result.type === "error") {
      hasErrors = true;
    }

    results.push(result);
  }

  await octokit.rest.checks.update({
    owner,
    repo: repository,
    check_run_id: checkRunResult.data.id,
    status: "completed",
    conclusion: hasErrors ? "failure" : "success",
    output: {
      title: "Check Run Results",
      summary: "Check run results",
      text: "TODO",
      annotations: [
        {
          path: "docs.json",
          annotation_level: "warning",
          message: "This is a warning message",
          start_line: 1,
          end_line: 1,
          start_column: 1,
          end_column: 1,
          title: "Warning in file1.js",
          raw_details: "Detailed information about the warning.",
        },
      ],
    },
  });
}
