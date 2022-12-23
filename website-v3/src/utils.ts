import get from 'lodash.get';
import context from 'src/context';

const VARIABLE_REGEX = /{{\s([a-zA-Z0-9_.]*)\s}}/gm;

// Returns a string with a leading slash
export function ensureLeadingSlash(path: string) {
  return !path.startsWith('/') ? `/${path}` : path;
}

// Removes any trailing slash from string
export function removeTrailingSlash(value: string) {
  return value.replace(/\/$/, '');
}

export function isExternalLink(href: string) {
  return href.startsWith('http');
}

export function isHashLink(href: string): boolean {
  return href.startsWith('#');
}

// Replaces an object of variables with their moustache values in a string
export function replaceMoustacheVariables(variables: Record<string, string>, value: string) {
  let output = value;
  let m: RegExpExecArray | null;

  while ((m = VARIABLE_REGEX.exec(value)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === VARIABLE_REGEX.lastIndex) {
      VARIABLE_REGEX.lastIndex++;
    }
    output = output.replace(m[0], get(variables, m[1], m[0]));
  }

  return output;
}

// Returns the correct image path for a given image;
//  - if remote, returns the path as is
//  - if local, returns the path with the correct base url
export function getImagePath(src: string) {
  if (src.startsWith('http')) {
    return src;
  }

  return;
}

// Returns a raw blob path for a given path.
export function getBlobPath(src: string) {
  const { source, baseBranch } = context.get();
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
