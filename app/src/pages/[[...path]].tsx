import type { GetServerSideProps, InferGetServerSidePropsType } from "next";

import {
  DocsBundleErrorCard,
  DocsBundleSection,
  DocsDebugShell,
} from "@/components/docs-bundle-debug";
import type {
  DocsBundleApiErrorResponse,
  DocsBundleApiResponse,
  DocsBundleApiSuccessResponse,
} from "@/lib/docs-bundle-api";
import { buildDocsBundleApiPath } from "@/lib/docs-bundle-api";
import { incomingHttpHeadersToWebHeaders } from "@/lib/incoming-http-headers";
import {
  isRawDocRequestPath,
  resolveDocsRoute,
  resolveRawDocsRoute,
  type DocsRequestMode,
} from "@/lib/docs-routing";
import {
  DOCS_HTML_CACHE_CONTROL,
  RAW_DOC_CACHE_CONTROL,
} from "@/proxy";

type DocPageProps = {
  kind: "doc";
  route: {
    owner: string;
    repository: string;
    ref: string | null;
    docPath: string;
    requestMode: DocsRequestMode;
    publicPathname: string;
    canonicalPathname: string;
  };
  hasAgent: boolean;
  bundle: unknown;
};

type ErrorPageProps = {
  kind: "error";
  error: {
    name: string;
    message: string;
    source?: string;
  };
};

type RawPageProps = {
  kind: "raw";
};

type HomePageProps = {
  kind: "home";
};

type PageProps = DocPageProps | ErrorPageProps | RawPageProps | HomePageProps;

export const getServerSideProps = (async ({ params, req, res }) => {
  const raw = params?.path;
  const chunks = raw
    ? Array.isArray(raw)
      ? raw
      : [raw]
    : [];

  if (chunks.length === 0) {
    return {
      props: {
        kind: "home" as const,
      },
    };
  }

  if (chunks.length === 1) {
    return { notFound: true };
  }

  if (chunks[0]?.startsWith(".")) {
    return { notFound: true };
  }

  const [owner, repo, ...path] = chunks;
  const requestHeaders = incomingHttpHeadersToWebHeaders(req.headers);
  const requestUrl = new URL(req.url ?? "/", "http://docs.page");
  const isRawRequest = isRawDocRequestPath(requestUrl.pathname);

  if (isRawRequest) {
    const route = resolveRawDocsRoute({
      owner,
      repoSegment: repo,
      path,
      headers: requestHeaders,
    });
    const [{ getRawDocSource }, { BundlerError }] = await Promise.all([
      import("@/server/docs/raw"),
      import("@/server/docs/bundle"),
    ]);

    try {
      const source = await getRawDocSource({
        owner: route.owner,
        repository: route.repository,
        ref: route.ref ?? undefined,
        path: route.docPath,
      });

      res.setHeader("Content-Type", "text/markdown; charset=utf-8");
      res.setHeader("Cache-Control", RAW_DOC_CACHE_CONTROL);
      res.statusCode = 200;
      res.end(source.content);

      return {
        props: {
          kind: "raw" as const,
        },
      };
    } catch (error) {
      if (error instanceof BundlerError) {
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.setHeader("Cache-Control", RAW_DOC_CACHE_CONTROL);
        res.statusCode = error.code;
        res.end(error.message);

        return {
          props: {
            kind: "raw" as const,
          },
        };
      }

      throw error;
    }
  }

  const route = resolveDocsRoute({
    owner,
    repoSegment: repo,
    path,
    headers: requestHeaders,
  });

  res.setHeader(
    "Cache-Control",
    DOCS_HTML_CACHE_CONTROL,
  );

  const bundleApiPath = buildDocsBundleApiPath(route);
  const bundleResponse = await fetch(getRequestOrigin(req, requestUrl) + bundleApiPath, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });
  const bundlePayload = (await bundleResponse.json()) as DocsBundleApiResponse;

  if (!bundleResponse.ok || bundlePayload.code !== "OK") {
    const errorResponse = bundlePayload as DocsBundleApiErrorResponse;
    const error =
      typeof errorResponse.error === "string"
        ? { message: errorResponse.error }
        : errorResponse.error;

    return {
      props: {
        kind: "error" as const,
        error: {
          name: "BundleError",
          message: error.message,
          ...(error.source ? { source: error.source } : {}),
        },
      } satisfies ErrorPageProps,
    };
  }

  const successResponse = bundlePayload as DocsBundleApiSuccessResponse;

  return {
    props: {
      kind: "doc" as const,
      route: {
        owner: route.owner,
        repository: route.repository,
        ref: route.ref,
        docPath: route.docPath,
        requestMode: route.requestMode,
        publicPathname: route.publicPathname,
        canonicalPathname: route.canonicalPathname,
      },
      hasAgent: successResponse.hasAgent,
      bundle: successResponse.bundle,
    } satisfies DocPageProps,
  };
}) satisfies GetServerSideProps<PageProps>;

export default function RepoDocsCatchAllPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  if (props.kind === "raw") {
    return null;
  }

  if (props.kind === "home") {
    return (
      <main className="flex min-h-screen flex-1 items-center justify-center bg-zinc-50 px-6 dark:bg-black">
        <div className="rounded-lg border border-zinc-200 bg-white px-6 py-4 text-2xl font-semibold text-zinc-950 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50">
          Homepage
        </div>
      </main>
    );
  }

  if (props.kind === "error") {
    return <DocsBundleErrorCard error={props.error} />;
  }

  const { route, hasAgent, bundle } = props;

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
}

function getRequestOrigin(
  req: Parameters<GetServerSideProps>[0]["req"],
  fallbackUrl: URL,
) {
  const port = process.env.PORT?.trim() || "3000";

  if (process.env.NODE_ENV !== "production") {
    return `http://localhost:${port}`;
  }

  const railwayPublicDomain = process.env.RAILWAY_PUBLIC_DOMAIN?.trim();

  if (railwayPublicDomain) {
    return `https://${railwayPublicDomain}`;
  }

  throw new Error("No request origin found");
}
