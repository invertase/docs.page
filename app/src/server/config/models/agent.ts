import { z } from "zod";

export default z
  .object({
    key: z.string().min(1).optional().catch(undefined),
    placeholder: z.string().min(1).optional().catch(undefined),
    questions: z.array(z.string().min(1)).optional().catch(undefined),
  })
  .catch({
    key: undefined,
    placeholder: undefined,
    questions: undefined,
  });
