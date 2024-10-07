import type { GetServerSidePropsContext } from "next/types";
import { createContext, useContext, useEffect, useState } from "react";
import { type BundlerOutput, type SidebarGroup, getBundle } from "./api";
import { getEnvironment } from "./env";
import {
  Redirect,
  ensureLeadingSlash,
  getAssetSrc,
  getCustomDomain,
  getHref,
  getLocale,
  isExternalLink,
} from "./utils";

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
  ref: string | null;
  // The domain assigned to the repository, e.g. `use.docs.page`.
  domain: string | null;
  // Whether the page is using a vanity domain, e.g. `:org.docs.page/repo`
  vanity: boolean;
  // The page is not in preview mode.
  preview: false;
};

export type Context = DocsPageContext | PreviewContext;

export async function getRequestContext(
  request: GetServerSidePropsContext["req"],
  opts: {
    owner: string;
    repository: string;
    path: string;
    ref: string | undefined;
  }
) {
  const { owner, repository, ref, path } = opts;

  // Checks if the incoming request is from the vanity domain proxy.
  const isVanityDomainRequest =
    request.headers["x-docs-page-vanity-domain"] !== undefined;

  // Checks if the incoming request is from a custom domain.
  const isCustomDomainRequest =
    request.headers["x-docs-page-custom-domain"] !== undefined;

  const bundle = await getBundle({
    owner,
    repository,
    path,
    ref,
  });

  // Get the current environment.
  const environment = getEnvironment();

  // Check whether the repository has a domain assigned.
  // We still do this here since we need to know if internal links
  // should be prefixed with the domain if one is set.
  const domain = await getCustomDomain(owner, repository);

  // Check if the user has set a redirect in the frontmatter of this page.
  const redirectTo =
    typeof bundle.frontmatter.redirect === "string"
      ? bundle.frontmatter.redirect
      : undefined;

  // Redirect to the specified URL.
  if (redirectTo && redirectTo.length > 0) {
    if (redirectTo.startsWith("http://") || redirectTo.startsWith("https://")) {
      throw new Redirect(redirectTo);
    }

    let url = "";
    if (isVanityDomainRequest) {
      url = `https://${owner}.docs.page/${repository}`;
      if (ref) url += `~${ref}`;
      url += redirectTo;
    } else if (domain && environment === "production") {
      // If there is a domain setup, always redirect to it.
      url = `https://${domain}`;
      if (ref) url += `/~${ref}`;
      url += redirectTo;
    } else {
      const base =
        environment === "production"
          ? "https://docs.page"
          : environment === "preview"
          ? "https://staging.docs.page"
          : "http://localhost:3000";

      // If no domain, redirect to docs.page.
      url = `${base}/${owner}/${repository}`;
      if (ref) url += `~${ref}`;
      url += redirectTo;
    }

    throw new Redirect(url);
  }

  return {
    path: ensureLeadingSlash(path),
    owner,
    repository,
    ref: ref || null,
    domain:
      isCustomDomainRequest && environment === "development"
        ? "localhost:8787"
        : domain && environment === "production"
        ? domain
        : null,
    vanity: isVanityDomainRequest,
    bundle,
    preview: false,
  } satisfies Context;
}

export const PageContext = createContext<Context | undefined>(undefined);

// Returns the current page context.
export function usePageContext(): Context {
  const context = useContext(PageContext);

  if (!context) {
    throw new Error(
      "usePageContext must be used within a PageContext.Provider"
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
    isExternal || !isPreview ? getAssetSrc(ctx, path) : ""
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
export function useHref(path: string): string {
  const ctx = usePageContext();
  return getHref(ctx, path);
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
