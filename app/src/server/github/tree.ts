import { assertPublicRepositoryAccess } from "@/lib/docs-access";
import { BundlerError, ERROR_CODES } from "@/server/docs/bundle";
import {
  GITHUB_CACHE_TTLS,
  getGitHubCache,
  githubCacheKey,
  hasNegativeRepositoryCache,
  putGitHubCache,
  putNegativeRepositoryCache,
  withGitHubCache,
} from "./cache";
import { getGitHubRestClient } from "./client";
import { isGitHubApiErrorStatus, logGitHubApiError } from "./errors";
import { isUnresolvedNumericRef } from "./ref-validation";
import { type GitHubSource, resolveGitHubSource } from "./repo-source";

type RefArgs = {
  owner: string;
  repository: string;
  ref?: string;
};

export type GitHubRepositoryMetadata = {
  stars: number;
  forks: number;
  defaultBranch: string;
  isFork: boolean;
  isPrivate: boolean;
};

type GitHubTreeEntry = {
  path: string;
  sha: string;
  type: "blob" | "tree" | "commit";
};

type GitHubRecursiveTree = {
  truncated: boolean;
  tree: GitHubTreeEntry[];
};

type CachedRefToSha =
  | {
      status: "resolved";
      ref: string;
      sha: string;
    }
  | {
      status: "not-found";
    };

export type GitHubDocFile = {
  path: string;
  sourcePath: string;
  sha: string;
  isIndex: boolean;
};

export type GitHubDocFileList = {
  requestedRef: string | null;
  source: GitHubSource;
  resolvedRef: string;
  resolvedSha: string;
  truncated: boolean;
  files: GitHubDocFile[];
};

export type GitHubSkillFile = {
  owner: string;
  repository: string;
  ref?: string;
  slug: string;
  uri: string;
  name: string;
  sourcePath: string;
  sha: string;
};

export type GitHubSkillFileList = {
  requestedRef: string | null;
  source: GitHubSource;
  resolvedRef: string;
  resolvedSha: string;
  truncated: boolean;
  skills: GitHubSkillFile[];
};

export async function getRepositoryMetadata(owner: string, repository: string) {
  if (await hasNegativeRepositoryCache(owner, repository).catch(() => false)) {
    throw createGitHubRepositoryNotFoundError(owner, repository);
  }

  return withGitHubCache<GitHubRepositoryMetadata>(
    githubCacheKey("repo-meta", owner, repository),
    GITHUB_CACHE_TTLS.repositoryMetadata,
    async () => {
      try {
        const response = await getGitHubRestClient().request(
          "GET /repos/{owner}/{repo}",
          {
            owner,
            repo: repository,
          },
        );

        return {
          stars: response.data.stargazers_count,
          forks: response.data.forks_count,
          defaultBranch: response.data.default_branch,
          isFork: response.data.fork,
          isPrivate: response.data.private,
        } satisfies GitHubRepositoryMetadata;
      } catch (error) {
        if (isGitHubApiErrorStatus(error, [404])) {
          await putNegativeRepositoryCache(owner, repository).catch(
            () => undefined,
          );
          throw createGitHubRepositoryNotFoundError(owner, repository);
        }

        throw error;
      }
    },
  );
}

function createGitHubRepositoryNotFoundError(
  owner: string,
  repository: string,
) {
  return new BundlerError({
    code: 404,
    name: ERROR_CODES.REPO_NOT_FOUND,
    message: `The repository ${owner}/${repository} was not found.`,
    details: {
      owner,
      repository,
      reason: "repository-not-found-or-inaccessible",
    },
  });
}

const PINNED_COMMIT_REF_PATTERN = /^[a-fA-F0-9]{40}$/;

export async function resolvePinnedGitHubSource(metadata: RefArgs): Promise<{
  source: GitHubSource;
  resolvedRef: string;
  resolvedSha: string;
  repositoryMetadata?: GitHubRepositoryMetadata;
}> {
  const source = await resolveGitHubSource(metadata);
  let repositoryMetadata: GitHubRepositoryMetadata | undefined;
  const resolvedRef =
    !source.ref || source.ref === "HEAD"
      ? await (async () => {
          repositoryMetadata = await getRepositoryMetadata(
            source.owner,
            source.repository,
          );
          return repositoryMetadata.defaultBranch;
        })()
      : source.ref;
  const resolvedSha =
    source.type === "commit" || PINNED_COMMIT_REF_PATTERN.test(resolvedRef)
      ? resolvedRef
      : await (async () => {
          if (isUnresolvedNumericRef(resolvedRef, source)) {
            throw createGitHubRefNotFoundError(
              source.owner,
              source.repository,
              resolvedRef,
            );
          }

          return (
            await resolveGitHubRefToSha(
              source.owner,
              source.repository,
              resolvedRef,
            )
          ).sha;
        })();

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

export async function resolveGitHubRefToSha(
  owner: string,
  repository: string,
  ref: string,
) {
  const cacheKey = githubCacheKey("ref-sha", owner, repository, ref);
  const cached = await getGitHubCache<CachedRefToSha>(cacheKey);

  if (cached?.status === "resolved") {
    return {
      ref: cached.ref,
      sha: cached.sha,
    };
  }

  if (cached?.status === "not-found") {
    throw createGitHubRefNotFoundError(owner, repository, ref);
  }

  try {
    const response = await getGitHubRestClient().request(
      "GET /repos/{owner}/{repo}/commits/{ref}",
      {
        owner,
        repo: repository,
        ref,
      },
    );
    const value = {
      status: "resolved",
      ref,
      sha: response.data.sha,
    } satisfies CachedRefToSha;

    await putGitHubCache(cacheKey, value, GITHUB_CACHE_TTLS.refToSha);

    return {
      ref: value.ref,
      sha: value.sha,
    };
  } catch (error) {
    if (isGitHubApiErrorStatus(error, [404, 422])) {
      await putGitHubCache(
        cacheKey,
        {
          status: "not-found",
        } satisfies CachedRefToSha,
        GITHUB_CACHE_TTLS.negativeRef,
      );
      throw createGitHubRefNotFoundError(owner, repository, ref);
    }

    logGitHubApiError(error, {
      context: "resolveGitHubRefToSha",
      owner,
      repository,
      ref,
    });
    throw error;
  }
}

export async function getGitHubRecursiveTreeBySha(
  owner: string,
  repository: string,
  sha: string,
): Promise<GitHubRecursiveTree> {
  return withGitHubCache<GitHubRecursiveTree>(
    githubCacheKey("tree", owner, repository, sha),
    GITHUB_CACHE_TTLS.recursiveTree,
    async () => {
      const response = await getGitHubRestClient().request(
        "GET /repos/{owner}/{repo}/git/trees/{tree_sha}",
        {
          owner,
          repo: repository,
          tree_sha: sha,
          recursive: "1",
        },
      );

      return {
        truncated: response.data.truncated,
        tree: response.data.tree
          .filter((entry) => {
            return (
              typeof entry.path === "string" &&
              typeof entry.sha === "string" &&
              (entry.type === "blob" ||
                entry.type === "tree" ||
                entry.type === "commit")
            );
          })
          .map((entry) => ({
            path: entry.path!,
            sha: entry.sha!,
            type: entry.type as GitHubTreeEntry["type"],
          })),
      };
    },
  );
}

function createGitHubRefNotFoundError(
  owner: string,
  repository: string,
  ref: string,
) {
  return new BundlerError({
    code: 404,
    name: ERROR_CODES.REPO_NOT_FOUND,
    message: `No matching branch, tag, pull request, or commit was found for ref ${ref}.`,
    source: `https://github.com/${owner}/${repository}`,
    details: {
      owner,
      repository,
      ref,
      reason: "ref-not-found",
    },
  });
}

function buildSkillUri(slug: string) {
  return `docs-page://skills/${slug.split("/").map(encodeURIComponent).join("/")}`;
}

function normalizeDocPath(sourcePath: string) {
  const relativePath = sourcePath.slice("docs/".length);

  if (relativePath === "index.mdx") {
    return {
      path: "index",
      isIndex: true,
    };
  }

  if (relativePath.endsWith("/index.mdx")) {
    return {
      path: relativePath.slice(0, -"/index.mdx".length),
      isIndex: true,
    };
  }

  return {
    path: relativePath.slice(0, -".mdx".length),
    isIndex: false,
  };
}

function filterDocFiles(tree: GitHubRecursiveTree) {
  const files = new Map<string, GitHubDocFile>();

  for (const entry of tree.tree) {
    if (entry.type !== "blob") {
      continue;
    }

    if (!entry.path.startsWith("docs/") || !entry.path.endsWith(".mdx")) {
      continue;
    }

    const normalized = normalizeDocPath(entry.path);
    const candidate: GitHubDocFile = {
      path: normalized.path,
      sourcePath: entry.path,
      sha: entry.sha,
      isIndex: normalized.isIndex,
    };

    const existing = files.get(candidate.path);

    // Match docs.page page resolution by preferring index.mdx over foo.mdx.
    if (!existing || (!existing.isIndex && candidate.isIndex)) {
      files.set(candidate.path, candidate);
    }
  }

  return [...files.values()].sort((left, right) =>
    left.path.localeCompare(right.path),
  );
}

function filterSkillFiles(
  args: Pick<RefArgs, "owner" | "repository">,
  resolvedRef: string,
  tree: GitHubRecursiveTree,
) {
  const skillCandidates = tree.tree
    .filter((entry) => entry.type === "blob")
    .filter(
      (entry) =>
        entry.path.startsWith(".agents/skills/") &&
        entry.path.endsWith("/SKILL.md"),
    );

  return skillCandidates
    .map((entry): GitHubSkillFile => {
      const slug = entry.path
        .slice(".agents/skills/".length)
        .slice(0, -"/SKILL.md".length);

      return {
        owner: args.owner,
        repository: args.repository,
        ref: resolvedRef,
        slug,
        uri: buildSkillUri(slug),
        name: slug.split("/").at(-1) ?? slug,
        sourcePath: entry.path,
        sha: entry.sha,
      };
    })
    .sort((left, right) => left.slug.localeCompare(right.slug));
}

export async function listGitHubDocFiles(
  args: RefArgs,
): Promise<GitHubDocFileList | undefined> {
  try {
    const resolved = await resolvePinnedGitHubSource(args);

    await assertPublicRepositoryAccess(
      args.owner,
      args.repository,
      resolved.repositoryMetadata,
    );

    const tree = await getGitHubRecursiveTreeBySha(
      resolved.source.owner,
      resolved.source.repository,
      resolved.resolvedSha,
    );

    return {
      requestedRef: args.ref ?? null,
      source: resolved.source,
      resolvedRef: resolved.resolvedRef,
      resolvedSha: resolved.resolvedSha,
      truncated: tree.truncated,
      files: filterDocFiles(tree),
    };
  } catch (error) {
    if (error instanceof BundlerError) {
      throw error;
    }

    return;
  }
}

export async function listGitHubSkillFiles(
  args: RefArgs,
): Promise<GitHubSkillFileList | undefined> {
  try {
    const resolved = await resolvePinnedGitHubSource(args);

    await assertPublicRepositoryAccess(
      args.owner,
      args.repository,
      resolved.repositoryMetadata,
    );

    const tree = await getGitHubRecursiveTreeBySha(
      resolved.source.owner,
      resolved.source.repository,
      resolved.resolvedSha,
    );

    return {
      requestedRef: args.ref ?? null,
      source: resolved.source,
      resolvedRef: resolved.resolvedRef,
      resolvedSha: resolved.resolvedSha,
      truncated: tree.truncated,
      skills: filterSkillFiles(
        {
          owner: resolved.source.owner,
          repository: resolved.source.repository,
        },
        resolved.resolvedRef,
        tree,
      ),
    };
  } catch (error) {
    if (error instanceof BundlerError) {
      throw error;
    }

    return;
  }
}
