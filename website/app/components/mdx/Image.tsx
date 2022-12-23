import { CSSProperties, DetailedHTMLProps, useCallback, useState } from 'react';
import { useImagePath } from '~/context';
import { Controlled as ControlledZoom } from 'react-medium-image-zoom';
import { DocsLink } from '../DocsLink';

interface ImageProps
  extends DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
  height?: string | number;
  width?: string | number;
  alt?: string;
  src?: string;
  caption?: string;
  zoom?: boolean;
}

export function Image({ zoom, caption, ...props }: ImageProps & { href?: string }): JSX.Element {
  const src = useImagePath(props.src || '');

  const zoomEnabled = zoom;

  const wrapper = (child: React.ReactElement) =>
    props.href
      ? withHref(withFigure(zoomEnabled ? withZoom(child) : child, caption), props.href)
      : withFigure(zoomEnabled ? withZoom(child) : child, caption);

  const style: CSSProperties = {
    height: props.height ? parseInt(`${props.height}`) : 'inherit',
    width: props.width ? parseInt(`${props.width}`) : 'inherit',
  };

  return wrapper(
    <img
      className="mx-auto"
      {...props}
      style={style}
      src={src}
      alt={props.alt ?? ''}
      loading="lazy"
    />,
  );
}

function withHref(child: React.ReactElement, href: string) {
  return <DocsLink to={href}>{child}</DocsLink>;
}

function withFigure(child: React.ReactElement, caption?: string) {
  return (
    <figure>
      {child}
      {!!caption && (
        <figcaption className="my-3 text-center text-sm italic dark:text-white">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function withZoom(child: React.ReactElement) {
  const [isZoomed, setIsZoomed] = useState(false);

  const handleZoomChange = useCallback((shouldZoom: boolean) => {
    setIsZoomed(shouldZoom);
  }, []);
  return (
    <ControlledZoom
      wrapStyle={
        isZoomed
          ? { width: '100%', height: 'auto', transition: 'height ease-out  0.5s' }
          : { width: '100%', transition: 'height ease-out  0.5s' }
      }
      isZoomed={isZoomed}
      onZoomChange={handleZoomChange}
    >
      {child}
    </ControlledZoom>
  );
}
