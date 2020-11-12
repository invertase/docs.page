import React, { useContext } from "react";
import NextLink from "next/link";
import {
  BRANCH_SPLITTER,
  DEFAULT_BRANCH,
  SlugPropertiesContext,
} from "../properties";

export function Link(props: React.HTMLProps<HTMLAnchorElement>) {
  if (isExternalLink(props.href)) {
    return <a {...props} target="_blank" rel="noopener" />;
  }

  const properties = useContext(SlugPropertiesContext);
  let { href, ...anchorProps } = props;

  href = `/${properties.owner}/${properties.repository}`;

  if (properties.branch !== DEFAULT_BRANCH) {
    href += `${BRANCH_SPLITTER}${properties.branch}`;
  }

  if (props.href.startsWith("/")) {
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

export function isExternalLink(link: string): boolean {
  return link.startsWith("http://") || link.startsWith("https://");
}
