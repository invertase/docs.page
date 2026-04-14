import { getGitHubRestClient } from "./client";
import { resolveGitHubSource, type GitHubSource } from "./contents";

type RefArgs = {
  owner: string;
  repository: string;
  ref?: string;
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

async function getDefaultBranch(owner: string, repository: string) {
  const response = await getGitHubRestClient().request("GET /repos/{owner}/{repo}", {
    owner,
    repo: repository,
  });

  return response.data.default_branch;
}

export async function resolveGitHubRefToSha(
  owner: string,
  repository: string,
  ref: string,
) {
  const response = await getGitHubRestClient().request("GET /repos/{owner}/{repo}/commits/{ref}", {
    owner,
    repo: repository,
    ref,
  });

  return {
    ref,
    sha: response.data.sha,
  };
}

export async function getGitHubRecursiveTreeBySha(
  owner: string,
  repository: string,
  sha: string,
): Promise<GitHubRecursiveTree> {
  const response = await getGitHubRestClient().request("GET /repos/{owner}/{repo}/git/trees/{tree_sha}", {
    owner,
    repo: repository,
    tree_sha: sha,
    recursive: "1",
  });

  return {
    truncated: response.data.truncated,
    tree: response.data.tree
      .filter((entry) => {
        return (
          typeof entry.path === "string" &&
          typeof entry.sha === "string" &&
          (entry.type === "blob" || entry.type === "tree" || entry.type === "commit")
        );
      })
      .map((entry) => ({
        path: entry.path!,
        sha: entry.sha!,
        type: entry.type as GitHubTreeEntry["type"],
      })),
  };
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

  return [...files.values()].sort((left, right) => left.path.localeCompare(right.path));
}

async function resolveRef(args: RefArgs) {
  const source = await resolveGitHubSource(args);
  const resolvedRef = !source.ref || source.ref === "HEAD"
    ? await getDefaultBranch(source.owner, source.repository)
    : source.ref;
  const resolvedSha = source.type === "commit"
    ? resolvedRef
    : (await resolveGitHubRefToSha(source.owner, source.repository, resolvedRef)).sha;

  return {
    source: {
      ...source,
      ref: resolvedRef,
    },
    resolvedRef,
    resolvedSha,
  };
}

function filterSkillFiles(
  args: Pick<RefArgs, "owner" | "repository">,
  resolvedRef: string,
  tree: GitHubRecursiveTree,
) {
  const skillCandidates = tree.tree
    .filter((entry) => entry.type === "blob")
    .filter((entry) => entry.path.startsWith(".agents/skills/") && entry.path.endsWith("/SKILL.md"));

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
    const resolved = await resolveRef(args);
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
  } catch {
    return;
  }
}

export async function listGitHubSkillFiles(
  args: RefArgs,
): Promise<GitHubSkillFileList | undefined> {
  try {
    const resolved = await resolveRef(args);
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
  } catch {
    return;
  }
}
