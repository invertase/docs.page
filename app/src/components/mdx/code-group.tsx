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

export type CodeGroupBlock = {
  lang: string;
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
  const languages = blocks.map((block) => block.lang || "text");

  let initialLanguage: string;
  if (
    synchronize &&
    codeGroups.language &&
    languages.includes(codeGroups.language)
  ) {
    initialLanguage = codeGroups.language;
  } else if (defaultLanguage && languages.includes(defaultLanguage)) {
    initialLanguage = defaultLanguage;
  } else {
    initialLanguage = languages[0] ?? "text";
  }

  const [active, setActive] = useState(initialLanguage);
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (
      synchronize &&
      codeGroups.language &&
      languages.includes(codeGroups.language) &&
      active !== codeGroups.language
    ) {
      setActive(codeGroups.language);
    }
  }, [active, synchronize, codeGroups.language, languages]);

  useEffect(() => {
    if (languages.length === 0) {
      return;
    }

    if (!languages.includes(active)) {
      setActive(languages[0] ?? "text");
    }
  }, [active, languages]);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  if (blocks.length === 0) {
    return null;
  }

  const activeBlock =
    blocks.find((block) => (block.lang || "text") === active) ?? blocks[0];

  const onCopy = () => {
    void navigator.clipboard.writeText(activeBlock.value);
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    setCopied(true);
    copyTimeoutRef.current = setTimeout(() => {
      copyTimeoutRef.current = null;
      setCopied(false);
    }, 2000);
  };

  const selectLanguage = (language: string) => {
    setActive(language);

    if (synchronize) {
      codeGroups.onChange(language);
    }
  };

  return (
    <figure className="not-prose overflow-hidden rounded-lg border bg-card text-card-foreground">
      <figcaption className="flex h-9 items-center gap-3 px-4 font-mono text-muted-foreground text-xs">
        {title ? (
          <div className="min-w-0 truncate font-medium">{title}</div>
        ) : null}
        <div className="ml-auto flex items-center gap-1">
          {languages.map((language) => (
            <Button
              key={language}
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "h-7 px-2 font-mono text-xs",
                language === active && "bg-muted text-foreground",
              )}
              onClick={() => selectLanguage(language)}
            >
              {language}
            </Button>
          ))}
          <Button variant="ghost" size="icon-sm" onClick={onCopy}>
            {copied ? <RiCheckLine /> : <RiFileCopyLine />}
          </Button>
        </div>
      </figcaption>
      <div className="overflow-x-auto px-4 py-2 text-sm">
        {blocks.map((block, index) => {
          const lang = block.lang || "text";
          return (
            <div
              key={`${lang}-${index}`}
              className={cn({ hidden: lang !== active })}
              dangerouslySetInnerHTML={
                block.highlighted ? { __html: block.highlighted } : undefined
              }
            />
          );
        })}
      </div>
    </figure>
  );
}
