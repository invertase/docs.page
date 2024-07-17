import { z } from "zod";

export default z
	.object({
		noindex: z.boolean().catch(false),
	})
	.catch({
		noindex: false,
	});
