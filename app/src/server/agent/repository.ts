import { getAgentStore } from "@/server/agent/storage";
import { loadDocsConfigForResolvedSha } from "@/server/docs/source-dataset";
import { resolvePinnedGitHubSource } from "@/server/github/tree";

export async function checkRepositoryAgentConfig(args: {
  owner: string;
  repository: string;
}) {
  return await getAgentStore().getByRepo(`${args.owner}/${args.repository}`);
}

export async function getDefaultBranchDocsConfig(args: {
  owner: string;
  repository: string;
}) {
  const { source, resolvedSha } = await resolvePinnedGitHubSource({
    owner: args.owner,
    repository: args.repository,
  });

  return loadDocsConfigForResolvedSha({
    owner: source.owner,
    repository: source.repository,
    resolvedSha,
  });
}

export async function isAgentEnabledForRepository(args: {
  owner: string;
  repository: string;
  ref?: string | null;
}) {
  if (args.ref) {
    return false;
  }

  const agent = await checkRepositoryAgentConfig(args);

  if (!agent) {
    return false;
  }

  const config = await getDefaultBranchDocsConfig(args);

  return config.agent?.key === agent.id;
}
