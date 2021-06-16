import React from 'react';
import cx from 'classnames';

import { ExternalLink, Link } from './Link';
import { Branch, GitHub, Menu, PullRequest, Twitter } from './Icons';
import { Image } from './Image';
import { Search } from './Search';
import { hasScrolled, useConfig, useSlugProperties } from '../hooks';

export type OnSidebarToggle = () => void;

export type HeaderProps = {
  onSidebarToggle: OnSidebarToggle;
};

export function Header(props: HeaderProps): JSX.Element {
  const config = useConfig();
  const properties = useSlugProperties();
  const repo = `${properties.owner}/${properties.repository}`;

  const showBorder = hasScrolled();

  return (
    <header
      className={cx(
        'px-4 sticky top-0 z-10 bg-docs-background text-gray-900 dark:text-white border-b transition-all',
        {
          'border-gray-100 dark:border-gray-700': showBorder,
          'border-transparent': !showBorder,
        },
      )}
    >
      <div className="flex items-center h-16">
        <Link href="/" className="mr-12 truncate text-lg font-semibold">
          <div className="flex h-16 items-center py-4">
            {!!config.logo && (
              <>
                <Image
                  src={config.logo}
                  alt={repo}
                  className={cx('max-h-full pr-4', {
                    'dark:hidden': !!config.logoDark,
                  })}
                />
                {!!config.logoDark && (
                  <Image
                    src={config.logoDark}
                    alt={repo}
                    className="hidden dark:block max-h-full pr-4"
                  />
                )}
              </>
            )}
            <span>{config.name || repo}</span>
          </div>
        </Link>
        <div className="hidden lg:flex items-center justify-center space-x-6 overflow-auto">
          <Navigation />
        </div>
        <div className="flex-1 flex justify-end">
          <Utils />
        </div>
        <MobileMenuIcon onToggle={props.onSidebarToggle} />
      </div>
    </header>
  );
}

function Navigation() {
  const config = useConfig();

  return (
    config.navigation.length > 0 && (
      <ul className="flex items-center justify-center lg:justify-start font-semibold overflow-x-auto h-12 lg:h-16 lg:mr-4">
        {config.navigation.map(([title, url]) => (
          <li key={title + url}>
            <Link
              href={url}
              className="transition-colors hover:text-theme-color whitespace-nowrap px-4 py-2 rounded lg:ml-1"
            >
              {title}
            </Link>
          </li>
        ))}
      </ul>
    )
  );
}

type MobileMenuIconProps = {
  onToggle: OnSidebarToggle;
};

function MobileMenuIcon(props: MobileMenuIconProps) {
  const config = useConfig();

  if (config.navigation.length === 0) {
    return null;
  }

  return (
    <div className="flex lg:hidden ml-4">
      <div role="button" tabIndex={0} onClick={props.onToggle}>
        <Menu size={24} />
      </div>
    </div>
  );
}

function Utils() {
  const config = useConfig();
  const properties = useSlugProperties();
  const repo = `${properties.owner}/${properties.repository}`;

  return (
    <div className="flex items-center">
      {!!config.twitter && (
        <ExternalLink
          href={`https://twitter.com/${config.twitter}`}
          className="group flex items-center hover:underline"
          aria-label="View Twitter Account"
        >
          <Twitter size={28} className="text-blue-500 dark:text-white hover:opacity-80" />
        </ExternalLink>
      )}
      <ExternalLink
        href={`https://github.com/${repo}`}
        className="pl-6 group flex items-center hover:underline"
        aria-label="View repository on GitHub"
      >
        <GitHub size={26} className="text-black dark:text-white hover:opacity-80" />
      </ExternalLink>
      {!properties.isBaseBranch && (
        <div className="pl-6">
          <ExternalLink
            href={`https://github.com/${repo}/tree/${properties.ref}`}
            className={cx(
              'flex px-3 py-2 text-xs rounded-lg shadow text-white transition-colors whitespace-nowrap',
              {
                'bg-green-600 hover:bg-green-500 ': properties.refType === 'branch',
                'bg-blue-600 hover:bg-blue-500 ': properties.refType === 'pull-request',
              },
            )}
          >
            {properties.refType === 'pull-request' && <PullRequest size={16} />}
            {properties.refType === 'branch' && <Branch size={16} className="text-white" />}
            <span className="pl-1">
              {properties.ref.slice(0, 25)}
              {properties.ref.length > 25 ? '...' : ''}
            </span>
          </ExternalLink>
        </div>
      )}
      {!!config.docsearch && (
        <Search apiKey={config.docsearch.apiKey} indexName={config.docsearch.indexName} />
      )}
    </div>
  );
}
