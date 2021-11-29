import React from 'react';
import cx from 'classnames';

import { ExternalLink, Link } from './Link';
import { Branch, Commit, GitHub, Menu, PullRequest, Twitter } from './Icons';
import { Image } from './Image';
import { Search } from './Search';
import { hasScrolled, useConfig, usePreviewMode, useSlugProperties } from '../hooks';
import { Pointer } from '../utils/properties';

export type OnSidebarToggle = () => void;

export type HeaderProps = {
  onSidebarToggle: OnSidebarToggle;
};

export function Header(props: HeaderProps): JSX.Element {
  const config = useConfig();
  const properties = useSlugProperties();
  const repo = `${properties.owner}/${properties.repository}`;

  const showBorder = hasScrolled();
  const previewMode = usePreviewMode();
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
            {previewMode.enabled && (
              <span className="ml-4 px-4 py-2 dark:text-black text-white italic text-xs rounded-lg bg-gradient-to-br from-red-600 to-black dark:from-yellow-200 dark:to-red-400">
                preview mode
              </span>
            )}
          </div>
        </Link>
        <div className="hidden lg:flex items-center justify-center space-x-6 overflow-auto">
          <Navigation />
        </div>
        <div className="flex-grow flex justify-end">
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
  const previewMode = usePreviewMode();
  return (
    <div className="flex items-center">
      {previewMode.enabled && (
        <button
          onClick={previewMode.onSelect}
          className="mr-4 flex px-3 py-2 text-xs rounded-lg shadow text-white transition-colors whitespace-nowrap bg-green-600 hover:bg-green-500"
        >
          <span className="text-white">Change directory</span>
        </button>
      )}
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
      {properties.pointer !== Pointer.base && (
        <div className="pl-6">
          <ExternalLink
            href={(() => {
              if (properties.pointer === Pointer.branch) {
                return `https://github.com/${repo}/tree/${properties.ref}`;
              }

              if (properties.pointer === Pointer.pullRequest) {
                return `https://github.com/${repo}/pull/${properties.ref}`;
              }

              if (properties.pointer === Pointer.commit) {
                return `https://github.com/${repo}/commit/${properties.ref}`;
              }

              return '';
            })()}
            className={cx(
              'flex px-3 py-2 text-xs rounded-lg shadow text-white transition-colors whitespace-nowrap',
              {
                'bg-green-600 hover:bg-green-500 ': properties.pointer === Pointer.branch,
                'bg-blue-600 hover:bg-blue-500 ': properties.pointer === Pointer.pullRequest,
                'bg-pink-600 hover:bg-pink-500 ': properties.pointer === Pointer.commit,
              },
            )}
          >
            {properties.pointer === Pointer.branch && <Branch size={16} />}
            {properties.pointer === Pointer.pullRequest && <PullRequest size={16} />}
            {properties.pointer === Pointer.commit && <Commit size={16} />}
            <span className="pl-1">
              {properties.pointer === Pointer.commit && <code>{properties.ref.slice(0, 7)}</code>}
              {properties.pointer !== Pointer.commit && (
                <>
                  {properties.ref.slice(0, 25)}
                  {properties.ref.length > 25 ? '...' : ''}
                </>
              )}
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
