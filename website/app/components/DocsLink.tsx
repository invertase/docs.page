import { NavLink, NavLinkProps, useLocation } from 'react-router-dom';
import { useCustomDomain, useDocumentationContext } from '~/context';
import { usePreviewMode } from '~/utils/local-preview-mode';

export function DocsLink({ ...props }: NavLinkProps): JSX.Element {
  const { owner, repo, ref } = useDocumentationContext();
  const previewMode = usePreviewMode();

  const { domain } = useCustomDomain();

  const { pathname } = useLocation();

  if (typeof props.to === 'string' && isExternalLink(props.to)) {
    return (
      <a
        target="_blank"
        rel="noreferrer nofollow"
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

  if (ref && ref !== 'HEAD') {
    to += `~${ref}`;
  }

  if (previewMode.enabled) {
    return (
      <a
        className={
          typeof props.className === 'function'
            ? props.className({ isActive: false })
            : props.className
        }
        href={`#${props.to}`}
      >
        {props.children}
      </a>
    );
  }

  if (domain && process.env.NODE_ENV === 'production') {
    let href = `//${domain}${props.to}`;

    if (ref && ref !== 'HEAD') {
      href = `//${domain}/~${ref}${props.to}`;
    }
    const path = '/' + pathname.split('/').slice(3).join('/');

    const isActive = props.to === path;
    console.log(href)
    return (
      <NavLink
        className={
          typeof props.className === 'function' ? props.className({ isActive }) : props.className
        }
        to={href}
      >
        {props.children}
      </NavLink>
    );
  }

  return <NavLink {...props} to={removeTrailingSlash(`${to}${props.to}`)} />;
}

function removeTrailingSlash(path: string) {
  return path.replace(/\/$/, '');
}

export function isExternalLink(to: string) {
  return to.startsWith('http');
}

export function isHashLink(link: string): boolean {
  return link.startsWith('#');
}
