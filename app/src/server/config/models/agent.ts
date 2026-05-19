import { z } from "zod";

export default z
  .object({
    key: z.string().min(1).optional().catch(undefined),
  })
  .catch({
    key: undefined,
  });
