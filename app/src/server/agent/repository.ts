import { getAgentStore } from "@/server/agent/storage";

export async function checkRepositoryAgentConfig(args: {
  owner: string;
  repository: string;
  token: string;
}) : Promise<boolean> {
  const token = args.token.trim();

  if (!token) {
    return false;
  }

  const record = await getAgentStore().getByRepo(
    `${args.owner}/${args.repository}`,
  );

  if (!record || record.id !== token) {
    return false;
  }

  return true;
}
