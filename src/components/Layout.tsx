import React from 'react';
import cx from 'classnames';

import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { Divider } from './Divider';
import { useConfig, usePageContent, useToggle } from '../hooks';
import { TableOfContents } from './TableOfContents';

export function Layout({ children }: { children: React.ReactNode }): JSX.Element {
  const [open, toggleMenu] = useToggle();
  const config = useConfig();
  const content = usePageContent();

  // TODO(ehesp): apply border
  // const showBorder = hasScrolled();

  if (!content || !config) {
    throw new Error('Layout must be a child of: ConfigContext, PageContentContext');
  }

  // TODO sidebar border & sticky
  return (
    <>
      <Header onSidebarToggle={toggleMenu} />
      <div className="grid grid-cols-[240px,auto,minmax(0,96ch),auto]">
        <div className="hidden lg:block col-start-1 col-end-2">
          <aside className="sticky top-20 px-4 h-[calc(100vh-4rem)] overflow-y-auto">
            <Sidebar />
          </aside>
        </div>
        <div className="col-start-1 lg:col-start-3 col-end-4 grid grid-cols-[1fr,180px] my-16">
          <div className="col-start-1 col-end-3 md:col-end-2">
            <article className="px-4 prose dark:prose-dark max-w-full">
              {children}
              <Divider />
              <Footer />
            </article>
          </div>
          <div className="hidden md:block col-start-2 col-end-3">
            <div className="sticky top-20 ml-6 p-3 border-l dark:border-gray-700">
              <TableOfContents />
            </div>
          </div>
        </div>
      </div>
      <div
        onClick={toggleMenu}
        className={cx('fixed lg:hidden inset-0 top-16 bg-black z-10 transition-all', {
          'pointer-events-none bg-opacity-0': !open,
          'bg-opacity-50': open,
        })}
      />
      <div
        className={cx(
          'fixed lg:hidden inset-0 top-16 w-[75vw] shadow-2xl bg-docs-background p-4 z-10 transition-transform transform',
          {
            'translate-x-[-75vw]': !open,
          },
        )}
      >
        <Sidebar />
      </div>
    </>
  );
}
