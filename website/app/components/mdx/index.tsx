import { createElement, DetailedHTMLProps } from 'react';
import cx from 'classnames';

import { DocsLink } from '../DocsLink';
import { YouTube } from './YouTube';
import { Image } from './Image';
import { Table } from './Table';
import { Pre } from './Pre';
import { Tabs, TabItem } from './Tabs';
import { Vimeo } from './Vimeo';
import { Tweet } from './Tweet';

function Anchor(
  props: DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>,
): JSX.Element {
  return (
    <DocsLink
      to={props.href || ''}
      className="border-docs-theme border-b no-underline hover:border-b-2"
    >
      {props.children}
    </DocsLink>
  );
}

type HTMLHeadingProps = DetailedHTMLProps<
  React.HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
>;

interface HeadingProps extends HTMLHeadingProps {
  type: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

function Heading({ type, id, children, ...props }: HeadingProps) {
  return createElement(
    type,
    {
      ...props,
      className: cx('relative group', props.className),
    },
    type === 'h1' ? (
      children
    ) : (
      <>
        <div id={id} className="pointer-events-none absolute -top-16 opacity-0" />
        <a
          href={`#${id}`}
          className="before:text-docs-theme no-underline opacity-0 transition before:absolute before:-left-6 before:w-6 before:content-['#'] group-hover:opacity-100"
        />
        <span>{children}</span>
      </>
    ),
  );
}

export default {
  img: Image,
  table: Table,
  pre: Pre,
  a: Anchor,
  h1: (props: HTMLHeadingProps) => <Heading {...props} type="h1" />,
  h2: (props: HTMLHeadingProps) => <Heading {...props} type="h2" />,
  h3: (props: HTMLHeadingProps) => <Heading {...props} type="h3" />,
  h4: (props: HTMLHeadingProps) => <Heading {...props} type="h4" />,
  h5: (props: HTMLHeadingProps) => <Heading {...props} type="h5" />,
  h6: (props: HTMLHeadingProps) => <Heading {...props} type="h6" />,
  Heading,
  YouTube,
  Image,
  Tabs,
  TabItem,
  Tweet,
  Vimeo,
};
