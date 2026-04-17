import { getGitHubGraphQLClient } from "./client";

type MetaData = {
  owner: string;
  repository: string;
  ref?: string;
  path: string;
};

type SourceMetaData = Omit<MetaData, "path">;

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
    mdx?: {
      text: string;
    };
    mdxIndex?: {
      text: string;
    };
  } | null;
};

type DocumentSourceQuery = {
  repository: {
    mdx?: {
      text: string;
    };
    mdxIndex?: {
      text: string;
    };
    md?: {
      text: string;
    };
    mdIndex?: {
      text: string;
    };
  } | null;
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
  };
  md?: string;
  path: string;
  repositoryFound: boolean;
};

export type DocumentSource = {
  content: string;
  path: string;
  contentType: "md" | "mdx";
};

export type FileSource = {
  content: string;
  path: string;
};

export async function getGitHubContents(
  metadata: MetaData,
  noDir?: boolean,
): Promise<Contents | undefined> {
  const base = noDir ? "" : "docs/";
  const absolutePath = `${base}${metadata.path}`;
  const indexPath = `${base}${metadata.path}/index`;
  const ref = metadata.ref || "HEAD";

  try {
    const response = await getGitHubGraphQLClient()<PageContentsQuery>({
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
    });

    if (response.repository === null) {
      return;
    }

    return {
      stars: response.repository?.stars ?? 0,
      forks: response.repository?.forks ?? 0,
      repositoryFound: true,
      isFork: response.repository?.isFork ?? false,
      isPrivate: response.repository?.isPrivate ?? false,
      baseBranch: response.repository?.baseBranch.name ?? "main",
      config: {
        configJson: response.repository?.configJson?.text,
        configYaml: response.repository?.configYaml?.text,
      },
      md: response.repository?.mdxIndex?.text || response.repository?.mdx?.text,
      path: response.repository?.mdxIndex?.text ? indexPath : absolutePath,
    };
  } catch (error) {
    console.error(error);
    return;
  }
}

export async function getGitHubDocumentSource(
  metadata: MetaData,
  noDir?: boolean,
): Promise<DocumentSource | undefined> {
  const base = noDir ? "" : "docs/";
  const absolutePath = `${base}${metadata.path}`;
  const indexPath = `${base}${metadata.path}/index`;
  const ref = metadata.ref || "HEAD";

  try {
    const response = await getGitHubGraphQLClient()<DocumentSourceQuery>({
      query: `
        query RepositoryDocument($owner: String!, $repository: String!, $mdx: String!, $mdxIndex: String!, $md: String!, $mdIndex: String!) {
          repository(owner: $owner, name: $repository) {
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
            md: object(expression: $md) {
              ... on Blob {
                text
              }
            }
            mdIndex: object(expression: $mdIndex) {
              ... on Blob {
                text
              }
            }
          }
        }
      `,
      owner: metadata.owner,
      repository: metadata.repository,
      mdx: `${ref}:${absolutePath}.mdx`,
      mdxIndex: `${ref}:${indexPath}.mdx`,
      md: `${ref}:${absolutePath}.md`,
      mdIndex: `${ref}:${indexPath}.md`,
    });

    if (response.repository === null) {
      return;
    }

    if (response.repository?.mdxIndex?.text) {
      return {
        content: response.repository.mdxIndex.text,
        path: `${indexPath}.mdx`,
        contentType: "mdx",
      };
    }

    if (response.repository?.mdx?.text) {
      return {
        content: response.repository.mdx.text,
        path: `${absolutePath}.mdx`,
        contentType: "mdx",
      };
    }

    if (response.repository?.mdIndex?.text) {
      return {
        content: response.repository.mdIndex.text,
        path: `${indexPath}.md`,
        contentType: "md",
      };
    }

    if (response.repository?.md?.text) {
      return {
        content: response.repository.md.text,
        path: `${absolutePath}.md`,
        contentType: "md",
      };
    }

    return;
  } catch {
    return;
  }
}

type FileSourceQuery = {
  repository: {
    file?: {
      text: string;
    };
  } | null;
};

export async function getGitHubFileSource(metadata: {
  owner: string;
  repository: string;
  ref?: string;
  path: string;
}): Promise<FileSource | undefined> {
  const ref = metadata.ref || "HEAD";

  try {
    const response = await getGitHubGraphQLClient()<FileSourceQuery>({
      query: `
        query RepositoryFile($owner: String!, $repository: String!, $file: String!) {
          repository(owner: $owner, name: $repository) {
            file: object(expression: $file) {
              ... on Blob {
                text
              }
            }
          }
        }
      `,
      owner: metadata.owner,
      repository: metadata.repository,
      file: `${ref}:${metadata.path}`,
    });

    if (!response.repository?.file?.text) {
      return;
    }

    return {
      content: response.repository.file.text,
      path: metadata.path,
    };
  } catch {
    return;
  }
}

/** GraphQL cost grows with field count; keep batches moderate. */
const GITHUB_BLOB_GRAPHQL_BATCH = 20;

/**
 * Load many blob texts with fewer HTTP round-trips than calling `getGitHubFileSource` per path.
 * Falls back to per-file fetches for a chunk if the batched query fails.
 */
export async function getGitHubFileSourcesBatch(args: {
  owner: string;
  repository: string;
  ref?: string;
  paths: string[];
}): Promise<Map<string, string | undefined>> {
  const out = new Map<string, string | undefined>();

  if (args.paths.length === 0) {
    return out;
  }

  const ref = args.ref || "HEAD";

  for (
    let offset = 0;
    offset < args.paths.length;
    offset += GITHUB_BLOB_GRAPHQL_BATCH
  ) {
    const paths = args.paths.slice(offset, offset + GITHUB_BLOB_GRAPHQL_BATCH);

    const varDefs = paths.map((_, j) => `$e${j}: String!`).join(", ");
    const fieldBlock = paths
      .map(
        (_, j) => `b${j}: object(expression: $e${j}) { ... on Blob { text } }`,
      )
      .join("\n");

    const query = `
        query BatchRepoBlobs($owner: String!, $repository: String!, ${varDefs}) {
          repository(owner: $owner, name: $repository) {
            ${fieldBlock}
          }
        }
      `;

    const variables: Record<string, string> = {
      owner: args.owner,
      repository: args.repository,
    };

    for (let j = 0; j < paths.length; j++) {
      variables[`e${j}`] = `${ref}:${paths[j]}`;
    }

    const response = await getGitHubGraphQLClient()<{
      repository: null | Record<string, { text?: string } | null | undefined>;
    }>({
      query,
      ...variables,
    });

    const repo = response.repository;

    if (!repo) {
      for (const p of paths) {
        out.set(p, undefined);
      }
      continue;
    }

    for (let j = 0; j < paths.length; j++) {
      const blob = repo[`b${j}`];
      out.set(paths[j], blob?.text ?? undefined);
    }
  }

  return out;
}

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
  } catch {
    return null;
  }
}

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
