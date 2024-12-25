import { ChevronDownIcon, ChevronUpIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { type ReactElement, cloneElement, useState } from "react";
import { useHrefMeta, usePageContext, useSidebar } from "~/context";
import { cn, getHrefIsActive } from "~/utils";
import { Anchors } from "./Anchors";
import { Icon } from "./Icon";

type Pages = ReturnType<typeof useSidebar>[number]["pages"];

type Props = {
  onMenuToggle: () => void;
};

export function Sidebar(props: Props) {
  const sidebar = useSidebar();

  return (
    <div className="relative pt-8 text-sm pl-2 pb-5">
      <button
        type="button"
        className="absolute top-3 right-3 lg:hidden"
        onClick={props.onMenuToggle}
      >
        <XIcon size={20} />
      </button>
      <div className="space-y-6">
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
  props: { pages: Pages } & { open: boolean; depth: number }
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
  const router = useRouter();
  const ctx = usePageContext();

  // A recursive function to determine if this group
  // has an active child link. If so, it is open.
  function hasActiveChild(pages: Pages): boolean {
    let isActive = false;
    for (const page of pages) {
      if ("group" in page) {
        if (hasActiveChild(page.pages)) {
          isActive = true;
        }
      } else if (page.href) {
        isActive = getHrefIsActive(ctx, router.asPath, page.href);
      }
    }

    return isActive;
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
        isOpen={open}
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
  isOpen?: boolean;
  href?: string;
  icon?: string;
  collapse?: ReactElement;
  onClick?: () => void;
}) {
  const { href, isActive } = useHrefMeta(props.href ?? "");
  const className = cn("py-2 inline-flex gap-2 grow");
  const style = {
    paddingLeft: `${(props.depth + 1) * 12}px`,
  };

  const element = props.href ? (
    <Link
      href={href}
      onClick={props.collapse && !props.isOpen ? props.onClick : undefined}
      className={cn(className, {
        "nav-link-active": isActive,
      })}
      style={style}
    />
  ) : (
    <div
      role="button"
      className={className}
      style={style}
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
  ]);

  return (
    <div
      className={cn(
        "flex opacity-75 hover:opacity-100 mb-px relative rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-all has-[.nav-link-active]:font-bold overflow-hidden truncate",
        "has-[.nav-link-active]:opacity-100 has-[.nav-link-active]:bg-primary-light/10 dark:has-[.nav-link-active]:bg-primary-light/10  dark:hover:has-[.nav-link-active]:bg-primary-light/10  has-[.nav-link-active]:text-primary-light dark:has-[.nav-link-active]:text-primary-light"
      )}
    >
      {anchor}
      {props.collapse ? (
        <button
          key="toggle"
          type="button"
          onKeyDown={props.onClick}
          onClick={props.onClick}
          className="px-3"
        >
          {props.collapse}
        </button>
      ) : null}
    </div>
  );
}
