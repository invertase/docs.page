import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type CodeFenceProps = ComponentProps<"figure"> & {
  lang?: string;
  highlightedLang?: string;
  meta?: string;
  title?: string;
  value: string;
  highlightedHtml?: string;
};

export function CodeFence({
  lang,
  highlightedLang,
  meta: _meta,
  title,
  value,
  highlightedHtml,
  className,
  ...props
}: CodeFenceProps) {
  const language = highlightedLang || lang || "text";
  const label = title || language;

  return (
    <figure
      className={cn(
        "my-4 overflow-hidden rounded-xl border bg-card text-card-foreground",
        className,
      )}
      {...props}
    >
      <figcaption className="flex min-h-9 items-center justify-between gap-3 border-b bg-muted/40 px-4 py-2 font-mono text-muted-foreground text-xs">
        <span className="truncate">{label}</span>
        {title ? <span>{language}</span> : null}
      </figcaption>
      <div className="docs-code overflow-x-auto p-4 text-sm">
        {highlightedHtml ? (
          <div dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
        ) : (
          <pre>
            <code>{value}</code>
          </pre>
        )}
      </div>
    </figure>
  );
}
