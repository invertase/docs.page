type BenchArgs = {
  owner: string;
  repository: string;
  path: string;
  runs: number;
  ref?: string;
};

type RequestedRefMode = {
  label: string;
  requestedRef?: string;
};

type CurrentFlowStats = {
  durationMs: number;
  requestCount: number;
  bytes: number;
  resolvedRef: string;
  resolvedSha: string;
  mdPath: string;
  hasMd: boolean;
};

type GitHubRepositoryMetadata = {
  stars: number;
  forks: number;
  defaultBranch: string;
  isFork: boolean;
  isPrivate: boolean;
};

type GraphQLStats = {
  durationMs: number;
  requestCount: number;
  gqlCost: number;
  bytes: number;
  mdPath: string;
  hasMd: boolean;
};

const SHA_PATTERN = /^[a-f0-9]{40}$/i;
const DEFAULT_RUNS = 4;

function parseArgs(argv: string[]): BenchArgs {
  const out: Partial<BenchArgs> = {
    runs: DEFAULT_RUNS,
    path: "index",
  };

  for (let i = 0; i < argv.length; i++) {
    const part = argv[i];
    const next = argv[i + 1];

    if ((part === "--owner" || part === "-o") && next) {
      out.owner = next;
      i++;
      continue;
    }

    if ((part === "--repo" || part === "-r") && next) {
      out.repository = next;
      i++;
      continue;
    }

    if (part === "--path" && next) {
      out.path = next;
      i++;
      continue;
    }

    if (part === "--ref" && next) {
      out.ref = next;
      i++;
      continue;
    }

    if (part === "--runs" && next) {
      out.runs = Number.parseInt(next, 10);
      i++;
    }
  }

  if (!out.owner || !out.repository) {
    throw new Error(
      "Usage: bun src/server/github/benchmark-github-contents.ts --owner <owner> --repo <repo> [--path index] [--ref <ref>] [--runs 4]",
    );
  }

  return {
    owner: out.owner,
    repository: out.repository,
    path: out.path ?? "index",
    ref: out.ref,
    runs:
      Number.isFinite(out.runs) && (out.runs ?? 0) > 0
        ? out.runs!
        : DEFAULT_RUNS,
  };
}

function getGitHubToken(): string {
  const token = process.env.GITHUB_PAT?.split(",")
    .map((value) => value.trim())
    .find(Boolean);

  if (!token) {
    throw new Error(
      "Missing GITHUB_PAT. Set it to compare GraphQL performance (example: export GITHUB_PAT=ghp_xxx).",
    );
  }

  return token;
}

function nowMs() {
  return Date.now();
}

function utf8ByteLength(input: string | undefined) {
  return input ? Buffer.byteLength(input, "utf8") : 0;
}

async function fetchGitHubJson<T>(url: string, token: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub request failed (${response.status}): ${body}`);
  }

  return (await response.json()) as T;
}

async function getRepositoryMetadata(args: {
  owner: string;
  repository: string;
  token: string;
}): Promise<GitHubRepositoryMetadata> {
  const response = await fetchGitHubJson<{
    stargazers_count: number;
    forks_count: number;
    default_branch: string;
    fork: boolean;
    private: boolean;
  }>(
    `https://api.github.com/repos/${args.owner}/${args.repository}`,
    args.token,
  );

  return {
    stars: response.stargazers_count,
    forks: response.forks_count,
    defaultBranch: response.default_branch,
    isFork: response.fork,
    isPrivate: response.private,
  };
}

async function resolveRefToSha(args: {
  owner: string;
  repository: string;
  ref: string;
  token: string;
}) {
  const response = await fetchGitHubJson<{ sha: string }>(
    `https://api.github.com/repos/${args.owner}/${args.repository}/commits/${encodeURIComponent(args.ref)}`,
    args.token,
  );

  return response.sha;
}

async function fetchText(url: string): Promise<string | undefined> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return;
    }
    return await response.text();
  } catch {
    return;
  }
}

function getJsDelivrUrl(args: {
  owner: string;
  repository: string;
  ref: string;
  path: string;
}) {
  return `https://cdn.jsdelivr.net/gh/${args.owner}/${args.repository}@${encodeURIComponent(args.ref)}/${args.path}`;
}

async function benchCurrentFlow(args: {
  owner: string;
  repository: string;
  requestedRef?: string;
  path: string;
  token: string;
}): Promise<CurrentFlowStats> {
  const started = nowMs();
  let requestCount = 0;

  const base = "docs/";
  const absolutePath = `${base}${args.path}`;
  const indexPath = `${base}${args.path}/index`;

  let resolvedRef = args.requestedRef ?? "HEAD";
  let repositoryMetadata: GitHubRepositoryMetadata | undefined;
  if (resolvedRef === "HEAD") {
    repositoryMetadata = await getRepositoryMetadata({
      owner: args.owner,
      repository: args.repository,
      token: args.token,
    });
    requestCount++;
    resolvedRef = repositoryMetadata.defaultBranch;
  }

  const resolvedSha = SHA_PATTERN.test(resolvedRef)
    ? resolvedRef
    : await (async () => {
        const sha = await resolveRefToSha({
          owner: args.owner,
          repository: args.repository,
          ref: resolvedRef,
          token: args.token,
        });
        requestCount++;
        return sha;
      })();

  const repoMetadataPromise = repositoryMetadata
    ? Promise.resolve(repositoryMetadata)
    : (() => {
        requestCount++;
        return getRepositoryMetadata({
          owner: args.owner,
          repository: args.repository,
          token: args.token,
        });
      })();

  const [, configJson, configYaml, mdx, mdxIndex] = await Promise.all([
    repoMetadataPromise,
    fetchText(
      getJsDelivrUrl({
        owner: args.owner,
        repository: args.repository,
        ref: resolvedSha,
        path: "docs.json",
      }),
    ),
    fetchText(
      getJsDelivrUrl({
        owner: args.owner,
        repository: args.repository,
        ref: resolvedSha,
        path: "docs.yaml",
      }),
    ),
    fetchText(
      getJsDelivrUrl({
        owner: args.owner,
        repository: args.repository,
        ref: resolvedSha,
        path: `${absolutePath}.mdx`,
      }),
    ),
    fetchText(
      getJsDelivrUrl({
        owner: args.owner,
        repository: args.repository,
        ref: resolvedSha,
        path: `${indexPath}.mdx`,
      }),
    ),
  ]);
  requestCount += 4;

  const md = mdxIndex || mdx;
  const mdPath = mdxIndex ? `${indexPath}.mdx` : `${absolutePath}.mdx`;

  return {
    durationMs: nowMs() - started,
    requestCount,
    bytes:
      utf8ByteLength(configJson) +
      utf8ByteLength(configYaml) +
      utf8ByteLength(mdx) +
      utf8ByteLength(mdxIndex),
    resolvedRef,
    resolvedSha,
    mdPath,
    hasMd: Boolean(md),
  };
}

async function benchGraphQLFlow(args: {
  owner: string;
  repository: string;
  requestedRef?: string;
  path: string;
  token: string;
}): Promise<GraphQLStats> {
  const started = nowMs();
  const ref = args.requestedRef ?? "HEAD";
  const absolutePath = `docs/${args.path}`;
  const indexPath = `docs/${args.path}/index`;
  const query = `
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
      rateLimit {
        cost
        remaining
      }
    }
  `;

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${args.token}`,
    },
    body: JSON.stringify({
      query,
      variables: {
        owner: args.owner,
        repository: args.repository,
        configJson: `${ref}:docs.json`,
        configYaml: `${ref}:docs.yaml`,
        mdx: `${ref}:${absolutePath}.mdx`,
        mdxIndex: `${ref}:${indexPath}.mdx`,
      },
    }),
  });

  const body = (await response.json()) as {
    data?: {
      repository?: {
        configJson?: { text?: string };
        configYaml?: { text?: string };
        mdx?: { text?: string };
        mdxIndex?: { text?: string };
      } | null;
      rateLimit?: { cost?: number };
    };
    errors?: Array<{ message?: string }>;
  };

  if (!response.ok || body.errors?.length) {
    throw new Error(
      `GraphQL request failed (${response.status}): ${JSON.stringify(body.errors ?? body)}`,
    );
  }

  const repository = body.data?.repository;
  const md = repository?.mdxIndex?.text || repository?.mdx?.text;
  const mdPath = repository?.mdxIndex?.text
    ? `${indexPath}.mdx`
    : `${absolutePath}.mdx`;

  return {
    durationMs: nowMs() - started,
    requestCount: 1,
    gqlCost: body.data?.rateLimit?.cost ?? 0,
    bytes:
      utf8ByteLength(repository?.configJson?.text) +
      utf8ByteLength(repository?.configYaml?.text) +
      utf8ByteLength(repository?.mdx?.text) +
      utf8ByteLength(repository?.mdxIndex?.text),
    mdPath,
    hasMd: Boolean(md),
  };
}

function average(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function formatMs(ms: number) {
  return `${ms.toFixed(1)}ms`;
}

async function buildRequestedRefModes(args: {
  owner: string;
  repository: string;
  requestedRef?: string;
  token: string;
}): Promise<RequestedRefMode[]> {
  if (args.requestedRef) {
    return [
      {
        label: args.requestedRef,
        requestedRef: args.requestedRef,
      },
    ];
  }

  const repoMeta = await getRepositoryMetadata({
    owner: args.owner,
    repository: args.repository,
    token: args.token,
  });
  const defaultSha = await resolveRefToSha({
    owner: args.owner,
    repository: args.repository,
    ref: repoMeta.defaultBranch,
    token: args.token,
  });

  return [
    { label: "HEAD" },
    { label: repoMeta.defaultBranch, requestedRef: repoMeta.defaultBranch },
    { label: defaultSha, requestedRef: defaultSha },
  ];
}

async function run() {
  const args = parseArgs(process.argv.slice(2));
  const token = getGitHubToken();
  const modes = await buildRequestedRefModes({
    owner: args.owner,
    repository: args.repository,
    requestedRef: args.ref,
    token,
  });

  console.log(
    `\nBenchmarking getGitHubContents() for ${args.owner}/${args.repository}`,
  );
  console.log(`Path: ${args.path}`);
  console.log(`Runs per mode: ${args.runs}`);
  console.log(`Modes: ${modes.map((mode) => mode.label).join(", ")}\n`);

  for (const mode of modes) {
    const currentResults: CurrentFlowStats[] = [];
    const gqlResults: GraphQLStats[] = [];

    console.log(`Mode: ${mode.label}`);

    for (let runIndex = 0; runIndex < args.runs; runIndex++) {
      const currentFirst = runIndex % 2 === 0;
      const label = `  Run ${runIndex + 1}/${args.runs}`;

      if (currentFirst) {
        const current = await benchCurrentFlow({
          owner: args.owner,
          repository: args.repository,
          requestedRef: mode.requestedRef,
          path: args.path,
          token,
        });
        currentResults.push(current);

        const gql = await benchGraphQLFlow({
          owner: args.owner,
          repository: args.repository,
          requestedRef: mode.requestedRef,
          path: args.path,
          token,
        });
        gqlResults.push(gql);

        console.log(
          `${label} current=${formatMs(current.durationMs)} gql=${formatMs(gql.durationMs)} resolvedSha=${current.resolvedSha.slice(0, 12)} gqlCost=${gql.gqlCost}`,
        );
      } else {
        const gql = await benchGraphQLFlow({
          owner: args.owner,
          repository: args.repository,
          requestedRef: mode.requestedRef,
          path: args.path,
          token,
        });
        gqlResults.push(gql);

        const current = await benchCurrentFlow({
          owner: args.owner,
          repository: args.repository,
          requestedRef: mode.requestedRef,
          path: args.path,
          token,
        });
        currentResults.push(current);

        console.log(
          `${label} gql=${formatMs(gql.durationMs)} current=${formatMs(current.durationMs)} resolvedSha=${current.resolvedSha.slice(0, 12)} gqlCost=${gql.gqlCost}`,
        );
      }
    }

    const currentAvg = average(
      currentResults.map((result) => result.durationMs),
    );
    const gqlAvg = average(gqlResults.map((result) => result.durationMs));
    const winner = currentAvg < gqlAvg ? "current" : "graphql";
    const deltaPct =
      (Math.abs(currentAvg - gqlAvg) / Math.max(currentAvg, gqlAvg)) * 100;

    console.table([
      {
        mode: mode.label,
        strategy: "current",
        avgMs: currentAvg.toFixed(1),
        avgRequests: average(
          currentResults.map((result) => result.requestCount),
        ).toFixed(1),
        avgBytes: average(currentResults.map((result) => result.bytes)).toFixed(
          1,
        ),
        hasMd: currentResults.every((result) => result.hasMd),
        mdPath: currentResults[0]?.mdPath ?? "",
      },
      {
        mode: mode.label,
        strategy: "graphql",
        avgMs: gqlAvg.toFixed(1),
        avgRequests: average(
          gqlResults.map((result) => result.requestCount),
        ).toFixed(1),
        avgBytes: average(gqlResults.map((result) => result.bytes)).toFixed(1),
        avgGqlCost: average(gqlResults.map((result) => result.gqlCost)).toFixed(
          1,
        ),
        hasMd: gqlResults.every((result) => result.hasMd),
        mdPath: gqlResults[0]?.mdPath ?? "",
      },
    ]);

    console.log(
      `Winner for ${mode.label}: ${winner} (${deltaPct.toFixed(1)}% faster)\n`,
    );
  }
}

await run();

export const __benchmarkGitHubContentsModule = true;
