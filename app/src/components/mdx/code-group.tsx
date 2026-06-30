import { RiCheckLine, RiFileCopyLine } from "@remixicon/react";
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

export type CodeGroupBlock = {
  label: string;
  highlighted: string;
  value: string;
};

type CodeGroupContextValue = {
  language?: string;
  onChange: (language: string) => void;
};

const CodeGroupContext = createContext<CodeGroupContextValue | undefined>(
  undefined,
);

function useCodeGroups() {
  const context = useContext(CodeGroupContext);

  if (!context) {
    throw new Error("useCodeGroups must be used within a CodeGroupProvider");
  }

  return context;
}

export function CodeGroupProvider({ children }: PropsWithChildren) {
  const [language, setLanguage] = useState<string>();
  const onChange = useCallback((next: string) => {
    setLanguage(next);
  }, []);

  const value = useMemo(() => ({ language, onChange }), [language, onChange]);

  return (
    <CodeGroupContext.Provider value={value}>
      {children}
    </CodeGroupContext.Provider>
  );
}

type CodeGroupProps = {
  title?: string;
  defaultLanguage?: string;
  synchronize?: boolean;
  blocks: CodeGroupBlock[];
};

export function CodeGroup({
  title,
  defaultLanguage,
  synchronize,
  blocks,
}: CodeGroupProps) {
  const codeGroups = useCodeGroups();
  const labels = blocks.map((block) => block.label || "text");

  let initialLabel: string;
  if (
    synchronize &&
    codeGroups.language &&
    labels.includes(codeGroups.language)
  ) {
    initialLabel = codeGroups.language;
  } else if (defaultLanguage && labels.includes(defaultLanguage)) {
    initialLabel = defaultLanguage;
  } else {
    initialLabel = labels[0] ?? "text";
  }

  const [active, setActive] = useState(initialLabel);
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (
      synchronize &&
      codeGroups.language &&
      labels.includes(codeGroups.language) &&
      active !== codeGroups.language
    ) {
      setActive(codeGroups.language);
    }
  }, [active, synchronize, codeGroups.language, labels]);

  useEffect(() => {
    if (labels.length === 0) {
      return;
    }

    if (!labels.includes(active)) {
      setActive(labels[0] ?? "text");
    }
  }, [active, labels]);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  if (blocks.length === 0) {
    return null;
  }

  const activeBlock =
    blocks.find((block) => (block.label || "text") === active) ?? blocks[0];

  const onCopy = () => {
    void navigator.clipboard.writeText(activeBlock.value);
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    setCopied(true);
    copyTimeoutRef.current = setTimeout(() => {
      copyTimeoutRef.current = null;
      setCopied(false);
    }, 2000);
  };

  const selectLabel = (label: string) => {
    setActive(label);

    if (synchronize) {
      codeGroups.onChange(label);
    }
  };

  return (
    <figure className="not-prose overflow-hidden rounded-lg border bg-card text-card-foreground">
      <figcaption className="flex h-9 items-center justify-between gap-3 px-4 font-mono text-muted-foreground text-xs">
        <div className="min-w-0 flex-1 overflow-x-auto no-scrollbar">
          <div className="flex w-max items-center gap-3">
            {labels.map((label) => (
              <button
                key={label}
                type="button"
                className={cn(
                  "shrink-0 whitespace-nowrap font-mono text-xs transition-colors",
                  label === active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
                onClick={() => selectLabel(label)}
              >
                {label}
              </button>
            ))}
            {title ? (
              <>
                <Separator orientation="vertical" />
                <span className="shrink-0 whitespace-nowrap font-medium">
                  {title}
                </span>
              </>
            ) : null}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          className="shrink-0"
          onClick={onCopy}
        >
          {copied ? <RiCheckLine /> : <RiFileCopyLine />}
        </Button>
      </figcaption>
      <div className="overflow-x-auto px-4 py-2 text-sm">
        {blocks.map((block, index) => {
          const label = block.label || "text";
          return (
            <div
              key={`${label}-${index}`}
              className={cn({ hidden: label !== active })}
            >
              {block.highlighted ? (
                <div dangerouslySetInnerHTML={{ __html: block.highlighted }} />
              ) : (
                <pre className="m-0">
                  <code>{block.value}</code>
                </pre>
              )}
            </div>
          );
        })}
      </div>
    </figure>
  );
}
