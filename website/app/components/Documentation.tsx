import { useHydratedMdx } from '@docs.page/client';
import cx from 'classnames';

import { Footer } from '~/components/Footer';
import { Header } from '~/components/Header';
import { Sidebar } from '~/components/Sidebar';
import { Theme } from '~/components/Theme';
import components from '~/components/mdx';
import { DocumentationProvider } from '~/context';
import { DocumentationLoader } from '../loaders/documentation.server';
import { ScrollSpy } from '~/components/ScrollSpy';
import { TabsContext } from './mdx/Tabs';
import { hash as createHash } from '~/utils';
import { MobileNav } from './MobileNav';
import { useState } from 'react';

export default function Documentation({ data }: { data: DocumentationLoader }) {
  const [open, toggleMenu] = useState<boolean>(false);

  const MDX = useHydratedMdx({ code: data.code });
  const hash = createHash(`${data.owner}/${data.repo}`);
  return (
    <DocumentationProvider data={data}>
      <Theme />
      <div className="w-screen">
        <Header onSidebarToggle={() => { toggleMenu(!open) }} />
        <div data-test-id={'documentation-provider'} className="max-w-8xl mx-auto">
          <div className="hidden lg:block">
            <div className="fixed inset-0 py-10 px-8 overflow-x-auto top-14 left-[max(0px,calc(50%-45rem))] w-64">
              <Sidebar />
            </div>
          </div>
          <div className="pt-10 px-8 lg:pr-8 lg:pl-72">
            <div
              className={cx({
                'md:mr-52 md:pr-16': true,
              })}
            >
              <main
                className="prose dark:prose-invert max-w-none
              prose-code:font-fira prose-code:font-medium
            "
              >
                <TabsContext hash={hash}>
                  <MDX components={components} />
                </TabsContext>
              </main>
              <Footer />
            </div>
            {!!data.headings && (
              <aside className=" hidden md:block pt-10 px-8 fixed top-14 bottom-0 w-52 overflow-y-auto right-[max(0px,calc(50%-45rem))]">
                <ScrollSpy />
              </aside>
            )}
          </div>
        </div>
      </div>
      <MobileNav visible={open} />
    </DocumentationProvider>
  );
}
