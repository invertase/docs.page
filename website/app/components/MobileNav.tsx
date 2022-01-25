import cx from 'classnames';
import { Sidebar } from './Sidebar';

export type MobileNavProps = {
  visible: boolean;
};

export function MobileNav({ visible }: MobileNavProps): JSX.Element {
  return (
    <div
      className={cx(
        'fixed inset-0 top-12 z-40 w-[100vw] transform overflow-y-auto bg-white p-4 shadow-2xl transition-transform dark:bg-zinc-900 dark:text-white md:w-1/2 lg:hidden',
        {
          'translate-x-[-100vw] md:translate-x-[-50vw]': !visible,
        },
      )}
    >
      <Sidebar />
    </div>
  );
}
