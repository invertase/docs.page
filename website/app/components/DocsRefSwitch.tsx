import React from 'react';
import { DocsLink } from './DocsLink';
import cx from 'classnames';
import { AcademicCapIcon, ArchiveIcon } from '@heroicons/react/solid';

export function DocsRefsSwitch({
  isReference,
  referencePath,
}: {
  isReference: boolean;
  referencePath: string;
}) {
  return (
    <ul>
      <li>
        <div className="flex items-center justify-start">
          <div className="px-2">
            <AcademicCapIcon width={14} />
          </div>
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
        </div>
      </li>
      <li>
        <div className="flex items-center justify-start">
          <div className="px-2">
            <ArchiveIcon width={14} />
          </div>
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
        </div>
      </li>
    </ul>
  );
}
