import { ComponentProps } from 'react';
import { Link as InternalLink } from '@remix-run/react';
import { useHref } from '~/context';
import { isExternalLink } from '~/utils';

type LinkProps = ComponentProps<'a'>;

export function Link(props: LinkProps) {
  const href = useHref(props.href ?? '');

  if (isExternalLink(props.href ?? '')) {
    return <a rel="noopener noreferrer" target="_blank" {...props} href={href} />;
  }

  return <InternalLink {...props} to={href} />;
}
