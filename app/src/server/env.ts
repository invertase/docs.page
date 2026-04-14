import { z } from "zod";

const isNextProductionBuild =
  process.env.NEXT_PHASE === "phase-production-build";

const envSource: NodeJS.ProcessEnv = { ...process.env };

if (isNextProductionBuild && !envSource.GITHUB_PAT?.trim()) {
  envSource.GITHUB_PAT = "__build_time_placeholder__";
}

export const ENV = z
  .object({
    GITHUB_PAT: z.string().min(1),
  })
  .parse(envSource);
