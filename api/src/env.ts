import { z } from "zod";
import { config } from "dotenv";

config();

export const ENV = z
  .object({
    PORT: z.number().int().optional(),
    GITHUB_PAT: z.string().min(1),
    GITHUB_APP_ID: z.string().min(1),
    GITHUB_APP_PRIVATE_KEY: z.string().min(1),
    GITHUB_APP_WEBHOOK_SECRET: z.string().min(1),
  })
  .parse(process.env);
