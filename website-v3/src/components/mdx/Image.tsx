import { getImagePath } from 'src/utils';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  // TODO: zoom
  zoom?: boolean;
}

const Image: React.FC<ImageProps> = props => {
  const src = getImagePath(props.src ?? '');

  return (
    <img
      {...props}
      src={src}
      loading="lazy"
      style={{
        width: props.width ? parseInt(props.width.toString()) : 'inherit',
        height: props.height ? parseInt(props.height.toString()) : 'inherit',
      }}
    />
  );
};

export default Image;
