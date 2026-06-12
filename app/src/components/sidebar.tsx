import { RiArrowRightSLine, RiExternalLinkLine } from "@remixicon/react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarContent,
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
  Sidebar as SidebarPrimitive,
} from "@/components/ui/sidebar";
import { useDocPageContext } from "@/hooks/use-doc-page-context";
import { useDocTabs } from "@/hooks/use-doc-tabs";
import { useSidebar } from "@/hooks/use-sidebar";
import { isExternalLink } from "@/lib/docs-links";
import { isDocHrefActive } from "@/lib/docs-nav";
import { cn } from "@/lib/utils";
import type { SidebarGroup as SidebarConfigGroup } from "@/server/config/models/sidebar";
import { Anchors } from "./anchors";
import { Link } from "./doc-link";
import { LocaleSwitcher } from "./locale-switcher";
import { Icon } from "./mdx/icon";
import { Separator } from "./ui/separator";

type SidebarPageLink = Extract<
  SidebarConfigGroup["pages"][number],
  { title: string }
>;

function SidebarNavIcon(props: { icon: string }) {
  if (isExternalLink(props.icon)) {
    return (
      <img
        src={props.icon}
        alt=""
        aria-hidden
        className="size-4 shrink-0 object-contain"
      />
    );
  }
  return (
    <span className="inline-flex shrink-0 text-sm leading-none text-sidebar-foreground [&>div]:contents opacity-80">
      <Icon name={props.icon} size={14} />
    </span>
  );
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
      const link = p as SidebarPageLink;
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
  icon?: string;
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
          className={cn("text-muted-foreground", external && "pr-7")}
        >
          <Link href={props.href}>
            {props.icon ? <SidebarNavIcon icon={props.icon} /> : null}
            <span className="truncate">{props.title}</span>
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
          {props.icon ? <SidebarNavIcon icon={props.icon} /> : null}
          <span className="truncate">{props.title}</span>
        </Link>
      </SidebarMenuButton>
      {external ? <ExternalLinkBadge /> : null}
    </>
  );
}

function SidebarNestedGroupLabel(props: {
  icon?: string;
  label: string;
}) {
  return (
    <>
      {props.icon ? <SidebarNavIcon icon={props.icon} /> : null}
      <span className="truncate">{props.label}</span>
    </>
  );
}

function SidebarNestedGroupChevron(props: { className?: string }) {
  return (
    <RiArrowRightSLine
      className={cn(
        "size-4 shrink-0 transition-transform duration-200 [[data-state=open]>&]:rotate-90",
        props.className,
      )}
    />
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

  const isOpen = hasActive || groupHrefActive;
  const href = props.node.href;

  const childList = (
    <CollapsibleContent>
      {props.depth === 0 ? (
        <SidebarMenuSub>
          <SidebarPagesList pages={props.node.pages} depth={props.depth + 1} />
        </SidebarMenuSub>
      ) : (
        <SidebarMenuSub className="mx-3.5 border-l border-sidebar-border px-2.5 py-0.5">
          <SidebarPagesList pages={props.node.pages} depth={props.depth + 1} />
        </SidebarMenuSub>
      )}
    </CollapsibleContent>
  );

  if (href) {
    if (props.depth === 0) {
      return (
        <Collapsible defaultOpen={isOpen}>
          <SidebarMenuItem className="pb-1">
            <div className="flex items-center gap-0.5">
              <SidebarMenuButton
                asChild
                tooltip={label}
                isActive={groupHrefActive}
                className="min-w-0 flex-1"
              >
                <Link href={href}>
                  <SidebarNestedGroupLabel
                    icon={props.node.icon}
                    label={label}
                  />
                </Link>
              </SidebarMenuButton>
              <CollapsibleTrigger
                className={cn(
                  "group flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  hasActive && "text-sidebar-foreground",
                )}
                aria-label={`${label} section`}
              >
                <SidebarNestedGroupChevron className="group-data-[state=open]:rotate-90" />
              </CollapsibleTrigger>
            </div>
            {childList}
          </SidebarMenuItem>
        </Collapsible>
      );
    }

    return (
      <Collapsible defaultOpen={isOpen}>
        <SidebarMenuSubItem className="pb-1">
          <div className="flex items-center gap-0.5">
            <SidebarMenuSubButton
              asChild
              isActive={groupHrefActive}
              size="md"
              className="min-w-0 flex-1 text-muted-foreground"
            >
              <Link href={href}>
                <SidebarNestedGroupLabel
                  icon={props.node.icon}
                  label={label}
                />
              </Link>
            </SidebarMenuSubButton>
            <CollapsibleTrigger
              className={cn(
                "group flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                hasActive && "text-sidebar-foreground",
              )}
              aria-label={`${label} section`}
            >
              <SidebarNestedGroupChevron className="group-data-[state=open]:rotate-90" />
            </CollapsibleTrigger>
          </div>
          {childList}
        </SidebarMenuSubItem>
      </Collapsible>
    );
  }

  if (props.depth === 0) {
    return (
      <Collapsible defaultOpen={isOpen}>
        <SidebarMenuItem className="pb-1">
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip={label} isActive={isOpen}>
              <SidebarNestedGroupLabel icon={props.node.icon} label={label} />
              <SidebarNestedGroupChevron className="ml-auto" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          {childList}
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  return (
    <Collapsible defaultOpen={isOpen}>
      <SidebarMenuSubItem className="pb-1">
        <CollapsibleTrigger asChild>
          <SidebarMenuSubButton
            isActive={isOpen}
            className="text-muted-foreground"
          >
            <SidebarNestedGroupLabel icon={props.node.icon} label={label} />
            <SidebarNestedGroupChevron className="ml-auto" />
          </SidebarMenuSubButton>
        </CollapsibleTrigger>
        {childList}
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
          const link = item as SidebarPageLink;
          const active = isDocHrefActive(route, link.href, locales);
          if (props.depth > 0) {
            return (
              <SidebarMenuSubItem
                key={key}
                className="pb-1 text-muted-foreground"
              >
                <SidebarPageRow
                  title={link.title}
                  href={link.href}
                  icon={link.icon}
                  isActive={active}
                  nested
                />
              </SidebarMenuSubItem>
            );
          }
          return (
            <SidebarMenuItem key={key} className="pb-1 text-muted-foreground">
              <SidebarPageRow
                title={link.title}
                href={link.href}
                icon={link.icon}
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

export function Sidebar() {
  const tabs = useDocTabs();
  const hasTabs = tabs.length > 0;
  const groups = useSidebar();

  return (
    <SidebarPrimitive
      variant="sidebar"
      className={cn(
        "sticky bottom-auto max-h-none will-change-transform border-none",
        hasTabs
          ? "top-[calc(6rem+1px)] h-[calc(100svh-6rem-1px)]"
          : "top-[calc(4rem+1px)] h-[calc(100svh-4rem-1px)]",
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
        <SidebarContent className="relative flex-1 bg-background py-8 pl-2">
          <LocaleSwitcher />
          <Anchors />
          {groups.map((group, gi) => (
            <SidebarGroup
              key={`${group.group ?? "group"}-${gi}`}
              className="group-data-[collapsible=icon]:hidden"
            >
              {group.group && gi > 0 ? <Separator className="mb-4" /> : null}
              {group.group ? (
                <SidebarGroupLabel
                  className={cn(
                    "flex items-center gap-2",
                    !group.pages?.length && "sr-only",
                  )}
                >
                  {group.icon ? <SidebarNavIcon icon={group.icon} /> : null}
                  {group.group}
                </SidebarGroupLabel>
              ) : null}
              <SidebarGroupContent>
                <SidebarMenu className="text-muted-foreground">
                  <SidebarPagesList pages={group.pages} depth={0} />
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
      </div>
    </SidebarPrimitive>
  );
}
