import { getImagePath } from 'src/utils';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  // TODO: zoom
  zoom?: boolean;
}

const Image: React.FC<ImageProps> = props => {
  const src = getImagePath(props.src ?? '');
  const { width, height, ...other } = props;

  return (
    <figure>
      <img
        {...other}
        src={src}
        loading="lazy"
        className="mx-auto"
        style={{
          width: width ? parseInt(width.toString()) : 'inherit',
          height: height ? parseInt(height.toString()) : 'inherit',
        }}
      />
    </figure>
  );
};

export default Image;
