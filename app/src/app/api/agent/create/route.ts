import { randomUUID } from "node:crypto";
import { z } from "zod";
import {
  AgentCredentialsDecryptionError,
  decryptAgentCredentialsJwe,
} from "@/server/agent/credentials-jwe";
import { encryptAgentPayload } from "@/server/agent/encryption";
import { checkAdminAccess, parseRepo } from "@/server/agent/github-admin";
import { getAgentStore } from "@/server/agent/storage";
import { getPostHogClient } from "@/lib/posthog";

const CreateAgentSchema = z.object({
  repo: z.string().trim().min(1),
  credentials: z.string().trim().min(1),
  githubToken: z.string().trim().min(1),
  force: z.boolean().optional().default(false),
});

export async function POST(req: Request) {
  try {
    const parsed = CreateAgentSchema.safeParse(await req.json());

    if (!parsed.success) {
      return Response.json({ error: "Invalid request body." }, { status: 400 });
    }

    const { repo, credentials, githubToken, force } = parsed.data;
    const repoParts = parseRepo(repo);

    if (!repoParts) {
      return Response.json(
        { error: "`repo` must be in the form `org/name`." },
        { status: 400 },
      );
    }

    const { provider, apikey } = await decryptAgentCredentialsJwe(credentials);

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

    if (existingRecord && !force) {
      return Response.json(
        {
          error:
            "An API key has already been added for this repository. Re-run the command with --force to overwrite.",
        },
        { status: 409 },
      );
    }

    const id = existingRecord?.id ?? randomUUID();
    const payload = encryptAgentPayload({ provider, apikey });

    await store.set({
      repo,
      id,
      version: payload.version,
      encrypted: payload.encrypted,
    });

    getPostHogClient().capture({
      distinctId: repo,
      event: "agent registered",
      properties: {
        owner: repoParts.owner,
        repository: repoParts.repo,
        provider,
        is_update: Boolean(existingRecord),
        $process_person_profile: false,
      },
    });

    return Response.json({ id }, { status: 200 });
  } catch (error) {
    if (error instanceof AgentCredentialsDecryptionError) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    console.error(error);
    return Response.json(
      { error: "Failed to create an agent API key." },
      { status: 500 },
    );
  }
}
