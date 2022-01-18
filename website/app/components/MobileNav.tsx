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
                'bg-white  dark:bg-zinc-900 dark:text-white z-40 fixed lg:hidden inset-0 top-16 w-[75vw] overflow-y-auto shadow-2xl p-4 transition-transform transform',
                {
                    'translate-x-[-75vw]': !visible,
                },
            )}
        >
            <Sidebar />
        </div>
    );
}