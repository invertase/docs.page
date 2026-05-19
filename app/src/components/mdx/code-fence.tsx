import { useEffect, useRef, useState, type ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { RiCheckLine, RiFileCopyLine } from "@remixicon/react";

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
  const label = title || language;

  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  const onCopy = () => {
    void navigator.clipboard.writeText(value);
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    setCopied(true);
    copyTimeoutRef.current = setTimeout(() => {
      copyTimeoutRef.current = null;
      setCopied(false);
    }, 2000);
  };

  return (
    <figure
      className={cn(
        "overflow-hidden rounded-lg border bg-card text-card-foreground",
        className,
      )}
      {...props}
    >
      <figcaption className="flex h-9 items-center justify-between gap-3 border-b px-4 font-mono text-muted-foreground text-xs">
        <div className="truncate">{label}</div>
        <div className="flex items-center gap-2">
          {title ? <span>{language}</span> : null}
          <Button variant="ghost" size="icon-sm" onClick={onCopy}>
            {copied ? <RiCheckLine /> : <RiFileCopyLine />}
          </Button>
        </div>
      </figcaption>
      <div className="overflow-x-auto p-4 text-sm">
        {highlighted ? (
          <div dangerouslySetInnerHTML={{ __html: highlighted }} />
        ) : null}
      </div>
    </figure>
  );
}
