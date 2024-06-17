import { z } from 'zod';

// Represents a single page in the sidebar
const SidebarPageItemSchema = z.object({
  title: z.string(),
  href: z.string(),
});

// Represents a group of pages in the sidebar
export type SidebarGroup = {
  group: string;
  href?: string;
  pages: (z.infer<typeof SidebarPageItemSchema> | SidebarGroup)[];
};

// The overall schema for the sidebar
const SidebarSchema: z.ZodType<SidebarGroup> = z.lazy(() =>
  z.object({
    group: z.string(),
    href: z.string().optional(),
    pages: z.array(z.union([SidebarPageItemSchema, SidebarSchema])),
  }),
);

export type Sidebar = z.infer<typeof SidebarSchema>;

export const ConfigSchema = z
  .object({
    // The name of the project
    name: z.string().optional().catch(undefined),
    // The description of the project
    description: z.string().optional().catch(undefined),
    // The logo of the project, used in the header
    logo: z
      .object({
        href: z.string().optional(),
        light: z.string().optional(),
        dark: z.string().optional(),
      })
      .optional()
      .catch(undefined),
    // The favicon of the project
    favicon: z.string().optional().catch(undefined),
    theme: z
      .object({
        defaultTheme: z
          .union([z.literal('light'), z.literal('dark')])
          .optional()
          .catch(undefined),
        // grayScale: z.boolean().catch(false), // TODO?
        primary: z.string().optional().catch(undefined),
        primaryLight: z.string().optional().catch(undefined),
        primaryDark: z.string().optional().catch(undefined),
        backgroundLight: z.string().optional().catch(undefined),
        backgroundDark: z.string().optional().catch(undefined),
      })
      .optional()
      .catch(undefined),
    header: z
      .object({
        showName: z.boolean().optional().catch(true),
        showThemeToggle: z.boolean().optional().catch(true),
        showGitHubCard: z.boolean().optional().catch(true),
        links: z
          .array(
            z.object({
              title: z.string(),
              href: z.string(),
              cta: z.boolean().optional().catch(false),
              locale: z.string().optional().catch(undefined),
            }),
          )
          .optional()
          .catch([]),
      })
      .optional()
      .catch(undefined),
    anchors: z
      .array(
        z
          .object({
            icon: z.string(),
            title: z.string(),
            href: z.string(),
            locale: z.string().optional().catch(undefined),
          })
          .optional()
          .catch(undefined),
      )
      .optional()
      .catch([]),
    social: z
      .object({
        preview: z.string().optional().catch(undefined),
        website: z.string().optional().catch(undefined),
        x: z.string().optional().catch(undefined),
        youtube: z.string().optional().catch(undefined),
        facebook: z.string().optional().catch(undefined),
        instagram: z.string().optional().catch(undefined),
        linkedin: z.string().optional().catch(undefined),
        github: z.string().optional().catch(undefined),
        slack: z.string().optional().catch(undefined),
        discord: z.string().optional().catch(undefined),
      })
      .optional()
      .catch(undefined),
    seo: z
      .object({
        noindex: z.boolean().catch(false),
      })
      .optional()
      .catch(undefined),
    variables: z.record(z.any()).catch({}),
    search: z
      .object({
        docsearch: z
          .object({
            appId: z.string().catch(''),
            apiKey: z.string().catch(''),
            indexName: z.string().catch(''),
          })
          .optional()
          .catch(undefined),
      })
      .optional()
      .catch(undefined),
    scripts: z
      .object({
        googleTagManager: z.string().optional().catch(undefined),
        googleAnalytics: z.string().optional().catch(undefined),
        plausible: z.union([z.string(), z.boolean()]).optional().catch(undefined),
      })
      .optional()
      .catch(undefined),
    content: z
      .object({
        headerDepth: z.number().catch(3),
        zoomImages: z.boolean().catch(false),
        automaticallyInferNextPrevious: z.boolean().catch(true),
      })
      .optional()
      .catch({
        headerDepth: 3,
        zoomImages: false,
        automaticallyInferNextPrevious: true,
      }),
    tabs: z
      .array(
        z.object({
          name: z.string(),
          href: z.string(),
          locale: z.string().optional().catch(undefined),
        }),
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
