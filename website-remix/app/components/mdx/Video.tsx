import { ComponentProps } from 'react';
import { useAssetSrc } from '~/context';
import { cn } from '~/utils';

type VideoProps = ComponentProps<'video'> & {
  src: string;
  type: string;
};

export function Video(props: VideoProps) {
  const src = useAssetSrc(props.src ?? '');

  if (!props.src) {
    return <div />;
  }

  const { type, className, ...other } = props;

  return (
    <video {...other} className={cn('aspect-video w-full rounded-md overflow-hidden', className)}>
      <source src={src} type={type} />
    </video>
  );
}
