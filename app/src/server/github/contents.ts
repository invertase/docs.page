import { GraphqlResponseError } from "@octokit/graphql";
import { assertPublicRepositoryAccess } from "@/lib/docs-access";
import { InvalidDocPathError, normalizeDocPath } from "@/lib/docs-paths";
import { BundlerError, ERROR_CODES } from "@/server/docs/bundle";
import {
  hasNegativeRepositoryCache,
  putNegativeRepositoryCache,
} from "./cache";
import { getGitHubGraphQLClient } from "./client";
import { logGitHubApiError } from "./errors";
import { resolvePinnedGitHubSource } from "./tree";

function resolveDocPath(path: string) {
  try {
    return normalizeDocPath(path);
  } catch (error) {
    if (error instanceof InvalidDocPathError) {
      throw new BundlerError({
        code: 400,
        name: ERROR_CODES.INVALID_DOC_PATH,
        message: error.message,
      });
    }

    throw error;
  }
}

function assertSafeRepoPath(path: string) {
  if (
    !path ||
    path.includes("\0") ||
    path.includes("..") ||
    /%2e/i.test(path)
  ) {
    throw new BundlerError({
      code: 400,
      name: ERROR_CODES.INVALID_DOC_PATH,
      message: "Invalid repository file path.",
    });
  }

  if (path.startsWith("/") || path.includes("\\")) {
    throw new BundlerError({
      code: 400,
      name: ERROR_CODES.INVALID_DOC_PATH,
      message: "Invalid repository file path.",
    });
  }
}

export type {
  GitHubSource,
  PullRequestMetadata,
} from "./repo-source";
export { getPullRequestMetadata, resolveGitHubSource } from "./repo-source";

type MetaData = {
  owner: string;
  repository: string;
  ref?: string;
  path: string;
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

type PageContentsQuery = {
  repository: {
    stars: number;
    forks: number;
    baseBranch: {
      name: string;
    } | null;
    isFork: boolean;
    isPrivate: boolean;
    configJson?: {
      text?: string;
    } | null;
    configYaml?: {
      text?: string;
    } | null;
    mdx?: {
      text?: string;
    } | null;
    mdxIndex?: {
      text?: string;
    } | null;
  } | null;
};

function getJsDelivrGitHubUrl(metadata: {
  owner: string;
  repository: string;
  ref: string;
  path: string;
}) {
  return `https://cdn.jsdelivr.net/gh/${metadata.owner}/${metadata.repository}@${encodeURIComponent(metadata.ref)}/${metadata.path}`;
}

const JSDELIVR_FETCH_CONCURRENCY = 16;

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
  const docPath = resolveDocPath(metadata.path);
  const base = noDir ? "" : "docs/";
  const absolutePath = `${base}${docPath}`;
  const indexPath = `${base}${docPath}/index`;

  const ref = metadata.ref || "HEAD";

  if (
    await hasNegativeRepositoryCache(metadata.owner, metadata.repository).catch(
      () => false,
    )
  ) {
    return;
  }

  try {
    const response = await getGitHubGraphQLClient()<PageContentsQuery>({
      query: `
        query RepositoryBundle(
          $owner: String!
          $repository: String!
          $configJson: String!
          $configYaml: String!
          $mdx: String!
          $mdxIndex: String!
        ) {
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

    // If the repo doesn't exist or is private / inaccessible from the PAT, GitHub returns `repository: null`.
    const repository = response.repository;
    if (repository == null) {
      await putNegativeRepositoryCache(
        metadata.owner,
        metadata.repository,
      ).catch(() => undefined);
      return;
    }

    const configJson = repository.configJson?.text;
    const configYaml = repository.configYaml?.text;
    const mdx = repository.mdx?.text;
    const mdxIndex = repository.mdxIndex?.text;

    return {
      stars: repository.stars,
      forks: repository.forks,
      repositoryFound: true,
      isFork: repository.isFork,
      isPrivate: repository.isPrivate,
      baseBranch: repository.baseBranch?.name ?? "main",
      config: {
        configJson,
        configYaml,
      },
      md: mdxIndex || mdx,
      path: mdxIndex ? indexPath : absolutePath,
    };
  } catch (e) {
    // Octokit throws a GraphqlResponseError when the repository is not found.
    if (e instanceof GraphqlResponseError) {
      if (
        e.errors?.some(
          (entry) =>
            entry.type === "NOT_FOUND" && entry.path.join(".") === "repository",
        )
      ) {
        await putNegativeRepositoryCache(
          metadata.owner,
          metadata.repository,
        ).catch(() => undefined);

        return;
      }
    }

    logGitHubApiError(e, "getGitHubContents");
    return;
  }
}

type JsDelivrFetchTarget = {
  owner: string;
  repository: string;
  resolvedSha: string;
};

async function resolveJsDelivrFetchTarget(args: {
  owner: string;
  repository: string;
  ref?: string;
  resolvedSha?: string;
  skipAccessCheck?: boolean;
}): Promise<JsDelivrFetchTarget> {
  if (args.resolvedSha) {
    return {
      owner: args.owner,
      repository: args.repository,
      resolvedSha: args.resolvedSha,
    };
  }

  const resolved = await resolvePinnedGitHubSource({
    owner: args.owner,
    repository: args.repository,
    ref: args.ref,
  });

  if (!args.skipAccessCheck) {
    await assertPublicRepositoryAccess(
      resolved.source.owner,
      resolved.source.repository,
      resolved.repositoryMetadata,
    );
  }

  return {
    owner: resolved.source.owner,
    repository: resolved.source.repository,
    resolvedSha: resolved.resolvedSha,
  };
}

export async function getGitHubDocumentSource(
  metadata: MetaData,
  noDir?: boolean,
  options?: { resolvedSha?: string; skipAccessCheck?: boolean },
): Promise<DocumentSource | undefined> {
  const docPath = resolveDocPath(metadata.path);
  const base = noDir ? "" : "docs/";
  const absolutePath = `${base}${docPath}`;
  const indexPath = `${base}${docPath}/index`;
  const target = await resolveJsDelivrFetchTarget({
    owner: metadata.owner,
    repository: metadata.repository,
    ref: metadata.ref,
    resolvedSha: options?.resolvedSha,
    skipAccessCheck: options?.skipAccessCheck,
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
      owner: target.owner,
      repository: target.repository,
      ref: target.resolvedSha,
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
  resolvedSha?: string;
  path: string;
}): Promise<FileSource | undefined> {
  assertSafeRepoPath(metadata.path);
  const target = await resolveJsDelivrFetchTarget({
    owner: metadata.owner,
    repository: metadata.repository,
    ref: metadata.ref,
    resolvedSha: metadata.resolvedSha,
    skipAccessCheck: Boolean(metadata.resolvedSha),
  });
  const content = await fetchTextFromJsDelivr({
    owner: target.owner,
    repository: target.repository,
    ref: target.resolvedSha,
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
  resolvedSha?: string;
  paths: string[];
}): Promise<Map<string, string | undefined>> {
  const out = new Map<string, string | undefined>();

  if (args.paths.length === 0) {
    return out;
  }

  const target = await resolveJsDelivrFetchTarget({
    owner: args.owner,
    repository: args.repository,
    ref: args.ref,
    resolvedSha: args.resolvedSha,
    skipAccessCheck: Boolean(args.resolvedSha),
  });
  const results = await mapWithConcurrency(
    args.paths,
    JSDELIVR_FETCH_CONCURRENCY,
    async (path) => {
      const content = await fetchTextFromJsDelivr({
        owner: target.owner,
        repository: target.repository,
        ref: target.resolvedSha,
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
