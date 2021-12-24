import { createElement, CSSProperties, DetailedHTMLProps, useEffect, useState } from 'react';
import cx from 'classnames';
import CopyToClipboard from 'react-copy-to-clipboard';

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

export interface PreProps extends React.HTMLProps<HTMLPreElement> {
  title?: string;
  raw: string;
  html: string;
}

export function Pre(props: PreProps): JSX.Element {
  const [copied, setCopied] = useState<boolean>(false);
  let timeout: NodeJS.Timeout;

  useEffect(() => {
    if (copied) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  }, [copied]);

  // Extract the data attributes from the component
  const title = props.title;
  const raw = decodeURIComponent(encodeURIComponent(props.raw));

  return (
    <>
      {!!title && (
        <div className="rounded-tr rounded-tl font-mono font-bold text-gray-300 text-sm px-4 py-2 border-b border-gray-700 bg-[#24292e]">
          {title}
        </div>
      )}
      <div className="relative group">
        <div
          className={cx('shiki-parent', {
            'shiki-parent-title': !!title,
          })}
          dangerouslySetInnerHTML={{ __html: props.html }}
        />
        <div
          className={cx(
            'opacity-0 group-hover:opacity-100 transition-opacity absolute top-0 right-0 mr-2 mt-2',
            {
              'opacity-100': copied,
            },
          )}
        >
          <CopyToClipboard text={raw} onCopy={() => setCopied(true)}>
            <button className="text-white text-xs font-mono bg-black hover:bg-black/40 transition-colors px-3 py-2 rounded-lg">
              {copied ? 'Copied' : 'Copy'}
            </button>
          </CopyToClipboard>
        </div>
      </div>
    </>
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
