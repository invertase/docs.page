import { z } from "zod";

export default z
  .object({
    headerDepth: z.number().catch(3),
    zoomImages: z.boolean().catch(false),
    automaticallyInferNextPrevious: z.boolean().catch(true),
    showPageTitle: z.boolean().catch(true),
    showPageImage: z.boolean().catch(true),
  })
  .catch({
    headerDepth: 3,
    zoomImages: false,
    automaticallyInferNextPrevious: true,
    showPageTitle: true,
    showPageImage: true,
  });
