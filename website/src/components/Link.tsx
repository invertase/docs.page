import cx from 'classnames';
import context from 'src/context';
import { isExternalLink, removeTrailingSlash } from 'src/utils';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  activeClassNames?: string;
}

const Link: React.FC<LinkProps> = props => {
  const { owner, repository, ref, domain, relativePath, locale } = context.get();

  if (isExternalLink(props.href)) {
    return (
      <a {...props} target="_blank" rel="noreferrer nofollow">
        {props.children}
      </a>
    );
  }

  if (domain && import.meta.env.PROD) {
    let href = `//${domain}`;

    if (ref && ref !== 'HEAD') {
      href = `//${domain}/~${encodeURIComponent(ref)}`;
    }

    // All links with locales should be relative to that locale.
    if (locale) {
      href += `/${locale}`;
    }

    href += props.href;

    return (
      <a
        {...props}
        className={cx(props.className, {
          [props.activeClassNames || '']: props.href === relativePath,
        })}
        href={href}
      />
    );
  }

  let to = repository ? `/${owner}/${repository}` : `/${owner}`;

  if (ref && ref !== 'HEAD') {
    to += `~${encodeURIComponent(ref)}`;
  }

  if (locale) {
    to += `/${locale}`;
  }

  return (
    <a
      {...props}
      className={cx(props.className, {
        [props.activeClassNames || '']: props.href === relativePath,
      })}
      href={removeTrailingSlash(`${to}${props.href}`)}
    />
  );
};

export default Link;
