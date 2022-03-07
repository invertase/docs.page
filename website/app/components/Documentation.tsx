import { useHydratedMdx } from '@docs.page/client';
import cx from 'classnames';

import { Footer } from '~/components/Footer';
import { Header } from '~/components/Header';
import { Sidebar } from '~/components/Sidebar';
import { Theme } from '~/components/Theme';
import components from '~/components/mdx';
import { DocumentationProvider, DomainProvider } from '~/context';
import { DocumentationLoader } from '../loaders/documentation.server';
import { ScrollSpy } from '~/components/ScrollSpy';
import { TabsContext } from './mdx/Tabs';
import { hash as createHash } from '~/utils';
import { MobileNav } from './MobileNav';
import { useEffect, useState } from 'react';
import { useTransition } from 'remix';
import domains from '../../../domains.json';


export default function Documentation({ data }: { data: DocumentationLoader }) {
  const [open, toggleMenu] = useState<boolean>(false);
  const transition = useTransition();
  useEffect(() => {
    toggleMenu(false);
  }, [transition.state]);
  const MDX = useHydratedMdx({ code: data.code });
  const hash = createHash(`${data.owner}/${data.repo}`);

  const domain =
    domains.find(
      ([, repository]) => repository === `${data.owner}/${data.repo}`,
    )?.[0] || null;

  return (
    <DomainProvider data={{ domain }}>
      <DocumentationProvider data={data}>
        <Theme />
        <div className="w-screen">
          <Header
            onSidebarToggle={() => {
              toggleMenu(!open);
            }}
          />
          <div data-test-id={'documentation-provider'} className="max-w-8xl mx-auto">
            <div className="hidden lg:block">
              <div className="fixed inset-0 top-14 left-[max(0px,calc(50%-45rem))] w-64 overflow-x-auto py-10 px-8">
                <Sidebar />
              </div>
            </div>
            <div className="px-8 pt-10 lg:pr-8 lg:pl-72">
              <div
                className={cx({
                  'items-center lg:mr-52 lg:pr-16': true,
                })}
              >
                <main
                  className="prose dark:prose-invert prose-code:font-fira prose-code:font-medium
              max-w-none justify-center
            "
                >
                  <TabsContext hash={hash}>
                    <MDX components={components} />
                  </TabsContext>
                </main>
                <Footer />
              </div>
              {!!data.headings && (
                <aside className="fixed top-14 bottom-0 right-[max(0px,calc(50%-45rem))] hidden w-52 overflow-y-auto overflow-x-hidden whitespace-nowrap px-8 pt-10 lg:block">
                  <ScrollSpy />
                </aside>
              )}
            </div>
          </div>
        </div>
        <MobileNav visible={open} />
      </DocumentationProvider>
    </DomainProvider>
  );
}
