import { z } from "zod";

const tab = z.object({
	id: z.string().min(1),
	title: z.string().min(1),
	href: z.string().min(1),
	locale: z.string().optional().catch(undefined),
});

export default z
	.array(tab.optional().catch(undefined))
	.catch([])
	.transform((val) => {
		// Remove any empty (invalid) objects
		return val.filter((anchor) => Boolean(anchor)) as Array<
			z.infer<typeof tab>
		>;
	});
