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