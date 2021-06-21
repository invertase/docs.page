import React from 'react';
import cx from 'classnames';
import { Sidebar } from './Sidebar';

export type MobileNavProps = {
  visible: boolean;
};

export function MobileNav({ visible }: MobileNavProps): JSX.Element {
  return (
    <div
      className={cx(
        'fixed lg:hidden inset-0 top-16 w-[75vw] overflow-y-auto shadow-2xl bg-docs-background p-4 z-10 transition-transform transform',
        {
          'translate-x-[-75vw]': !visible,
        },
      )}
    >
      <Sidebar />
    </div>
  );
}
