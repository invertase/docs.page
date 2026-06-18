"use client";

import { useTheme } from "next-themes";
import { useEffect, useId, useMemo, useState } from "react";

type MermaidDiagramProps = {
  value: string;
};

type RenderState =
  | { status: "loading" }
  | { status: "success"; svg: string }
  | { status: "error"; error: string };

export function MermaidDiagram({ value }: MermaidDiagramProps) {
  const { resolvedTheme } = useTheme();
  const reactId = useId();
  const diagramId = useMemo(
    () => `mermaid-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`,
    [reactId],
  );
  const [state, setState] = useState<RenderState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    async function renderDiagram() {
      setState({ status: "loading" });

      try {
        const { default: mermaid } = await import("mermaid");

        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          suppressErrorRendering: true,
          theme: resolvedTheme === "dark" ? "dark" : "default",
        });

        const { svg } = await mermaid.render(diagramId, value);

        if (!cancelled) {
          setState({ status: "success", svg });
        }
      } catch (error) {
        if (!cancelled) {
          setState({ status: "error", error: errorMessage(error) });
        }
      }
    }

    renderDiagram();

    return () => {
      cancelled = true;
    };
  }, [diagramId, resolvedTheme, value]);

  return (
    <figure className="overflow-hidden rounded-lg border bg-card text-card-foreground">
      <figcaption className="flex h-9 items-center px-4 font-mono text-muted-foreground text-xs">
        mermaid
      </figcaption>
      <div className="overflow-x-auto p-4">
        {state.status === "loading" ? (
          <div className="flex min-h-40 items-center justify-center rounded-md bg-muted/40 text-muted-foreground text-sm">
            Rendering diagram...
          </div>
        ) : state.status === "success" ? (
          <div
            className="flex min-w-max justify-center [&_svg]:h-auto [&_svg]:max-w-none"
            dangerouslySetInnerHTML={{ __html: state.svg }}
          />
        ) : (
          <div className="space-y-3">
            <p className="text-destructive text-sm">
              Mermaid could not render this diagram: {state.error}
            </p>
            <pre className="overflow-x-auto rounded-md bg-muted p-3 font-mono text-muted-foreground text-xs">
              <code>{value}</code>
            </pre>
          </div>
        )}
      </div>
    </figure>
  );
}

function errorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Unknown error";
}
