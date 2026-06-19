import { z } from "zod";

export default z
  .object({
    logo: z.string().optional().catch(undefined),
    github: z.boolean().optional().catch(true),
  })
  .catch({
    logo: undefined,
    github: true,
  });
