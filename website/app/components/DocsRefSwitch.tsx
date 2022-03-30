import React from 'react';
import { DocsLink } from './DocsLink';
import cx from 'classnames';

/**
 * Renders a switch which toggles locale
 */

export function DocsRefsSwitch({
  isReference,
  referencePath,
}: {
  isReference: boolean;
  referencePath: string;
}) {
  const container = (children?: React.ReactElement) => (
    <div className="relative flex w-full items-center rounded border bg-[#fbfbfb] px-1 pl-2 hover:border-gray-300 hover:bg-transparent focus:outline-none dark:border-gray-700 dark:bg-transparent dark:text-white dark:hover:border-gray-600">
      {children}
    </div>
  );

  return container(
    <ul>
      <li>
        <DocsLink
          to={'/'}
          className={() =>
            cx('my-2 block', {
              'hover:text-gray-800 dark:hover:text-gray-100': isReference,
              'text-docs-theme border-docs-theme font-medium': !isReference,
            })
          }
        >
          {'Docs'}
        </DocsLink>
      </li>
      <li>
        <DocsLink
          to={`/${referencePath}`}
          className={() =>
            cx('my-2 block', {
              'hover:text-gray-800 dark:hover:text-gray-100': !isReference,
              'text-docs-theme border-docs-theme font-medium': isReference,
            })
          }
        >
          {referencePath}
        </DocsLink>
      </li>
    </ul>,
  );
}
