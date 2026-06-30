import { createAgentUIStreamResponse, stepCountIs, ToolLoopAgent } from "ai";
import { createBashTool } from "bash-tool";
import type { InitialFiles } from "just-bash";
import { Bash } from "just-bash";
import {
  RateLimiterMemory,
  RateLimiterRedis,
  RateLimiterRes,
} from "rate-limiter-flexible";
import { z } from "zod";
import { anonymizeIp, getPostHogClient } from "@/lib/posthog";
import { getRequestClientIp } from "@/lib/request-client-ip";
import { decryptAgentPayload } from "@/server/agent/encryption";
import { checkAdminAccess, parseRepo } from "@/server/agent/github-admin";
import { getModelForProvider, getProvider } from "@/server/agent/providers";
import { getDefaultBranchDocsConfig } from "@/server/agent/repository";
import {
  AGENT_SESSION_COOKIE_NAME,
  AGENT_SESSION_HEADER_NAME,
  parseCookies,
  verifyAgentCsrfToken,
  verifyAgentSession,
} from "@/server/agent/session";
import { getAgentStore } from "@/server/agent/storage";
import { BundlerError } from "@/server/docs/bundle";
import { getGitHubFileSourcesBatch } from "@/server/github/contents";
import {
  type GitHubDocFileList,
  listGitHubDocFiles,
} from "@/server/github/tree";
import { getRedisClient } from "@/server/redis";

const AgentRequestSchema = z.object({
  messages: z.array(z.any()),
});

const DeleteAgentSchema = z.object({
  repo: z.string().trim().min(1),
  githubToken: z.string().trim().min(1),
});

const AGENT_RATE_LIMIT_DURATION_SECONDS = 60 * 60;
const REPO_RATE_LIMIT_KEY_PREFIX = "repo:";

const SYSTEM_INSTRUCTIONS = (
  repo: string,
) => `You are a documentation agent helping users of public documentation for the ${repo} GitHub repository with their questions.

You have access to all of the users documentation for the repository as raw MDX files. The docs are mounted in the sandbox under \`/docs\` (for example \`/docs/index.mdx\`). Use the bash tool to search the repository and answer their question.

**Important**:

- Always use the bash tool to search the repository for information. You must always call the tool until completing the task.
- If the user asks you a question unrelated to documentation, refuse to answer and revert the conversation back to the user about helping with documentation.

You have access to bash commands, such as:

- tree - output the directory structure of the documentation files
- ls - list the files in the repository
- cat - read the contents of a file
- grep - search the contents of a file for a string
- find - search the repository for a file

When referencing files, always provide the relative URL to the file as markdown links, for example:
1. /docs/index.mdx -> [Documentation](/)
2. /docs/getting-started/index.mdx -> [Getting Started](/getting-started)
`;

export async function DELETE(req: Request) {
  try {
    const parsed = DeleteAgentSchema.safeParse(await req.json());

    if (!parsed.success) {
      return Response.json({ error: "Invalid request body." }, { status: 400 });
    }

    const { repo, githubToken } = parsed.data;
    const repoParts = parseRepo(repo);

    if (!repoParts) {
      return Response.json(
        { error: "`repo` must be in the form `org/name`." },
        { status: 400 },
      );
    }

    const adminCheck = await checkAdminAccess({
      owner: repoParts.owner,
      repo: repoParts.repo,
      githubToken,
    });

    if (!adminCheck.ok) {
      return Response.json(
        { error: adminCheck.error },
        { status: adminCheck.status },
      );
    }

    const store = getAgentStore();
    const existingRecord = await store.getByRepo(repo);

    if (!existingRecord) {
      return Response.json({ error: "Agent not found." }, { status: 404 });
    }

    await store.deleteByRepo(repo);

    getPostHogClient().capture({
      distinctId: repo,
      event: "agent:registration_remove",
      properties: {
        owner: repoParts.owner,
        repository: repoParts.repo,
        $process_person_profile: false,
      },
    });

    return Response.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to delete the agent API key." },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const cookies = parseCookies(req.headers.get("cookie") ?? undefined);
  const sessionToken = cookies[AGENT_SESSION_COOKIE_NAME];
  const session = sessionToken ? await verifyAgentSession(sessionToken) : null;

  if (!session) {
    return Response.json(
      {
        error:
          "Invalid, missing, or expired agent session. Refresh the page and try again.",
      },
      { status: 401 },
    );
  }

  const sessionHeader = req.headers.get(
    AGENT_SESSION_HEADER_NAME.toLowerCase(),
  );

  if (!sessionHeader || !verifyAgentCsrfToken(session.sid, sessionHeader)) {
    return Response.json(
      { error: "Invalid agent session header." },
      { status: 403 },
    );
  }

  const parsedBody = AgentRequestSchema.safeParse(await req.json());

  if (!parsedBody.success) {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const ip = getRequestClientIp(req);

  if (!ip) {
    return Response.json(
      { error: "Unable to determine request origin." },
      { status: 400 },
    );
  }

  const { messages } = parsedBody.data;
  const repoSlug = `${session.owner}/${session.repo}`;
  const defaultBranchConfig = await getDefaultBranchDocsConfig({
    owner: session.owner,
    repository: session.repo,
  });
  const redisClient = await getRedisClient();

  const ipLimiter = createAgentRateLimiter({
    redisClient,
    points: defaultBranchConfig.agent.limits.ip,
    duration: AGENT_RATE_LIMIT_DURATION_SECONDS,
  });
  const repoLimiter = createAgentRateLimiter({
    redisClient,
    points: defaultBranchConfig.agent.limits.repo,
    duration: AGENT_RATE_LIMIT_DURATION_SECONDS,
  });

  const ipLimit = await consumeAgentRateLimit({
    limiter: ipLimiter,
    key: ip,
    exceededMessage: "Rate limit exceeded.",
    failureMessage: "Unable to rate limit request.",
  });

  if (ipLimit.response) {
    getPostHogClient().capture({
      distinctId: anonymizeIp(ip),
      event: "agent:request_limit",
      properties: {
        owner: session.owner,
        repository: session.repo,
        limit_type: "ip",
        $process_person_profile: false,
      },
    });
    return ipLimit.response;
  }

  const repoLimit = await consumeAgentRateLimit({
    limiter: repoLimiter,
    key: `${REPO_RATE_LIMIT_KEY_PREFIX}${repoSlug}:hourly`,
    exceededMessage: "Repository agent hourly rate limit exceeded.",
    failureMessage: "Unable to rate limit request.",
  });

  if (repoLimit.response) {
    getPostHogClient().capture({
      distinctId: repoSlug,
      event: "agent:request_limit",
      properties: {
        owner: session.owner,
        repository: session.repo,
        limit_type: "repo",
        $process_person_profile: false,
      },
    });
    return repoLimit.response;
  }

  const config = await getAgentStore()
    .getByRepo(repoSlug)
    .catch(() => null);

  if (!config) {
    return Response.json({ error: "Agent not found." }, { status: 404 });
  }

  if (defaultBranchConfig.agent.key !== config.id) {
    return Response.json(
      { error: "Agent is not enabled for this repository." },
      { status: 403 },
    );
  }

  const { provider, apikey } = decryptAgentPayload(config.encrypted);

  const instance = getProvider(provider, apikey);

  if (!instance) {
    return Response.json({ error: "Invalid provider." }, { status: 400 });
  }

  const modelName = getModelForProvider(provider);

  if (!modelName) {
    return Response.json(
      { error: "No model configured for provider." },
      { status: 400 },
    );
  }

  let docList: GitHubDocFileList | undefined;

  try {
    docList = await listGitHubDocFiles({
      owner: session.owner,
      repository: session.repo,
    });
  } catch (error) {
    if (error instanceof BundlerError) {
      return Response.json({ error: error.message }, { status: error.code });
    }

    throw error;
  }

  if (!docList) {
    return Response.json(
      { error: "Documentation files not found." },
      { status: 404 },
    );
  }

  const blobs = await getGitHubFileSourcesBatch({
    owner: docList.source.owner,
    repository: docList.source.repository,
    resolvedSha: docList.resolvedSha,
    paths: docList.files.map((file) => file.sourcePath),
  });

  const fileEntries = docList.files.flatMap((file) => {
    const content = blobs.get(file.sourcePath);

    if (content == null) {
      return [];
    }

    return [[`/${file.sourcePath}`, content] as const];
  });
  const files: InitialFiles = Object.fromEntries(fileEntries);

  const env = new Bash({
    files,
  });

  const bashToolkit = await createBashTool({
    destination: "/docs",
    sandbox: env,
  });

  const agent = new ToolLoopAgent({
    model: instance(modelName),
    instructions: SYSTEM_INSTRUCTIONS(repoSlug),
    tools: {
      bash: bashToolkit.tools.bash as never,
    },
    stopWhen: stepCountIs(20),
  });

  getPostHogClient().capture({
    distinctId: anonymizeIp(ip),
    event: "agent:message_send",
    properties: {
      owner: session.owner,
      repository: session.repo,
      provider,
      message_count: messages.length,
      $process_person_profile: false,
    },
  });

  return createAgentUIStreamResponse({
    agent,
    uiMessages: messages,
    headers: {
      "X-RateLimit-Limit": String(defaultBranchConfig.agent.limits.ip),
      "X-RateLimit-Remaining": String(ipLimit.limiter.remainingPoints),
      "X-RateLimit-Reset": String(getRateLimitReset(ipLimit.limiter)),
      "X-Repo-RateLimit-Hourly-Limit": String(
        defaultBranchConfig.agent.limits.repo,
      ),
      "X-Repo-RateLimit-Hourly-Remaining": String(
        repoLimit.limiter.remainingPoints,
      ),
      "X-Repo-RateLimit-Hourly-Reset": String(
        getRateLimitReset(repoLimit.limiter),
      ),
    },
  });
}

function createAgentRateLimiter({
  redisClient,
  points,
  duration,
}: {
  redisClient: Awaited<ReturnType<typeof getRedisClient>>;
  points: number;
  duration: number;
}) {
  return redisClient
    ? new RateLimiterRedis({
        storeClient: redisClient,
        useRedisPackage: true,
        points,
        duration,
      })
    : new RateLimiterMemory({
        points,
        duration,
      });
}

async function consumeAgentRateLimit({
  limiter,
  key,
  exceededMessage,
  failureMessage,
}: {
  limiter: RateLimiterRedis | RateLimiterMemory;
  key: string;
  exceededMessage: string;
  failureMessage: string;
}): Promise<
  | {
      limiter: RateLimiterRes;
      response?: undefined;
    }
  | {
      limiter?: undefined;
      response: Response;
    }
> {
  try {
    return {
      limiter: await limiter.consume(key, 1),
    };
  } catch (error) {
    if (error instanceof RateLimiterRes) {
      return {
        response: Response.json({ error: exceededMessage }, { status: 429 }),
      };
    }

    return {
      response: Response.json({ error: failureMessage }, { status: 500 }),
    };
  }
}

function getRateLimitReset(limiter: RateLimiterRes) {
  return Math.round((Date.now() + limiter.msBeforeNext) / 1000);
}
