import React from 'react';
import cx from 'classnames';

import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { Divider } from './Divider';
import { hasScrolled, useConfig, usePageContent } from '../hooks';
import { TableOfContents } from './TableOfContents';

export function Layout({ children }: { children: React.ReactNode }) {
  const config = useConfig();
  const content = usePageContent();
  const showBorder = hasScrolled();

  if (!content || !config) {
    throw new Error('Layout must be a child of: ConfigContext, PageContentContext');
  }

  return (
    <>
      <Header />
      <aside
        className={cx(
          'hidden md:block fixed left-0 top-16 bottom-0 w-[260px] border-r p-4 transition-all overflow-y-auto',
          {
            'border-gray-100 dark:border-gray-600': showBorder,
            'border-transparent': !showBorder,
          },
        )}
      >
        <Sidebar />
      </aside>
      <div className="grid grid-cols-[1fr,min(85ch,100%),1fr] px-2 my-16 ">
        <div className="grid grid-cols-[1fr,180px] col-start-2 col-end-3">
          <article className="col-start-1 col-end-3 lg:col-end-2 prose dark:prose-dark max-w-full">
            {children}
            <Divider />
            <Footer />
          </article>
          <aside className="hidden lg:block col-start-2 col-end-3">
            <div className="sticky top-20 ml-6 p-3 border-l dark:border-gray-700">
              <TableOfContents />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
