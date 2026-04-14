import { randomUUID } from "node:crypto";

import { z } from "zod";
import { encryptAgentPayload } from "@/server/agent/encryption";
import { getAgentStore } from "@/server/agent/storage";

export const runtime = "nodejs";

const CreateAgentSchema = z.object({
  repo: z.string().trim().min(1),
  model: z.string().trim().min(1),
  apikey: z.string().trim().min(2),
  githubToken: z.string().trim().min(1),
  force: z.boolean().optional().default(false),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = CreateAgentSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Invalid request body." },
        { status: 400 },
      );
    }

    const { repo, model, apikey, githubToken, force } = parsed.data;
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
      return Response.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const store = getAgentStore();
    const existingRecord = await store.getByRepo(repo);

    if (existingRecord && !force) {
      return Response.json(
        {
          error:
            "An API key has already been added for this repository. Re-run the command with --force to overwrite.",
        },
        { status: 409 },
      );
    }

    const id = randomUUID();
    const payload = encryptAgentPayload({ model, apikey });

    await store.set({
      repo,
      id,
      version: payload.version,
      encrypted: payload.encrypted,
    });

    return Response.json({ id });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to create an agent API key." },
      { status: 500 },
    );
  }
}

function parseRepo(repo: string) {
  const [owner, name, ...rest] = repo.split("/");

  if (!owner || !name || rest.length > 0) {
    return null;
  }

  return {
    owner,
    repo: name,
  };
}

async function checkAdminAccess({
  owner,
  repo,
  githubToken,
}: {
  owner: string;
  repo: string;
  githubToken: string;
}) {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    method: "GET",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${githubToken}`,
      "User-Agent": "docs.page",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    cache: "no-store",
  });

  const payload = (await response.json().catch(() => null)) as unknown;

  if (response.status === 401) {
    return {
      ok: false as const,
      status: 401,
      error: "The provided GitHub token is invalid or expired.",
    };
  }

  if (response.status === 404) {
    return {
      ok: false as const,
      status: 404,
      error: "Unable to find that repository or access it with the provided GitHub token.",
    };
  }

  if (!response.ok) {
    return {
      ok: false as const,
      status: response.status,
      error: "Unable to verify GitHub repository permissions.",
    };
  }

  const isAdmin =
    isRecord(payload) &&
    isRecord(payload.permissions) &&
    payload.permissions.admin === true;

  if (!isAdmin) {
    return {
      ok: false as const,
      status: 403,
      error:
        "You are not an admin of this repository on GitHub. Ask an admin to create the agent, or use a GitHub token with admin access.",
    };
  }

  return {
    ok: true as const,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
