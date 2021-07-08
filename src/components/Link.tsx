import React from 'react';
import NextLink from 'next/link';
import { SPLITTER } from '../utils/properties';
import { useCustomDomain, useEnvironment, useSlugProperties } from '../hooks';

/**
 * Custom Link component which builds upon top of the Next Link
 * component.
 *
 * Links on pages needs to be relative to the repository rather than
 * the root, so several checks are in place to alter the provided
 * `href`.
 */
export function Link(props: React.HTMLProps<HTMLAnchorElement>): JSX.Element {
  const domain = useCustomDomain();
  const properties = useSlugProperties();
  const env = useEnvironment();

  if (isHashLink(props.href)) {
    return <a {...props} />;
  }

  if (isExternalLink(props.href)) {
    return <ExternalLink {...props} />;
  }

  const isProduction = env === 'production';

  // Extract `href` from `props`
  const { href: originalHref, ...anchorProps } = props;
  let href: string = originalHref;
  let as: string;

  // If there is no custom domain, attach the owner and repo
  if (!isProduction || !domain) {
    href = properties.base + originalHref;
  }

  if (isProduction && domain && !properties.ref) {
    href = `https://${domain}${originalHref}`;
  }

  if (isProduction && domain && properties.ref) {
    href = `https://${domain}/${encodeURIComponent(`${SPLITTER}${properties.ref}`)}${originalHref}`;
  }

  return (
    <NextLink href={href} as={as}>
      <a {...anchorProps}>{props.children}</a>
    </NextLink>
  );
}

/**
 * Simple component which opens links in a new tab.
 */
export function ExternalLink(props: React.HTMLProps<HTMLAnchorElement>): JSX.Element {
  return <a {...props} target="_blank" rel="noopener" />;
}

/**
 * Links beginning with `http://` or `https://` are considered external.
 */
export function isExternalLink(link: string): boolean {
  return link.startsWith('http://') || link.startsWith('https://');
}

/**
 * Links beginning with a `#` are considered hash links.
 */
export function isHashLink(link: string): boolean {
  return link.startsWith('#');
}
