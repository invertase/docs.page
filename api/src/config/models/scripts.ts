import { z } from "zod";

export default z
  .object({
    googleTagManager: z.string().min(1).optional().catch(undefined),
    googleAnalytics: z.string().min(1).optional().catch(undefined),
    plausible: z
      .union([z.string().min(1), z.boolean()])
      .optional()
      .catch(undefined),
  })
  .catch({
    googleTagManager: undefined,
    googleAnalytics: undefined,
    plausible: undefined,
  });
