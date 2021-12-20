import { createElement, CSSProperties, DetailedHTMLProps } from 'react';
import cx from 'classnames';

import { useImagePath } from '~/context';
import { DocsLink } from './DocsLink';

export type YouTubeProps = {
  id: string;
};

export function YouTube({ id }: YouTubeProps) {
  if (!id) {
    return <div />;
  }

  return (
    <iframe
      className="w-full aspect-video rounded overflow-hidden"
      src={`https://www.youtube.com/embed/${id}`}
      allowFullScreen
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
    />
  );
}

interface ImageProps
  extends DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
  height?: string | number;
  width?: string | number;
  alt?: string;
  src?: string;
}

function Image(props: ImageProps) {
  const src = useImagePath(props.src || '');

  const style: CSSProperties = {
    height: props.height ? parseInt(`${props.height}`) : 'inherit',
    width: props.width ? parseInt(`${props.width}`) : 'inherit',
  };

  return <img {...props} style={style} src={src} alt={props.alt ?? ''} loading="lazy" />;
}

function Table(
  props: DetailedHTMLProps<React.ImgHTMLAttributes<HTMLTableElement>, HTMLTableElement>,
) {
  return (
    <div className="overflow-scroll sm:overflow-visible">
      <table {...props} />
    </div>
  );
}

function Pre(props: DetailedHTMLProps<React.HTMLAttributes<HTMLPreElement>, HTMLPreElement>) {
  return (
    <div className="no-prose">
      <pre {...props} />
    </div>
  );
}

function Anchor(
  props: DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>,
) {
  return (
    <DocsLink
      to={props.href || ''}
      className="no-underline border-b border-docs-theme hover:border-b-2"
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
  return createElement(type, {
    ...props,
    className: cx('relative', props.className),
    children:
      type === 'h1' ? (
        children
      ) : (
        <>
          <div id={id} className="absolute -top-16 opacity-0 pointer-events-none" />
          <a
            href={`#${id}`}
            className="before:content-['#'] before:absolute before:-left-6 before:text-docs-theme no-underline"
          />
          <span>{children}</span>
        </>
      ),
  });
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
  YouTube,
  Image,
};
