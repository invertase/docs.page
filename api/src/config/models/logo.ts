import { z } from "zod";

export default z
	.object({
		href: z.string().optional(),
		light: z.string().optional(),
		dark: z.string().optional(),
	})
	.catch({
		href: undefined,
		light: undefined,
		dark: undefined,
	});
