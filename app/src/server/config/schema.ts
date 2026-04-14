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
    name: z.string().min(1).optional().catch(undefined),
    description: z.string().min(1).optional().catch(undefined),
    socialPreview: z.union([z.string().min(1), z.literal(false)]).optional().catch(undefined),
    favicon,
    logo,
    theme,
    header,
    anchors,
    social,
    seo,
    variables: z.record(z.string(), z.unknown()).catch({}),
    search,
    scripts,
    content,
    tabs,
    sidebar,
  })
  .transform((config) => {
    return {
      ...config,
      locales: Array.isArray(config.sidebar)
        ? []
        : Object.keys(config.sidebar).filter((key) => key !== "default"),
    };
  });

export type Config = z.infer<typeof ConfigSchema>;
