import { createGoogleGenerativeAI } from "@ai-sdk/google";

export const AGENT_PROVIDERS = [
  "xai",
  "openai",
  "anthropic",
  "google",
] as const;

export type AgentProvider = (typeof AGENT_PROVIDERS)[number];

const providers = {
  google: (apiKey: string) =>
    createGoogleGenerativeAI({
      apiKey,
    }),
};

// Fast, cost-efficient defaults suited to docs search + tool use.
const MODEL_BY_PROVIDER: Record<AgentProvider, string> = {
  xai: "grok-3-mini",
  openai: "gpt-4.1-mini",
  anthropic: "claude-haiku-4-5",
  google: "gemini-2.5-flash",
};

export const PROVIDERS = AGENT_PROVIDERS;

export function getProvider(provider: string, apiKey: string) {
  if (!providers[provider as keyof typeof providers]) {
    return undefined;
  }

  return providers[provider as keyof typeof providers]!(apiKey);
}

export function getModelForProvider(provider: string) {
  return MODEL_BY_PROVIDER[provider as AgentProvider];
}
