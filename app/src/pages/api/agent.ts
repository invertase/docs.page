import { randomUUID } from "node:crypto";

import type { NextApiHandler } from "next";
import { z } from "zod";

const CreateAgentSchema = z.object({
  repo: z.string().trim().min(1),
  model: z.string().trim().min(1),
  apikey: z.string().trim().min(2),
  githubToken: z.string().trim().min(1),
  force: z.boolean().optional().default(false),
});

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const parsed = CreateAgentSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid request body." });
    }

    const { repo, model, apikey, githubToken, force } = parsed.data;
    const repoParts = parseRepo(repo);

    if (!repoParts) {
      return res
        .status(400)
        .json({ error: "`repo` must be in the form `org/name`." });
    }

    const adminCheck = await checkAdminAccess({
      owner: repoParts.owner,
      repo: repoParts.repo,
      githubToken,
    });

    if (!adminCheck.ok) {
      return res.status(adminCheck.status).json({ error: adminCheck.error });
    }

    const [{ encryptAgentPayload }, { getAgentStore }] = await Promise.all([
      import("@/server/agent/encryption"),
      import("@/server/agent/storage"),
    ]);
    const store = getAgentStore();
    const existingRecord = await store.getByRepo(repo);

    if (existingRecord && !force) {
      return res.status(409).json({
        error:
          "An API key has already been added for this repository. Re-run the command with --force to overwrite.",
      });
    }

    const id = randomUUID();
    const payload = encryptAgentPayload({ model, apikey });

    await store.set({
      repo,
      id,
      version: payload.version,
      encrypted: payload.encrypted,
    });

    return res.status(200).json({ id });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Failed to create an agent API key." });
  }
};

export default handler;

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
      error:
        "Unable to find that repository or access it with the provided GitHub token.",
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
