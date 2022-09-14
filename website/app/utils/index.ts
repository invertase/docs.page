import { DocumentationLoader } from '~/loaders/documentation.server';
import get from 'lodash.get';

export function ensureLeadingSlash(path: string) {
  if (!path.startsWith('/')) {
    return `/${path}`;
  }
  return path;
}

const VARIABLE_REGEX = /{{\s([a-zA-Z0-9_.]*)\s}}/gm;

export function replaceVariables(variables: Record<string, string>, value: string) {
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

export function hash(value: string): string {
  let hash = 0,
    i: number,
    chr: number;
  for (i = 0; i < value.length; i++) {
    chr = value.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString();
}

export function getSocialImage(data?: DocumentationLoader): string {
  if (!data?.config?.socialPreview) {
    return 'https://raw.githubusercontent.com/invertase/docs.page/main/docs/assets/docs-page-social.png';
  }

  let socialPreviewUrl = data.config.socialPreview;

  if (socialPreviewUrl.startsWith('http')) {
    return new URL(socialPreviewUrl).href;
  }
  if (!socialPreviewUrl.startsWith('/')) {
    socialPreviewUrl = '/' + socialPreviewUrl;
  }
  const ref = encodeURIComponent(data.source.ref);

  socialPreviewUrl = `https://raw.githubusercontent.com/${data.owner}/${data.repo}/${ref}/docs${socialPreviewUrl}`;

  return new URL(socialPreviewUrl).href;
}
