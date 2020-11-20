import { graphql } from "@octokit/graphql";
import get from "lodash.get";

export const GithubGQLClient = graphql.defaults({
  headers: {
    authorization: `token ${process.env.GITHUB_PAT}`,
  },
});

export function isClient(): boolean {
  return typeof window !== "undefined";
}

// Returns a guaranteed string value from a config object
export function getString<T = string>(
  json: any,
  key: string,
  defaultValue: T
): T {
  const value = get<T>(json, key, defaultValue);

  // If there is a custom value but it isn't a string, return the defaultValue instead.
  if (typeof value !== "string") {
    return defaultValue;
  }

  return value;
}

// Returns a guaranteed number value from a config object
export function getNumber<T = number>(
  json: any,
  key: string,
  defaultValue: T
): T {
  const value = get<T>(json, key, defaultValue);

  // If there is a custom value but it isn't a string, return the defaultValue instead.
  if (typeof value !== "number") {
    return defaultValue;
  }

  return value;
}

// Returns a guaranteed boolean value from a config object
export function getBoolean(
  json: any,
  key: string,
  defaultValue: boolean
): boolean {
  const value = get<boolean>(json, key, defaultValue);
  
  // If there is a custom value but it isn't a string, return the defaultValue instead.
  if (typeof value === "string") {
    if (value === "false") return false;
    if (value === "true") return true;
    return defaultValue;
  }

  if (typeof value !== "boolean") {
    return defaultValue;
  }

  return value;
}
