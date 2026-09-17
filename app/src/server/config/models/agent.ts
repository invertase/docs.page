import { z } from "zod";

const DEFAULT_AGENT_LIMITS = {
  ip: 200,
  repo: 10_000,
};

const limits = z
  .object({
    ip: z.number().int().positive().catch(DEFAULT_AGENT_LIMITS.ip),
    repo: z.number().int().positive().catch(DEFAULT_AGENT_LIMITS.repo),
  })
  .catch(DEFAULT_AGENT_LIMITS);

// Keyed by provider name rather than a single `agent.model` string: the active
// provider is stored server-side in the encrypted agent credential and is not
// visible in `docs.json`, so a bare string would be silently misapplied to
// whatever provider the site later rotates to. Only the entry matching the
// active provider is ever read.
//
// Spelt out per provider instead of `z.record`, because one malformed entry in
// a record fails the whole record and `.catch` would then silently discard
// every override; a per-field `.catch` degrades one entry at a time.
const models = z.object({
  xai: z.string().min(1).optional().catch(undefined),
  openai: z.string().min(1).optional().catch(undefined),
  anthropic: z.string().min(1).optional().catch(undefined),
  google: z.string().min(1).optional().catch(undefined),
});

export default z
  .object({
    key: z.string().min(1).optional().catch(undefined),
    placeholder: z.string().min(1).optional().catch(undefined),
    questions: z.array(z.string().min(1)).optional().catch(undefined),
    limits: limits.default(DEFAULT_AGENT_LIMITS),
    // `.optional().catch(undefined)` rather than a bare `.catch({})`: a bare
    // catch inherits its inner type's `optin`, which lands the field in the
    // generated JSON schema's `required` list.
    models: models.optional().catch(undefined),
  })
  .catch({
    key: undefined,
    placeholder: undefined,
    questions: undefined,
    limits: DEFAULT_AGENT_LIMITS,
    models: undefined,
  });
