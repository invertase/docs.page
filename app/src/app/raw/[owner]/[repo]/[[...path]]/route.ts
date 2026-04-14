import { resolveRawDocsRoute } from "@/lib/docs-routing";
import { getRawDocSource } from "@/server/docs/raw";
import { BundlerError } from "@/server/docs/bundle";

const DOCS_CACHE_CONTROL = "public, s-maxage=1, stale-while-revalidate=59";

type RouteProps = {
  params: Promise<{
    owner: string;
    repo: string;
    path?: string[];
  }>;
};

export async function GET(request: Request, { params }: RouteProps) {
  const { owner, repo, path } = await params;
  const route = resolveRawDocsRoute({
    owner,
    repoSegment: repo,
    path,
    headers: request.headers,
  });

  try {
    const source = await getRawDocSource({
      owner: route.owner,
      repository: route.repository,
      ref: route.ref ?? undefined,
      path: route.docPath,
    });

    return new Response(source.content, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Cache-Control": DOCS_CACHE_CONTROL,
      },
    });
  } catch (error) {
    if (error instanceof BundlerError) {
      return new Response(error.message, {
        status: error.code,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": DOCS_CACHE_CONTROL,
        },
      });
    }

    throw error;
  }
}
