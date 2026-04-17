"use client";

import { startTransition, useDeferredValue, useEffect, useState } from "react";
import { useRouter } from "next/router";
import type { ComponentProps } from "react";
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
import { useDocHref } from "@/hooks/use-doc-href";
import { isExternalLink } from "@/lib/docs-assets";
import { useAgentPanel } from "./agent-panel";
import { useDocPageContext } from "@/hooks/use-doc-page-context";

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
  const { setOpen: setAgentPanelOpen } = useAgentPanel();
  const { bundle } = useDocPageContext();

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
                <TabCommandItem
                  key={tab.id}
                  href={tab.href}
                  title={tab.title}
                  onNavigate={() => onOpenChange(false)}
                />
              ))}
              <CommandItem
                onSelect={() => {
                  onOpenChange(false);
                  setAgentPanelOpen(true);
                }}
              >
                <RiSparkling2Fill className="text-muted-foreground" />
                <span>Ask AI</span>
                <span className="text-muted-foreground">Open agent window</span>
              </CommandItem>
              <CommandItem>
                <RiCloudFill className="text-muted-foreground" />
                <span>Install MCP</span>
              </CommandItem>
              <CommandItem onSelect={() => {
                window.open(`https://github.com/${bundle.source.owner}/${bundle.source.repository}`, "_blank", "noopener,noreferrer");
              }}>
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

type TabCommandItemProps = {
  href: string;
  title: string;
  onNavigate?: () => void;
} & Omit<ComponentProps<typeof CommandItem>, "onSelect" | "value" | "children">;

function TabCommandItem({
  href,
  title,
  onNavigate,
  ...props
}: TabCommandItemProps) {
  const router = useRouter();
  const resolvedHref = useDocHref(href);
  const external = isExternalLink(href);

  return (
    <CommandItem
      {...props}
      value={`${title} ${resolvedHref}`}
      onSelect={() => {
        if (external) {
          window.open(resolvedHref, "_blank", "noopener,noreferrer");
        } else {
          router.push(resolvedHref);
        }
        onNavigate?.();
      }}
    >
      <RiArrowRightLine className="text-muted-foreground" />
      <span>{title}</span>
    </CommandItem>
  );
}
