import { z } from "zod";

// Represents a single page in the sidebar
const SidebarPageItemSchema = z.object({
	title: z.string().min(1),
	href: z.string().min(1),
	icon: z
		.string()
		.min(1)
		.optional()
		.transform((val) => val || undefined),
});

// Represents a group of pages in the sidebar
export type SidebarGroup = {
	group: string;
	tab?: string;
	href?: string;
	icon?: string;
	pages: (z.infer<typeof SidebarPageItemSchema> | SidebarGroup)[];
};

// The overall schema for the sidebar
const SidebarSchema: z.ZodType<SidebarGroup> = z.lazy(() =>
	z.object({
		group: z.string().min(1),
		tab: z
			.string()
			.min(1)
			.optional()
			.transform((val) => val || undefined),
		href: z
			.string()
			.min(1)
			.optional()
			.transform((val) => val || undefined),
		icon: z
			.string()
			.min(1)
			.optional()
			.transform((val) => val || undefined),
		pages: z.array(z.union([SidebarPageItemSchema, SidebarSchema])),
	}),
);

export type Sidebar = z.infer<typeof SidebarSchema>;

export default z
	.union([z.record(z.array(SidebarSchema)), z.array(SidebarSchema)])
	.catch({});
