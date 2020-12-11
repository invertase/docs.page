import React, { CSSProperties } from 'react';
import Zoom from 'react-medium-image-zoom';

import { Image } from '../components/Image';
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

export function Img({ zoom, caption, ...props }: ImageProps) {
  const config = useConfig();
  const properties = useSlugProperties();
  const zoomEnabled = zoom ?? config.zoomImages;

  let src = props.src ?? '';

  if (!src) {
    return null;
  }

  const wrapper = (child: React.ReactElement) =>
    withFigure(zoomEnabled ? withZoom(child) : child, caption);

  return wrapper(<Image {...props} />);
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
