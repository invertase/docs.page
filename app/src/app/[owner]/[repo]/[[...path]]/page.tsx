import { headers } from "next/headers";
import { resolveDocsRoute } from "@/lib/docs-routing";
import { BundlerError, getDocBundle } from "@/server/docs/bundle";

type PageProps = {
  params: Promise<{
    owner: string;
    repo: string;
    path?: string[];
  }>;
};

export default async function RepoDocPage({ params }: PageProps) {
  const [{ owner, repo, path }, requestHeaders] = await Promise.all([params, headers()]);
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

    return (
      <main className="flex min-h-screen flex-1 justify-center bg-zinc-50 px-6 py-16 dark:bg-black">
        <div className="flex w-full max-w-4xl flex-col gap-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <header className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
              Documentation route
            </p>
            <h1 className="text-3xl font-semibold text-zinc-950 dark:text-zinc-50">
              {route.owner}/{route.repository}
            </h1>
            <div className="space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
              <p>Ref: {route.ref ?? "(default branch)"}</p>
              <p>Path: {route.docPath || "(root document)"}</p>
              <p>Request mode: {route.requestMode}</p>
              <p>Public pathname: {route.publicPathname}</p>
              <p>Canonical pathname: {route.canonicalPathname}</p>
            </div>
          </header>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
              Bundle data
            </h2>
            <pre className="overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">
              {JSON.stringify(bundle, null, 2)}
            </pre>
          </section>
        </div>
      </main>
    );
  } catch (error) {
    if (error instanceof BundlerError) {
      return (
        <main className="flex min-h-screen flex-1 justify-center bg-zinc-50 px-6 py-16 dark:bg-black">
          <div className="flex w-full max-w-3xl flex-col gap-4 rounded-xl border border-red-200 bg-white p-6 shadow-sm dark:border-red-950 dark:bg-zinc-950">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-red-600 dark:text-red-400">
              Bundle error
            </p>
            <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
              {error.name}
            </h1>
            <p className="text-sm text-zinc-700 dark:text-zinc-300">{error.message}</p>
            {error.source ? (
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Source: {error.source}</p>
            ) : null}
          </div>
        </main>
      );
    }

    throw error;
  }
}
