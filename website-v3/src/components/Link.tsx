import cx from 'classnames';
import context from 'src/context';
import { isExternalLink, removeTrailingSlash } from 'src/utils';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  activeClassName?: string;
}

const Link: React.FC<LinkProps> = props => {
  const { owner, repository, ref, domain, relativePath } = context.get();

  if (isExternalLink(props.href)) {
    return (
      <a {...props} target="_blank" rel="noreferrer nofollow">
        {props.children}
      </a>
    );
  }

  let to = `/${owner}/${repository}`;

  if (ref && ref !== 'HEAD') {
    to += `~${encodeURIComponent(ref)}`;
  }

  // TODO: Preview mode

  if (domain && import.meta.env.PROD) {
    let href = `//${domain}${props.href}`;

    if (ref && ref !== 'HEAD') {
      href = `//${domain}/~${encodeURIComponent(ref)}${props.href}`;
    }

    return (
      <a
        {...props}
        className={cx(props.className, {
          [props.activeClassName || '']: props.href === relativePath,
        })}
        href={href}
      />
    );
  }

  return (
    <a
      {...props}
      className={cx(props.className, {
        [props.activeClassName || '']: props.href === relativePath,
      })}
      href={removeTrailingSlash(`${to}${props.href}`)}
    />
  );
};

export default Link;
