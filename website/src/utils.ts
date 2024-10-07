import cx from "classnames";
import { twMerge } from "tailwind-merge";
import type { BundleResponse } from "./api";
import type { Context } from "./context";
import { getEnvironment } from "./env";

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

// Gets a custom domain for a given owner and repository.
export async function getCustomDomain(
  owner: string,
  repository: string
): Promise<string | null> {
  const response = await fetch(
    `https://custom-domain.invertase.workers.dev/?owner=${owner}&repo=${repository}`
  );

  if (!response.ok) {
    return null;
  }

  const json = await response.json();

  if ("domain" in json && typeof json.domain === "string") {
    return json.domain;
  }

  return null;
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

// Returns whether the provided path is active or not.
export function getHrefIsActive(ctx: Context, currentPath: string, path: string) {
  const href = getHref(ctx, path);

  // If it's a preview request, we can just check if the current path is equal to the href.
  if (ctx.preview) {
    return currentPath === href;
  }

  // If the request is a vanity request (e.g. https://invertase.docs.page/melos), but there's a domain
  // set for the repo, the `href` will be the full domain path, so we need to check if the current path
  // which contains the repo is equal to the fully qualified domain path.
  if (ctx.domain && ctx.vanity) {
    const [_repo, ...path] = currentPath.split("/").filter(Boolean);
    return `https://${ctx.domain}${path.join("/")}` === href;
  }

  // If it's just a domain request, we need to check if the current path is equal to the fully qualified domain path.
  if (ctx.domain) {
    return `https://${ctx.domain}${currentPath}` === href;
  }

  // Otherwise, we can just check if the current path is equal to the href.
  return currentPath === href;
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
  
  // Ensure all links start with the custom domain if it's set.
  if (ctx.domain) {
    const protocol = getEnvironment() === "development" ? "http" : "https";
    href += `${protocol}://${ctx.domain}`;
  }
  // If it's a vanity domain, we need to prefix the path with the repository only.
  else if (ctx.vanity) {
    href += `/${ctx.repository}`;
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

export function toBase64(str: string): string {
  const encoded = encodeURIComponent(str).replace(
    /%([0-9A-F]{2})/g,
    (_, p1) => {
      return String.fromCharCode(Number.parseInt(p1, 16));
    }
  );

  return typeof window !== "undefined"
    ? window.btoa(encoded)
    : Buffer.from(encoded).toString("base64");
}
