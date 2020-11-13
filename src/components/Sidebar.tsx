import React, { useContext } from "react";
import cx from "classnames";
import { NextRouter, useRouter } from "next/router";

import { ConfigContext, SidebarItem } from "../config";
import { isExternalLink, Link } from "./Link";
import { SlugProperties, SlugPropertiesContext } from "../properties";

// Sidebar wrapper - iterates the config and renders a sidebar.
export function Sidebar() {
  const config = useContext(ConfigContext);

  return (
    <ul className="w-full">
      {config.sidebar.map((item) => (
        <Iterator depth={0} item={item} />
      ))}
    </ul>
  );
}

// The [SidebarItem] iterator, returns a [Title] or [NavLink].
function Iterator({ item, depth }: { item: SidebarItem; depth: number }) {
  const router = useRouter();
  const properties = useContext(SlugPropertiesContext);

  // If [string, string] render as a Link
  if (typeof item[1] === "string") {
    return (
      <NavLink
        href={item[1]}
        active={isRouteMatch(router, properties, item[1])}
      >
        {item[0]}
      </NavLink>
    );
  }

  // Otherwise, it's a nested element
  const links = getChildrenLinks(item[1], []);

  const isActive = !!links.find((link) =>
    isRouteMatch(router, properties, link)
  );

  return (
    <ul>
      <li>
        <Title active={isActive} title={item[0]} />
        <ul style={{ paddingLeft: `${(depth + 1) / 2}rem` }}>
          {item[1].map((subItem) => (
            <Iterator depth={depth + 1} item={subItem} />
          ))}
        </ul>
      </li>
    </ul>
  );
}

// Toggable title in the sidebar
function Title({ title, active }: { title: string; active: boolean }) {
  return (
    <li>
      <div
        className="-mx-2 px-2 flex items-center rounded group hover:bg-gray-200 py-2"
        role="button"
      >
        <span
          className={cx("flex-1", {
            "text-theme-color": active,
          })}
        >
          {title}
        </span>
        <span
          className={cx("transform transition-rotate duration-100", {
            "rotate-00": true,
          })}
          style={{ width: 20, height: 20 }}
        >
          <svg
            width="20"
            height="20"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </span>
      </div>
    </li>
  );
}

// A single navigation URL in the sidebar.
function NavLink({
  href,
  children,
  active,
}: {
  href: string;
  children: string;
  active: boolean;
}) {
  return (
    <span>
      <Link
        href={href}
        className={cx(
          "-mx-2 px-2 mt-1 font-thin flex py-2 rounded hover:bg-gray-100",
          {
            "text-theme-color bg-gray-100": active,
          }
        )}
      >
        {children}
      </Link>
    </span>
  );
}

/**
 * Extracts all child links from a [SidebarItem] list.
 *
 * @param items
 * @param initialLinks
 */
function getChildrenLinks(
  items: SidebarItem[],
  initialLinks: string[]
): string[] {
  let links: string[] = [...initialLinks];

  items.forEach((item: SidebarItem) => {
    if (typeof item[1] === "string") links.push(item[1]);
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
function isRouteMatch(
  router: NextRouter,
  properties: SlugProperties,
  link: string
) {
  // External links can never be active
  if (isExternalLink(link)) {
    return false;
  }

  const currentPath = `/${(router.query.slug as string[]).join("/")}`;
  return currentPath === `${properties.base}${link}`;
}
