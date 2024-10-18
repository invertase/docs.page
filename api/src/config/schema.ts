import { z } from "zod";

import anchors from "./models/anchors";
import content from "./models/content";
import favicon from "./models/favicon";
import header from "./models/header";
import logo from "./models/logo";
import scripts from "./models/scripts";
import search from "./models/search";
import seo from "./models/seo";
import sidebar from "./models/sidebar";
import social from "./models/social";
import tabs from "./models/tabs";
import theme from "./models/theme";

export type { Sidebar } from "./models/sidebar";

export const ConfigSchema = z
  .object({
    // The URL of the schema file
    $schema: z.string().url().optional().catch(undefined),
    // The name of the project
    name: z.string().min(1).optional().catch(undefined),
    // The description of the project
    description: z.string().min(1).optional().catch(undefined),
    // The preview image used in social media - either a path or a URL, or false to disable
    socialPreview: z
      .union([z.string().min(1), z.literal(false)])
      .optional()
      .catch(undefined),
    // The favicon of the project
    favicon,
    // The logo of the project, used in the header
    logo,
    // Theme settings
    theme,
    // Configuration for the header
    header,
    // Anchors to display in the sidebar
    anchors,
    // Social links to display in the footer
    social,
    // SEO settings
    seo,
    // Variables to override in mustache templates
    variables: z.record(z.any()).catch({}),
    // Search settings
    search,
    // Scripts to include in the documentation
    scripts,
    // Settings to control content rendering
    content,
    // Tabs to display in the header
    tabs,
    // Sidebar configuration
    sidebar,
  })
  .transform((config) => {
    if (config.$schema) delete config.$schema;
    return {
      ...config,
      // Extract locales from the sidebar configuration
      locales: Array.isArray(config.sidebar)
        ? []
        : Object.keys(config.sidebar).filter((key) => key !== "default"),
    };
  });

export type Config = z.infer<typeof ConfigSchema>;
