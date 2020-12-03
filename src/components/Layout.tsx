import React from 'react';
import cx from 'classnames';

import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { Divider } from './Divider';
import { useConfig, usePageContent } from '../hooks';

export type LayoutType = 'default' | 'wide' | 'full' | 'bare';

export const DEFAULT_LAYOUT: LayoutType = 'default';

const widthMap: { [key in LayoutType] } = {
  default: 'max-w-2xl',
  wide: 'max-w-6xl',
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

  if (page.type === 'html' || layout === 'bare') {
    return <div>{children}</div>;
  }

  return (
    <>
      <Header />
      <WithSidebar>
        <article className={cx('prose dark:prose-dark px-2 lg:px-0 py-20 mx-auto', widthMap[layout])}>
          {children}
          <Divider />
          <Footer />
        </article>
      </WithSidebar>
    </>
  );
}

function WithSidebar({ children }: { children: React.ReactNode }) {
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
        <nav className="fixed inset-y-0 w-64 hidden desktop:block">
          <div className="flex h-full mt-16 overflow-y-auto overflow-x-hidden border-r dark:border-gray-700 p-4">
            <Sidebar />
          </div>
        </nav>
      )}
      <div
        className={cx('flex-1', {
          'pl-0 desktop:pl-64': enabled,
        })}
      >
        {children}
      </div>
    </>
  );
}
