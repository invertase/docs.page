import { ComponentProps } from 'react';
import { Link as InternalLink } from '@remix-run/react';
import { useHref } from '~/context';
import { cn, isExternalLink } from '~/utils';

type LinkProps = ComponentProps<'a'>;

export function Link(props: LinkProps) {
  const href = useHref(props.href ?? '');

  const className = cn(
    'font-bold no-underline border-b border-primary hover:border-b-2',
    props.className,
  );

  if (isExternalLink(props.href ?? '')) {
    return (
      <a rel="noopener noreferrer" target="_blank" {...props} className={className} href={href} />
    );
  }

  return <InternalLink {...props} to={href} className={className} />;
}
