import React, { useCallback, useState } from 'react';
import cx from 'classnames';
import { NextRouter, useRouter } from 'next/router';

import { SidebarItem } from '../config';
import { isExternalLink, Link } from './Link';
import { SlugProperties } from '../properties';
import { useConfig, useSlugProperties } from '../hooks';

// Sidebar wrapper - iterates the config and renders a sidebar.
export function Sidebar() {
  const config = useConfig();

  return (
    <ul className="w-full p-4 dark:text-white mb-4">
      {config.sidebar.map((item, index) => (
        <Iterator key={index} depth={1} item={item} />
      ))}
    </ul>
  );
}

// The [SidebarItem] iterator, returns a [Title] or [NavLink].
function Iterator({ item, depth }: { item: SidebarItem; depth: number }) {
  const router = useRouter();
  const properties = useSlugProperties();

  // If [string, string] render as a Link
  if (typeof item[1] === 'string') {
    return (
      <NavLink href={item[1]} active={isRouteMatch(router, properties, item[1])}>
        {item[0]}
      </NavLink>
    );
  }

  // Otherwise, it's a nested element
  const links = getChildrenLinks(item[1]);

  const isActive = !!links.find(link => isRouteMatch(router, properties, link));

  return (
    <NavigationList isInitiallyActive={isActive} title={item[0]} depth={depth} items={item[1]} />
  );
}

function NavigationList({
  title,
  isInitiallyActive,
  depth,
  items,
}: {
  title: string;
  isInitiallyActive: boolean;
  depth: number;
  items: SidebarItem[];
}) {
  const [isActive, setIsActive] = useState<boolean>(isInitiallyActive);

  const onToggle = useCallback(() => {
    setIsActive($ => !$);
  }, [isInitiallyActive]);

  return (
    <li className="mt-1">
      <Title title={title} active={isActive} onToggle={onToggle} />
      <ul
        className={cx({
          'overflow-hidden h-0': !isActive,
        })}
        style={{ marginLeft: `${depth / 2}rem` }}
      >
        {items.map((subItem, index) => (
          <Iterator key={`${depth}-${index.toString()}`} depth={depth + 1} item={subItem} />
        ))}
      </ul>
    </li>
  );
}

// Toggable title in the sidebar
function Title({
  title,
  active,
  onToggle,
}: {
  title: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="-ml-2 px-2 flex items-center rounded group hover:bg-gray-200 dark:hover:bg-gray-900 py-2"
      role="button"
      onClick={() => onToggle()}
    >
      <span
        className={cx('flex-1', {
          'text-theme-color': active,
        })}
      >
        {title}
      </span>
      <span
        style={{
          width: 20,
          height: 20,
          transform: `rotate(${active ? '90deg' : '0deg'})`,
          transition: 'transform .1s ease-in-out',
        }}
      >
        <svg
          width={20}
          height={20}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </div>
  );
}

// A single navigation URL in the sidebar.
function NavLink({ href, children, active }: { href: string; children: string; active: boolean }) {
  return (
    <li className="-ml-2 mt-1">
      <Link
        href={href}
        className={cx('flex px-2 py-2 rounded transition-colors duration-100', {
          'text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-700': active,
          'hover:bg-gray-200 dark:hover:bg-gray-700': !active,
        })}
      >
        {children}
      </Link>
    </li>
  );
}

/**
 * Extracts all child links from a [SidebarItem] list.
 *
 * @param items
 * @param initialLinks
 */
function getChildrenLinks(items: SidebarItem[], initialLinks: string[] = []): string[] {
  let links: string[] = [...initialLinks];

  items.forEach((item: SidebarItem) => {
    if (typeof item[1] === 'string') links.push(item[1]);
    else links = [...links, ...getChildrenLinks(item[1], links)];
  });

  return links;
}

/**
 * Returns whether a given link matches the current route.
 *
 * @param router
 * @param properties
 * @param link
 */
function isRouteMatch(router: NextRouter, properties: SlugProperties, link: string) {
  // External links can never be active
  if (isExternalLink(link)) {
    return false;
  }

  let path = properties.base;

  if (link !== '/') {
    path = `${path}${link}`;
  }

  const currentPath = `/${(router.query.slug as string[]).join('/')}`;
  return currentPath === path;
}
