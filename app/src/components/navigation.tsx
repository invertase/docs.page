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
  docsContentTopPaddingClassName,
  docsNavMaxHeightClassName,
  docsStickyOffsetClassName,
} from "@/lib/docs-layout";
import { isDocHrefActive, resolveActiveTabId } from "@/lib/docs-routing";
import { getSidebarGroups, subtreeHasActivePage } from "@/lib/docs-sidebar";
import { cn } from "@/lib/utils";
import type { SidebarGroup as SidebarConfigGroup } from "@/server/config/models/sidebar";
import { Link } from "./doc-link";

function isPageLink(item: SidebarConfigGroup["pages"][number]): boolean {
  return "title" in item;
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
          className={cn("text-muted-foreground/80", external && "pr-7")}
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
    props.node.href != null && isDocHrefActive(route, props.node.href, locales);

  const isActive = hasActive || groupHrefActive;

  if (props.depth === 0) {
    return (
      <Collapsible defaultOpen={isActive}>
        <SidebarMenuItem className="pb-1">
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              tooltip={label}
              isActive={isActive}
              className="!py-0"
            >
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
          <SidebarMenuSubButton
            isActive={isActive}
            className="text-muted-foreground/80"
          >
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
              <SidebarMenuSubItem
                key={key}
                className="pb-1 text-muted-foreground/80"
              >
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
            <SidebarMenuItem
              key={key}
              className="pb-1 text-muted-foreground/80"
            >
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
      collapsible="none"
      className={cn(
        "sticky z-20 self-start max-h-none border-none",
        docsStickyOffsetClassName(hasTabs),
        docsNavMaxHeightClassName(hasTabs),
      )}
    >
      <div className="relative flex min-h-0 flex-1 flex-col">
        <SidebarContent className="relative flex-1 bg-background pb-5 pl-2">
          {groups.map((group, gi) => (
            <SidebarGroup
              key={`${group.group ?? "group"}-${gi}`}
              className={cn(
                "group-data-[collapsible=icon]:hidden",
                gi === 0 && docsContentTopPaddingClassName,
              )}
            >
              {group.group ? (
                <SidebarGroupLabel
                  className={cn(
                    "font-light",
                    !group.pages?.length && "sr-only",
                  )}
                >
                  {group.group}
                </SidebarGroupLabel>
              ) : null}
              <SidebarGroupContent className={group.group ? "mt-2" : undefined}>
                <SidebarMenu className="text-muted-foreground/80">
                  <SidebarPagesList pages={group.pages} depth={0} />
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
      </div>
    </Sidebar>
  );
}
