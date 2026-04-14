import "server-only";

import { z } from "zod";

export const ENV = z
  .object({
    GITHUB_PAT: z.string().min(1),
  })
  .parse(process.env);
