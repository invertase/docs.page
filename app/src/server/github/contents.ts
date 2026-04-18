import { getGitHubGraphQLClient, getGitHubRestClient } from "./client";

type MetaData = {
  owner: string;
  repository: string;
  ref?: string;
  path: string;
};

type SourceMetaData = Omit<MetaData, "path">;

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

type GitHubRepositoryMetadata = {
  stars: number;
  forks: number;
  defaultBranch: string;
  isFork: boolean;
  isPrivate: boolean;
};

function getJsDelivrGitHubUrl(metadata: {
  owner: string;
  repository: string;
  ref: string;
  path: string;
}) {
  return `https://cdn.jsdelivr.net/gh/${metadata.owner}/${metadata.repository}@${encodeURIComponent(metadata.ref)}/${metadata.path}`;
}

const PINNED_COMMIT_REF_PATTERN = /^[a-fA-F0-9]{40}$/;
const JSDELIVR_FETCH_CONCURRENCY = 16;

async function getRepositoryMetadata(owner: string, repository: string) {
  const response = await getGitHubRestClient().request("GET /repos/{owner}/{repo}", {
    owner,
    repo: repository,
  });

  return {
    stars: response.data.stargazers_count,
    forks: response.data.forks_count,
    defaultBranch: response.data.default_branch,
    isFork: response.data.fork,
    isPrivate: response.data.private,
  } satisfies GitHubRepositoryMetadata;
}

async function resolveGitHubRefToSha(
  owner: string,
  repository: string,
  ref: string,
) {
  const response = await getGitHubRestClient().request(
    "GET /repos/{owner}/{repo}/commits/{ref}",
    {
      owner,
      repo: repository,
      ref,
    },
  );

  return response.data.sha;
}

async function resolvePinnedGitHubSource(
  metadata: SourceMetaData,
): Promise<{
  source: GitHubSource;
  resolvedRef: string;
  resolvedSha: string;
  repositoryMetadata?: GitHubRepositoryMetadata;
}> {
  const source = await resolveGitHubSource(metadata);
  let repositoryMetadata: GitHubRepositoryMetadata | undefined;
  const resolvedRef = !source.ref || source.ref === "HEAD"
    ? await (async () => {
      repositoryMetadata = await getRepositoryMetadata(source.owner, source.repository);
      return repositoryMetadata.defaultBranch;
    })()
    : source.ref;
  const resolvedSha = source.type === "commit" || PINNED_COMMIT_REF_PATTERN.test(resolvedRef)
    ? resolvedRef
    : await resolveGitHubRefToSha(source.owner, source.repository, resolvedRef);

  return {
    source: {
      ...source,
      ref: resolvedRef,
    },
    resolvedRef,
    resolvedSha,
    repositoryMetadata,
  };
}

async function fetchTextFromJsDelivr(metadata: {
  owner: string;
  repository: string;
  ref: string;
  path: string;
}): Promise<string | undefined> {
  try {
    const response = await fetch(
      getJsDelivrGitHubUrl({
        owner: metadata.owner,
        repository: metadata.repository,
        ref: metadata.ref,
        path: metadata.path,
      }),
    );

    if (!response.ok) {
      return;
    }

    return await response.text();
  } catch {
    return;
  }
}

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  worker: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const out = new Array<R>(items.length);
  let cursor = 0;

  const workers = Array.from(
    { length: Math.max(1, Math.min(concurrency, items.length)) },
    async () => {
      while (true) {
        const index = cursor++;
        if (index >= items.length) {
          return;
        }

        out[index] = await worker(items[index], index);
      }
    },
  );

  await Promise.all(workers);

  return out;
}

export async function getGitHubContents(
  metadata: MetaData,
  noDir?: boolean,
): Promise<Contents | undefined> {
  const base = noDir ? "" : "docs/";
  const absolutePath = `${base}${metadata.path}`;
  const indexPath = `${base}${metadata.path}/index`;
  const resolved = await resolvePinnedGitHubSource({
    owner: metadata.owner,
    repository: metadata.repository,
    ref: metadata.ref,
  });

  try {
    const [repositoryMetadata, configJson, configYaml, mdx, mdxIndex] = await Promise.all([
      resolved.repositoryMetadata
        ? Promise.resolve(resolved.repositoryMetadata)
        : getRepositoryMetadata(resolved.source.owner, resolved.source.repository),
      fetchTextFromJsDelivr({
        owner: resolved.source.owner,
        repository: resolved.source.repository,
        ref: resolved.resolvedSha,
        path: "docs.json",
      }),
      fetchTextFromJsDelivr({
        owner: resolved.source.owner,
        repository: resolved.source.repository,
        ref: resolved.resolvedSha,
        path: "docs.yaml",
      }),
      fetchTextFromJsDelivr({
        owner: resolved.source.owner,
        repository: resolved.source.repository,
        ref: resolved.resolvedSha,
        path: `${absolutePath}.mdx`,
      }),
      fetchTextFromJsDelivr({
        owner: resolved.source.owner,
        repository: resolved.source.repository,
        ref: resolved.resolvedSha,
        path: `${indexPath}.mdx`,
      }),
    ]);

    return {
      stars: repositoryMetadata.stars,
      forks: repositoryMetadata.forks,
      repositoryFound: true,
      isFork: repositoryMetadata.isFork,
      isPrivate: repositoryMetadata.isPrivate,
      baseBranch: repositoryMetadata.defaultBranch,
      config: {
        configJson,
        configYaml,
      },
      md: mdxIndex || mdx,
      path: mdxIndex ? indexPath : absolutePath,
    };
  } catch {
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
  const resolved = await resolvePinnedGitHubSource({
    owner: metadata.owner,
    repository: metadata.repository,
    ref: metadata.ref,
  });
  const candidates = [
    {
      path: `${indexPath}.mdx`,
      contentType: "mdx" as const,
    },
    {
      path: `${absolutePath}.mdx`,
      contentType: "mdx" as const,
    },
    {
      path: `${indexPath}.md`,
      contentType: "md" as const,
    },
    {
      path: `${absolutePath}.md`,
      contentType: "md" as const,
    },
  ];

  for (const candidate of candidates) {
    const content = await fetchTextFromJsDelivr({
      owner: resolved.source.owner,
      repository: resolved.source.repository,
      ref: resolved.resolvedSha,
      path: candidate.path,
    });

    if (content != null) {
      return {
        content,
        path: candidate.path,
        contentType: candidate.contentType,
      };
    }
  }

  return;
}

export async function getGitHubFileSource(metadata: {
  owner: string;
  repository: string;
  ref?: string;
  path: string;
}): Promise<FileSource | undefined> {
  const resolved = await resolvePinnedGitHubSource({
    owner: metadata.owner,
    repository: metadata.repository,
    ref: metadata.ref,
  });
  const content = await fetchTextFromJsDelivr({
    owner: resolved.source.owner,
    repository: resolved.source.repository,
    ref: resolved.resolvedSha,
    path: metadata.path,
  });

  if (content == null) {
    return;
  }

  return {
    content,
    path: metadata.path,
  };
}

/**
 * Load many blob texts from jsDelivr using a pinned commit SHA.
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

  const resolved = await resolvePinnedGitHubSource({
    owner: args.owner,
    repository: args.repository,
    ref: args.ref,
  });
  const results = await mapWithConcurrency(
    args.paths,
    JSDELIVR_FETCH_CONCURRENCY,
    async (path) => {
      const content = await fetchTextFromJsDelivr({
        owner: resolved.source.owner,
        repository: resolved.source.repository,
        ref: resolved.resolvedSha,
        path,
      });

      return [path, content] as const;
    },
  );

  for (const [path, content] of results) {
    out.set(path, content);
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
