"use client";

import { useEffect, useMemo, useState } from "react";

import { DocsDebugShell } from "@/components/docs-bundle-debug";

type PreviewClientProps = {
  docPath: string;
  rawUrl?: string;
};

type ConnectionState =
  | "missing-url"
  | "invalid-url"
  | "connecting"
  | "connected"
  | "error";

type PreviewEvent =
  | {
      type: "snapshot";
      revision: number;
      path: string;
      filePath?: string | null;
      paths?: string[];
      config?: {
        json: string | null;
        yaml: string | null;
      };
      markdown?: string | null;
      candidates?: string[];
      rootDir: string;
      at: string;
    }
  | {
      type: "error";
      revision: number;
      path: string;
      filePath?: string | null;
      paths?: string[];
      error?: string;
      candidates?: string[];
      rootDir: string;
      at: string;
    };

async function getErrorMessage(response: Response) {
  const body = await response.text();

  if (!body.trim()) {
    return `Preview server responded with ${response.status} ${response.statusText}.`;
  }

  try {
    const json = JSON.parse(body) as { error?: unknown };

    if (typeof json.error === "string" && json.error.trim()) {
      return json.error;
    }
  } catch {
    // Fall back to the raw text body below.
  }

  return body;
}

function normalizePreviewUrl(value?: string) {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);

    if (url.protocol !== "http:") {
      return null;
    }

    return url;
  } catch {
    return null;
  }
}

function buildEndpoint(baseUrl: URL, suffix = "") {
  const url = new URL(baseUrl.toString());
  const basePath = url.pathname.endsWith("/")
    ? url.pathname.slice(0, -1)
    : url.pathname;
  const nextPath = suffix ? `${basePath}/${suffix}` : basePath || "/";
  url.pathname = nextPath.replace(/\/{2,}/g, "/");
  return url;
}

export function PreviewClient({ docPath, rawUrl }: PreviewClientProps) {
  const [status, setStatus] = useState<ConnectionState>(() =>
    rawUrl ? "connecting" : "missing-url",
  );
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const previewUrl = useMemo(() => normalizePreviewUrl(rawUrl), [rawUrl]);

  useEffect(() => {
    if (!rawUrl) {
      setStatus("missing-url");
      setError(null);
      setLogs([]);
      return;
    }

    if (!previewUrl) {
      setStatus("invalid-url");
      setError("`url` must be a valid http:// URL.");
      setLogs([]);
      return;
    }

    const resolvedPreviewUrl = previewUrl;
    let disposed = false;
    const controller = new AbortController();
    const sseUrl = buildEndpoint(resolvedPreviewUrl, "events");
    const pathUrl = buildEndpoint(resolvedPreviewUrl, "path");

    setStatus("connecting");
    setError(null);
    setLogs([]);

    async function connect() {
      try {
        const response = await fetch(pathUrl, {
          method: "POST",
          signal: controller.signal,
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            path: docPath || "index",
          }),
        });

        if (!response.ok) {
          throw new Error(await getErrorMessage(response));
        }

        if (disposed) {
          return;
        }

        const source = new EventSource(sseUrl.toString());

        source.onopen = () => {
          if (disposed) {
            return;
          }

          setLogs((current) => [
            ...current,
            `Connected to ${resolvedPreviewUrl.toString()}`,
            `Listening for SSE updates on ${sseUrl.toString()}`,
          ]);
        };

        source.onmessage = (event) => {
          console.log("preview:sse", event.data);

          try {
            const payload = JSON.parse(event.data) as PreviewEvent;

            if (payload.type === "error") {
              setStatus("error");
              setError(payload.error ?? "Preview server returned an error.");
            } else {
              setStatus("connected");
              setError(null);
            }

            setLogs((current) => [...current, JSON.stringify(payload, null, 2)]);
          } catch {
            setLogs((current) => [...current, event.data]);
          }
        };

        source.onerror = () => {
          if (disposed) {
            return;
          }

          setStatus("error");
          setError("Lost connection to the preview SSE stream.");
          source.close();
        };

        controller.signal.addEventListener("abort", () => {
          source.close();
        });
      } catch (cause) {
        if (disposed || controller.signal.aborted) {
          return;
        }

        const message =
          cause instanceof Error
            ? cause.message
            : "Failed to connect to the preview server.";

        setStatus("error");
        setError(message);
      }
    }

    void connect();

    return () => {
      disposed = true;
      controller.abort();
    };
  }, [docPath, previewUrl, rawUrl]);

  return (
    <DocsDebugShell
      eyebrow="Preview route"
      title="Local preview connection"
      rows={[
        { label: "Path", value: docPath || "(root document)" },
        { label: "URL", value: rawUrl || "(missing)" },
        { label: "Status", value: status },
      ]}
    >
      {!rawUrl ? (
        <section className="space-y-3 text-sm text-zinc-700 dark:text-zinc-300">
          <p>
            Add a `url` query parameter that points to your local preview
            server.
          </p>
          <p className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 font-mono text-xs text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">
            /preview
            {docPath ? `/${docPath}` : ""}
            ?url=http://localhost:3001
          </p>
        </section>
      ) : null}

      {rawUrl && !previewUrl ? (
        <section className="space-y-3 text-sm text-red-700 dark:text-red-300">
          <p>{error}</p>
        </section>
      ) : null}

      {rawUrl && previewUrl && error ? (
        <section className="space-y-3 text-sm text-red-700 dark:text-red-300">
          <p>{error}</p>
        </section>
      ) : null}

      {previewUrl ? (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
            SSE log
          </h2>
          <pre className="min-h-32 overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">
            {logs.length > 0 ? logs.join("\n") : "Waiting for events..."}
          </pre>
        </section>
      ) : null}
    </DocsDebugShell>
  );
}
