export const DEFAULT_API_BASE_URL = "https://docs.page";

export type GlobalCliOptions = {
  apiUrl?: string;
};

export function getApiBase(apiUrl?: string) {
  const configuredBase = apiUrl?.trim();

  if (!configuredBase) {
    throw new Error("`--api-url` must be a non-empty URL.");
  }

  return configuredBase.replace(/\/+$/, "");
}

export function parseJson(value: string) {
  if (!value.trim()) {
    return null;
  }

  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
