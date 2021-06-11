import React, { useState } from 'react';
import cx from 'classnames';
import useOnClickOutside from 'use-onclickoutside';

import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { Divider } from './Divider';
import { hasScrolled, useBodyScrollLock, useConfig, usePageContent } from '../hooks';
import { JumpToTop } from './JumpToTop';
import { Menu, Close } from './Icons';
import { TableOfContents } from './TableOfContents';

export type LayoutType = 'default' | 'wide' | 'full';

export const DEFAULT_LAYOUT: LayoutType = 'default';

const widthMap: { [key in LayoutType] } = {
  default: 'max-w-6xl',
  wide: 'max-w-7xl',
  full: 'max-w-full',
};

export function Layout({ children }: { children: React.ReactNode }) {
  const config = useConfig();
  const content = usePageContent();
  const showBorder = hasScrolled();

  if (!content || !config) {
    throw new Error('Layout must be a child of: ConfigContext, PageContentContext');
  }

  // First check the frontmatter for a layout, then fallback to the config
  const layout = content.frontmatter.layout || config.defaultLayout;

  return (
    <>
      <Header />
      <aside
        className={cx('hidden md:block fixed left-0 top-16 bottom-0 w-[240px] border-r p-4 transition-all', {
          'border-gray-100 dark:border-gray-600': showBorder,
          'border-transparent': !showBorder,
        })}
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
      <JumpToTop />
    </>
  );
}

function WithTableOfContents({
  layout,
  children,
}: {
  layout: LayoutType;
  children: React.ReactNode;
}) {
  const showTableOfContents = usePageContent().headings.length > 0;

  return (
    <section className={cx('flex px-6 py-6 desktop:py-20 mx-auto', widthMap[layout])}>
      <div className="min-w-0 w-full">{children}</div>
      {showTableOfContents && (
        <div className="flex-none w-48 ml-4 hidden desktop:block">
          <div className="sticky top-20">
            <TableOfContents />
          </div>
        </div>
      )}
    </section>
  );
}

function WithSidebar({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<boolean>(false);

  useOnClickOutside(ref, () => setOpen(false));
  useBodyScrollLock(open);

  // Check first whether there is a sidebar to render
  let enabled = useConfig().sidebar.length > 0;
  const content = usePageContent();

  // If there is a sidebar, check whether the frontmatter has enabled/disabled it
  if (enabled) {
    enabled = content.frontmatter.sidebar;
  }

  return (
    <>
      {enabled && (
        <nav
          ref={ref}
          className={cx(
            'desktop:ml-0 fixed z-20 inset-y-0 w-64 mt-16 overflow-y-auto overflow-x-hidden bg-docs-background',
            {
              'ml-0': open,
              '-ml-64': !open,
            },
          )}
        >
          <Sidebar />
        </nav>
      )}
      <div
        className={cx('flex-1', {
          'pl-0 desktop:pl-64': enabled,
        })}
      >
        {children}
      </div>
      <div
        className={cx('desktop:hidden fixed inset-0 z-10 bg-black transition-colors top-16', {
          'opacity-60': open,
          'opacity-0 pointer-events-none': !open,
        })}
      />
      <div
        className="desktop:hidden fixed bottom-0 right-0 bg-theme-color mb-6 mr-6 px-4 py-2 rounded shadow text-white"
        role="button"
        onClick={() => setOpen($ => !$)}
      >
        {open && <Close size={20} />}
        {!open && <Menu size={20} />}
      </div>
    </>
  );
}
