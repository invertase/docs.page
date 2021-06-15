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

  // TODO sidebar border & sticky
  return (
    <>
      <Header />
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
    </>
  );
}
