import { z } from "zod";

export default z
  .object({
    preview: z.string().optional().catch(undefined),
    website: z.string().optional().catch(undefined),
    x: z.string().optional().catch(undefined),
    youtube: z.string().optional().catch(undefined),
    facebook: z.string().optional().catch(undefined),
    instagram: z.string().optional().catch(undefined),
    linkedin: z.string().optional().catch(undefined),
    github: z.string().optional().catch(undefined),
    slack: z.string().optional().catch(undefined),
    discord: z.string().optional().catch(undefined),
  })
  .catch({
    preview: undefined,
    website: undefined,
    x: undefined,
    youtube: undefined,
    facebook: undefined,
    instagram: undefined,
    linkedin: undefined,
    github: undefined,
    slack: undefined,
    discord: undefined,
  });
