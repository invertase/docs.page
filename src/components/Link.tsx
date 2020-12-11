import React from 'react';
import NextLink from 'next/link';
import { SPLITTER } from '../utils/properties';
import { useCustomDomain, useSlugProperties } from '../hooks';
import { isProduction } from '../utils';
import { useRouter } from 'next/router';

/**
 * Custom Link component which builds upon top of the Next Link
 * component.
 *
 * Links on pages needs to be relative to the repository rather than
 * the root, so several checks are in place to alter the provided
 * `href`.
 *
 * Prefetching is disabled by default on Links, since pages are not
 * prebuilt at build time.
 */
export function Link(props: React.HTMLProps<HTMLAnchorElement>) {
  const router = useRouter();
  const customDomain = useCustomDomain();
  const properties = useSlugProperties();

  if (isHashLink(props.href)) {
    return <a {...props} />;
  }

  if (isExternalLink(props.href)) {
    return <ExternalLink {...props} />;
  }

  // Custom domains are only used in production
  // const isUsingCustomDomain: boolean = isProduction() && !!customDomain;

  // Remove `href` from `props`
  let { href, ...anchorProps } = props;

  // If no custom domain, set the repository path as the href
  // if (!isUsingCustomDomain) {
  //   href = `/${properties.owner}/${properties.repository}`;

  //   // Add a ref to the current href, if the branch is not default
  //   if (!properties.isBaseBranch) {
  //     href += `${SPLITTER}${properties.ref}`;
  //   }

  href = `/${properties.owner}/${properties.repository}`;

  // Add a ref to the current href, if the branch is not default
  if (!properties.isBaseBranch) {
    href += `${SPLITTER}${properties.ref}`;
  }

  // Ensure href passed by user starts with a `/`
  if (props.href.startsWith('/')) {
    href += props.href;
  } else {
    href += `/${props.href}`;
  }

  // if (isUsingCustomDomain) {
  //   href = `https://${customDomain}${href}`;
  // }

  return (
    <NextLink href={href} prefetch={false}>
      <a {...anchorProps}>{props.children}</a>
    </NextLink>
  );
}

/**
 * Simple component which opens links in a new tab.
 */
export function ExternalLink(props: React.HTMLProps<HTMLAnchorElement>) {
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
