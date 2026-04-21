import { RiArrowRightSLine, RiExternalLinkLine } from "@remixicon/react";
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
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useDocPageContext } from "@/hooks/use-doc-page-context";
import { useDocTabs } from "@/hooks/use-doc-tabs";
import { isExternalLink } from "@/lib/docs-assets";
import {
  isDocHrefActive,
  resolveActiveTabId,
} from "@/lib/docs-routing";
import type { SidebarGroup as SidebarConfigGroup } from "@/server/config/models/sidebar";
import { cn } from "@/lib/utils";
import { Link } from "./doc-link";
import { GithubSource } from "./github-source";

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

function subtreeHasActivePage(
  route: ReturnType<typeof useDocPageContext>["route"],
  pages: SidebarConfigGroup["pages"],
  locales: string[],
): boolean {
  for (const p of pages) {
    if (isPageLink(p)) {
      const link = p as { title: string; href: string };
      if (isDocHrefActive(route, link.href, locales)) {
        return true;
      }
    } else {
      const nested = p as SidebarConfigGroup;
      if (nested.href && isDocHrefActive(route, nested.href, locales)) {
        return true;
      }
      if (subtreeHasActivePage(route, nested.pages, locales)) {
        return true;
      }
    }
  }
  return false;
}

function ExternalLinkBadge(props: { nested?: boolean }) {
  return (
    <SidebarMenuBadge
      aria-hidden="true"
      className={cn(
        "text-sidebar-foreground/60 [&>svg]:size-3.5",
        props.nested && "top-1",
      )}
    >
      <RiExternalLinkLine />
    </SidebarMenuBadge>
  );
}

function SidebarPageRow(props: {
  title: string;
  href: string;
  isActive: boolean;
  nested?: boolean;
}) {
  const external = isExternalLink(props.href);

  if (props.nested) {
    return (
      <>
        <SidebarMenuSubButton
          asChild
          isActive={props.isActive}
          size="md"
          className={cn(external && "pr-7")}
        >
          <Link href={props.href}>
            <span>{props.title}</span>
          </Link>
        </SidebarMenuSubButton>
        {external ? <ExternalLinkBadge nested /> : null}
      </>
    );
  }

  return (
    <>
      <SidebarMenuButton
        asChild
        isActive={props.isActive}
        className={cn(external && "pr-8")}
      >
        <Link href={props.href}>
          <span>{props.title}</span>
        </Link>
      </SidebarMenuButton>
      {external ? <ExternalLinkBadge /> : null}
    </>
  );
}

function SidebarNestedGroup(props: {
  node: SidebarConfigGroup;
  depth: number;
}) {
  const { bundle, route } = useDocPageContext();
  const label = props.node.group ?? "More";
  const locales = bundle.config.locales;
  const hasActive = subtreeHasActivePage(route, props.node.pages, locales);
  const groupHrefActive =
    props.node.href != null &&
    isDocHrefActive(route, props.node.href, locales);

  const isActive = hasActive || groupHrefActive;

  if (props.depth === 0) {
    return (
      <Collapsible defaultOpen={isActive}>
        <SidebarMenuItem className="pb-1">
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip={label} isActive={isActive}>
              <span className="truncate">{label}</span>
              <RiArrowRightSLine className="ml-auto size-4 shrink-0 transition-transform duration-200 [[data-state=open]>&]:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              <SidebarPagesList
                pages={props.node.pages}
                depth={props.depth + 1}
              />
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  return (
    <Collapsible defaultOpen={isActive}>
      <SidebarMenuSubItem className="pb-1">
        <CollapsibleTrigger asChild>
          <SidebarMenuSubButton isActive={isActive}>
            <span className="truncate">{label}</span>
            <RiArrowRightSLine className="ml-auto size-4 shrink-0 transition-transform duration-200 [[data-state=open]>&]:rotate-90" />
          </SidebarMenuSubButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="mx-3.5 border-l border-sidebar-border px-2.5 py-0.5">
            <SidebarPagesList
              pages={props.node.pages}
              depth={props.depth + 1}
            />
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuSubItem>
    </Collapsible>
  );
}

function SidebarPagesList(props: {
  pages: SidebarConfigGroup["pages"];
  depth: number;
}) {
  const { bundle, route } = useDocPageContext();
  const locales = bundle.config.locales;

  return (
    <>
      {props.pages.map((item, index) => {
        const key = `page-${props.depth}-${index}`;

        if (isPageLink(item)) {
          const link = item as { title: string; href: string };
          const active = isDocHrefActive(route, link.href, locales);
          if (props.depth > 0) {
            return (
              <SidebarMenuSubItem key={key} className="pb-1">
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
            <SidebarMenuItem key={key} className="pb-1">
              <SidebarPageRow
                title={link.title}
                href={link.href}
                isActive={active}
              />
            </SidebarMenuItem>
          );
        }

        return (
          <SidebarNestedGroup
            key={key}
            node={item as SidebarConfigGroup}
            depth={props.depth}
          />
        );
      })}
    </>
  );
}

export function Navigation() {
  const { bundle, route } = useDocPageContext();
  const tabs = useDocTabs();
  const hasTabs = tabs.length > 0;
  const activeTabId = resolveActiveTabId(route, tabs, bundle.config.locales);
  const groups = getSidebarGroups(bundle.config).filter((g) => {
    if (!g.tab) {
      return true;
    }
    if (!hasTabs) {
      return true;
    }
    return g.tab === activeTabId;
  });

  return (
    <Sidebar
      variant="sidebar"
      className={cn(
        "sticky bottom-auto max-h-none will-change-transform",
        hasTabs
          ? "top-[calc(5rem+1px)] h-[calc(100svh-5rem-1px)]"
          : "top-[calc(3rem+1px)] h-[calc(100svh-3rem-1px)]",
      )}
    >
      <div className="relative flex min-h-0 flex-1 flex-col">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-12 bg-linear-to-b from-background to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12 bg-linear-to-t from-background to-transparent"
        />
        <SidebarContent className="relative flex-1 bg-background py-5 pl-2">
          {groups.map((group, gi) => (
            <SidebarGroup
              key={`${group.group ?? "group"}-${gi}`}
              className="group-data-[collapsible=icon]:hidden"
            >
              {group.group ? (
                <SidebarGroupLabel
                  className={cn(!group.pages?.length && "sr-only")}
                >
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
      {route.requestMode !== 'preview' && (
        <SidebarFooter className="bg-background p-2">
          <GithubSource />
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
