import { NavLink, NavLinkProps } from 'react-router-dom';
import { useDocumentationContext } from '~/context';

export function DocsLink({ ...props }: NavLinkProps) {
  const { owner, repo, ref } = useDocumentationContext();

  if (typeof props.to === 'string' && isExternalLink(props.to)) {
    return (
      <a
        target="_blank"
        rel="noopener nofollow"
        href={props.to}
        className={
          typeof props.className === 'function'
            ? props.className({ isActive: false })
            : props.className
        }
      >
        {props.children}
      </a>
    );
  }

  let to = `/${owner}/${repo}`;

  if (ref) {
    to += `~${ref}`;
  }

  return <NavLink {...props} to={removeTrailingSlash(`${to}${props.to}`)} />;
}

function removeTrailingSlash(path: string) {
  return path.replace(/\/$/, '');
}

function isExternalLink(to: string) {
  return to.startsWith('http');
}
