import { ComponentProps, ReactElement } from 'react';
import Zoom from 'react-medium-image-zoom';
import { usePageContext } from '~/context';
import { getImageSrc } from '~/utils';

type ImageProps = ComponentProps<'img'> & {
  zoom?: boolean;
  caption?: string;
};

export function Image(props: ImageProps) {
  const ctx = usePageContext();
  const { width, height, ...other } = props;
  const src = getImageSrc(ctx, props.src ?? '');

  // Get the zoom configuration from the props or the bundle content.
  const zoom = Boolean(props.zoom) || Boolean(ctx.bundle.config.content?.zoomImages);

  // Wrap the image in a zoom container if zoom is enabled.
  const container = (child: ReactElement) => {
    return zoom ? <Zoom>{child}</Zoom> : child;
  };

  return (
    <figure>
      {container(
        <img
          {...other}
          data-zoom={`${zoom}`}
          src={src}
          loading="lazy"
          className="mx-auto"
          style={{
            width: width ? parseInt(width.toString()) : 'inherit',
            height: height ? parseInt(height.toString()) : 'inherit',
          }}
        />,
      )}
      {!!props.caption && <figcaption className="text-center">{props.caption}</figcaption>}
    </figure>
  );
}
