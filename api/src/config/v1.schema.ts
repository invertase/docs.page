import { z } from 'zod';
import { ConfigSchema } from './schema';
import type { Config, Sidebar } from './schema';

const V1SidebarItem = z.tuple([
  z.coerce.string(),
  z
    .union([
      // URL
      z.string(),
      // Nested children
      z
        .array(z.tuple([z.coerce.string(), z.coerce.string()]).optional().catch(undefined))
        // Remove any undefined items from the array.
        .transform(items => {
          return items.filter(Boolean);
        }),
    ])
    // Fallback to empty array if something is wrong, so the entire sidebar doesn't break
    .catch([]),
]);

export const V1ConfigSchema = z
  .object({
    name: z.string().catch(''),
    description: z.string().catch(''),
    logo: z.string().catch(''),
    logoDark: z.string().catch(''),
    favicon: z.string().catch(''),
    socialPreview: z.string().catch(''),
    twitter: z.string().catch(''),
    noindex: z.boolean().catch(false),
    theme: z.string().catch(''),
    headerDepth: z.number().catch(3),
    variables: z.record(z.any()).catch({}),
    googleTagManager: z.string().catch(''),
    googleAnalytics: z.string().catch(''),
    zoomImages: z.boolean().catch(false),
    experimentalCodehike: z.boolean().catch(false),
    experimentalMath: z.boolean().catch(false),
    automaticallyDisplayName: z.boolean().catch(true),
    automaticallyInferNextPrevious: z.boolean().catch(true),
    plausibleAnalytics: z.boolean().catch(false),
    plausibleAnalyticsScript: z.string().catch('https://plausible.io/js/script.js'),
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
      .transform(items => items.filter(Boolean))
      .catch([]),
    docsearch: z
      .object({
        appId: z.string().catch(''),
        apiKey: z.string().catch(''),
        indexName: z.string().catch(''),
      })
      .optional()
      .catch(undefined),
    sidebar: z.union([z.record(z.array(V1SidebarItem)), z.array(V1SidebarItem)]).catch([]),
  })
  .transform(v1 => {
    const config: Config = {
      name: v1.name,
      description: v1.description,
      logo: {
        href: '/',
        light: v1.logo,
        dark: v1.logoDark,
      },
      favicon: v1.favicon,
      theme: {
        primary: v1.theme,
      },
      social: {
        x: v1.twitter,
      },
      anchors: v1.anchors,
      seo: {
        noindex: v1.noindex,
      },
      variables: v1.variables,
      scripts: {
        googleTagManager: v1.googleTagManager,
        googleAnalytics: v1.googleAnalytics,
        plausible:
          // If they have `true` for plausible
          v1.plausibleAnalytics
            ? // Check if they have a custom script
              !!v1.plausibleAnalyticsScript
              ? v1.plausibleAnalyticsScript
              : true
            : undefined,
      },
      content: {
        headerDepth: v1.headerDepth,
        zoomImages: v1.zoomImages,
        automaticallyInferNextPrevious: v1.automaticallyInferNextPrevious,
      },
      tabs: [], // V1 doesn't have tabs
      sidebar: [], // This is transformed below
      locales: [], // This is overridden in the v2 schema
    };

    // Utility function to transform a sidebar item from v1 to latest
    function transformSidebarItem(item: z.infer<typeof V1SidebarItem>): Sidebar {
      const [title, hrefOrChildren] = item;

      if (typeof hrefOrChildren === 'string') {
        return {
          group: '',
          pages: [
            {
              title,
              href: hrefOrChildren,
            },
          ],
        };
      } else if (Array.isArray(hrefOrChildren)) {
        return {
          group: title,
          pages: hrefOrChildren.map(child => {
            const [childTitle, childHref] = child || ['', ''];
            return {
              title: childTitle,
              href: childHref,
            };
          }),
        };
      }

      return { group: '', pages: [] };
    }

    if (Array.isArray(v1.sidebar)) {
      config.sidebar = v1.sidebar.map(transformSidebarItem);
    } else {
      const sidebar: Record<string, Sidebar[]> = {};
      Object.entries(v1.sidebar).map(entry => {
        const locale = entry[0];
        const sidebarItems = entry[1];
        sidebar[locale] = sidebarItems.map(transformSidebarItem);
      });
      config.sidebar = sidebar;
    }

    return ConfigSchema.parse(config);
  });
