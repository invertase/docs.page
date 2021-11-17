import React, { useCallback, useState } from 'react';
import cx from 'classnames';
import { NextRouter, useRouter } from 'next/router';

import { SidebarItem } from '../utils/projectConfig';
import { isExternalLink, Link } from './Link';
import { SlugProperties } from '../utils/properties';
import { useConfig, useSlugProperties } from '../hooks';

// Sidebar wrapper - iterates the config and renders a sidebar.
export function Sidebar(): JSX.Element {
  const config = useConfig();

  return <AbstractSidebar data={config.sidebar} />;
}

export function AbstractSidebar({ data }: { data: SidebarItem[] }): JSX.Element {
  return (
    <ul className="w-full dark:text-white">
      {data.map((item, index) => (
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
        className={cx('relative', {
          'overflow-hidden h-0': !isActive,
        })}
        style={{ marginLeft: `${depth * 10}px` }}
      >
        <li className="absolute left-[-10px] top-[10px] inset-y-0 w-[1px] bg-gray-200 dark:bg-gray-700"></li>
        {items.map((subItem, index) => (
          <Iterator key={`${depth}-${index.toString()}`} depth={depth + 1} item={subItem} />
        ))}
      </ul>
    </li>
  );
}

/**
 * Toggable title in the sidebar
 */
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
      className="-ml-2 px-2 flex items-center rounded group py-1"
      role="button"
      tabIndex={0}
      onClick={() => onToggle()}
    >
      <span
        className={cx('flex-1 opacity-75 font-semibold hover:opacity-100', {
          'opacity-100': active,
        })}
      >
        {title}
      </span>
      <span
        style={{
          width: 16,
          height: 16,
          transform: `rotate(${active ? '90deg' : '0deg'})`,
          transition: 'transform .1s ease-in-out',
        }}
      >
        <svg
          width={16}
          height={16}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className={cx('text-gray-600 dark:text-gray-400 transition-opacity', {
            'opacity-50': !active,
          })}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </div>
  );
}

/**
 * A single navigation URL in the sidebar.
 */
function NavLink({ href, children, active }: { href: string; children: string; active: boolean }) {
  return (
    <li className="-ml-2 mt-1">
      <Link
        href={href}
        className={cx('flex px-2 py-1 rounded font-semibold', {
          'text-theme-color': active,
          'opacity-75 hover:opacity-100': !active,
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

  const currentPath = `/${((router.query.slug as string[]) || []).join('/')}`;

  if (link === '/') {
    return currentPath === '/';
  }

  path = `${path}${link}`;

  console.log(currentPath);
  console.log('/' + path.split('/').slice(-1)[0]);
  
  return currentPath === '/' + path.split('/').slice(-1)[0];
}
