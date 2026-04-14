import { z } from "zod";

const tab = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  href: z.string().min(1),
  locale: z.string().optional().catch(undefined),
});

export default z
  .array(tab.optional().catch(undefined))
  .catch([])
  .transform((value) => {
    return value.filter((item) => Boolean(item)) as Array<z.infer<typeof tab>>;
  });
