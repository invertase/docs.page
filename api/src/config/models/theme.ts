import { z } from "zod";

const hexColor = z
	.string()
	.optional()
	.transform((val) => {
		// Check if the value is a valid hex color
		if (!val || /^#?[0-9A-Fa-f]{6}$/.test(val)) {
			return val;
		}

		return undefined;
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
