import React, { useState } from 'react';
import cx from 'classnames';
import useOnClickOutside from 'use-onclickoutside';

import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { Divider } from './Divider';
import { useBodyScrollLock, useConfig, usePageContent } from '../hooks';
import { JumpToTop } from './JumpToTop';
import { Menu, Close } from './Icons';
import { TableOfContents } from './TableOfContents';

export type LayoutType = 'default' | 'wide' | 'full' | 'bare';

export const DEFAULT_LAYOUT: LayoutType = 'default';

const widthMap: { [key in LayoutType] } = {
  default: 'max-w-5xl',
  wide: 'max-w-7xl',
  full: 'max-w-full',
  bare: '',
};

export function Layout({ children }: { children: React.ReactNode }) {
  const config = useConfig();
  const page = usePageContent();

  if (!page || !config) {
    throw new Error('Layout must be a child of: ConfigContext, ContentContext');
  }

  // First check the frontmatter for a layout, then fallback to the config
  const layout = page.frontmatter.layout || config.defaultLayout;

  if (layout === 'bare') {
    return <div>{children}</div>;
  }

  return (
    <>
      <Header />
      <WithSidebar>
        <WithTableOfContents layout={layout}>
          <article className="prose dark:prose-dark max-w-full">
            {children}

            <Divider />
            <Footer />
          </article>
        </WithTableOfContents>

        <JumpToTop />
      </WithSidebar>
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
  const { headings } = usePageContent();

  return (
    <section className={cx('flex px-6 py-6 desktop:py-20 mx-auto', widthMap[layout])}>
      <div className="flex-1">{children}</div>
      {headings.length > 0 && (
        <div className="w-48 ml-4 hidden desktop:block">
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
            'desktop:ml-0 fixed z-20 inset-y-0 w-64 mt-16 overflow-y-auto overflow-x-hidden border-r bg-white dark:bg-gray-900 dark:border-gray-700',
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
