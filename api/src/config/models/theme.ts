import { z } from "zod";

const hexColor = z
	.string()
	.optional()
	.transform((val) => {
		if (!val || !/^#?[0-9A-Fa-f]{6}$/.test(val)) {
			return undefined;
		}

		return val;
	});

export default z
	.object({
		defaultTheme: z
			.union([z.literal("light"), z.literal("dark")])
			.optional()
			.catch(undefined),
		primary: hexColor,
		primaryLight: hexColor,
		primaryDark: hexColor,
		backgroundLight: hexColor,
		backgroundDark: hexColor,
	})
	.catch({});
