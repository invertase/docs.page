import React from 'react';
// import { useCallback, useState } from 'react';
import cx from 'classnames';
import { NextRouter, useRouter } from 'next/router';

import { SidebarItem } from '../utils/projectConfig';
import { isExternalLink, Link } from './Link';
import { SlugProperties } from '../utils/properties';
import { useConfig, usePreviewMode, useSlugProperties } from '../hooks';

// Sidebar wrapper - iterates the config and renders a sidebar.
export function Sidebar(): JSX.Element {
  const config = useConfig();

  return (
    <ul className="w-full dark:text-white text-sm">
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
  const previewMode = usePreviewMode();
  // If [string, string] render as a Link
  if (typeof item[1] === 'string') {
    return (
      <NavLink
        href={item[1]}
        active={isRouteMatch(router, properties, item[1], previewMode.enabled)}
      >
        {item[0]}
      </NavLink>
    );
  }

  return <NavigationList title={item[0]} depth={depth} items={item[1]} />;
}

function NavigationList({
  title,
  depth,
  items,
}: {
  title: string;
  depth: number;
  items: SidebarItem[];
}) {
  return (
    <li className="mt-1">
      <Title title={title} />
      <ul className="relative" style={{ marginLeft: `${depth * 10}px` }}>
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
function Title({ title }: { title: string }) {
  return (
    <div className="-ml-2 px-2 flex items-center rounded group py-1">
      <span className="flex-1 font-semibold">{title}</span>
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
        className={cx('flex px-2 py-1 rounded', {
          'text-theme-color font-semibold': active,
          'opacity-75 hover:opacity-100': !active,
        })}
      >
        {children}
      </Link>
    </li>
  );
}

/**
 * Returns whether a given link matches the current route.
 *
 * @param router
 * @param properties
 * @param link
 */
function isRouteMatch(
  router: NextRouter,
  _properties: SlugProperties,
  link: string,
  previewMode = false,
) {
  // External links can never be active
  if (isExternalLink(link)) {
    return false;
  }
  if (previewMode) {
    return window.location.hash.split('#')[1] === link;
  }

  const currentPath = `/${((router.query.slug as string[]) || []).join('/')}`;

  return currentPath === link;
}
