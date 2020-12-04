import React from 'react';
import cx from 'classnames';
import DarkModeToggle from 'react-dark-mode-toggle';
import useDarkMode from 'use-dark-mode';

import { DARK_MODE_CLASS_NAME, LIGHT_MODE_CLASS_NAME, STORAGE_KEY } from '../scripts/noflash';

import { ExternalLink, Link } from './Link';
import { Branch, GitHub, PullRequest } from './Icons';
import { useConfig, useNoSSR, useSlugProperties } from '../hooks';
import { Search } from './Search';

export function Header() {
  const config = useConfig();
  const properties = useSlugProperties();
  const repo = `${properties.owner}/${properties.repository}`;

  return (
    <header className="px-4 sticky top-0 z-10 bg-white text-sm dark:bg-gray-800 text-gray-900 dark:text-white border-b dark:border-gray-800">
      <div className="flex items-center h-16">
        <Link href="/" className="flex-1 text-lg mr-1 font-mono hover:underline truncate">
          {config.name || repo}
        </Link>
        <div className="hidden desktop:flex items-center justify-center space-x-6 font-mono overflow-auto">
          <Navigation />
        </div>
        <Utils />
      </div>
      <div className="block desktop:hidden">
        <Navigation />
      </div>
    </header>
  );
}

function Navigation() {
  const config = useConfig();

  return (
    config.navigation.length > 0 && (
      <ul className="flex items-center overflow-x-auto h-16 desktop:mr-4">
        {config.navigation.map(([title, url]) => (
          <li key={url}>
            <Link href={url} className="transition-colors hover:bg-gray-200 dark:hover:bg-gray-900 whitespace-nowrap px-4 py-2 rounded desktop:ml-1">
              {title}
            </Link>
          </li>
        ))}
      </ul>
    )
  );
}

function Utils() {
  const config = useConfig();
  const properties = useSlugProperties();
  const repo = `${properties.owner}/${properties.repository}`;

  return (
    <div className="flex items-center space-x-6">
      <ExternalLink
        href={`https://github.com/${repo}`}
        className="group flex items-center hover:underline"
      >
        <GitHub size={26} className="text-black dark:text-white hover:opacity-80" />
      </ExternalLink>
      {!properties.isDefaultBranch && (
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
        <Toggle />
      </div>
    </div>
  );
}

function Toggle() {
  const ready = useNoSSR();
  const darkMode = useDarkMode(false, {
    storageKey: STORAGE_KEY,
    classNameDark: DARK_MODE_CLASS_NAME,
    classNameLight: LIGHT_MODE_CLASS_NAME,
  });

  return (
    <div className="flex items-center" style={{ width: 70 }}>
      {ready && (
        <DarkModeToggle
          onChange={checked => {
            if (checked) darkMode.enable();
            else darkMode.disable();
          }}
          checked={darkMode.value}
          size={70}
        />
      )}
    </div>
  );
}
