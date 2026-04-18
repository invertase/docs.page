type GitHubTreeEntry = {
  path: string;
  sha: string;
  type: "blob" | "tree" | "commit";
};

type GitHubRecursiveTree = {
  truncated: boolean;
  tree: GitHubTreeEntry[];
};

type BenchArgs = {
  owner: string;
  repository: string;
  ref?: string;
  runs: number;
  gqlBatchSize: number;
  jsDelivrConcurrency: number;
};

type ProviderStats = {
  provider: "graphql" | "jsdelivr";
  durationMs: number;
  requestCount: number;
  bytes: number;
  loadedFiles: number;
  missingFiles: number;
  gqlCost?: number;
  jsDelivrCacheHits?: number;
};

const SHA_PATTERN = /^[a-f0-9]{40}$/i;
const DEFAULTS = {
  runs: 3,
  gqlBatchSize: 20,
  jsDelivrConcurrency: 16,
};

function parseArgs(argv: string[]): BenchArgs {
  const out: Partial<BenchArgs> = {
    runs: DEFAULTS.runs,
    gqlBatchSize: DEFAULTS.gqlBatchSize,
    jsDelivrConcurrency: DEFAULTS.jsDelivrConcurrency,
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

    if (part === "--ref" && next) {
      out.ref = next;
      i++;
      continue;
    }

    if (part === "--runs" && next) {
      out.runs = Number.parseInt(next, 10);
      i++;
      continue;
    }

    if (part === "--gql-batch" && next) {
      out.gqlBatchSize = Number.parseInt(next, 10);
      i++;
      continue;
    }

    if (part === "--js-concurrency" && next) {
      out.jsDelivrConcurrency = Number.parseInt(next, 10);
      i++;
    }
  }

  if (!out.owner || !out.repository) {
    throw new Error(
      "Usage: bun src/server/github/benchmark-doc-load.ts --owner <owner> --repo <repo> [--ref <ref>] [--runs 3] [--gql-batch 20] [--js-concurrency 16]",
    );
  }

  return {
    owner: out.owner,
    repository: out.repository,
    ref: out.ref,
    runs: Number.isFinite(out.runs) && (out.runs ?? 0) > 0 ? out.runs! : DEFAULTS.runs,
    gqlBatchSize:
      Number.isFinite(out.gqlBatchSize) && (out.gqlBatchSize ?? 0) > 0
        ? out.gqlBatchSize!
        : DEFAULTS.gqlBatchSize,
    jsDelivrConcurrency:
      Number.isFinite(out.jsDelivrConcurrency) && (out.jsDelivrConcurrency ?? 0) > 0
        ? out.jsDelivrConcurrency!
        : DEFAULTS.jsDelivrConcurrency,
  };
}

function getGitHubToken(): string {
  const token = process.env.GITHUB_PAT?.split(",").map((v) => v.trim()).find(Boolean);

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

function utf8ByteLength(input: string) {
  return Buffer.byteLength(input, "utf8");
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

async function resolveRefAndSha(args: {
  owner: string;
  repository: string;
  requestedRef?: string;
  token: string;
}) {
  const { owner, repository, requestedRef, token } = args;

  let resolvedRef = requestedRef ?? "HEAD";
  if (resolvedRef === "HEAD") {
    const repoMeta = await fetchGitHubJson<{ default_branch: string }>(
      `https://api.github.com/repos/${owner}/${repository}`,
      token,
    );
    resolvedRef = repoMeta.default_branch;
  }

  if (SHA_PATTERN.test(resolvedRef)) {
    return {
      resolvedRef,
      resolvedSha: resolvedRef,
    };
  }

  const commit = await fetchGitHubJson<{ sha: string }>(
    `https://api.github.com/repos/${owner}/${repository}/commits/${encodeURIComponent(resolvedRef)}`,
    token,
  );

  return {
    resolvedRef,
    resolvedSha: commit.sha,
  };
}

async function getGitHubRecursiveTreeBySha(args: {
  owner: string;
  repository: string;
  sha: string;
  token: string;
}): Promise<GitHubRecursiveTree> {
  const response = await fetchGitHubJson<{
    truncated: boolean;
    tree: Array<{ path?: string; sha?: string; type?: string }>;
  }>(
    `https://api.github.com/repos/${args.owner}/${args.repository}/git/trees/${args.sha}?recursive=1`,
    args.token,
  );

  return {
    truncated: response.truncated,
    tree: response.tree
      .filter(
        (entry): entry is { path: string; sha: string; type: "blob" | "tree" | "commit" } =>
          typeof entry.path === "string"
          && typeof entry.sha === "string"
          && (entry.type === "blob" || entry.type === "tree" || entry.type === "commit"),
      )
      .map((entry) => ({
        path: entry.path,
        sha: entry.sha,
        type: entry.type,
      })),
  };
}

function normalizeDocPath(sourcePath: string) {
  const relativePath = sourcePath.slice("docs/".length);

  if (relativePath === "index.mdx") {
    return { path: "index", isIndex: true };
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

function collectDocSourcePaths(tree: GitHubRecursiveTree) {
  const files = new Map<string, { path: string; sourcePath: string; isIndex: boolean }>();

  for (const entry of tree.tree) {
    if (entry.type !== "blob") {
      continue;
    }

    if (!entry.path.startsWith("docs/") || !entry.path.endsWith(".mdx")) {
      continue;
    }

    const normalized = normalizeDocPath(entry.path);
    const candidate = {
      path: normalized.path,
      sourcePath: entry.path,
      isIndex: normalized.isIndex,
    };
    const existing = files.get(candidate.path);

    if (!existing || (!existing.isIndex && candidate.isIndex)) {
      files.set(candidate.path, candidate);
    }
  }

  return [...files.values()]
    .sort((left, right) => left.path.localeCompare(right.path))
    .map((file) => file.sourcePath);
}

function chunk<T>(items: T[], chunkSize: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    out.push(items.slice(i, i + chunkSize));
  }
  return out;
}

async function benchGraphQL(args: {
  owner: string;
  repository: string;
  ref: string;
  paths: string[];
  token: string;
  batchSize: number;
}): Promise<ProviderStats> {
  const started = nowMs();
  let bytes = 0;
  let missingFiles = 0;
  let requestCount = 0;
  let gqlCost = 0;

  for (const paths of chunk(args.paths, args.batchSize)) {
    const varDefs = paths.map((_, index) => `$e${index}: String!`).join(", ");
    const fieldBlock = paths
      .map((_, index) => `b${index}: object(expression: $e${index}) { ... on Blob { text } }`)
      .join("\n");

    const query = `
      query BatchRepoBlobs($owner: String!, $repository: String!, ${varDefs}) {
        repository(owner: $owner, name: $repository) {
          ${fieldBlock}
        }
        rateLimit {
          cost
          remaining
        }
      }
    `;

    const variables: Record<string, string> = {
      owner: args.owner,
      repository: args.repository,
    };

    for (let index = 0; index < paths.length; index++) {
      variables[`e${index}`] = `${args.ref}:${paths[index]}`;
    }

    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${args.token}`,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });
    requestCount++;

    const body = (await response.json()) as {
      data?: {
        repository?: Record<string, { text?: string } | null> | null;
        rateLimit?: { cost?: number };
      };
      errors?: Array<{ message?: string }>;
    };

    if (!response.ok || body.errors?.length) {
      throw new Error(
        `GraphQL request failed (${response.status}): ${JSON.stringify(body.errors ?? body)}`,
      );
    }

    gqlCost += body.data?.rateLimit?.cost ?? 0;
    const repository = body.data?.repository;

    if (!repository) {
      missingFiles += paths.length;
      continue;
    }

    for (let index = 0; index < paths.length; index++) {
      const text = repository[`b${index}`]?.text;
      if (typeof text !== "string") {
        missingFiles++;
        continue;
      }
      bytes += utf8ByteLength(text);
    }
  }

  return {
    provider: "graphql",
    durationMs: nowMs() - started,
    requestCount,
    bytes,
    loadedFiles: args.paths.length - missingFiles,
    missingFiles,
    gqlCost,
  };
}

async function benchJsDelivr(args: {
  owner: string;
  repository: string;
  ref: string;
  paths: string[];
  concurrency: number;
}): Promise<ProviderStats> {
  const started = nowMs();
  let cursor = 0;
  let bytes = 0;
  let missingFiles = 0;
  let requestCount = 0;
  let jsDelivrCacheHits = 0;

  const workers = Array.from(
    { length: Math.max(1, Math.min(args.concurrency, args.paths.length)) },
    () => (async () => {
      while (true) {
        const nextIndex = cursor++;
        if (nextIndex >= args.paths.length) {
          return;
        }

        const path = args.paths[nextIndex];
        const url = `https://cdn.jsdelivr.net/gh/${args.owner}/${args.repository}@${encodeURIComponent(args.ref)}/${path}`;
        const response = await fetch(url);
        requestCount++;

        const cacheHeader = response.headers.get("x-cache");
        if (cacheHeader?.toUpperCase().includes("HIT")) {
          jsDelivrCacheHits++;
        }

        if (!response.ok) {
          missingFiles++;
          continue;
        }

        const text = await response.text();
        bytes += utf8ByteLength(text);
      }
    })(),
  );

  await Promise.all(workers);

  return {
    provider: "jsdelivr",
    durationMs: nowMs() - started,
    requestCount,
    bytes,
    loadedFiles: args.paths.length - missingFiles,
    missingFiles,
    jsDelivrCacheHits,
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

async function run() {
  const args = parseArgs(process.argv.slice(2));
  const token = getGitHubToken();

  console.log(`\nBenchmarking doc fetch providers for ${args.owner}/${args.repository}`);
  console.log(`Requested ref: ${args.ref ?? "HEAD"}`);
  console.log(
    `Runs: ${args.runs}, GraphQL batch: ${args.gqlBatchSize}, jsDelivr concurrency: ${args.jsDelivrConcurrency}`,
  );

  const resolveStarted = nowMs();
  const { resolvedRef, resolvedSha } = await resolveRefAndSha({
    owner: args.owner,
    repository: args.repository,
    requestedRef: args.ref,
    token,
  });
  const resolveDurationMs = nowMs() - resolveStarted;

  const treeStarted = nowMs();
  const tree = await getGitHubRecursiveTreeBySha({
    owner: args.owner,
    repository: args.repository,
    sha: resolvedSha,
    token,
  });
  const treeDurationMs = nowMs() - treeStarted;
  const paths = collectDocSourcePaths(tree);

  console.log(`Resolved ref: ${resolvedRef}`);
  console.log(`Resolved sha: ${resolvedSha}`);
  console.log(`Tree load: ${formatMs(treeDurationMs)} (resolve+tree total ${formatMs(resolveDurationMs + treeDurationMs)})`);
  console.log(`Docs files selected: ${paths.length}${tree.truncated ? " (tree truncated)" : ""}\n`);

  const allGraphQL: ProviderStats[] = [];
  const allJsDelivr: ProviderStats[] = [];

  for (let runIndex = 0; runIndex < args.runs; runIndex++) {
    const runLabel = `Run ${runIndex + 1}/${args.runs}`;
    const gqlFirst = runIndex % 2 === 0;
    console.log(`${runLabel} (${gqlFirst ? "GraphQL first" : "jsDelivr first"})`);

    if (gqlFirst) {
      const gql = await benchGraphQL({
        owner: args.owner,
        repository: args.repository,
        ref: resolvedSha,
        paths,
        token,
        batchSize: args.gqlBatchSize,
      });
      allGraphQL.push(gql);
      console.log(
        `  GraphQL  ${formatMs(gql.durationMs)} | requests=${gql.requestCount} | loaded=${gql.loadedFiles}/${paths.length} | gqlCost=${gql.gqlCost ?? 0}`,
      );

      const jsd = await benchJsDelivr({
        owner: args.owner,
        repository: args.repository,
        ref: resolvedSha,
        paths,
        concurrency: args.jsDelivrConcurrency,
      });
      allJsDelivr.push(jsd);
      console.log(
        `  jsDelivr ${formatMs(jsd.durationMs)} | requests=${jsd.requestCount} | loaded=${jsd.loadedFiles}/${paths.length} | cacheHits=${jsd.jsDelivrCacheHits ?? 0}`,
      );
    } else {
      const jsd = await benchJsDelivr({
        owner: args.owner,
        repository: args.repository,
        ref: resolvedSha,
        paths,
        concurrency: args.jsDelivrConcurrency,
      });
      allJsDelivr.push(jsd);
      console.log(
        `  jsDelivr ${formatMs(jsd.durationMs)} | requests=${jsd.requestCount} | loaded=${jsd.loadedFiles}/${paths.length} | cacheHits=${jsd.jsDelivrCacheHits ?? 0}`,
      );

      const gql = await benchGraphQL({
        owner: args.owner,
        repository: args.repository,
        ref: resolvedSha,
        paths,
        token,
        batchSize: args.gqlBatchSize,
      });
      allGraphQL.push(gql);
      console.log(
        `  GraphQL  ${formatMs(gql.durationMs)} | requests=${gql.requestCount} | loaded=${gql.loadedFiles}/${paths.length} | gqlCost=${gql.gqlCost ?? 0}`,
      );
    }
  }

  const gqlAvgMs = average(allGraphQL.map((item) => item.durationMs));
  const jsdAvgMs = average(allJsDelivr.map((item) => item.durationMs));
  const gqlAvgCost = average(allGraphQL.map((item) => item.gqlCost ?? 0));
  const jsdAvgHits = average(allJsDelivr.map((item) => item.jsDelivrCacheHits ?? 0));

  console.log("\nAverage results:");
  console.table([
    {
      provider: "GraphQL",
      avgMs: gqlAvgMs.toFixed(1),
      avgRequests: average(allGraphQL.map((item) => item.requestCount)).toFixed(1),
      avgLoadedFiles: average(allGraphQL.map((item) => item.loadedFiles)).toFixed(1),
      avgMissingFiles: average(allGraphQL.map((item) => item.missingFiles)).toFixed(1),
      avgBytes: average(allGraphQL.map((item) => item.bytes)).toFixed(1),
      avgGqlCost: gqlAvgCost.toFixed(1),
    },
    {
      provider: "jsDelivr",
      avgMs: jsdAvgMs.toFixed(1),
      avgRequests: average(allJsDelivr.map((item) => item.requestCount)).toFixed(1),
      avgLoadedFiles: average(allJsDelivr.map((item) => item.loadedFiles)).toFixed(1),
      avgMissingFiles: average(allJsDelivr.map((item) => item.missingFiles)).toFixed(1),
      avgBytes: average(allJsDelivr.map((item) => item.bytes)).toFixed(1),
      avgCacheHits: jsdAvgHits.toFixed(1),
    },
  ]);

  const faster = gqlAvgMs < jsdAvgMs ? "GraphQL" : "jsDelivr";
  const deltaPct = Math.abs(gqlAvgMs - jsdAvgMs) / Math.max(gqlAvgMs, jsdAvgMs) * 100;
  console.log(`\nWinner by average wall time: ${faster} (${deltaPct.toFixed(1)}% faster)\n`);
}

await run();

export const __benchmarkDocLoadModule = true;
