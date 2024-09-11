import { createContext, useContext, useEffect, useState } from "react";
import type { BundlerOutput, SidebarGroup } from "./api";
import { getAssetSrc, getHref, getLocale, isExternalLink } from "./utils";

type BaseContext = {
  // The relative path of the current page, e.g. `/contributing`.
  path: string;
  // The bundle output for the current page.
  bundle: BundlerOutput;
};

type PreviewContext = BaseContext & {
  // The page is in preview mode.
  preview: true;
  // Returns a blob URL src for a given path.
  getFile: (path: string) => Promise<string | undefined>;
};

export type DocsPageContext = BaseContext & {
  // The owner of the repository, e.g. `invertase`.
  owner: string;
  // The repository name, e.g. `docs.page`.
  repository: string;
  // The branch or tag of the repository, e.g. `main`.
  ref?: string;
  // The domain assigned to the repository, e.g. `use.docs.page`.
  domain?: string;
  // Whether the page is using a vanity domain, e.g. `:org.docs.page/repo`
  vanity?: boolean;
  // The page is not in preview mode.
  preview: false;
};

export type Context = DocsPageContext | PreviewContext;

export const PageContext = createContext<Context | undefined>(undefined);

// Returns the current page context.
export function usePageContext(): Context {
  const context = useContext(PageContext);

  if (!context) {
    throw new Error(
      "usePageContext must be used within a PageContext.Provider",
    );
  }

  return context;
}

// Returns a src url for a given asset path.
export function useAssetSrc(path: string) {
  const ctx = usePageContext();
  const isPreview = ctx.preview;
  const isExternal = isExternalLink(path);

  const [src, setSrc] = useState(
    isExternal || !isPreview ? getAssetSrc(ctx, path) : "",
  );

  useEffect(() => {
    if (isExternal || !isPreview) return;
    ctx.getFile(path).then((src) => setSrc(src || ""));
  }, [ctx, isExternal, isPreview, path]);

  return src;
}

// Returns the current locale.
//
// This is determined by the first segment of the path, e.g. `/fr/getting-started` would return `fr`.
// For it to be considered a valid locale, it must be included in the `locales` array of the bundle config,
// which is derived from the sidebar configuration.
export function useLocale(): string | undefined {
  const ctx = usePageContext();
  return getLocale(ctx);
}

// Returns the tabs for the current page and locale.
export function useTabs() {
  const context = usePageContext();
  const locale = useLocale();
  const tabs = context.bundle.config.tabs;

  // If no locale is set, return tabs that are not locale-specific.
  if (!locale) {
    return tabs.filter((tab) => !tab.locale);
  }

  // Otherwise, return tabs that match the current locale.
  return tabs.filter((tab) => tab.locale === locale);
}

// Returns the sidebar for the current page and locale.
export function useSidebar(): SidebarGroup[] {
  const ctx = usePageContext();
  const locale = useLocale();
  const activeTab = useActiveTab();

  let sidebar: SidebarGroup[] = [];
  if (locale && !Array.isArray(ctx.bundle.config.sidebar)) {
    sidebar = ctx.bundle.config.sidebar[locale];
  } else if (!Array.isArray(ctx.bundle.config.sidebar)) {
    sidebar = ctx.bundle.config.sidebar.default || [];
  } else {
    sidebar = ctx.bundle.config.sidebar;
  }

  if (activeTab !== undefined) {
    return sidebar.filter((group) => {
      return group.tab === activeTab || !group.tab;
    });
  }

  return sidebar;
}

// Resolves a path to a full URL.
export function useHref(path: string, ignoreLocale: boolean = false): string {
  const ctx = usePageContext();
  return getHref(ctx, path, ignoreLocale);
}

// Returns the active tab for the current page.
export function useActiveTab(): string | undefined {
  const ctx = usePageContext();
  const tabs = useTabs();

  if (!tabs.length) {
    return;
  }

  let closestTab: string | undefined = undefined;
  let maxSegments = -1;

  for (const tab of tabs) {
    const tabSegments = tab.href.split("/").filter(Boolean);
    const pathSegments = ctx.path.split("/").filter(Boolean);
    let matchCount = 0;

    // Count matching segments
    for (let i = 0; i < tabSegments.length; i++) {
      if (
        tabSegments[i] === pathSegments[i] ||
        tabSegments[i] === "*" ||
        tabSegments[i].startsWith(":")
      ) {
        matchCount++;
      } else {
        break;
      }
    }

    // Update the closest tab if this tab matches more segments
    if (matchCount > maxSegments && matchCount === tabSegments.length) {
      closestTab = tab.id;
      maxSegments = matchCount;
    }
  }

  return closestTab;
}

// Returns the source URL for the current page.
export function useSourceUrl() {
  const ctx = usePageContext();

  if (ctx.preview) {
    return "#";
  }

  const source = ctx.bundle.source;

  return [
    "https://github.com/",
    ctx.owner,
    "/",
    ctx.repository,
    "/edit/",
    source.type === "branch" && source.ref !== "HEAD"
      ? source.ref
      : ctx.bundle.baseBranch,
    "/docs/",
    ctx.bundle.path,
    ".mdx",
  ].join("");
}

// Returns the GitHub reference URL for the current page.
export function useRefUrl() {
  const ctx = usePageContext();

  if (ctx.preview || !ctx.ref) {
    return "#";
  }

  const source = ctx.bundle.source;
  const base = `https://github.com/${ctx.owner}/${ctx.repository}`;

  if (source.ref === "HEAD") return base;
  if (source.type === "branch") return `${base}/tree/${source.ref}`;
  if (source.type === "commit") return `${base}/commit/${source.ref}`;
  if (source.type === "PR") return `${base}/pull/${source.ref}`;

  return "#";
}
