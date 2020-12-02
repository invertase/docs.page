import React, { useContext } from 'react';

import { ConfigContext } from '../config';

type HeadingType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

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

  if (!props.id || type === 'h1' || config.headerDepth === 0 || depth[type] > config.headerDepth) {
    return React.createElement(type, props);
  }

  const renderChildren = (children: React.ReactNode) => (
    <span className="flex group">
      <span>{children}</span>
      <a
        href={`#${props.id}`}
        className="opacity-0 group-hover:opacity-100 ml-3 transition-opacity duration-100"
      >
        #
      </a>
    </span>
  );

  return (
    <span className="relative">
      <a id={props.id} className="absolute -mt-16" />
      {React.createElement(type, {
        ...props,
        children: renderChildren(props.children),
      })}
    </span>
  );
}

export { Heading };
