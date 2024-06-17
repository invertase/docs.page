import { NavLink, useLocation } from '@remix-run/react';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { ReactElement, cloneElement, useState } from 'react';
import { useSidebar, useHref, usePageContext } from '~/context';
import { cn, getHref } from '~/utils';

type Pages = ReturnType<typeof useSidebar>[number]['pages'];

export function Sidebar() {
  const sidebar = useSidebar();

  return (
    <div className="relative pt-5 text-sm pl-5 pb-5">
      {sidebar.map(({ group, pages }) => {
        return (
          <div key={group} className="mb-6">
            <GroupHeading title={group} />
            <SidebarLinks pages={pages} open={false} depth={0} />
          </div>
        );
      })}
    </div>
  );
}

// Displays a top-level group heading
function GroupHeading(props: { title: string }) {
  return (
    <h3 className="font-display font-medium text-[15px] mb-2 tracking-wider">{props.title}</h3>
  );
}

// A recursive sidebar navigation component, renders a list of links and groups.
function SidebarLinks(props: { pages: Pages } & { open: boolean; depth: number }) {
  return (
    <ul
      aria-expanded={props.open}
      className={cn({
        'pl-[16px]': props.depth > 0,
      })}
    >
      {props.pages.map((child, index) => {
        return <SidebarGroup key={index} group={child} depth={props.depth} />;
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
      if ('group' in page) {
        if (hasActiveChild(page.pages)) {
          return true;
        }
      } else {
        const href = getHref(ctx, page.href);
        if (location.pathname === href) {
          return true;
        }
      }
    }
    return false;
  }

  // Determine if this group has an active child link.
  const activeChild = 'group' in props.group ? hasActiveChild(props.group.pages) : false;

  const [open, setOpen] = useState(activeChild);

  if (!('group' in props.group)) {
    return (
      <li>
        <SidebarAnchor href={props.group.href} title={props.group.title} depth={props.depth} />
      </li>
    );
  }

  return (
    <li
      className={cn('relative', {
        "before:content-[''] before:absolute before:mt-9 before:border-l-[0.5px] before:inset-0 before:border-gray-700":
          open,
      })}
    >
      <SidebarAnchor
        title={props.group.group}
        depth={props.depth}
        href={props.group.href}
        icon={open ? <ChevronUpIcon size={14} /> : <ChevronDownIcon size={14} />}
        onClick={() => setOpen(open => !open)}
      />
      {open ? <SidebarLinks pages={props.group.pages} depth={props.depth + 1} open={open} /> : null}
    </li>
  );
}

// Renders a sidebar link with an optional icon.
function SidebarAnchor(props: {
  title: string;
  depth: number;
  href?: string;
  icon?: ReactElement;
  onClick?: () => void;
}) {
  const href = useHref(props.href ?? '');
  const className = cn('relative group flex items-center pr-5 py-[7.5px] text-[14px]');

  const element = props.href ? (
    <NavLink
      end
      to={href}
      className={({ isActive }) =>
        cn(className, {
          "before:content-[''] before:absolute before:border-l-2 before:-left-4 before:bottom-0 before:top-px before:border-primary":
            isActive && props.depth > 0,
          '[&>span]:text-white [&>span]:font-medium': isActive,
        })
      }
    />
  ) : (
    <div role="button" className={className} />
  );

  return cloneElement(element, {}, [
    <span key="title" className="flex-1 text-gray-400 group-hover:text-gray-100">
      {props.title}
    </span>,
    <div key="toggle" onClick={props.onClick}>
      {props.icon}
    </div>,
  ]);
}
