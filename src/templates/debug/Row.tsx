import React, { ReactNode } from 'react';
import cx from 'classnames';

interface RowProps {
  title: String;
  children?: ReactNode;
  header?: boolean;
  highlight?: any;
}

function Row({ title, children, header = false, highlight }: RowProps) {
  return (
    <div
      className={cx('flex', {
        'font-bold text-center text-lg bg-gray-100': header,
        'divide-x': !header,
      })}
      style={{
        backgroundColor: highlight,
      }}
    >
      <div className="flex-1 p-4">
        <pre>{title}</pre>
      </div>
      {!header && (
        <div className="flex-1 p-4 text-right">
          <pre>{children}</pre>
        </div>
      )}
    </div>
  );
}

export { Row };
