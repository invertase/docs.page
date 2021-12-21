import cx from 'classnames';
import { useDocumentationContext } from '~/context';
import { DocsLink } from './DocsLink';

export function Sidebar() {
  const { sidebar } = useDocumentationContext().config;

  return (
    <nav>
      <ul className="text-sm text-gray-600 dark:text-gray-300">
        {sidebar.map(([title, urlOrChildren]) => {
          if (typeof urlOrChildren === 'string') {
            return (
              <li key={urlOrChildren}>
                <DocsLink
                  end={urlOrChildren === '/'}
                  to={urlOrChildren}
                  className={({ isActive }) =>
                    cx('block my-2', {
                      'hover:text-gray-800 dark:hover:text-gray-100': !isActive,
                      'text-docs-theme font-medium border-docs-theme': isActive,
                    })
                  }
                >
                  {title}
                </DocsLink>
              </li>
            );
          }

          return (
            <li key={title} className="mt-4 first:mt-0 mb-4">
              <h5 className="text-gray-900 dark:text-gray-200 font-semibold tracking-wide pb-3">
                {title}
              </h5>
              <ul className="border-l border-gray-100 dark:border-gray-700 space-y-2">
                {urlOrChildren.map(([title, url]) => (
                  <li key={url}>
                    <DocsLink
                      end={url === '/'}
                      to={url}
                      className={({ isActive }) =>
                        cx('block pl-4 -ml-px border-l border-transparent', {
                          'hover:border-gray-400 hover:text-gray-800 dark:hover:text-gray-100':
                            !isActive,
                          'text-docs-theme font-medium !border-docs-theme': isActive,
                        })
                      }
                    >
                      {title}
                    </DocsLink>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
