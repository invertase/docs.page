"use client";

import { startTransition, useDeferredValue, useEffect, useState } from "react";
import { searchDocs } from "@/lib/search-client";
import type { SearchRow } from "@/workers/search.worker";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  RiArrowRightLine,
  RiCloudFill,
  RiGithubFill,
  RiSparkling2Fill,
} from "@remixicon/react";
import { useDocTabs } from "@/hooks/use-doc-tabs";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  searchUrl: string;
};

export default function SearchDialog({ open, onOpenChange, searchUrl }: Props) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [results, setResults] = useState<SearchRow[]>([]);
  const tabs = useDocTabs();

  useEffect(() => {
    const q = deferredQuery.trim();
    if (!q) {
      setResults([]);
      return;
    }

    let cancelled = false;
    let unsubscribe: (() => void) | null = null;

    const handle = window.setTimeout(() => {
      if (cancelled) return;
      unsubscribe = searchDocs(searchUrl, q, q.length < 2 ? 5 : 10, (rows) => {
        if (cancelled) return;
        startTransition(() => setResults(rows));
      });
    }, 80);

    return () => {
      cancelled = true;
      window.clearTimeout(handle);
      unsubscribe?.();
    };
  }, [deferredQuery, searchUrl]);

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      className="sm:max-w-2xl"
    >
      <Command className="bar" shouldFilter={false}>
        <CommandInput
          placeholder="Search documentation..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {query.length === 0 && (
            <CommandGroup heading="Navigate">
              {tabs.map((tab) => (
                <CommandItem key={tab.id}>
                  <RiArrowRightLine className="text-muted-foreground" />
                  <span>{tab.title}</span>
                </CommandItem>
              ))}
              <CommandItem>
                <RiSparkling2Fill className="text-muted-foreground" />
                <span>Ask AI</span>
                <span className="text-muted-foreground">Open agent window</span>
              </CommandItem>
              <CommandItem>
                <RiCloudFill className="text-muted-foreground" />
                <span>Install MCP</span>
              </CommandItem>
              <CommandItem>
                <RiGithubFill className="text-muted-foreground" />
                <span>GitHub</span>
                <span className="text-muted-foreground">
                  invertase/react-native-firebase
                </span>
              </CommandItem>
            </CommandGroup>
          )}

          {results.length > 0 ? (
            <CommandGroup heading="Results">
              {results.map((doc) => (
                <CommandItem
                  key={doc.path}
                  value={doc.path}
                  className="flex flex-col items-start gap-1"
                >
                  <span
                    className="text-sm font-medium"
                    dangerouslySetInnerHTML={{ __html: doc.titleHtml }}
                  />
                  <span
                    className="text-muted-foreground text-xs line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: doc.snippetHtml }}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          ) : (
            <CommandEmpty>No results found.</CommandEmpty>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
