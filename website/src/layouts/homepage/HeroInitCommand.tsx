"use client";

import { RiCheckLine, RiFileCopyLine } from "@remixicon/react";
import { useCallback, useEffect, useState } from "react";

import { cn } from "~/lib/utils";

const CLI_INIT = "npx @docs.page/cli init";

type HeroInitCommandProps = {
  className?: string;
};

export function HeroInitCommand({ className }: HeroInitCommandProps) {
  const [copied, setCopied] = useState(false);

  const onCopy = useCallback(() => {
    void navigator.clipboard.writeText(CLI_INIT);
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
        "hero-init-command inline-flex h-full min-h-12 w-max min-w-0 max-w-full shrink-0 items-center overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
    >
      <span
        className="shrink-0 select-none font-mono text-base font-light text-neutral-500 dark:text-neutral-400"
        aria-hidden
      >
        $
      </span>
      <input
        type="text"
        readOnly
        value={CLI_INIT}
        size={CLI_INIT.length}
        className="min-w-0 shrink-0 appearance-none border-0 bg-transparent py-0 pl-2 pr-0 font-mono text-base font-light leading-snug text-neutral-200 outline-none [field-sizing:content] focus-visible:ring-1 focus-visible:ring-neutral-300 dark:focus-visible:ring-neutral-500 max-sm:max-w-[calc(100vw-6rem)]"
        onFocus={(e) => e.target.select()}
        spellCheck={false}
        aria-label="CLI install command"
      />
      <button
        type="button"
        onClick={onCopy}
        className="ml-2 inline-flex shrink-0 items-center justify-center rounded-sm bg-transparent p-1 text-neutral-500 transition-colors outline-none hover:text-neutral-300"
        aria-label={copied ? "Copied" : "Copy command"}
      >
        {copied ? (
          <RiCheckLine
            className="size-5 text-teal-600 dark:text-teal-400/90"
            aria-hidden
          />
        ) : (
          <RiFileCopyLine className="size-5" aria-hidden />
        )}
      </button>
    </div>
  );
}
