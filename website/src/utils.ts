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

  return getBlobPath(src);
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

export const sideBarToggleLogic = () => {
  const toggle = document.querySelector('button[data-sidebar-toggle]')!;
  const sidebar = document.querySelector('div[data-sidebar]')!;
  const mask = document.querySelector('div[data-sidebar-mask]')!;

  // Listen to menu toggle events and toggle the body attribute.
  toggle?.addEventListener('click', () => {
    document.body.setAttribute(
      'sidebar-open',
      (document.body.getAttribute('sidebar-open') !== 'true').toString(),
    );
  });

  mask?.addEventListener('click', () => {
    document.body.setAttribute('sidebar-open', 'false');
  });

  new MutationObserver(() => {
    const open = document.body.getAttribute('sidebar-open') === 'true';
    for (const el of [sidebar, mask]) el.setAttribute('data-visible', `${open}`);
  }).observe(document.body, {
    attributes: true,
    attributeFilter: ['sidebar-open'],
  });
};

export const themeToggleLogic = ({
  owner,
  repository,
  domain,
  ref,
}: {
  owner: string;
  repository: string;
  domain?: string;
  ref?: string;
}) => {
  const html = document.documentElement;
  const isDark = () => html.getAttribute('data-theme') === 'dark';

  const toggle = document.querySelector('button[data-theme-toggle]')!;
  const light = toggle?.querySelector('span[data-theme-type="light"]') as HTMLSpanElement;
  const dark = toggle?.querySelector('span[data-theme-type="dark"]') as HTMLSpanElement;

  function toggleElements() {
    if (!toggle || !light || !dark) return;
    if (isDark()) {
      light.style.display = 'none';
      dark.style.display = 'inline';
    } else {
      dark.style.display = 'none';
      light.style.display = 'inline';
    }
  }

  toggle?.addEventListener('click', () => {
    const theme = isDark() ? 'light' : 'dark';
    // Update the theme attribute on the <html> element
    theme === 'light'
      ? html.removeAttribute('data-theme')
      : html.setAttribute('data-theme', 'dark');
    // Toggle the icons
    toggleElements();
    // Update the theme via server and return a cookie
    fetch('/api/docs.page/theme', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        owner,
        repository,
        ref,
        domain,
        theme,
      }),
    });
  });
  toggleElements();
};
