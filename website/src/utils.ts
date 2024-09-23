import cx from "classnames";
import { twMerge } from "tailwind-merge";
import type { BundleResponse } from "./api";
import type { Context } from "./context";

export class Redirect extends Error {
  url: string;

  constructor(url: string) {
    super();
    this.url = url;
  }
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
      ref ?? baseBranch,
    )}/docs${ensureLeadingSlash(path)}`;
  }
  if (source.type === "PR") {
    return `https://raw.githubusercontent.com/${owner}/${repository}/${encodeURIComponent(
      ref ?? baseBranch,
    )}/docs${ensureLeadingSlash(path)}`;
  }

  return `https://raw.githubusercontent.com/${owner}/${repository}/HEAD/docs${ensureLeadingSlash(
    path,
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

  // Ensures a path, e.g. foo/bar becomes /foo/bar
  let normalizedPath = ensureLeadingSlash(path);

  // Remove any trailing slash from the path.
  if (normalizedPath === "/") {
    normalizedPath = "";
  }

  // All external links should be returned as is.
  if (isExternalLink(path)) {
    return path;
  }

  // If we're in preview mode, the path always starts with `/preview`.
  if (ctx.preview) {
    if (locale) {
      return `/preview/${locale}${normalizedPath}`;
    }

    return `/preview${normalizedPath}`;
  }

  // Define the base href for the current request.
  let href = "";

  // If it's a vanity domain, we need to prefix the path with the owner and repository.
  if (ctx.vanity) {
    href += `/${ctx.repository}`;
  }
  // Ensure all links start with the custom domain if it's set.
  else if (ctx.domain) {
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

    // Append the encoded ref to ensure no special characters are present.
    href += `~${encodeURIComponent(ctx.ref)}`;
  }

  // If there is a locale, we need to include it in the path, e.g. `/invertase/docs.page/fr`.
  if (locale) {
    href += `/${locale}`;
  }

  // Return the full path with the owner, repository, ref, locale and path.
  return `${href}${normalizedPath}`;
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
