"use client";

import {
  startTransition,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/router";
import type { ComponentProps } from "react";
import { isSearchReady, searchDocs } from "@/lib/search-client";
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
import { ensureLeadingSlash, isExternalLink } from "@/lib/docs-links";
import { useAgentPanel } from "@/hooks/use-agent-panel";
import { useDocPageContext } from "@/hooks/use-doc-page-context";
import { Badge } from "@/components/ui/badge";
import { useMcpDialog } from "./mcp-dialog";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  searchUrl: string;
};

export default function SearchDialog({ open, onOpenChange, searchUrl }: Props) {
  const [query, setQuery] = useState("");
  const [titleOnly, setTitleOnly] = useState(false);
  const deferredQuery = useDeferredValue(query);
  const [results, setResults] = useState<SearchRow[]>([]);
  const tabs = useDocTabs();
  const { setOpen: setAgentPanelOpen } = useAgentPanel();
  const { bundle, meta } = useDocPageContext();
  const displayResults = useMemo(() => dedupeSearchResults(results), [results]);
  const dialog = useMcpDialog();
  
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
      unsubscribe = searchDocs(
        searchUrl,
        q,
        q.length < 2 ? 5 : 10,
        (rows) => {
          if (cancelled) return;
          startTransition(() => setResults(rows));
        },
        { scope: titleOnly ? "title" : "all" },
      );
    }, 80);

    return () => {
      cancelled = true;
      window.clearTimeout(handle);
      unsubscribe?.();
    };
  }, [deferredQuery, searchUrl, titleOnly]);

  const hasQuery = query.trim().length > 0;
  const showLoading = hasQuery && !isSearchReady();

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      className="sm:max-w-2xl"
    >
      <Command className="bar" shouldFilter={false}>
        <div className="relative">
          <CommandInput
            placeholder={titleOnly ? undefined : "Search docs (`>` for pages)"}
            value={query}
            onValueChange={(value) => {
              const trimmed = value.trimStart();
              if (trimmed.startsWith(">")) {
                setTitleOnly(true);
                const strippedValue = trimmed.slice(1).trimStart();
                setQuery(strippedValue);
                return;
              }
              setQuery(value);
            }}
            onKeyDown={(event) => {
              if (
                titleOnly &&
                query.trim().length === 0 &&
                event.key === "Backspace"
              ) {
                event.preventDefault();
                setTitleOnly(false);
              }
            }}
            className={titleOnly ? "ml-28" : undefined}
          />
          {titleOnly && (
            <Badge className="absolute left-10 top-2.5">Search pages</Badge>
          )}
        </div>

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
              {meta.hasAgent && (
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
              )}
              <CommandItem
                onSelect={() => {
                  dialog.setOpen(true);
                }}
              >
                <RiCloudFill className="text-muted-foreground" />
                <span>Install MCP</span>
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  window.open(
                    `https://github.com/${bundle.source.owner}/${bundle.source.repository}`,
                    "_blank",
                    "noopener,noreferrer",
                  );
                }}
              >
                <RiGithubFill className="text-muted-foreground" />
                <span>GitHub</span>
                <span className="text-muted-foreground">
                  {bundle.source.owner}/{bundle.source.repository}
                </span>
              </CommandItem>
            </CommandGroup>
          )}

          {displayResults.length > 0 ? (
            <CommandGroup heading={titleOnly ? "Pages" : "Results"}>
              {displayResults.map((doc) => (
                <CommandItem
                  key={doc.path}
                  value={doc.path}
                  className="flex flex-col items-start gap-1"
                >
                  <span
                    className="text-sm font-medium [&_mark]:rounded-sm [&_mark]:bg-primary/15 [&_mark]:text-primary"
                    dangerouslySetInnerHTML={{ __html: doc.titleHtml }}
                  />
                  <span className="text-muted-foreground text-xs font-mono">
                    {formatDisplayPath(doc.path)}
                  </span>
                  {!titleOnly && (
                    <span
                      className="text-muted-foreground text-xs line-clamp-2 [&_mark]:rounded-sm [&_mark]:bg-primary/15 [&_mark]:text-primary"
                      dangerouslySetInnerHTML={{ __html: doc.snippetHtml }}
                    />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          ) : showLoading ? (
            <CommandEmpty>Loading...</CommandEmpty>
          ) : titleOnly && !hasQuery ? (
            <CommandEmpty>Type to search page titles.</CommandEmpty>
          ) : (
            <CommandEmpty>
              {titleOnly ? "No page titles found." : "No results found."}
            </CommandEmpty>
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

function dedupeSearchResults(rows: SearchRow[]): SearchRow[] {
  const seen = new Set<string>();
  const deduped: SearchRow[] = [];

  for (const row of rows) {
    const key = normalizeResultPath(row.path);
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(row);
  }

  return deduped;
}

function normalizeResultPath(path: string): string {
  if (isExternalLink(path)) return path;
  const [pathWithoutQuery] = path.split("?");
  const [pathWithoutHash] = pathWithoutQuery.split("#");
  const normalized = pathWithoutHash.replace(/\/+$/, "");
  const withoutIndex = normalized.replace(/\/index$/i, "");
  return ensureLeadingSlash(withoutIndex || "/");
}

function formatDisplayPath(path: string): string {
  return normalizeResultPath(path);
}
