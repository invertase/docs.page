import React, { useCallback, useState } from 'react';
import { Controlled as ControlledZoom } from 'react-medium-image-zoom';
import { Image } from '../components/Image';
import { useConfig } from '../hooks';

interface ImageProps
  extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
  caption?: string;
  zoom?: boolean;
}

export function Img({ zoom, caption, ...props }: ImageProps): JSX.Element {
  const config = useConfig();
  const zoomEnabled = zoom ?? config.zoomImages;

  const src = props.src ?? '';

  if (!src) {
    return null;
  }

  const wrapper = (child: React.ReactElement) =>
    withFigure(zoomEnabled ? withZoom(child) : child, caption);

  return wrapper(<Image {...props} className="mx-auto" />);
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
  const [isZoomed, setIsZoomed] = useState(false);

  // const handleImgLoad = useCallback(() => {
  //   setIsZoomed(true);
  // }, []);

  const handleZoomChange = useCallback(shouldZoom => {
    setIsZoomed(shouldZoom);
  }, []);
  return (
    <ControlledZoom
      wrapStyle={
        isZoomed
          ? { width: '100%', height: 'auto', transition: 'height ease-out  0.5s' }
          : { transition: 'height ease-out  0.5s' }
      }
      isZoomed={isZoomed}
      onZoomChange={handleZoomChange}
    >
      {child}
    </ControlledZoom>
  );
}
