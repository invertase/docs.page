import { z } from "zod";
import type { Config, Sidebar } from "./schema";
import { ConfigSchema } from "./schema";

const V1SidebarItem = z.tuple([
  z.coerce.string(),
  z
    .union([
      z.string(),
      z
        .array(
          z
            .tuple([z.coerce.string(), z.coerce.string()])
            .optional()
            .catch(undefined),
        )
        .transform((items) => items.filter(Boolean)),
    ])
    .catch([]),
]);

export const V1ConfigSchema = z
  .object({
    name: z.string().catch(""),
    description: z.string().catch(""),
    logo: z.string().catch(""),
    logoDark: z.string().catch(""),
    favicon: z.string().catch(""),
    socialPreview: z.string().catch(""),
    twitter: z.string().catch(""),
    noindex: z.boolean().catch(false),
    theme: z.string().catch(""),
    headerDepth: z.number().catch(3),
    variables: z.record(z.string(), z.unknown()).catch({}),
    googleTagManager: z.string().catch(""),
    googleAnalytics: z.string().catch(""),
    zoomImages: z.boolean().catch(false),
    experimentalCodehike: z.boolean().catch(false),
    experimentalMath: z.boolean().catch(false),
    automaticallyDisplayName: z.boolean().catch(true),
    automaticallyInferNextPrevious: z.boolean().catch(true),
    plausibleAnalytics: z.boolean().catch(false),
    plausibleAnalyticsScript: z
      .string()
      .catch("https://plausible.io/js/script.js"),
    anchors: z
      .array(
        z
          .object({
            icon: z.string(),
            title: z.string(),
            link: z.string(),
          })
          .optional()
          .catch(undefined),
      )
      .transform((items) => items.filter(Boolean))
      .catch([]),
    docsearch: z
      .object({
        appId: z.string().catch(""),
        apiKey: z.string().catch(""),
        indexName: z.string().catch(""),
      })
      .optional()
      .catch(undefined),
    sidebar: z
      .union([
        z.record(z.string(), z.array(V1SidebarItem)),
        z.array(V1SidebarItem),
      ])
      .catch([]),
  })
  .transform((v1) => {
    const config: Config = {
      name: v1.name,
      description: v1.description,
      favicon: {
        light: v1.favicon,
        dark: v1.favicon,
      },
      agent: {
        key: undefined,
        limits: {
          ip: 200,
          repo: 10_000,
        },
      },
      mcp: {
        enabled: true,
      },
      og: {
        logo: v1.logo,
        github: true,
      },
      socialPreview: v1.socialPreview,
      logo: {
        light: v1.logo,
        dark: v1.logoDark,
      },
      header: {
        showName: true,
        showThemeToggle: true,
        showGitHubCard: true,
      },
      theme: {
        preset: undefined,
        defaultTheme: undefined,
        primary: v1.theme,
        primaryLight: undefined,
        primaryDark: undefined,
        backgroundLight: undefined,
        backgroundDark: undefined,
      },
      social: {
        x: v1.twitter,
      },
      anchors: v1.anchors.filter(Boolean).map((anchor) => ({
        title: anchor!.title,
        href: anchor!.link,
        icon: anchor!.icon,
      })),
      seo: {
        noindex: v1.noindex,
      },
      search: {
        docsearch: v1.docsearch,
      },
      variables: v1.variables,
      scripts: {
        googleTagManager: v1.googleTagManager,
        googleAnalytics: v1.googleAnalytics,
        plausible: v1.plausibleAnalytics
          ? v1.plausibleAnalyticsScript
            ? v1.plausibleAnalyticsScript
            : true
          : undefined,
      },
      content: {
        headerDepth: v1.headerDepth,
        zoomImages: v1.zoomImages,
        automaticallyInferNextPrevious: v1.automaticallyInferNextPrevious,
        showPageTitle: false,
        showPageImage: false,
      },
      tabs: [],
      sidebar: [],
      locales: [],
    };

    function transformSidebarItem(
      item: z.infer<typeof V1SidebarItem>,
    ): Sidebar {
      const [title, hrefOrChildren] = item;

      if (typeof hrefOrChildren === "string") {
        return {
          group: "",
          pages: [
            {
              title,
              href: hrefOrChildren,
              icon: undefined,
            },
          ],
        };
      }

      if (Array.isArray(hrefOrChildren)) {
        return {
          group: title,
          pages: hrefOrChildren.map((child) => {
            const [childTitle, childHref] = child || ["", ""];
            return {
              title: childTitle,
              href: childHref,
              icon: undefined,
            };
          }),
        };
      }

      return { group: "", pages: [] };
    }

    function isSingleTopLevelPage(group: Sidebar): boolean {
      const page = group.pages[0];
      return (
        !group.group &&
        group.pages.length === 1 &&
        page != null &&
        "title" in page
      );
    }

    function compactSidebarGroups(groups: Sidebar[]): Sidebar[] {
      const compacted: Sidebar[] = [];
      let mergedPages: Sidebar["pages"] = [];

      const flushMergedPages = () => {
        if (mergedPages.length === 0) {
          return;
        }

        compacted.push({ group: "", pages: mergedPages });
        mergedPages = [];
      };

      for (const group of groups) {
        if (isSingleTopLevelPage(group)) {
          mergedPages.push(group.pages[0]);
          continue;
        }

        flushMergedPages();
        compacted.push(group);
      }

      flushMergedPages();
      return compacted;
    }

    if (Array.isArray(v1.sidebar)) {
      config.sidebar = compactSidebarGroups(
        v1.sidebar.map(transformSidebarItem),
      );
    } else {
      const sidebar: Record<string, Sidebar[]> = {};
      for (const [locale, sidebarItems] of Object.entries(v1.sidebar)) {
        sidebar[locale] = compactSidebarGroups(
          sidebarItems.map(transformSidebarItem),
        );
      }
      config.sidebar = sidebar;
    }

    return ConfigSchema.parse(config);
  });
