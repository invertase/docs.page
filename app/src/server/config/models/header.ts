import { z } from "zod";

export default z
  .object({
    showName: z.boolean().optional().catch(true),
    showThemeToggle: z.boolean().optional().catch(true),
    showGitHubCard: z.boolean().optional().catch(true),
    links: z
      .array(
        z.object({
          title: z.string().min(1),
          href: z.string().min(1),
          cta: z.boolean().optional().catch(false),
          locale: z.string().optional().catch(undefined),
        }),
      )
      .optional()
      .catch([]),
  })
  .catch({
    showName: true,
    showThemeToggle: true,
    showGitHubCard: true,
    links: [],
  });
