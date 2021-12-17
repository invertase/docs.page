import { CSSProperties, DetailedHTMLProps } from 'react';
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

function Code(props: DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>) {
  return <code className="font-fira font-medium" {...props} />;
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

export default {
  img: Image,
  table: Table,
  pre: Pre,
  code: Code,
  a: Anchor,
  YouTube,
  Image,
};
