import React from 'react';
import NextLink from 'next/link';
import { SPLITTER } from '../properties';
import { useSlugProperties } from '../hooks';

export function Link(props: React.HTMLProps<HTMLAnchorElement>) {
  const properties = useSlugProperties();

  if (isExternalLink(props.href)) {
    return <a {...props} target="_blank" rel="noopener" />;
  }

  let { href, ...anchorProps } = props;

  href = `/${properties.owner}/${properties.repository}`;

  if (!properties.isDefaultBranch) {
    href += `${SPLITTER}${properties.ref}`;
  }

  if (props.href.startsWith('/')) {
    href += props.href;
  } else {
    href += `/${props.href}`;
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
