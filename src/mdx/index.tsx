import React, { useContext } from "react";
import Link from "next/link";

import Foo from "./Foo";
import { DEFAULT_BRANCH, SlugPropertiesContext } from "../properties";

export default {
  a: (props: React.HTMLProps<HTMLAnchorElement>): React.ReactNode => {
    if (
      props.href?.startsWith("http://") ||
      props.href?.startsWith("https://")
    ) {
      return <a {...props} target="_blank" rel="noopener" />;
    }

    const properties = useContext(SlugPropertiesContext);
    let { href, ...anchorProps } = props;

    href = `/${properties.owner}/${properties.repository}`;

    if (properties.branch !== DEFAULT_BRANCH) {
      href += `#${properties.branch}`;
    }

    if (props.href.startsWith("/")) {
      href += props.href;
    } else {
      href += `/${props.href}`;
    }

    return (
      <Link href={href}>
        <a {...anchorProps}>{props.children}</a>
      </Link>
    );
  },
  Foo,
};
