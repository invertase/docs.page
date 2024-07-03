import { ComponentProps, ReactElement } from 'react';
import Zoom from 'react-medium-image-zoom';
import { usePageContext, useAssetSrc } from '~/context';
import { cn } from '~/utils';

type ImageProps = ComponentProps<'img'> & {
  zoom?: boolean;
  caption?: string;
};

export function Image(props: ImageProps) {
  const ctx = usePageContext();
  const { width, height, className, ...other } = props;
  const src = useAssetSrc(props.src ?? '');

  // Get the zoom configuration from the props or the bundle content.
  const zoom =
    props.zoom === false
      ? false
      : Boolean(props.zoom) || Boolean(ctx.bundle.config.content?.zoomImages);

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
          className={cn('mx-auto rounded-md', className)}
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
