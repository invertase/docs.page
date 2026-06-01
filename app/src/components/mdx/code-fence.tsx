import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCopy } from "@/hooks/use-copy";
import { cn } from "@/lib/utils";
import { RiCheckLine, RiFileCopyLine } from "@remixicon/react";
import type { ComponentProps } from "react";

type CodeFenceProps = ComponentProps<"figure"> & {
  lang?: string;
  highlighted: string;
  meta?: string;
  title?: string;
  value: string;
};

export function CodeFence({
  lang,
  highlighted,
  meta: _meta,
  title,
  value,
  className,
  ...props
}: CodeFenceProps) {
  const language = lang || "text";
  const { copied, copy: onCopy } = useCopy(value);

  return (
    <figure
      className={cn(
        "overflow-hidden rounded-lg border bg-card text-card-foreground",
        className,
      )}
      {...props}
    >
      <figcaption className="flex h-9 items-center justify-between gap-3 px-4 font-mono text-muted-foreground text-xs">
        <div className="truncate">
          {title ? (
            <>
              {language}
              <Separator orientation="vertical" />
              {title}
            </>
          ) : (
            language
          )}
        </div>
        <Button variant="ghost" size="icon-sm" onClick={onCopy}>
          {copied ? <RiCheckLine /> : <RiFileCopyLine />}
        </Button>
      </figcaption>
      <div className="overflow-x-auto px-4 py-2 text-sm">
        {highlighted ? (
          <div dangerouslySetInnerHTML={{ __html: highlighted }} />
        ) : null}
      </div>
    </figure>
  );
}
