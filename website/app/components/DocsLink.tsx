import { NavLink, NavLinkProps } from 'react-router-dom';
import { useDocumentationContext } from '~/context';

export function DocsLink({ ...props }: NavLinkProps) {
  const { owner, repo, ref } = useDocumentationContext();

  let to = `/${owner}/${repo}`;

  if (ref) {
    to += `~${ref}`;
  }

  return <NavLink {...props} to={removeTrailingSlash(`${to}${props.to}`)} />;
}

function removeTrailingSlash(path: string) {
  return path.replace(/\/$/, '');
}
