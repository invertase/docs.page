import { RiArrowRightSLine, RiExternalLinkLine } from "@remixicon/react";
import { type MouseEvent, useEffect, useState } from "react";
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
            <span className="min-w-0 wrap-break-word">{props.title}</span>
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
          <span className="min-w-0 wrap-break-word">{props.title}</span>
        </Link>
      </SidebarMenuButton>
      {external ? <ExternalLinkBadge /> : null}
    </>
  );
}

function SidebarLinkedGroupRow(props: {
  href: string;
  label: string;
  icon?: string;
  isActive: boolean;
  open: boolean;
  onClick: (event: MouseEvent<HTMLAnchorElement>) => void;
  nested?: boolean;
  tooltip?: string;
}) {
  const external = isExternalLink(props.href);
  const row = (
    <>
      {props.icon ? <SidebarNavIcon icon={props.icon} /> : null}
      <span className="min-w-0 flex-1 wrap-break-word">{props.label}</span>
      <RiArrowRightSLine
        className={cn(
          "ml-auto size-4 shrink-0 transition-transform duration-200",
          props.open && "rotate-90",
        )}
      />
    </>
  );

  if (props.nested) {
    return (
      <>
        <SidebarMenuSubButton
          asChild
          isActive={props.isActive}
          size="md"
          className={cn("text-muted-foreground", external && "pr-7")}
        >
          <Link href={props.href} onClick={props.onClick}>
            {row}
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
        tooltip={props.tooltip}
        isActive={props.isActive}
        className={cn(external && "pr-8")}
      >
        <Link href={props.href} onClick={props.onClick}>
          {row}
        </Link>
      </SidebarMenuButton>
      {external ? <ExternalLinkBadge /> : null}
    </>
  );
}

function SidebarCollapsibleGroupTrigger(props: {
  label: string;
  icon?: string;
  isActive: boolean;
  nested?: boolean;
  tooltip?: string;
}) {
  const trigger = (
    <>
      {props.icon ? <SidebarNavIcon icon={props.icon} /> : null}
      <span className="min-w-0 flex-1 wrap-break-word">{props.label}</span>
      <RiArrowRightSLine className="ml-auto size-4 shrink-0 transition-transform duration-200 in-data-[state=open]:rotate-90" />
    </>
  );

  if (props.nested) {
    return (
      <CollapsibleTrigger asChild>
        <SidebarMenuSubButton
          isActive={props.isActive}
          className="text-muted-foreground"
        >
          {trigger}
        </SidebarMenuSubButton>
      </CollapsibleTrigger>
    );
  }

  return (
    <CollapsibleTrigger asChild>
      <SidebarMenuButton tooltip={props.tooltip} isActive={props.isActive}>
        {trigger}
      </SidebarMenuButton>
    </CollapsibleTrigger>
  );
}

function SidebarCollapsibleNestedGroup(props: {
  node: SidebarConfigGroup;
  depth: number;
  label: string;
  isActive: boolean;
}) {
  const [open, setOpen] = useState(props.isActive);
  const nested = props.depth > 0;
  const href = props.node.href;
  const triggerProps = {
    label: props.label,
    icon: props.node.icon,
    isActive: props.isActive,
    nested,
    tooltip: nested ? undefined : props.label,
  };

  useEffect(() => {
    if (props.isActive) {
      setOpen(true);
    }
  }, [props.isActive]);

  const handleGroupClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (open) {
      event.preventDefault();
      setOpen(false);
      return;
    }

    setOpen(true);
  };

  const trigger = href ? (
    <SidebarLinkedGroupRow
      href={href}
      {...triggerProps}
      open={open}
      onClick={handleGroupClick}
    />
  ) : (
    <SidebarCollapsibleGroupTrigger {...triggerProps} />
  );

  const children = (
    <CollapsibleContent>
      <SidebarMenuSub
        className={cn(
          "gap-1 py-0",
          nested && "mx-3.5 border-l border-sidebar-border px-2.5",
        )}
      >
        <SidebarPagesList pages={props.node.pages} depth={props.depth + 1} />
      </SidebarMenuSub>
    </CollapsibleContent>
  );

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      {nested ? (
        <SidebarMenuSubItem className="flex flex-col gap-1">
          {trigger}
          {children}
        </SidebarMenuSubItem>
      ) : (
        <SidebarMenuItem className="flex flex-col gap-1">
          {trigger}
          {children}
        </SidebarMenuItem>
      )}
    </Collapsible>
  );
}

function SidebarNestedGroup(props: {
  node: SidebarConfigGroup;
  depth: number;
}) {
  const { bundle, route } = useDocPageContext();
  const label = props.node.group ?? "More";
  const locales = bundle.config.locales;
  const hasChildren = props.node.pages.length > 0;
  const hasActive = subtreeHasActivePage(route, props.node.pages, locales);
  const groupHrefActive =
    props.node.href != null && isDocHrefActive(route, props.node.href, locales);

  const isActive = hasActive || groupHrefActive;
  const nested = props.depth > 0;

  if (props.node.href && !hasChildren) {
    if (nested) {
      return (
        <SidebarMenuSubItem className="text-muted-foreground">
          <SidebarPageRow
            title={label}
            href={props.node.href}
            icon={props.node.icon}
            isActive={groupHrefActive}
            nested
          />
        </SidebarMenuSubItem>
      );
    }

    return (
      <SidebarMenuItem className="text-muted-foreground">
        <SidebarPageRow
          title={label}
          href={props.node.href}
          icon={props.node.icon}
          isActive={groupHrefActive}
        />
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarCollapsibleNestedGroup
      node={props.node}
      depth={props.depth}
      label={label}
      isActive={isActive}
    />
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
              <SidebarMenuSubItem key={key} className="text-muted-foreground">
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
            <SidebarMenuItem key={key} className="text-muted-foreground">
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
                group.href ? (
                  <SidebarGroupLabel
                    asChild
                    className={cn(
                      "mb-1 flex items-center gap-2",
                      !group.pages?.length && "sr-only",
                    )}
                  >
                    <Link
                      href={group.href}
                      className="hover:text-sidebar-foreground"
                    >
                      {group.icon ? <SidebarNavIcon icon={group.icon} /> : null}
                      {group.group}
                    </Link>
                  </SidebarGroupLabel>
                ) : (
                  <SidebarGroupLabel
                    className={cn(
                      "mb-1 flex items-center gap-2",
                      !group.pages?.length && "sr-only",
                    )}
                  >
                    {group.icon ? <SidebarNavIcon icon={group.icon} /> : null}
                    {group.group}
                  </SidebarGroupLabel>
                )
              ) : null}
              <SidebarGroupContent>
                <SidebarMenu className="gap-1 text-muted-foreground">
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
