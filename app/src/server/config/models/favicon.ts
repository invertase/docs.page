import { z } from "zod";

export default z
  .union([
    z.string().min(1),
    z.object({
      light: z.string().optional(),
      dark: z.string().optional(),
    }),
  ])
  .optional()
  .catch(undefined)
  .transform((value) => {
    if (typeof value === "string") {
      return { light: value, dark: value };
    }

    return value;
  });
