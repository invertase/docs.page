export type SharedEnvironmentVariables = {
  VERCEL: string | null;
  VERCEL_ENV?: string | null;
  VERCEL_GIT_COMMIT_SHA: string | null;
};

declare global {
  interface Window {
    ENV: SharedEnvironmentVariables;
  }
}

// Returns the shared environment variables, from either the server or the client.
export function getSharedEnvironmentVariables(): SharedEnvironmentVariables {
  return typeof window === "undefined"
    ? {
        VERCEL: process.env.VERCEL || null,
        VERCEL_ENV: process.env.VERCEL_ENV || null,
        VERCEL_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA || null,
      }
    : window.ENV;
}

// Returns the current environment, either `production`, `preview` or `development`.
export function getEnvironment() {
  const ENV = getSharedEnvironmentVariables();

  return ENV.VERCEL
    ? ENV.VERCEL_ENV === "production"
      ? "production"
      : "preview"
    : "development";
}

// Returns the current build hash, either the Vercel Git commit SHA or `development`.
export function getBuildHash() {
  return getSharedEnvironmentVariables().VERCEL_GIT_COMMIT_SHA || "development";
}
