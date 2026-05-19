"use client";

import { defaultConfig, parseConfig } from "@/server/config";
import { Docs } from "@/components/docs";
import { DocPageContext } from "@/hooks/use-doc-page-context";
import type { DocIrNode } from "@/lib/docs-ir/types";
import type { DocPageProps } from "@/lib/types";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Preset } from "./preset";

type PreviewBundle = {
  markdown?: string;
  docIr?: DocIrNode;
  frontmatter: Record<string, unknown>;
  headings: Array<{
    id: string;
    title: string;
    rank: number | null;
    includeInToc: boolean;
  }>;
};

type PreviewSocketResponse = {
  type: "response";
  revision: number;
  pathname: string;
  filePath: string | null;
  changedPaths?: string[];
  config: {
    json: string | null;
    yaml: string | null;
  };
  markdown: string | null;
  bundle: PreviewBundle | null;
  candidates: string[];
  error: string | null;
  errorDetails: {
    name: string;
    message: string;
    stack: string | null;
    raw: string | null;
  } | null;
  rootDir: string;
  at: string;
};

function normalizeSocketUrl(value?: string | null) {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);

    if (url.protocol === "ws:" || url.protocol === "wss:") {
      return url;
    }

    if (url.protocol === "http:" || url.protocol === "https:") {
      const websocketUrl = new URL(url.toString());
      websocketUrl.protocol =
        websocketUrl.protocol === "https:" ? "wss:" : "ws:";
      websocketUrl.pathname = websocketUrl.pathname.replace(/\/+$/, "") || "/";
      return websocketUrl;
    }

    return null;
  } catch {
    return null;
  }
}

function toPreviewPath(pathname: string) {
  const withoutPreviewPrefix = pathname.replace(/^\/preview(?=\/|$)/, "");
  return withoutPreviewPrefix.length > 0 ? withoutPreviewPrefix : "/";
}

export function PreviewClient() {
  const router = useRouter();
  const socketRef = useRef<WebSocket | null>(null);
  const previewPathRef = useRef("/");
  const [response, setResponse] = useState<PreviewSocketResponse | null>(null);
  const [socketError, setSocketError] = useState<string | null>(null);
  const asPath = router.asPath || "/preview";
  const currentPathname = useMemo(
    () => getPathnameFromAsPath(asPath),
    [asPath],
  );
  const rawSocketUrl = useMemo(() => getPreviewSocketUrl(asPath), [asPath]);
  const websocketUrl = useMemo(
    () => normalizeSocketUrl(rawSocketUrl),
    [rawSocketUrl],
  );
  const previewPath = useMemo(
    () => toPreviewPath(currentPathname),
    [currentPathname],
  );
  const previewDocProps = useMemo<DocPageProps | null>(() => {
    if (!response?.bundle) {
      return null;
    }

    const docPath = normalizePreviewDocPath(previewPath);
    const config = parsePreviewConfig(response.config);
    const repository = getWorkspaceName(response.rootDir);
    const markdown = response.bundle.markdown ?? response.markdown ?? "";

    return {
      kind: "doc",
      route: {
        owner: "local",
        repository,
        ref: null,
        docPath,
        requestMode: "preview",
        vanity: false,
        customDomain: false,
        canonicalPathname: docPath ? `/preview/${docPath}` : "/preview",
        publicPathname: docPath ? `/preview/${docPath}` : "/preview",
      },
      bundle: {
        source: {
          type: "branch",
          owner: "local",
          repository,
          ref: "preview",
        },
        ref: "preview",
        stars: 0,
        forks: 0,
        private: true,
        baseBranch: "preview",
        path: docPath || "index",
        config,
        markdown,
        docIr: response.bundle.docIr ?? {
          kind: "root",
          children: [{ kind: "markdown", source: markdown }],
        },
        headings: response.bundle.headings,
        frontmatter: response.bundle.frontmatter,
      },
      meta: {
        hasAgent: false,
        initialAgentPanelOpen: false,
        requestOrigin:
          typeof window !== "undefined"
            ? window.location.origin
            : `http://localhost:${process.env.PORT?.trim() || "3000"}`,
      },
    };
  }, [previewPath, response]);

  useEffect(() => {
    previewPathRef.current = previewPath;
  }, [previewPath]);

  useEffect(() => {
    if (!websocketUrl) {
      return;
    }

    const socket = new WebSocket(websocketUrl.toString());
    socketRef.current = socket;
    setSocketError(null);

    socket.addEventListener("open", () => {
      socket.send(
        JSON.stringify({
          type: "ping",
          path: previewPathRef.current,
        }),
      );
    });

    socket.addEventListener("message", (event) => {
      try {
        const payload = JSON.parse(event.data) as PreviewSocketResponse;
        setResponse(payload);
      } catch {
        setSocketError("Received an invalid preview response.");
      }
    });

    socket.addEventListener("error", () => {
      setSocketError("Unable to connect to the local preview websocket.");
    });

    return () => {
      socket.close();
      if (socketRef.current === socket) {
        socketRef.current = null;
      }
    };
  }, [websocketUrl]);

  useEffect(() => {
    const socket = socketRef.current;

    if (!socket || socket.readyState !== WebSocket.OPEN) {
      return;
    }

    socket.send(
      JSON.stringify({
        type: "ping",
        path: previewPath,
      }),
    );
  }, [previewPath]);

  if (socketError) {
    return (
      <PreviewErrorCard
        title="Preview connection failed"
        message={socketError}
        previewPath={previewPath}
        socketUrl={rawSocketUrl}
        errorDetails={{
          name: "PreviewConnectionError",
          message: socketError,
          stack: null,
          raw: null,
        }}
      />
    );
  }

  if (response?.error) {
    return (
      <PreviewErrorCard
        title="Preview render failed"
        message={response.error}
        previewPath={previewPath}
        socketUrl={rawSocketUrl}
        rootDir={response.rootDir}
        filePath={response.filePath}
        candidates={response.candidates}
        errorDetails={response.errorDetails}
      />
    );
  }

  if (!previewDocProps) {
    const isMissingSocketUrl = !rawSocketUrl;
    const isInvalidSocketUrl = Boolean(rawSocketUrl) && !websocketUrl;

    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <img src="/logo.svg" alt="Docs Page" width={100} height={100} />
          </EmptyMedia>
          <EmptyTitle>
            {isMissingSocketUrl
              ? "Missing preview server URL"
              : isInvalidSocketUrl
                ? "Invalid preview server URL"
                : "Connecting to local preview"}
          </EmptyTitle>
          <EmptyDescription>
            {isMissingSocketUrl
              ? "Open this page from the CLI preview command so the app knows how to reach your local preview server."
              : isInvalidSocketUrl
                ? "The `url` query parameter is present, but it is not a valid websocket or http URL."
                : "Waiting for the local preview server to send the first bundled page."}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          {isMissingSocketUrl ? (
            <>
              <div className="rounded-md border bg-muted/40 px-3 py-2 font-mono text-xs break-all">
                /preview{previewPath === "/" ? "" : previewPath}?url=ws://localhost:PORT
              </div>
              <p className="text-muted-foreground">
                Run <code>docs preview</code> and open the URL it prints in the terminal.
              </p>
            </>
          ) : isInvalidSocketUrl ? (
            <>
              <div className="rounded-md border bg-muted/40 px-3 py-2 font-mono text-xs break-all">
                {rawSocketUrl}
              </div>
              <p className="text-muted-foreground">
                Use a valid <code>ws://</code>, <code>wss://</code>, <code>http://</code>, or{" "}
                <code>https://</code> preview server URL.
              </p>
            </>
          ) : (
            <>
              <div className="rounded-md border bg-muted/40 px-3 py-2 font-mono text-xs break-all">
                {websocketUrl?.toString()}
              </div>
              <p className="text-muted-foreground">
                If this takes more than a moment, make sure <code>docs preview</code> is still
                running and that the requested page exists under <code>docs/</code>.
              </p>
            </>
          )}
        </EmptyContent>
      </Empty>
    );
  }
  
  return (
    <>
      <DocPageContext.Provider value={previewDocProps}>
        <Docs />
        <Preset />
      </DocPageContext.Provider>
    </>
  );
}

function parsePreviewConfig(config: {
  json: string | null;
  yaml: string | null;
}) {
  try {
    return parseConfig({
      json: config.json ?? undefined,
      yaml: config.yaml ?? undefined,
    });
  } catch {
    return defaultConfig;
  }
}

function normalizePreviewDocPath(previewPath: string) {
  return previewPath.replace(/^\/+|\/+$/g, "");
}

function getWorkspaceName(rootDir: string) {
  const parts = rootDir.split(/[\\/]/).filter(Boolean);
  return parts.at(-1) ?? "preview";
}

function getPathnameFromAsPath(asPath: string) {
  const [pathname] = asPath.split("?", 1);
  return pathname || "/preview";
}

function getPreviewSocketUrl(asPath: string) {
  const query = asPath.split("?", 2)[1];

  if (!query) {
    return null;
  }

  return new URLSearchParams(query).get("url");
}

function PreviewErrorCard({
  title,
  message,
  previewPath,
  socketUrl,
  rootDir,
  filePath,
  candidates,
  errorDetails,
}: {
  title: string;
  message: string;
  previewPath: string;
  socketUrl?: string | null;
  rootDir?: string;
  filePath?: string | null;
  candidates?: string[];
  errorDetails?: {
    name: string;
    message: string;
    stack: string | null;
    raw: string | null;
  } | null;
}) {
  const hasCandidates = Boolean(candidates?.length);
  const trace = errorDetails?.stack ?? errorDetails?.raw ?? null;

  return (
    <main className="flex min-h-screen flex-1 justify-center bg-zinc-50 px-6 py-16 dark:bg-black">
      <div className="flex w-full max-w-3xl flex-col gap-5 rounded-xl border border-red-200 bg-white p-6 shadow-sm dark:border-red-950 dark:bg-zinc-950">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-red-600 dark:text-red-400">
            Local preview error
          </p>
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
            {title}
          </h1>
          <p className="text-sm text-zinc-700 dark:text-zinc-300">{message}</p>
        </div>

        {errorDetails ? (
          <dl className="grid gap-3 text-sm md:grid-cols-2">
            <div>
              <dt className="font-medium text-zinc-950 dark:text-zinc-50">
                Error type
              </dt>
              <dd className="break-all text-zinc-600 dark:text-zinc-400">
                {errorDetails.name}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-zinc-950 dark:text-zinc-50">
                Summary
              </dt>
              <dd className="break-all text-zinc-600 dark:text-zinc-400">
                {errorDetails.message}
              </dd>
            </div>
          </dl>
        ) : null}

        <dl className="grid gap-3 text-sm md:grid-cols-2">
          <div>
            <dt className="font-medium text-zinc-950 dark:text-zinc-50">
              Preview path
            </dt>
            <dd className="break-all text-zinc-600 dark:text-zinc-400">
              {previewPath}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-zinc-950 dark:text-zinc-50">
              Preview server
            </dt>
            <dd className="break-all text-zinc-600 dark:text-zinc-400">
              {socketUrl ?? "Missing `url` query parameter"}
            </dd>
          </div>
          {rootDir ? (
            <div>
              <dt className="font-medium text-zinc-950 dark:text-zinc-50">
                Workspace
              </dt>
              <dd className="break-all text-zinc-600 dark:text-zinc-400">
                {rootDir}
              </dd>
            </div>
          ) : null}
          {filePath ? (
            <div>
              <dt className="font-medium text-zinc-950 dark:text-zinc-50">
                Resolved file
              </dt>
              <dd className="break-all text-zinc-600 dark:text-zinc-400">
                {filePath}
              </dd>
            </div>
          ) : null}
        </dl>

        {hasCandidates ? (
          <div className="space-y-2">
            <h2 className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
              Tried these files
            </h2>
            <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
              {candidates?.map((candidate) => (
                <li key={candidate}>{candidate}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {trace ? (
          <div className="space-y-2">
            <h2 className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
              Full trace
            </h2>
            <pre className="overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-xs text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">
              {trace}
            </pre>
          </div>
        ) : null}

        <div className="space-y-2">
          <h2 className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
            Things to check
          </h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
            <li>Keep `docs preview` running in your terminal.</li>
            <li>
              Make sure `docs.json` or `docs.yaml` exists in the workspace root.
            </li>
            <li>Confirm the requested page exists under `docs/`.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
