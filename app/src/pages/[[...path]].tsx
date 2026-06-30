import type { GetServerSideProps, InferGetServerSidePropsType } from "next";

import { Docs } from "@/components/docs";
import {
  DocsBundleErrorCard,
  DocsDebug,
  DocsDebugDetails,
} from "@/components/docs-debug";
import { DocsNotFoundPage } from "@/components/docs-not-found";
import { Homepage } from "@/components/homepage";
import { Preset } from "@/components/preset";
import { DocPageContext } from "@/hooks/use-doc-page-context";
import { getAgentPanelCookieName } from "@/lib/agent-panel-state";
import type {
  DocsBundleApiErrorResponse,
  DocsBundleApiResponse,
  DocsBundleApiSuccessResponse,
} from "@/lib/docs-bundle-api";
import {
  buildDocsBundleApiPath,
  isDocsBundleNotFoundResponse,
  parseDocsBundleApiError,
} from "@/lib/docs-bundle-api";
import {
  resolveCanonicalUrl,
  resolvePublicDocsPublishingContext,
} from "@/lib/docs-canonical";
import { getDeploymentOrigin } from "@/lib/docs-environment";
import { resolveFrontmatterRedirectDestination } from "@/lib/docs-redirect";
import { isRawDocRequestPath, resolveRawDocsRoute } from "@/lib/docs-routing";
import {
  acceptPrefersMarkdown,
  incomingHttpHeadersToWebHeaders,
} from "@/lib/incoming-http-headers";
import { getPostHogClient } from "@/lib/posthog";
import type {
  DocPageProps,
  ErrorPageProps,
  NotFoundPageProps,
  PageProps,
} from "@/lib/types";
import {
  DOCS_HTML_CACHE_HEADERS,
  RAW_DOC_CACHE_HEADERS,
  setDocsCacheHeaders,
} from "@/proxy";
import {
  createAgentSession,
  createAgentSessionCookies,
  getAgentCsrfCookiePath,
  parseCookies,
} from "@/server/agent/session";

export const getServerSideProps = (async ({ params, req, res, query }) => {
  const isDebug = query.debug !== undefined;
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
    res.statusCode = 404;

    return {
      props: {
        kind: "notFound" as const,
        notFound: {
          ...(isDebug
            ? {
                debug: {
                  pathChunks: chunks,
                  error: {
                    code: 404,
                    message:
                      "Incomplete docs route. Expected /owner/repository/...",
                  },
                },
              }
            : {}),
        },
      } satisfies NotFoundPageProps,
    };
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

  const {
    route: resolvedRoute,
    customDomain,
    origin: requestOrigin,
    pathRoute: publicPathRoute,
  } = await resolvePublicDocsPublishingContext({
    owner,
    repoSegment: repo,
    path,
    headers: requestHeaders,
  });
  const route = {
    ...resolvedRoute,
    canonicalUrl: resolveCanonicalUrl(resolvedRoute, customDomain),
  };
  const csrfCookiePath = getAgentCsrfCookiePath(route);
  const cookies = parseCookies(req.headers.cookie);
  const panelCookieName = getAgentPanelCookieName(
    route.owner,
    route.repository,
  );
  const initialAgentPanelOpen = cookies[panelCookieName] === "1";

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
  const bundleResponse = await fetch(getDeploymentOrigin() + bundleApiPath, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });
  const bundlePayload = (await bundleResponse.json()) as DocsBundleApiResponse;

  if (!bundleResponse.ok || bundlePayload.code !== "OK") {
    const errorResponse = bundlePayload as DocsBundleApiErrorResponse;
    const error = parseDocsBundleApiError(errorResponse);

    if (isDocsBundleNotFoundResponse(errorResponse)) {
      res.statusCode = 404;

      return {
        props: {
          kind: "notFound" as const,
          notFound: {
            description: error.message,
            ...(error.source ? { source: error.source } : {}),
            ...(error.branding ? { branding: error.branding } : {}),
            ...(isDebug
              ? {
                  debug: {
                    route,
                    bundleApiPath,
                    error: {
                      code: errorResponse.code,
                      message: error.message,
                      ...(error.source ? { source: error.source } : {}),
                    },
                  },
                }
              : {}),
          },
        } satisfies NotFoundPageProps,
      };
    }

    getPostHogClient().capture({
      distinctId: `${owner}/${repo}`,
      event: "docs:page_error",
      properties: {
        owner,
        repository: repo,
        error_message: error.message,
        $process_person_profile: false,
      },
    });

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

  if (!isDebug && successResponse.hasAgent) {
    const session = await createAgentSession({
      owner: route.owner,
      repo: route.repository,
    });

    res.setHeader(
      "Set-Cookie",
      createAgentSessionCookies(
        session.token,
        session.csrfToken,
        csrfCookiePath,
      ),
    );

    getPostHogClient().capture({
      distinctId: `${route.owner}/${route.repository}`,
      event: "agent:session_created",
      properties: {
        owner: route.owner,
        repository: route.repository,
        ref: route.ref ?? null,
        $process_person_profile: false,
      },
    });
  }

  getPostHogClient().capture({
    distinctId: `${route.owner}/${route.repository}`,
    event: "docs:page_viewed",
    properties: {
      owner: route.owner,
      repository: route.repository,
      ref: route.ref ?? null,
      path: route.docPath ?? null,
      has_agent: successResponse.hasAgent,
      $process_person_profile: false,
    },
  });

  return {
    props: {
      kind: isDebug ? ("debug" as const) : ("doc" as const),
      route,
      bundle: successResponse.bundle,
      meta: {
        hasAgent: successResponse.hasAgent,
        initialAgentPanelOpen,
        requestOrigin,
        publicPathRoute,
      },
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
    return <Homepage />;
  }

  if (props.kind === "notFound") {
    const { debug, ...notFound } = props.notFound;

    if (debug) {
      return <DocsDebugDetails {...debug} />;
    }

    return <DocsNotFoundPage {...notFound} />;
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

  return (
    <>
      <DocPageContext.Provider value={props}>
        {props.kind === "debug" ? <DocsDebug /> : <Docs />}
        <Preset />
      </DocPageContext.Provider>
    </>
  );
}
