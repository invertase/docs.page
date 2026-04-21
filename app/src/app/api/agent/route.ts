import { z } from "zod";
import {
  RateLimiterMemory,
  RateLimiterRedis,
  RateLimiterRes,
} from "rate-limiter-flexible";
import { createBashTool } from "bash-tool";
import { Bash } from "just-bash";
import { ToolLoopAgent, createAgentUIStreamResponse, stepCountIs } from "ai";
import { getAgentStore } from "@/server/agent/storage";
import { decryptAgentPayload } from "@/server/agent/encryption";
import { getProvider } from "@/server/agent/providers";
import {
  AGENT_SESSION_COOKIE_NAME,
  AGENT_SESSION_HEADER_NAME,
  parseCookies,
  verifyAgentCsrfToken,
  verifyAgentSession,
} from "@/server/agent/session";
import { getRedisClient } from "@/server/redis";
import type { InitialFiles } from "just-bash";
import { getRawDocSource } from "@/server/docs/raw";
import { listGitHubDocFiles } from "@/server/github/tree";

const AgentRequestSchema = z.object({
  messages: z.array(z.any()),
});

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
`;

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

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();

  if (!ip) {
    return Response.json(
      { error: "Unable to determine request origin." },
      { status: 400 },
    );
  }

  const redisClient = await getRedisClient();
  const rateLimiter = redisClient
    ? new RateLimiterRedis({
        storeClient: redisClient,
        useRedisPackage: true,
        points: 200,
        duration: 3600,
      })
    : new RateLimiterMemory({
        points: 200,
        duration: 3600,
      });

  let limiter: RateLimiterRes | null = null;

  try {
    limiter = await rateLimiter.consume(ip, 1);
  } catch (error) {
    if (error instanceof RateLimiterRes) {
      return Response.json({ error: "Rate limit exceeded." }, { status: 429 });
    }

    return Response.json(
      { error: "Unable to rate limit request." },
      { status: 500 },
    );
  }

  const { messages } = parsedBody.data;
  const repoSlug = `${session.owner}/${session.repo}`;

  const config = await getAgentStore()
    .getByRepo(repoSlug)
    .catch(() => null);

  if (!config) {
    return Response.json({ error: "Agent not found." }, { status: 404 });
  }

  const { provider, modelName, apikey } = decryptAgentPayload(config.encrypted);

  const instance = getProvider(provider, apikey);

  if (!instance) {
    return Response.json({ error: "Invalid provider." }, { status: 400 });
  }

  const docList = await listGitHubDocFiles({
    owner: session.owner,
    repository: session.repo,
  });

  if (!docList) {
    return Response.json(
      { error: "Documentation files not found." },
      { status: 404 },
    );
  }

  const fileEntries = await Promise.all(
    docList.files.map(async (file) => {
      const source = await getRawDocSource({
        owner: docList.source.owner,
        repository: docList.source.repository,
        ref: docList.source.ref,
        path: file.path,
      });

      return [`/${file.sourcePath}`, source.content] as const;
    }),
  );
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

  return createAgentUIStreamResponse({
    agent,
    uiMessages: messages,
    headers: {
      "X-RateLimit-Limit": "1",
      "X-RateLimit-Remaining": String(limiter?.remainingPoints ?? 0),
      "X-RateLimit-Reset": String(
        Math.round((Date.now() + (limiter?.msBeforeNext ?? 0)) / 1000),
      ),
    },
  });
}
