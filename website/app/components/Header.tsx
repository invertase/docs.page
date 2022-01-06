import { Link } from 'remix';
import cx from 'classnames';
import { DocSearch } from '@docsearch/react';

import { DarkModeToggle } from './DarkModeToggle';
import { useBaseUrl, useDocumentationContext, useImagePath } from '~/context';
import { Branch, Commit, PullRequest } from './Icons';
import { usePreviewMode } from '~/utils/local-preview-mode';

// TODO link
export function Header() {
  const { owner, repo, config, ref, source } = useDocumentationContext();

  const base = useBaseUrl();

  const logoLight = useImagePath(config.logo);
  const logoDark = useImagePath(config.logoDark);
  const previewMode = usePreviewMode();
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-gray-900/10 dark:lg:border-gray-400/10 bg-white/60 dark:bg-zinc-900/60">
      <div className="max-w-8xl mx-auto flex items-center h-14 px-4 lg:px-8">
        <div className="flex-shrink-0">
          <Link to={base} className="flex items-center font-bold">
            {!!config.logo && (
              <>
                <img
                  className={cx('w-6 h-6 mr-3 inline-block dark:hidden', {
                    'dark:hidden': !!config.logoDark,
                  })}
                  src={logoLight}
                  alt="Logo"
                />
              </>
            )}
            {!!config.logoDark && (
              <img
                className="w-6 h-6 mr-3 hidden dark:inline-block"
                src={logoDark}
                alt="Logo"
              />
            )}
            <span>{config.name || `${owner}/${repo}`}</span>
          </Link>
        </div>
        {previewMode.enabled && (
          <span className="ml-4 px-4 py-2 dark:text-black text-white italic text-xs rounded-lg bg-gradient-to-br from-red-600 to-black dark:from-yellow-200 dark:to-red-400">
            preview mode
          </span>
        )}
        <div className="flex-grow flex justify-end">
          <ul className="flex space-x-4">
            {!!config.twitter && (
              <li>
                <a
                  href={`https://github.com/${owner}/${repo}`}
                  className="text-blue-500 hover:text-blue-400 transition-colors duration-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      fill="currentColor"
                      d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"
                    />
                  </svg>
                </a>
              </li>
            )}
            <li>
              <a
                href={`https://github.com/${owner}/${repo}`}
                className="text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors duration-100"
              >
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </li>
            {previewMode.enabled && (
              <button
                onClick={previewMode.onSelect}
                className="mr-4 flex px-3 py-2 text-xs rounded-lg shadow text-white transition-colors whitespace-nowrap bg-green-600 hover:bg-green-500"
              >
                <span className="text-white">Change directory</span>
              </button>
            )}
            {
              !!ref && source.type !== 'branch' && source.ref !== 'HEAD' && !previewMode.enabled &&
              <li>
                <RefLink pointer={ref} owner={owner} repo={repo} source={source} />
              </li>
            }
            {!!config.docsearch && (
              <li>
                <DocSearch
                  appId={config.docsearch.appId}
                  apiKey={config.docsearch.apiKey}
                  indexName={config.docsearch.indexName}
                />
              </li>
            )}
            <li>
              <DarkModeToggle />
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}

interface RefLinkProps {
  pointer: string,
  owner: string,
  repo: string,
  source: {
    type: string,
    owner: string,
    repository: string,
    ref: string
  }
}


function RefLink({ pointer, owner, repo, source }: RefLinkProps): JSX.Element {

  const defaultIconSize = 16;

  const linkData: Record<string, any> = {
    branch: {
      href: `https://github.com/${owner}/${repo}/tree/${pointer}`,
      icon: <Branch size={defaultIconSize} />,
      className: 'bg-green-600 hover:bg-green-500 '
    },
    PR: {
      href: `https://github.com/${owner}/${repo}/pull/${pointer}`,
      icon: <PullRequest size={defaultIconSize} />,
      className: 'bg-blue-600 hover:bg-blue-500 '
    },
    commit: {
      href: `https://github.com/${owner}/${repo}/tree/${pointer}`,
      icon: <Commit size={defaultIconSize} />,
      className: 'bg-pink-600 hover:bg-pink-500 '
    }
  }

  const { href, icon, className } = linkData[source?.type ?? 'branch'];

  return <a href={href}>
    <div className={cx(
      'flex px-3 py-2 text-xs rounded-lg shadow text-white transition-colors whitespace-nowrap',
      `${className}`
    )}>
      {icon}
      <div className="pl-1">{pointer}</div>
    </div>
  </a>
}