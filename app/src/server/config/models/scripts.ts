import { z } from "zod";

export default z
  .object({
    googleTagManager: z.string().min(1).optional().catch(undefined),
    googleAnalytics: z.string().min(1).optional().catch(undefined),
    googleSiteVerification: z.string().min(1).optional().catch(undefined),
  })
  .catch({
    googleTagManager: undefined,
    googleAnalytics: undefined,
    googleSiteVerification: undefined,
  });
