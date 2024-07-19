import cx from "classnames";
import { twMerge } from "tailwind-merge";
import type { Context } from "~/context";
import type { BundleResponse } from "./api";

export type SharedEnvironmentVariables = {
  VERCEL?: string;
  VERCEL_ENV?: string;
  VERCEL_GIT_COMMIT_SHA?: string;
};

declare global {
  interface Window {
    ENV: SharedEnvironmentVariables;
  }
}

// Returns the shared environment variables, from either the server or the client.
export function getSharedEnvironmentVariables(): SharedEnvironmentVariables {
  return typeof window === "undefined"
    ? (process.env as SharedEnvironmentVariables)
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

// Helper function to merge Tailwind CSS classes with classnames.
export function cn(...inputs: cx.ArgumentArray) {
  return twMerge(cx(inputs));
}

// Returns a string with a leading slash
export function ensureLeadingSlash(path: string) {
  return !path.startsWith("/") ? `/${path}` : path;
}

// Removes any trailing slash from string
export function removeTrailingSlash(value: string) {
  return value.replace(/\/$/, "");
}

// Returns whether the link is external or not
export function isExternalLink(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

// Returns the correct image path for a given image;
//  - if remote, returns the path as is
//  - if local, returns the path with the correct base url
export function getAssetSrc(ctx: Context, path: string) {
  if (isExternalLink(path)) {
    return path;
  }

  return getBlobSrc(ctx, path);
}

// Returns a raw blob path for a given path.
export function getBlobSrc(ctx: Context, path: string) {
  const { source, baseBranch } = ctx.bundle;
  const { owner, repository, ref } = source;

  if (source.type === "branch") {
    return `https://raw.githubusercontent.com/${owner}/${repository}/${encodeURIComponent(
      ref ?? baseBranch
    )}/docs${ensureLeadingSlash(path)}`;
  }
  if (source.type === "PR") {
    return `https://raw.githubusercontent.com/${owner}/${repository}/${encodeURIComponent(
      ref ?? baseBranch
    )}/docs${ensureLeadingSlash(path)}`;
  }

  return `https://raw.githubusercontent.com/${owner}/${repository}/HEAD/docs${ensureLeadingSlash(
    path
  )}`;
}

// Returns the current locale.
//
// This is determined by the first segment of the path, e.g. `/fr/getting-started` would return `fr`.
// For it to be considered a valid locale, it must be included in the `locales` array of the bundle config,
// which is derived from the sidebar configuration.
export function getLocale(ctx: Context) {
  const locale = ctx.path.split("/").filter(Boolean).at(0);
  return locale && ctx.bundle.config.locales.includes(locale)
    ? locale
    : undefined;
}

// Gets a href for a given path.
// If the path is external, it is returned as is.
// If we're in preview mode, the path is prefixed with `/preview`.
// Otherwise applies the owner, repository, ref and locale to the path.
export function getHref(ctx: Context, path: string) {
  const locale = getLocale(ctx);
  const pathWithLeadingSlash = ensureLeadingSlash(path);

  // All external links should be returned as is.
  if (isExternalLink(path)) {
    return path;
  }

  // If we're in preview mode, the path always starts with `/preview`.
  if (ctx.preview) {
    if (locale) {
      return `/preview/${locale}${pathWithLeadingSlash}`;
    }

    return `/preview${pathWithLeadingSlash}`;
  }

  // Define the base href for the current request.
  let href = "";

  // Start with `//` to ensure the URL is protocol-relative and includes the domain.
  if (ctx.domain) {
    href += `https://${ctx.domain}`;
  }
  // Prefix the path with the owner and repository, e.g. `/invertase/docs.page`.
  else {
    href = `/${ctx.owner}/${ctx.repository}`;
  }

  // If there is a ref, which is not the HEAD, we need to include it in the path.
  if (ctx.ref && ctx.ref !== "HEAD") {
    // When using a domain, the ref is it's own segment, e.g. `/~foo`.
    if (ctx.domain) {
      href += "/";
    }

    // Append the encoded ref to ensure no
    href += `~${encodeURIComponent(ctx.ref)}`;
  }

  // If there is a locale, we need to include it in the path, e.g. `/invertase/docs.page/fr`.
  if (locale) {
    href += `/${locale}`;
  }

  // Return the full path with the owner, repository, ref, locale and path.
  return `${href}${pathWithLeadingSlash}`;
}

// Matches a URL matching a pattern with a given path. Rules are:
// `/foo/*` matches `/foo`, `/foo/bar`, `/foo/bar/baz/etc`
// `/foo/:bar` matches `/foo/bar`, `/foo/baz`, etc
// `/foo/:bar/*` matches `/foo/bar`, `/foo/bar/baz/etc`
// `/foo/:bar/:baz` matches `/foo/bar/baz`, `/foo/bar/qux`, etc
// `/foo/*/bar` matches `/foo/bar`, `/foo/etc/bar`, etc
export function matchPathPattern(pattern: string, path: string) {
  // Escape regex special characters in the pattern except for * and :
  const regexPattern = pattern
    .replace(/([.+?^=!:${}()|\[\]\/\\])/g, "\\$1")
    .replace(/\*/g, ".*") // Replace * with .*
    .replace(/\/:([^\/]+)/g, "/([^/]+)"); // Replace /:param with /([^/]+)

  return new RegExp(`^${regexPattern}$`).test(path);
}

// Returns the bundle error response as a JSON response.
export function bundleErrorResponse(bundle: BundleResponse): Response {
  if (bundle.code === "OK") {
    throw new Error("bundleErrorResponse called with a successful bundle");
  }

  let json = { code: bundle.code, message: "" };
  if (typeof bundle.error === "string") {
    json.message = bundle.error;
  } else {
    json = {
      code: bundle.code,
      ...bundle.error,
    };
  }

  return Response.json(json, {
    status: bundleCodeToStatusCode(bundle),
  });
}

// Returns the status code for a given bundle response.
export function bundleCodeToStatusCode(bundle: BundleResponse): number {
  switch (bundle.code) {
    case "NOT_FOUND":
      return 404;
    case "BAD_REQUEST":
      return 400;
    case "REPO_NOT_FOUND":
      return 404;
    case "FILE_NOT_FOUND":
      return 404;
    case "BUNDLE_ERROR":
      return 500;
    case "INTERNAL_SERVER_ERROR":
      return 500;
    default:
      return 200;
  }
}
