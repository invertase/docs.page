import { getAgentStore } from "@/server/agent/storage";

export async function checkRepositoryAgentConfig(args: {
  owner: string;
  repository: string;
}) {
  return await getAgentStore().getByRepo(`${args.owner}/${args.repository}`);
}
