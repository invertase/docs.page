import { NavLink, NavLinkProps, useLocation } from 'react-router-dom';
import { useCustomDomain, useDocumentationContext } from '~/context';
import { usePreviewMode } from '~/utils/local-preview-mode';

export function DocsLink({ ...props }: NavLinkProps): JSX.Element {
  const { owner, repo, ref } = useDocumentationContext();
  const previewMode = usePreviewMode();
  console.log('ref', ref)

  const { domain } = useCustomDomain()

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
    console.log('here', to)
  }

  if (previewMode.enabled) {
    return (
      <a
        className={
          typeof props.className === 'function'
            ? props.className({ isActive: false })
            : props.className
        }
        href={`#${to}`}
      >
        {props.children}
      </a>
    );
  }

  if (domain) {

    return (
      <a
        className={
          typeof props.className === 'function'
            ? props.className({ isActive: false })
            : props.className
        }
        href={`https://${domain}${to}`}
      >
        {props.children}
      </a>
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
