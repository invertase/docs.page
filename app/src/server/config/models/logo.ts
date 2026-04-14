import { z } from "zod";

export default z
  .object({
    light: z.string().optional(),
    dark: z.string().optional(),
  })
  .catch({
    light: undefined,
    dark: undefined,
  });
