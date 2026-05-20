import { z } from "zod";

export default z
  .object({
    enabled: z.boolean().optional().catch(true),
  })
  .catch({
    enabled: true,
  });
