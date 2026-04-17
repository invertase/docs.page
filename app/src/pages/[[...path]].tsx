import type { GetServerSideProps, InferGetServerSidePropsType } from "next";

import type {
  DocsBundleApiErrorResponse,
  DocsBundleApiResponse,
  DocsBundleApiSuccessResponse,
} from "@/lib/docs-bundle-api";
import {
  isRawDocRequestPath,
  resolveDocsRoute,
  resolveRawDocsRoute,
} from "@/lib/docs-routing";
import { buildDocsBundleApiPath } from "@/lib/docs-bundle-api";
import { getRequestOrigin } from "@/lib/docs-environment";
import { resolveFrontmatterRedirectDestination } from "@/lib/docs-redirect";
import {
  acceptPrefersMarkdown,
  incomingHttpHeadersToWebHeaders,
} from "@/lib/incoming-http-headers";
import {
  DOCS_HTML_CACHE_HEADERS,
  RAW_DOC_CACHE_HEADERS,
  setDocsCacheHeaders,
} from "@/proxy";
import type { DocPageProps, ErrorPageProps, PageProps } from "@/lib/types";
import { DocsBundleErrorCard, DocsDebug } from "@/components/docs-debug";
import { Docs } from "@/components/docs";
import { DocPageContext } from "@/hooks/use-doc-page-context";

export const getServerSideProps = (async ({ params, req, res, query }) => {
  const raw = params?.path;
  const chunks = raw ? (Array.isArray(raw) ? raw : [raw]) : [];

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
      setDocsCacheHeaders(res, RAW_DOC_CACHE_HEADERS);
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
        setDocsCacheHeaders(res, RAW_DOC_CACHE_HEADERS);
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

  const accept = Array.isArray(req.headers.accept)
    ? req.headers.accept.join(", ")
    : req.headers.accept;

  // Client-side navigations fetch `/_next/data/*.json` with `Accept: */*`. Our markdown
  // negotiator treats `*/*` as preferring markdown (same weight as HTML), which would
  // send raw markdown in the response body and break JSON parsing — blank page.
  if (
    !requestUrl.pathname.startsWith("/_next/") &&
    acceptPrefersMarkdown(accept)
  ) {
    const [{ getRawDocSource }, { BundlerError }] = await Promise.all([
      import("@/server/docs/raw"),
      import("@/server/docs/bundle"),
    ]);

    try {
      const source = await getRawDocSource({
        owner: route.owner,
        repository: route.repository,
        ref: route.ref ?? undefined,
        path: route.docPath || "index",
      });

      res.setHeader("Content-Type", "text/markdown; charset=utf-8");
      res.setHeader("Vary", "Accept");
      setDocsCacheHeaders(res, RAW_DOC_CACHE_HEADERS);
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
        res.setHeader("Vary", "Accept");
        setDocsCacheHeaders(res, RAW_DOC_CACHE_HEADERS);
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

  res.setHeader("Vary", "Accept");
  setDocsCacheHeaders(res, DOCS_HTML_CACHE_HEADERS);

  const bundleApiPath = buildDocsBundleApiPath(route);
  const bundleResponse = await fetch(getRequestOrigin() + bundleApiPath, {
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

  const redirectDestination = await resolveFrontmatterRedirectDestination(
    route,
    successResponse.bundle,
  );

  if (redirectDestination) {
    return {
      redirect: {
        destination: redirectDestination,
        permanent: false,
      },
    };
  }

  return {
    props: {
      kind: query.debug ? ("debug" as const) : ("doc" as const),
      route,
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

  if (props.kind !== "doc" && props.kind !== "debug") {
    return null;
  }

  if (!props.bundle?.config) {
    return null;
  }

  const preset = props.bundle.config.theme.preset;

  return (
    <>
      <DocPageContext.Provider value={props}>
        {props.kind === "debug" ? <DocsDebug /> : <Docs />}
      </DocPageContext.Provider>
      {preset ? (
        <style key="theme-preset">{`
          ${preset.css}
          *, *::before, *::after { 
            --font-sans: ${preset.build.fontSans} !important;
            --font-heading: ${preset.build.fontHeading} !important;
          }
        `.trim()}</style>
      ) : null}
    </>
  );
}
