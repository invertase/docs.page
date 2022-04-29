import { NavLink, NavLinkProps, useLocation } from 'react-router-dom';
import { useCustomDomain, useDocumentationContext } from '~/context';
import { usePreviewMode } from '~/utils/preview';

export function DocsLink({ ...props }: NavLinkProps): JSX.Element {
  const { owner, repo, ref } = useDocumentationContext();
  const previewMode = usePreviewMode();

  const { domain } = useCustomDomain();

  const { pathname, hash } = useLocation();

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
    to += `~${encodeURIComponent(ref)}`;
  }

  if (previewMode.enabled) {
    const isActive = hash === `#${props.to}`;
    return (
      <a
        id={`${hash},${`#${props.to}`},${isActive}`}
        className={
          typeof props.className === 'function' ? props.className({ isActive }) : props.className
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
      href = `//${domain}/~${encodeURIComponent(ref)}${props.to}`;
    }

    const formattedPathname = pathname.replace(`/${owner}/${repo}`, '') || '/';

    const isActive = props.to === formattedPathname;

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
