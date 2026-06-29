import { z } from "zod";

export default z
  .object({
    docsearch: z
      .object({
        appId: z.string().catch(""),
        apiKey: z.string().catch(""),
        indexName: z.string().catch(""),
      })
      .optional()
      .catch(undefined),
  })
  .catch({
    docsearch: undefined,
  });
