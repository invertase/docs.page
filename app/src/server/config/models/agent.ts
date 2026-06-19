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

export default z
  .object({
    key: z.string().min(1).optional().catch(undefined),
    placeholder: z.string().min(1).optional().catch(undefined),
    questions: z.array(z.string().min(1)).optional().catch(undefined),
    limits: limits.default(DEFAULT_AGENT_LIMITS),
  })
  .catch({
    key: undefined,
    placeholder: undefined,
    questions: undefined,
    limits: DEFAULT_AGENT_LIMITS,
  });
