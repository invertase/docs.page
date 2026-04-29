"use client";

import { RiCheckLine, RiFileCopyLine } from "@remixicon/react";
import { useCallback, useEffect, useState } from "react";

import { cn } from "~/lib/utils";

const COPY = "npx @docs.page/cli init";
const CMD = "npx docs.page init";

type HeroInitCommandProps = {
  className?: string;
};

export function HeroInitCommand({ className }: HeroInitCommandProps) {
  const [copied, setCopied] = useState(false);

  const onCopy = useCallback(() => {
    void navigator.clipboard.writeText(COPY);
    setCopied(true);
  }, []);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <div
      className={cn(
        "inline-flex w-max min-w-0 max-w-full shrink-0",
        className,
      )}
    >
      <div
        className={cn(
          "flex h-9 min-h-9 w-max min-w-0 max-w-full items-center overflow-hidden overflow-x-auto rounded-md border border-border pl-2.5 pr-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "bg-[hsl(var(--color-zinc-200))]",
          "dark:border-zinc-800/80 dark:bg-[hsl(var(--muted))]",
          "focus-within:outline-none focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-[hsl(var(--color-zinc-200))]",
          "dark:focus-within:ring-zinc-600/80 dark:focus-within:ring-offset-[hsl(var(--muted))]",
        )}
      >
        <span
          className="shrink-0 select-none font-mono text-sm font-normal text-muted-foreground"
          aria-hidden
        >
          $
        </span>
        <input
          type="text"
          readOnly
          value={CMD}
          size={CMD.length}
          className="min-w-0 shrink-0 border-0 bg-transparent py-0 pl-2 pr-0 font-mono text-sm font-normal text-foreground outline-none [field-sizing:content] max-sm:max-w-[calc(100vw-5.5rem)] dark:text-zinc-200"
          onFocus={(e) => e.target.select()}
          spellCheck={false}
          aria-label="CLI install command"
        />
        <button
          type="button"
          onClick={onCopy}
          className="ml-2 inline-flex shrink-0 items-center justify-center rounded-sm p-1 text-muted-foreground transition-colors outline-none hover:text-foreground dark:text-zinc-500 dark:hover:text-zinc-300"
          aria-label={copied ? "Copied" : "Copy command"}
        >
          {copied ? (
            <RiCheckLine
              className="size-4 text-emerald-600 dark:text-emerald-400/90"
              aria-hidden
            />
          ) : (
            <RiFileCopyLine className="size-4" aria-hidden />
          )}
        </button>
      </div>
    </div>
  );
}
