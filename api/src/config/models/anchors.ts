import { z } from "zod";

const anchor = z.object({
  icon: z.string().min(1),
  title: z.string().min(1),
  href: z.string().min(1),
  locale: z.string().optional().catch(undefined),
  tab: z.string().optional().catch(undefined),
});

export default z
  .array(anchor.optional().catch(undefined))
  .catch([])
  .transform((val) => {
    // Remove any empty (invalid) objects
    return val.filter((anchor) => Boolean(anchor)) as Array<
      z.infer<typeof anchor>
    >;
  });
