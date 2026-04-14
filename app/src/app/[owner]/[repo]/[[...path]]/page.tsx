import { headers } from "next/headers";
import {
  DocsBundleErrorCard,
  DocsBundleSection,
  DocsDebugShell,
} from "@/components/docs-bundle-debug";
import { resolveDocsRoute } from "@/lib/docs-routing";
import { checkRepositoryAgentConfig } from "@/server/agent/repository";
import { BundlerError, getDocBundle } from "@/server/docs/bundle";

type PageProps = {
  params: Promise<{
    owner: string;
    repo: string;
    path?: string[];
  }>;
};

export default async function RepoDocPage({ params }: PageProps) {
  const [{ owner, repo, path }, requestHeaders] = await Promise.all([
    params,
    headers(),
  ]);

  const route = resolveDocsRoute({
    owner,
    repoSegment: repo,
    path,
    headers: requestHeaders,
  });

  try {
    const bundle = await getDocBundle({
      owner: route.owner,
      repository: route.repository,
      ref: route.ref ?? undefined,
      path: route.docPath || "index",
    });

    const hasAgent = bundle.config.agent
      ? await checkRepositoryAgentConfig({
          owner: route.owner,
          repository: route.repository,
          token: bundle.config.agent,
        })
      : false;

    return (
      <DocsDebugShell
        eyebrow="Documentation route"
        title={`${route.owner}/${route.repository}`}
        rows={[
          { label: "Ref", value: route.ref ?? "(default branch)" },
          { label: "Path", value: route.docPath || "(root document)" },
          { label: "Request mode", value: route.requestMode },
          { label: "Public pathname", value: route.publicPathname },
          { label: "Canonical pathname", value: route.canonicalPathname },
          { label: "Has agent", value: hasAgent ? "Yes" : "No" },
        ]}
      >
        <DocsBundleSection bundle={bundle} />
      </DocsDebugShell>
    );
  } catch (error) {
    if (error instanceof BundlerError) {
      return <DocsBundleErrorCard error={error} />;
    }

    throw error;
  }
}
