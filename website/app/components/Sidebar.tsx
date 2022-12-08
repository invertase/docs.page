import cx from 'classnames';
import { useLocation } from 'react-router-dom';
import { useDocumentationContext } from '~/context';
import { DarkModeToggle } from './DarkModeToggle';
import { DocsLink } from './DocsLink';
import { LocaleSelect } from './LocaleSelect';

export function Sidebar() {
  const { sidebar, locales } = useDocumentationContext().config;
  const location = useLocation();
  const currentLocale = location.pathname.split('/')[3];
  return (
    <nav>
      <ul className="text-sm text-gray-600 dark:text-gray-300">
        {!!locales && (
          <li className="mb-2 w-full">
            <LocaleSelect locales={locales} />
          </li>
        )}
        <li className=" flex w-full md:hidden">
          <DarkModeToggle />
        </li>
        {sidebar.map(([title, urlOrChildren]) => {
          if (typeof urlOrChildren === 'string') {
            return (
              <li key={urlOrChildren} className="mb-3">
                <DocsLink
                  end={urlOrChildren === (locales ? `/${currentLocale}` : '/')}
                  to={urlOrChildren}
                  className={({ isActive }) =>
                    cx('my-2 block', {
                      'hover:text-gray-800 dark:hover:text-gray-100': !isActive,
                      'text-docs-theme border-docs-theme font-medium': isActive,
                    })
                  }
                >
                  {title}
                </DocsLink>
              </li>
            );
          }

          return (
            <li key={title} className="mt-10 mb-8 first:mt-0">
              <h5 className="pb-3 font-semibold tracking-wide text-gray-900 dark:text-gray-200">
                {title}
              </h5>
              <ul className="space-y-2 border-l border-gray-100 text-gray-500 dark:border-gray-700 dark:text-gray-400">
                {urlOrChildren.map(([title, url]) => (
                  <li key={url}>
                    <DocsLink
                      end={url === (locales ? `/${currentLocale}` : '/')}
                      to={url}
                      className={({ isActive }) =>
                        cx('-ml-px block border-l border-transparent pl-4', {
                          'hover:border-gray-400 hover:text-gray-800 dark:hover:text-gray-100':
                            !isActive,
                          'text-docs-theme !border-docs-theme font-medium': isActive,
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
