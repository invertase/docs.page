import React from 'react';
import NextLink from 'next/link';
import { SPLITTER } from '../properties';
import { useCustomDomain, useSlugProperties } from '../hooks';
import { isProduction } from '../utils';
import { useRouter } from 'next/router';

export function Link(props: React.HTMLProps<HTMLAnchorElement>) {
  const router = useRouter();
  const customDomain = useCustomDomain();
  const properties = useSlugProperties();

  if (isExternalLink(props.href)) {
    return <a {...props} target="_blank" rel="noopener" />;
  }
  // Custom domains are only used in production
  const isUsingCustomDomain: boolean = isProduction() && !!customDomain;

  // Remove `href` from `props`
  let { href, ...anchorProps } = props;

  // If no custom domain, set the repository path as the href
  if (!isUsingCustomDomain) {
    href = `/${properties.owner}/${properties.repository}`;

    // Add a ref to the current href, if the branch is not default
    if (!properties.isDefaultBranch) {
      href += `${SPLITTER}${properties.ref}`;
    }
  } else {
    if (!properties.isDefaultBranch) {
      // Add the ref to the start of the href with a custom domain
      href = `/${SPLITTER}${properties.ref}`;
    }
  }

  // Ensure href passed by user starts with a `/`
  if (props.href.startsWith('/')) {
    href += props.href;
  } else {
    href += `/${props.href}`;
  }

  if (isUsingCustomDomain) {
    href = `https://${customDomain}${href}`;
  }

  return (
    <NextLink href={href}>
      <a {...anchorProps}>{props.children}</a>
    </NextLink>
  );
}

export function ExternalLink(props: React.HTMLProps<HTMLAnchorElement>) {
  return <a {...props} target="_blank" rel="noopener" />;
}

export function isExternalLink(link: string): boolean {
  return link.startsWith('http://') || link.startsWith('https://');
}
