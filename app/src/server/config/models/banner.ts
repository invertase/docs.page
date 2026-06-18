import { z } from "zod";

export default z
  .object({
    message: z.string().optional().catch(undefined),
    href: z.string().optional().catch(undefined),
    backgroundColor: z.string().optional().catch(undefined),
    foregroundColor: z.string().optional().catch(undefined),
  })
  .catch({
    message: undefined,
    href: undefined,
    backgroundColor: undefined,
    foregroundColor: undefined,
  });
