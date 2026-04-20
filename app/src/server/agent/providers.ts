import { createGoogleGenerativeAI } from "@ai-sdk/google";

const providers = {
  google: (apiKey: string) =>
    createGoogleGenerativeAI({
      apiKey,
    }),
};

export const PROVIDERS = Object.freeze(Object.keys(providers));

export function getProvider(provider: string, apiKey: string) {
  if (!providers[provider as keyof typeof providers]) {
    return undefined;
  }

  return providers[provider as keyof typeof providers]!(apiKey);
}
