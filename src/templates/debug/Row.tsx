import React, { ReactNode } from 'react';
import cx from 'classnames';

interface RowProps {
  title: string;
  children?: ReactNode;
  header?: boolean;
  highlight?: string;
}

function Row({ title, children, header = false, highlight }: RowProps): JSX.Element {
  return (
    <div
      className={cx('flex items-center', {
        'font-bold text-center text-lg bg-gray-100': header,
        'divide-x': !header,
      })}
      style={{
        backgroundColor: highlight,
      }}
    >
      <div className="flex-1 p-4 dark:bg-gray-600">{title}</div>
      {!header && (
        <div className="flex-1 p-4 text-right">
          <pre>{children}</pre>
        </div>
      )}
    </div>
  );
}

export { Row };
