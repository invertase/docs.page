import { z } from "zod";

const hexColor = z
  .string()
  .optional()
  .transform((value) => {
    if (!value || !/^#?[0-9A-Fa-f]{6}$/.test(value)) {
      return undefined;
    }

    return value;
  });

export default z
  .object({
    defaultTheme: z.union([z.literal("light"), z.literal("dark")]).optional().catch(undefined),
    primary: hexColor,
    primaryLight: hexColor,
    primaryDark: hexColor,
    backgroundLight: hexColor,
    backgroundDark: hexColor,
  })
  .catch({
    defaultTheme: undefined,
    primary: undefined,
    primaryLight: undefined,
    primaryDark: undefined,
    backgroundLight: undefined,
    backgroundDark: undefined,
  });
