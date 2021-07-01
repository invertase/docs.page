import React from 'react';
import NextLink from 'next/link';
import { SPLITTER } from '../utils/properties';
import { useCustomDomain, useSlugProperties } from '../hooks';

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

  if (isHashLink(props.href)) {
    return <a {...props} />;
  }

  if (isExternalLink(props.href)) {
    return <ExternalLink {...props} />;
  }

  // Extract `href` from `props`
  const { href: originalHref, ...anchorProps } = props;
  let href = originalHref;

  // If there is no custom domain, attach the owner and repo
  if (!domain) {
    href = `/${properties.owner}/${properties.repository}`;

    // Add a ref to the current href, if the branch is not the base branch
    if (!properties.isBaseBranch) {
      href += `${SPLITTER}${properties.ref}`;
    }

    href += originalHref;
  }

  // If there is a domain, and we're on a ref, prefix the URL instead
  if (domain && !properties.isBaseBranch) {
    href = `/${SPLITTER}${properties.ref}` + href;
  }

  return (
    <NextLink href={href}>
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
