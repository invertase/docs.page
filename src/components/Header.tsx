import React, { useState } from 'react';
import cx from 'classnames';

import { ExternalLink, Link } from './Link';
import { Branch, GitHub, MenuOpen, PullRequest, Twitter } from './Icons';
import { DarkModeToggle } from './DarkModeToggle';
import { Search } from './Search';
import { useConfig, useSlugProperties } from '../hooks';
import { Menu } from './Icons';

export function Header() {
  const config = useConfig();
  const properties = useSlugProperties();
  const repo = `${properties.owner}/${properties.repository}`;
  console.log(!!config.logoDark);

  return (
    <header className="px-4 sticky top-0 z-10 bg-white text-sm dark:bg-gray-800 text-gray-900 dark:text-white border-b dark:border-gray-800">
      <div className="flex items-center h-16">
        <Link href="/" className="flex-1 text-lg mr-1 font-mono hover:underline truncate">
          <div className="flex h-12 desktop:h-16 items-center space-x-4">
            {!!config.logo && (
              <>
                <img
                  src={config.logo}
                  alt={repo}
                  style={{ maxHeight: '60%' }}
                  className={cx({
                    'dark:hidden': !!config.logoDark,
                  })}
                />
                {!!config.logoDark && (
                  <img
                    src={config.logoDark}
                    alt={repo}
                    style={{ maxHeight: '60%' }}
                    className="hidden dark:block"
                  />
                )}
              </>
            )}
            <span>{config.name || repo}</span>
          </div>
        </Link>
        <div className="hidden desktop:flex items-center justify-center space-x-6 font-mono overflow-auto">
          <Navigation />
        </div>
        <Utils />
        {config.navigation.length > 0 && (
          <div className="flex desktop:hidden ml-4">
            <MobileNavigation />
          </div>
        )}
      </div>
    </header>
  );
}

function Navigation() {
  const config = useConfig();

  return (
    config.navigation.length > 0 && (
      <ul className="flex items-center justify-center desktop:justify-start overflow-x-auto h-12 desktop:h-16 desktop:mr-4">
        {config.navigation.map(([title, url]) => (
          <li key={url}>
            <Link
              href={url}
              className="transition-colors hover:bg-gray-200 dark:hover:bg-gray-900 whitespace-nowrap px-4 py-2 rounded desktop:ml-1"
            >
              {title}
            </Link>
          </li>
        ))}
      </ul>
    )
  );
}

function MobileNavigation() {
  const [open, setOpen] = useState<boolean>(false);
  const config = useConfig();

  return (
    <>
      {open && (
        <div onClick={() => setOpen($ => !$)}>
          <MenuOpen size={24} />
        </div>
      )}
      {!open && (
        <div onClick={() => setOpen($ => !$)}>
          <Menu size={24} />
        </div>
      )}
      <div
        className={cx('absolute right-0 bg-gray-800 bg-opacity-85 top-16 w-1/2 shadow-inner', {
          hidden: !open,
        })}
      >
        {config.navigation.length > 0 && (
          <ul className="items-center justify-center overflow-x-auto">
            {config.navigation.map(([title, url]) => (
              <li key={url} className="py-4 px-4 h-12 text-right w-full">
                <Link
                  href={url}
                  className="transition-colors hover:bg-gray-200 dark:hover:bg-gray-900 whitespace-nowrap px-4 py-2 rounded w-full"
                >
                  {title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

function Utils() {
  const config = useConfig();
  const properties = useSlugProperties();
  const repo = `${properties.owner}/${properties.repository}`;

  return (
    <div className="flex items-center space-x-6">
      {!!config.twitter && (
        <ExternalLink
          href={`https://twitter.com/${config.twitter}`}
          className="group flex items-center hover:underline"
        >
          <Twitter size={28} className="text-blue-500 dark:text-white hover:opacity-80" />
        </ExternalLink>
      )}
      <ExternalLink
        href={`https://github.com/${repo}`}
        className="group flex items-center hover:underline"
      >
        <GitHub size={26} className="text-black dark:text-white hover:opacity-80" />
      </ExternalLink>
      {!properties.isDefaultBranch && properties.ref && (
        <ExternalLink
          href={`https://github.com/${repo}/tree/${properties.ref}`}
          className={cx(
            'flex px-3 py-2 text-xs rounded-lg shadow text-white transition-colors whitespace-nowrap',
            {
              'bg-green-500 hover:bg-green-400 ': properties.refType === 'branch',
              'bg-blue-500 hover:bg-blue-400 ': properties.refType === 'pull-request',
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
      )}
      {!!config.docsearch && (
        <Search apiKey={config.docsearch.apiKey} indexName={config.docsearch.indexName} />
      )}
      <div className="hidden desktop:block">
        <DarkModeToggle />
      </div>
    </div>
  );
}
