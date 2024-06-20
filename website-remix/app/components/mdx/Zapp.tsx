import { ComponentProps } from 'react';
import { cn } from '~/utils';

type ZappProps = ComponentProps<'iframe'> & {
  id: string;
  lazy?: boolean;
  theme?: 'light' | 'dark';
};

export function Zapp(props: ZappProps) {
  if (!props.id) {
    return <div />;
  }

  const { id, lazy, theme, className, ...other } = props;

  // Allows for GitHub, Gist, and other Zapps.
  // If no / is included, we assume the user supplied a Zapp id,
  // like 'flutter', which should be prefixed by 'edit/'.
  // Otherwise, we assume the user specified their own Zapp path,
  // and treat it as such.
  const _id = id.includes('/') ? id : `edit/${id}`;

  const _lazy = lazy === undefined ? false : props.lazy;
  const _theme = theme || 'dark';

  return (
    <iframe
      {...other}
      src={`https://zapp.run/${_id}?theme=${_theme}&lazy=${_lazy}`}
      className={cn('aspect-video w-full rounded-md overflow-hidden', className)}
      style={{
        width: '100%',
        height: '100%',
        border: 0,
        overflow: 'hidden',
      }}
    />
  );
}
