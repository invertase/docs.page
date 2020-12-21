import React, { useState } from 'react';
import cx from 'classnames';
import useOnClickOutside from 'use-onclickoutside';

import { ExternalLink, Link } from './Link';
import { Branch, GitHub, Menu, MenuOpenRight, PullRequest, Twitter } from './Icons';
import { Image } from './Image';
import { Search } from './Search';
import { useConfig, useSlugProperties } from '../hooks';

export function Header() {
  const config = useConfig();
  const properties = useSlugProperties();
  const repo = `${properties.owner}/${properties.repository}`;

  return (
    <header className="px-4 sticky top-0 z-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-b dark:border-gray-800">
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
        <div className="hidden desktop:flex items-center justify-center space-x-6 overflow-auto">
          <Navigation />
        </div>
        <div className="flex-1 flex justify-end">
          <Utils />
        </div>
        <MobileNavigation />
      </div>
    </header>
  );
}

function Navigation() {
  const config = useConfig();

  return (
    config.navigation.length > 0 && (
      <ul className="flex items-center justify-center desktop:justify-start font-semibold overflow-x-auto h-12 desktop:h-16 desktop:mr-4">
        {config.navigation.map(([title, url]) => (
          <li key={title + url}>
            <Link
              href={url}
              className="transition-colors hover:text-theme-color whitespace-nowrap px-4 py-2 rounded desktop:ml-1"
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
  const ref = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<boolean>(false);
  const config = useConfig();

  useOnClickOutside(ref, () => setOpen(false));

  if (config.navigation.length === 0) {
    return null;
  }

  return (
    <div className="flex desktop:hidden ml-4">
      <div role="button" tabIndex={0} onClick={() => setOpen($ => !$)}>
        {open && <MenuOpenRight size={24} />}
        {!open && <Menu size={24} />}
      </div>
      <div
        ref={ref}
        className={cx('absolute inset-x-0 bg-white dark:bg-gray-800 top-16 shadow-xl', {
          hidden: !open,
        })}
      >
        {config.navigation.length > 0 && (
          <ul className="items-center justify-center overflow-x-auto">
            {config.navigation.map(([title, url]) => (
              <li key={url} className="border-t dark:border-gray-700">
                <Link
                  href={url}
                  className="block text-center transition-colors hover:bg-gray-200 dark:hover:bg-gray-900 whitespace-nowrap p-4 w-full"
                >
                  {title}
                </Link>
              </li>
            ))}
          </ul>
        )}
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
