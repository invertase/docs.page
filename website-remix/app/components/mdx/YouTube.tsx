import { ComponentProps } from 'react';
import { cn } from '~/utils';

type YouTubeProps = ComponentProps<'iframe'> & {
  id: string;
};

export function YouTube({ id, className, ...props }: YouTubeProps) {
  if (!id) {
    return <div />;
  }

  return (
    <iframe
      {...props}
      className={cn('aspect-video w-full overflow-hidden', className)}
      src={`https://www.youtube.com/embed/${id}`}
      allowFullScreen
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
    />
  );
}
