import { z } from 'zod';

// Represents a single page in the sidebar
const SidebarPageItemSchema = z.object({
  title: z.string(),
  href: z.string(),
});

// Represents a group of pages in the sidebar
type SidebarGroup = {
  group: string;
  pages: (z.infer<typeof SidebarPageItemSchema> | SidebarGroup)[];
};

// The overall schema for the sidebar
const SidebarSchema: z.ZodType<SidebarGroup> = z.lazy(() =>
  z.object({
    group: z.string(),
    pages: z.array(z.union([SidebarPageItemSchema, SidebarSchema])),
  }),
);

export type Sidebar = z.infer<typeof SidebarSchema>;

export const ConfigSchema = z
  .object({
    // The name of the project
    name: z.string().nullish(),
    // The description of the project
    description: z.string().nullish(),
    // The logo of the project, used in the header
    logo: z
      .object({
        href: z.string().nullish(),
        light: z.string().nullish(),
        dark: z.string().nullish(),
      })
      .nullish()
      .catch(null),
    // The favicon of the project
    favicon: z.string().nullish(),
    theme: z
      .object({
        // grayScale: z.boolean().catch(false), // TODO?
        primary: z.string().optional().nullish(),
        primaryLight: z.string().optional().nullish(),
        primaryDark: z.string().optional().nullish(),
      })
      .nullish()
      .catch(null),
    anchors: z
      .array(
        z
          .object({
            icon: z.string(),
            title: z.string(),
            link: z.string(),
            locale: z.string().nullish(),
          })
          .optional()
          .catch(undefined),
      )
      .transform(items => items.filter(Boolean))
      .catch([]),
    social: z
      .object({
        preview: z.string().nullish(),
        website: z.string().nullish(),
        x: z.string().nullish(),
        youtube: z.string().nullish(),
        facebook: z.string().nullish(),
        instagram: z.string().nullish(),
        linkedin: z.string().nullish(),
        github: z.string().nullish(),
        slack: z.string().nullish(),
        discord: z.string().nullish(),
      })
      .nullish()
      .catch(null),
    seo: z
      .object({
        noindex: z.boolean().catch(false),
      })
      .nullish()
      .catch(null),
    variables: z.record(z.any()).catch({}),
    search: z
      .object({
        docsearch: z
          .object({
            appId: z.string().catch(''),
            apiKey: z.string().catch(''),
            indexName: z.string().catch(''),
          })
          .nullish()
          .catch(null),
      })
      .nullish()
      .catch(null),
    scripts: z
      .object({
        googleTagManager: z.string().nullish(),
        googleAnalytics: z.string().nullish(),
        plausible: z.union([z.string(), z.boolean()]).nullish(),
      })
      .nullish()
      .catch(null),
    content: z
      .object({
        headerDepth: z.number().catch(3),
        zoomImages: z.boolean().catch(false),
        automaticallyInferNextPrevious: z.boolean().catch(true),
      })
      .nullish()
      .catch(null),
    tabs: z
      .array(
        z
          .object({
            name: z.string(),
            href: z.string(),
            locale: z.string().nullish(),
          })
          .nullish()
          .catch(null),
      )
      .catch([]),
    sidebar: z.union([z.record(z.array(SidebarSchema)), z.array(SidebarSchema)]).catch({}),
  })
  .transform(config => {
    return {
      ...config,
      locales: Array.isArray(config.sidebar)
        ? []
        : Object.keys(config.sidebar).filter(key => key !== 'default'),
    };
  });

export type Config = z.infer<typeof ConfigSchema>;
