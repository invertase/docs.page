import { z } from "zod";

/**
 * Settings for `@docs.page/cli check`. The hosted app does not read these
 * itself, but they live in the schema so `docs.json` validates and
 * autocompletes the key instead of editors flagging it as unknown.
 */
export default z
  .object({
    /**
     * Hosts to skip when checking external links. The CLI accepts either a
     * comma-separated string or a list of hosts, and discards entries it
     * cannot normalise, so both shapes are permitted here.
     */
    ignoreExternalHosts: z
      .union([z.string(), z.array(z.string())])
      .optional()
      .catch(undefined),
  })
  .optional()
  .catch(undefined);
