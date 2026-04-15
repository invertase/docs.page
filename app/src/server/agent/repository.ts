import { getAgentStore } from "@/server/agent/storage";

export async function checkRepositoryAgentConfig(args: {
  owner: string;
  repository: string;
  token: string;
}) : Promise<boolean> {
  const startedAt = Date.now();
  const token = args.token.trim();

  if (!token) {
    logAgentRepositoryEvent("empty-token", {
      owner: args.owner,
      repository: args.repository,
      elapsedMs: Date.now() - startedAt,
    });
    return false;
  }

  const recordStartedAt = Date.now();
  const record = await getAgentStore().getByRepo(
    `${args.owner}/${args.repository}`,
  );
  const recordElapsedMs = Date.now() - recordStartedAt;

  if (!record || record.id !== token) {
    logAgentRepositoryEvent("lookup-miss", {
      owner: args.owner,
      repository: args.repository,
      recordElapsedMs,
      elapsedMs: Date.now() - startedAt,
    });
    return false;
  }

  logAgentRepositoryEvent("lookup-hit", {
    owner: args.owner,
    repository: args.repository,
    recordElapsedMs,
    elapsedMs: Date.now() - startedAt,
  });

  return true;
}

function logAgentRepositoryEvent(
  event: string,
  extra: Record<string, number | string>,
) {
  console.info("[docs.agent.repository]", event, extra);
}
