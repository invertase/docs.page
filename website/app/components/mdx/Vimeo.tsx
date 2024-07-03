import { ComponentProps } from 'react';
import { cn } from '~/utils';

type VimeoProps = ComponentProps<'iframe'> & {
  id?: string;
  video?: string;
};

export function Vimeo({ id, video, className, ...props }: VimeoProps) {
  if (!id && !video) {
    return <div />;
  }

  return (
    <iframe
      {...props}
      className={cn('aspect-video w-full rounded-md overflow-hidden', className)}
      src={`https://player.vimeo.com/video/${id || video}`}
      allowFullScreen
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
    />
  );
}
