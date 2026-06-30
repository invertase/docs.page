import { z } from "zod";
import type { ConfigTab } from "@/lib/config-tab";

const optionalString = z
  .string()
  .optional()
  .transform((value) => value || undefined);

const optionalConfigTab = z
  .union([z.string(), z.array(z.string())])
  .optional()
  .transform((value): ConfigTab | undefined => {
    if (value === undefined) {
      return undefined;
    }

    if (typeof value === "string") {
      return value || undefined;
    }

    const tabs = value.map((tab) => tab.trim()).filter(Boolean);
    if (tabs.length === 0) {
      return undefined;
    }

    return tabs.length === 1 ? tabs[0] : tabs;
  });

const SidebarPageItemSchema = z.object({
  title: z.string().min(1),
  href: z.string().min(1),
  icon: z
    .string()
    .min(1)
    .optional()
    .transform((value) => value || undefined),
});

export type SidebarGroup = {
  group?: string;
  tab?: ConfigTab;
  href?: string;
  icon?: string;
  pages: (z.infer<typeof SidebarPageItemSchema> | SidebarGroup)[];
};

const SidebarSchema: z.ZodType<SidebarGroup> = z.lazy(() =>
  z.object({
    group: optionalString,
    tab: optionalConfigTab,
    href: optionalString,
    icon: optionalString,
    pages: z.array(z.union([SidebarPageItemSchema, SidebarSchema])),
  }),
);

export type Sidebar = z.infer<typeof SidebarSchema>;

export default z
  .union([z.record(z.string(), z.array(SidebarSchema)), z.array(SidebarSchema)])
  .catch({});
