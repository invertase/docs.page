import cx from 'classnames';
import { twMerge } from 'tailwind-merge';
import { Context } from '~/context';

// Helper function to merge Tailwind CSS classes with classnames.
export function cn(...inputs: cx.ArgumentArray) {
  return twMerge(cx(inputs));
}

// Returns a string with a leading slash
export function ensureLeadingSlash(path: string) {
  return !path.startsWith('/') ? `/${path}` : path;
}

// Removes any trailing slash from string
export function removeTrailingSlash(value: string) {
  return value.replace(/\/$/, '');
}

// Returns whether the link is external or not
export function isExternalLink(href: string) {
  return href.startsWith('http://') || href.startsWith('https://');
}

// Returns the correct image path for a given image;
//  - if remote, returns the path as is
//  - if local, returns the path with the correct base url
export function getImageSrc(ctx: Context, src: string) {
  if (isExternalLink(src)) {
    return src;
  }

  return getBlobSrc(ctx, src);
}

// Returns a raw blob path for a given path.
export function getBlobSrc(ctx: Context, src: string) {
  const { source, baseBranch } = ctx.bundle;
  const { owner, repository, ref } = source;

  if (source.type === 'branch') {
    return `https://raw.githubusercontent.com/${owner}/${repository}/${encodeURIComponent(
      ref ?? baseBranch,
    )}/docs${ensureLeadingSlash(src)}`;
  }
  if (source.type === 'PR') {
    return `https://raw.githubusercontent.com/${owner}/${repository}/${encodeURIComponent(
      ref ?? baseBranch,
    )}/docs${ensureLeadingSlash(src)}`;
  }

  return `https://raw.githubusercontent.com/${owner}/${repository}/main/docs${ensureLeadingSlash(
    src,
  )}`;
}

// Returns the current locale.
//
// This is determined by the first segment of the path, e.g. `/fr/getting-started` would return `fr`.
// For it to be considered a valid locale, it must be included in the `locales` array of the bundle config,
// which is derived from the sidebar configuration.
export function getLocale(ctx: Context) {
  const locale = ctx.path.split('/').filter(Boolean).at(0);
  return locale && ctx.bundle.config.locales.includes(locale) ? locale : undefined;
}

export function getHref(ctx: Context, path: string) {
  const locale = getLocale(ctx);
  const pathWithLeadingSlash = ensureLeadingSlash(path);

  // All external links should be returned as is.
  if (isExternalLink(path)) {
    return path;
  }

  // If we're in preview mode, the path always starts with `/preview`.
  if (ctx.preview) {
    return `/preview${pathWithLeadingSlash}`;
  }

  // Define the base href for the current request.
  let href = '';

  // Start with `//` to ensure the URL is protocol-relative and includes the domain.
  if (ctx.domain) {
    href += `//${ctx.domain}`;
  }
  // Prefix the path with the owner and repository, e.g. `/invertase/docs.page`.
  else {
    href = `/${ctx.owner}/${ctx.repository}`;
  }

  // If there is a ref, which is not the HEAD, we need to include it in the path.
  if (ctx.ref && ctx.ref !== 'HEAD') {
    // When using a domain, the ref is it's own segment, e.g. `/~foo`.
    if (ctx.domain) {
      href += '/';
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
