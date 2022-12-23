import cx from 'classnames';
import { DocSearch } from '@docsearch/react';

import { DarkModeToggle } from './DarkModeToggle';
import { useBaseUrl, useDocumentationContext, useImagePath } from '~/context';
import { Branch, Commit, Menu, PullRequest } from './Icons';
import { usePreviewMode } from '~/utils/preview';
import { DocsLink } from './DocsLink';

export type OnSidebarToggle = () => void;

export type HeaderProps = {
  onSidebarToggle: OnSidebarToggle;
};

export function Header(props: HeaderProps) {
  const { owner, repo, config, ref, source } = useDocumentationContext();
  const base = useBaseUrl();

  const logoLight = useImagePath(config.logo);
  const logoDark = useImagePath(config.logoDark);
  const previewMode = usePreviewMode();
  return (
    <header className="sticky top-0 z-40 w-screen flex-none bg-white px-4 transition-colors duration-500 dark:bg-zinc-900 md:bg-white/60 md:backdrop-blur md:dark:bg-zinc-900/60 lg:z-50 lg:border-b lg:border-gray-900/10 dark:lg:border-gray-400/10">
      <div className="max-w-8xl mx-auto flex h-16 items-center">
        <div className="flex-shrink-0">
          <DocsLink to={base} className="flex items-center font-bold">
            {!!config.logo && (
              <>
                <img
                  className={cx('mr-3 inline-block h-[30px] dark:hidden', {
                    'dark:hidden': !!config.logoDark,
                  })}
                  src={logoLight}
                  alt="Logo"
                />
              </>
            )}
            {!!config.logoDark && (
              <img className="mr-3 hidden h-[30px] dark:inline-block" src={logoDark} alt="Logo" />
            )}
            {!config.logo && !config.logoDark && <span>{config.name || `${owner}/${repo}`}</span>}
          </DocsLink>
        </div>
        {previewMode.enabled && (
          <span className="ml-4 rounded-lg bg-gradient-to-br from-red-600 to-black px-4 py-2 text-xs italic text-white dark:from-yellow-200 dark:to-red-400 dark:text-black">
            preview mode
          </span>
        )}
        <div className="flex flex-grow justify-end">
          <ul className="flex space-x-4">
            {previewMode.enabled && (
              <button
                onClick={previewMode.onSelect}
                className="mr-4 flex whitespace-nowrap rounded-lg bg-green-600 px-3 py-2 text-xs text-white shadow transition-colors hover:bg-green-500"
              >
                <span className="text-white">Change directory</span>
              </button>
            )}
            {!!ref && source.type !== 'branch' && source.ref !== 'HEAD' && !previewMode.enabled && (
              <li>
                <RefLink pointer={ref} owner={owner} repo={repo} source={source} />
              </li>
            )}
            {!!config.docsearch && !previewMode.enabled && (
              <li>
                <DocSearch
                  appId={config.docsearch.appId}
                  apiKey={config.docsearch.apiKey}
                  indexName={config.docsearch.indexName}
                />
              </li>
            )}
            <li className="hidden h-8 items-center md:flex">
              <DarkModeToggle />
            </li>
            <li className="flex items-center justify-center">
              <MobileMenuIcon onToggle={props.onSidebarToggle} />
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}

interface RefLinkProps {
  pointer: string;
  owner: string;
  repo: string;
  source: {
    type: 'branch' | 'PR' | 'commit';
    owner: string;
    repository: string;
    ref: string;
  };
}

type LinkData = Record<
  'branch' | 'PR' | 'commit',
  {
    href: string;
    icon: JSX.Element;
    className: string;
  }
>;

function RefLink({ pointer, owner, repo, source }: RefLinkProps): JSX.Element {
  const defaultIconSize = 16;

  const linkData: LinkData = {
    branch: {
      href: `https://github.com/${owner}/${repo}/tree/${pointer}`,
      icon: <Branch size={defaultIconSize} />,
      className: 'bg-green-600 hover:bg-green-500 ',
    },
    PR: {
      href: `https://github.com/${owner}/${repo}/pull/${pointer}`,
      icon: <PullRequest size={defaultIconSize} />,
      className: 'bg-blue-600 hover:bg-blue-500 ',
    },
    commit: {
      href: `https://github.com/${owner}/${repo}/tree/${pointer}`,
      icon: <Commit size={defaultIconSize} />,
      className: 'bg-pink-600 hover:bg-pink-500 ',
    },
  };

  const { href, icon, className } = linkData[source?.type ?? 'branch'];

  return (
    <a href={href}>
      <div
        className={cx(
          'flex whitespace-nowrap rounded-lg px-3 py-2 text-xs text-white shadow transition-colors',
          `${className}`,
        )}
      >
        {icon}
        <div className="pl-1">{pointer}</div>
      </div>
    </a>
  );
}

type MobileMenuIconProps = {
  onToggle: OnSidebarToggle;
};

function MobileMenuIcon(props: MobileMenuIconProps) {
  return (
    <div className="flex lg:hidden ">
      <div role="button" tabIndex={0} onClick={props.onToggle}>
        <Menu size={24} />
      </div>
    </div>
  );
}
