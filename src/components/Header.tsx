import React from 'react';
import cx from 'classnames';
import DarkModeToggle from 'react-dark-mode-toggle';
import useDarkMode from 'use-dark-mode';

import { DARK_MODE_CLASS_NAME, LIGHT_MODE_CLASS_NAME, STORAGE_KEY } from '../scripts/noflash';
import { isClient } from '../utils';

import { ExternalLink, Link } from './Link';
import { Branch, GitHub, PullRequest } from './Icons';
import { useConfig, useSlugProperties } from '../hooks';
import { Search } from './Search';

export function Header({ debug = false }: { debug?: boolean }) {
  const config = useConfig();
  const properties = useSlugProperties();
  const repo = `${properties.owner}/${properties.repository}`;

  return (
    <header className="desktop:px-4 sticky top-0 z-10 flex items-center h-16 bg-white text-sm dark:bg-gray-800 text-gray-900 dark:text-white border-b dark:border-gray-800 transition duration-1000 ease-in-out">
      <div className="flex-1 flex items-center space-x-4 h-16">
        <span>
          <span className="font-mono text-lg">
            <Link href="/" className="font-mono hover:underline">
              {config.name || repo}
            </Link>
          </span>
        </span>
      </div>
      <div className="flex items-center justify-center space-x-6 font-mono h-16">
        {config.navigation.length > 0 && (
          <ul className="flex items-center space-x-6 overflow-x-auto px-3 desktop:px-0">
            {config.navigation.map(([title, url]) => (
              <li key={url}>
                <Link href={url} className="hover:underline whitespace-nowrap">
                  {title}
                </Link>
              </li>
            ))}
          </ul>
        )}
        <div className="hidden desktop:flex items-center space-x-6">
          {!!config.name && (
            <ExternalLink
              href={`https://github.com/${repo}`}
              className="group flex items-center hover:underline"
            >
              <GitHub size={26} className="text-black dark:text-white hover:opacity-80" />
            </ExternalLink>
          )}
          {!properties.isDefaultBranch && (
            <ExternalLink
              href={`https://github.com/${repo}/tree/${properties.ref}`}
              className={cx(
                'flex px-3 py-2 text-xs rounded-lg shadow text-white transition-colors',
                {
                  'bg-green-500 hover:bg-green-400 ': properties.refType === 'branch',
                  'bg-blue-500 hover:bg-blue-400 ': properties.refType === 'pull-request',
                },
              )}
            >
              {properties.refType === 'pull-request' && <PullRequest size={16} />}
              {properties.refType === 'branch' && <Branch size={16} className="text-white" />}
              <span className="pl-1">{properties.ref}</span>
            </ExternalLink>
          )}
          {!!config.docsearch && (
            <Search apiKey={config.docsearch.apiKey} indexName={config.docsearch.indexName} />
          )}
          <Toggle />
        </div>
      </div>
    </header>
  );
}

function Toggle() {
  const darkMode = useDarkMode(false, {
    storageKey: STORAGE_KEY,
    classNameDark: DARK_MODE_CLASS_NAME,
    classNameLight: LIGHT_MODE_CLASS_NAME,
  });

  return (
    <div className="flex items-center" style={{ width: 70 }}>
      {isClient() && (
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
