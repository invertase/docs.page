import { z } from "zod";

export default z
  .union([
    z
      .string()
      .min(1), // Support for a single path
    z.object({
      light: z.string().optional(),
      dark: z.string().optional(),
    }),
  ])
  .optional()
  .catch(undefined)
  .transform((value) => {
    // If a string is provided, use it for both light and dark
    if (typeof value === "string") {
      return { light: value, dark: value };
    }

    return value;
  });
