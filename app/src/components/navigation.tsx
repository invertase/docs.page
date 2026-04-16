"use client";

import { GitBranchIcon, StarIcon } from "@phosphor-icons/react";
import { ChevronRightIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { useDocPageContext } from "@/lib/context";
import {
  docPathMatchesSidebarHref,
  resolveActiveTabId,
  resolveSidebarNavHref,
} from "@/lib/docs-routing";
import type { SidebarGroup as SidebarConfigGroup } from "@/server/config/models/sidebar";
import { cn } from "@/lib/utils";

function getSidebarGroups(config: { sidebar: unknown }): SidebarConfigGroup[] {
  const raw = config.sidebar;
  if (Array.isArray(raw)) {
    return raw as SidebarConfigGroup[];
  }
  if (raw && typeof raw === "object") {
    const rec = raw as Record<string, SidebarConfigGroup[]>;
    return rec.default ?? Object.values(rec)[0] ?? [];
  }
  return [];
}

function isPageLink(item: SidebarConfigGroup["pages"][number]): boolean {
  return "title" in item;
}

function subtreeHasActivePage(routeDocPath: string, pages: SidebarConfigGroup["pages"]): boolean {
  for (const p of pages) {
    if (isPageLink(p)) {
      const link = p as { title: string; href: string };
      if (docPathMatchesSidebarHref(routeDocPath, link.href)) {
        return true;
      }
    } else {
      const nested = p as SidebarConfigGroup;
      if (nested.href && docPathMatchesSidebarHref(routeDocPath, nested.href)) {
        return true;
      }
      if (subtreeHasActivePage(routeDocPath, nested.pages)) {
        return true;
      }
    }
  }
  return false;
}

function SidebarPageRow(props: {
  title: string;
  href: string;
  isActive: boolean;
  nested?: boolean;
}) {
  const { route } = useDocPageContext();
  const url = resolveSidebarNavHref(route, props.href);

  if (props.nested) {
    return (
      <SidebarMenuSubButton asChild isActive={props.isActive} size="md">
        <a href={url}>
          <span>{props.title}</span>
        </a>
      </SidebarMenuSubButton>
    );
  }

  return (
    <SidebarMenuButton asChild isActive={props.isActive}>
      <a href={url}>
        <span>{props.title}</span>
      </a>
    </SidebarMenuButton>
  );
}

function SidebarNestedGroup(props: {
  node: SidebarConfigGroup;
  depth: number;
}) {
  const { route } = useDocPageContext();
  const label = props.node.group ?? "More";
  const hasActive = subtreeHasActivePage(route.docPath, props.node.pages);
  const groupHrefActive =
    props.node.href != null && docPathMatchesSidebarHref(route.docPath, props.node.href);

  const isActive = hasActive || groupHrefActive;

  if (props.depth === 0) {
    return (
      <Collapsible defaultOpen={isActive} className="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip={label} isActive={isActive}>
              <span className="truncate">{label}</span>
              <ChevronRightIcon className="ml-auto size-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              <SidebarPagesList pages={props.node.pages} depth={props.depth + 1} />
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  return (
    <Collapsible defaultOpen={isActive} className="group/collapsible">
      <SidebarMenuSubItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuSubButton isActive={isActive}>
            <span className="truncate">{label}</span>
            <ChevronRightIcon className="ml-auto size-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuSubButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="mx-3.5 border-l border-sidebar-border px-2.5 py-0.5">
            <SidebarPagesList pages={props.node.pages} depth={props.depth + 1} />
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuSubItem>
    </Collapsible>
  );
}

function SidebarPagesList(props: { pages: SidebarConfigGroup["pages"]; depth: number }) {
  const { route } = useDocPageContext();

  return (
    <>
      {props.pages.map((item, index) => {
        const key = `page-${props.depth}-${index}`;

        if (isPageLink(item)) {
          const link = item as { title: string; href: string };
          const active = docPathMatchesSidebarHref(route.docPath, link.href);
          if (props.depth > 0) {
            return (
              <SidebarMenuSubItem key={key}>
                <SidebarPageRow
                  title={link.title}
                  href={link.href}
                  isActive={active}
                  nested
                />
              </SidebarMenuSubItem>
            );
          }
          return (
            <SidebarMenuItem key={key}>
              <SidebarPageRow title={link.title} href={link.href} isActive={active} />
            </SidebarMenuItem>
          );
        }

        return (
          <SidebarNestedGroup key={key} node={item as SidebarConfigGroup} depth={props.depth} />
        );
      })}
    </>
  );
}

export function Navigation() {
  const { bundle, route } = useDocPageContext();
  const tabs = bundle.config.tabs ?? [];
  const activeTabId = resolveActiveTabId(route, tabs);
  const groups = getSidebarGroups(bundle.config).filter((g) => {
    if (!g.tab) {
      return true;
    }
    if (tabs.length === 0) {
      return true;
    }
    return g.tab === activeTabId;
  });

  const gh = bundle.source;

  return (
    <Sidebar variant="sidebar" className="absolute inset-y-0 h-full max-h-none">
      <div className="relative flex min-h-0 flex-1 flex-col">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-12 bg-linear-to-b from-background to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12 bg-linear-to-t from-background to-transparent"
        />
        <SidebarContent className="relative flex-1 bg-background pt-5">
          {groups.map((group, gi) => (
            <SidebarGroup key={`${group.group ?? "group"}-${gi}`} className="group-data-[collapsible=icon]:hidden">
              {group.group ? (
                <SidebarGroupLabel className={cn(!group.pages?.length && "sr-only")}>
                  {group.group}
                </SidebarGroupLabel>
              ) : null}
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarPagesList pages={group.pages} depth={0} />
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
      </div>
      <SidebarFooter className="bg-background p-2">
        <Button
          asChild
          type="button"
          variant="outline"
          className="h-auto w-full min-w-0 flex-col items-stretch justify-start gap-1.5 whitespace-normal px-3 py-2.5 text-left"
        >
          <a
            href={`https://github.com/${gh.owner}/${gh.repository}`}
            target="_blank"
            rel="noreferrer"
          >
            <div className="min-w-0 truncate text-sm leading-snug font-medium">
              {gh.owner}/{gh.repository}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <StarIcon className="size-4" />
                <span>{bundle.stars.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <GitBranchIcon className="size-4" />
                <span>{bundle.forks.toLocaleString()}</span>
              </div>
            </div>
          </a>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
