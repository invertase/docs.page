import { z } from "zod";

const optionalString = z
  .string()
  .optional()
  .transform((value) => value || undefined);

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
  tab?: string;
  href?: string;
  icon?: string;
  pages: (z.infer<typeof SidebarPageItemSchema> | SidebarGroup)[];
};

const SidebarSchema: z.ZodType<SidebarGroup> = z.lazy(() =>
  z.object({
    group: optionalString,
    tab: optionalString,
    href: optionalString,
    icon: optionalString,
    pages: z.array(z.union([SidebarPageItemSchema, SidebarSchema])),
  }),
);

export type Sidebar = z.infer<typeof SidebarSchema>;

export default z
  .union([z.record(z.string(), z.array(SidebarSchema)), z.array(SidebarSchema)])
  .catch({});
