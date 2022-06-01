import cx from 'classnames';
import { useLocation } from 'react-router-dom';
import { useDocumentationContext } from '~/context';
import { DarkModeToggle } from './DarkModeToggle';
import { DocsLink } from './DocsLink';
import { DocsRefsSwitch } from './DocsRefSwitch';
import { LocaleSelect } from './LocaleSelect';

export function Sidebar() {
  const documentationContext = useDocumentationContext();
  const { sidebar, locales, references } = documentationContext.config;
  const { referenceConfig, frontmatter } = documentationContext;

  const referencePath = references ?? 'API';

  const location = useLocation();
  const currentLocale = location.pathname.split('/')[3];

  const formattedRefs: Record<string, { name: string; path: string; kind: string }[]> = {};

  for (const ref of referenceConfig || []) {
    if (!formattedRefs[ref.kind]) {
      formattedRefs[ref.kind] = [ref];
    } else {
      formattedRefs[ref.kind].push(ref);
    }
  }

  const formattedRefsArray = Object.entries(formattedRefs);

  return (
    <nav>
      <ul className="text-sm text-gray-600 dark:text-gray-300">
        {!!locales && (
          <li className="mb-2 w-full">
            <LocaleSelect locales={locales} />
          </li>
        )}
        {referenceConfig && (
          <li className="mb-2 w-full">
            <DocsRefsSwitch
              locales={locales}
              currentLocale={currentLocale}
              isReference={!!frontmatter.reference}
              referencePath={referencePath}
            />
          </li>
        )}
        <li className=" flex w-full md:hidden">
          <DarkModeToggle />
        </li>
        {!frontmatter.reference &&
          sidebar.map(([title, urlOrChildren]) => {
            if (typeof urlOrChildren === 'string') {
              return (
                <li key={urlOrChildren}>
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
              <li key={title} className="mt-4 mb-4 first:mt-0">
                <h5 className="pb-3 font-semibold tracking-wide text-gray-900 dark:text-gray-200">
                  {title}
                </h5>
                <ul className="space-y-2 border-l border-gray-100 dark:border-gray-700">
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
        {frontmatter.reference &&
          referenceConfig &&
          formattedRefsArray.map(([kind, refs]) => {
            return (
              <li className="mt-4 mb-4 first:mt-0" key={kind}>
                <h5 className="pb-3 font-semibold tracking-wide text-gray-900 dark:text-gray-200">
                  {kind}
                </h5>
                <ul className="space-y-2 border-l border-gray-100 dark:border-gray-700">
                  {refs.map(ref => {
                    return (
                      <DocsLink
                        key={ref.name}
                        to={`/${ref.path}`}
                        className={({ isActive }) =>
                          cx('-ml-px block border-l border-transparent pl-4', {
                            'hover:border-gray-400 hover:text-gray-800 dark:hover:text-gray-100':
                              !isActive,
                            'text-docs-theme !border-docs-theme font-medium': isActive,
                          })
                        }
                      >
                        {ref.name}
                      </DocsLink>
                    );
                  })}
                </ul>
              </li>
            );
          })}
      </ul>
    </nav>
  );
}
