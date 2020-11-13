import React, { useContext } from "react";
import { onlyText } from "react-children-utilities";
import slugify from "slugify";

import { ConfigContext } from "../config";

type HeadingType = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

interface HeadingProps extends React.HTMLProps<HTMLHeadingElement> {
  type: HeadingType;
}

const depth: { [key in HeadingType]: number } = {
  h1: 1,
  h2: 2,
  h3: 3,
  h4: 4,
  h5: 5,
  h6: 6,
};

function Heading(props: HeadingProps) {
  const config = useContext(ConfigContext);
  const type = props.type;

  const id = (props.id || slugify(onlyText(props.children))).toLowerCase();

  if (!id || config.headerDepth === 0 || depth[type] > config.headerDepth) {
    return React.createElement(type, props);
  }

  const renderChildren = (children: React.ReactNode) => (
    <span className="relative">
      <a
        href={`#${id}`}
        className="absolute desktop:-ml-10 opacity-20 hover:opacity-30 transition-opacity duration-100"
        style={{
          textDecoration: "none",
        }}
      >
        #
      </a>
      <span className="pl-8 desktop:pl-0">{children}</span>
    </span>
  );

  return (
    <span className="relative">
      <a id={id} className="absolute -mt-16" />
      {React.createElement(type, {
        ...props,
        children: renderChildren(props.children),
      })}
    </span>
  );
}

export { Heading };
