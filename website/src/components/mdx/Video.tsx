import { getImagePath } from 'src/utils';

interface VideoProps extends React.ComponentProps<'video'> {
  src: string;
  type: string;
}

function Video(props: VideoProps) {
  if (!props.src) {
    return <div />;
  }

  const { src, type, ...other } = props;

  return (
    <video {...other}>
      <source src={getImagePath(src)} type={type} />
    </video>
  );
}

export default Video;
