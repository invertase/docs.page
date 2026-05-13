import { getGitHubGraphQLClient } from "./client";
import { resolvePinnedGitHubSource } from "./tree";

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
  const base = noDir ? "" : "docs/";
  const absolutePath = `${base}${metadata.path}`;
  const indexPath = `${base}${metadata.path}/index`;

  const ref = metadata.ref || "HEAD";

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
    console.error(e);
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
