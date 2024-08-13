import { NavLink, useLocation } from "@remix-run/react";
import { ChevronDownIcon, ChevronUpIcon, XIcon } from "lucide-react";
import { type ReactElement, cloneElement, useState } from "react";
import { useHref, usePageContext, useSidebar } from "~/context";
import { cn, getHref } from "~/utils";
import { Anchors } from "./Anchors";
import { Icon } from "./Icon";

type Pages = ReturnType<typeof useSidebar>[number]["pages"];

type Props = {
  onMenuToggle: () => void;
};

export function Sidebar(props: Props) {
  const sidebar = useSidebar();

  return (
    <div className="relative pt-8 text-sm pl-2 pb-5 space-y-6">
      <button
        type="button"
        className="absolute top-3 right-3 lg:hidden"
        onClick={props.onMenuToggle}
      >
        <XIcon size={20} />
      </button>
      <Anchors />
      <div>
        {sidebar.map(({ group, icon, pages }) => {
          return (
            <div
              key={group}
              className={cn({
                "mt-6 first:mt-0 pr-3": group,
              })}
            >
              {group ? <GroupHeading title={group} icon={icon} /> : null}
              <SidebarLinks pages={pages} open={false} depth={0} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Displays a top-level group heading
function GroupHeading(props: { title: string; icon?: string }) {
  return (
    <h3 className="pl-3 font-semibold text-[14px] mb-4 flex items-center gap-2 text-black dark:text-white">
      {props.icon ? <Icon name={props.icon} /> : null}
      <span>{props.title}</span>
    </h3>
  );
}

// A recursive sidebar navigation component, renders a list of links and groups.
function SidebarLinks(
  props: { pages: Pages } & { open: boolean; depth: number },
) {
  return (
    <ul aria-expanded={props.open}>
      {props.pages.map((child, index) => {
        return (
          <SidebarGroup
            key={`${props.depth}-${index}`}
            group={child}
            depth={props.depth}
          />
        );
      })}
    </ul>
  );
}

// Renders a group of sidebar links, either as a link or a group of links.
function SidebarGroup(props: { group: Pages[number] } & { depth: number }) {
  const location = useLocation();
  const ctx = usePageContext();

  // A recursive function to determine if this group
  // has an active child link. If so, it is open.
  function hasActiveChild(pages: Pages): boolean {
    for (const page of pages) {
      if ("group" in page) {
        if (hasActiveChild(page.pages)) {
          return true;
        }
      } else if (page.href) {
        const href = getHref(ctx, page.href);
        if (location.pathname === href) {
          return true;
        }
      }
    }
    return false;
  }

  // Determine if this group has an active child link.
  const activeChild =
    "group" in props.group ? hasActiveChild(props.group.pages) : false;

  const [open, setOpen] = useState(activeChild);

  if ("title" in props.group) {
    return (
      <li>
        <SidebarAnchor
          href={props.group.href}
          title={props.group.title}
          depth={props.depth}
          icon={props.group.icon}
        />
      </li>
    );
  }

  return (
    <li>
      <SidebarAnchor
        title={props.group.group || ""}
        depth={props.depth}
        href={props.group.href}
        icon={props.group.icon}
        collapse={
          open ? <ChevronUpIcon size={14} /> : <ChevronDownIcon size={14} />
        }
        onClick={() => setOpen((open) => !open)}
      />
      {open ? (
        <SidebarLinks
          pages={props.group.pages}
          depth={props.depth + 1}
          open={open}
        />
      ) : null}
    </li>
  );
}

// Renders a sidebar link with an optional icon.
function SidebarAnchor(props: {
  title: string;
  depth: number;
  href?: string;
  icon?: string;
  collapse?: ReactElement;
  onClick?: () => void;
}) {
  const href = useHref(props.href ?? "");
  const className = cn("relative group flex items-center pr-5 gap-2 py-2 pl-3");

  const element = props.href ? (
    <NavLink
      end
      to={href}
      onClick={props.collapse ? props.onClick : undefined}
      className={({ isActive }) =>
        cn(className, {
          "nav-link-active": isActive,
        })
      }
    />
  ) : (
    <div
      role="button"
      className={className}
      onKeyDown={props.onClick}
      onClick={props.onClick}
    />
  );

  const anchor = cloneElement(element, {}, [
    props.icon ? (
      <span key="icon">
        <Icon key="icon" name={props.icon} />
      </span>
    ) : null,
    <span key="title" className="flex-1">
      {props.title}
    </span>,
    props.collapse ? (
      <div key="toggle" onKeyDown={props.onClick} onClick={props.onClick}>
        {props.collapse}
      </div>
    ) : null,
  ]);

  return (
    <div className="opacity-75 has-[.nav-link-active]:opacity-100 hover:opacity-100 mb-px relative rounded-md hover:bg-black/5 dark:hover:bg-white/5 has-[.nav-link-active]:bg-primary-light/10 dark:has-[.nav-link-active]:bg-primary-light/10 dark:hover:has-[.nav-link-active]:bg-primary-light/10 transition-all">
      <div
        className="has-[.nav-link-active]:font-bold has-[.nav-link-active]:text-primary-light dark:has-[.nav-link-active]:text-primary-light"
        style={{
          paddingLeft: `${props.depth * 12}px`,
        }}
      >
        {anchor}
      </div>
    </div>
  );
}
