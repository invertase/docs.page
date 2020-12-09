import React, { CSSProperties } from 'react';
import validDataUrl from 'valid-data-url';
import Zoom from 'react-medium-image-zoom';

import { isExternalLink } from '../components/Link';
import { useConfig, useSlugProperties } from '../hooks';

interface ImageProps
  extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
  caption?: string;
  zoom?: boolean;
}

const className: string = 'mx-auto';
const style: CSSProperties = {
  maxHeight: 600,
};

export function Image({ zoom, caption, ...props }: ImageProps) {
  const config = useConfig();
  const properties = useSlugProperties();
  const zoomEnabled = zoom ?? config.zoomImages;

  let src = props.src ?? '';

  if (!src) {
    return null;
  }

  const wrapper = (child: React.ReactElement) =>
    withFigure(zoomEnabled ? withZoom(child) : child, caption);

  if (isExternalLink(src) || validDataUrl(src)) {
    return wrapper(
      <img {...props} src={src} alt={props.alt ?? ''} className={className} style={style} />,
    );
  }

  let url = `https://raw.githubusercontent.com/${properties.owner}/${properties.repository}/${properties.ref}/docs/${src}`;
  return wrapper(<img {...props} src={url} alt={props.alt} className={className} style={style} />);
}

function withFigure(child: React.ReactElement, caption?: string) {
  return (
    <figure>
      {child}
      {!!caption && (
        <figcaption className="text-center text-sm italic my-3 dark:text-white">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function withZoom(child: React.ReactElement) {
  return <Zoom wrapStyle={{ width: '100%' }}>{child}</Zoom>;
}
