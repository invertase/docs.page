import { Content } from './components/Content';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { PreviousNext } from './components/PreviousNext';
import { Scripts } from './components/Scripts';
import { Sidebar } from './components/Sidebar';
import { TableOfContents } from './components/TableOfContents';
import { Tabs } from './components/Tabs';
import { ThemeScripts } from './components/Theme';
import { useTabs } from './context';
import { cn } from './utils';

export function Layout() {
  const hasTabs = useTabs().length > 0;

  return (
    <>
      <ThemeScripts />
      <Scripts />
      <section className="fixed z-10 inset-x-0 top-0 bg-background-dark/90 backdrop-blur">
        <Header />
        <Tabs />
      </section>
      <div className="max-w-8xl mx-auto px-5">
        <section
          className={cn('fixed w-[17rem] bottom-0 overflow-y-auto', {
            'top-16': !hasTabs,
            'top-28': hasTabs,
          })}
        >
          <Sidebar />
        </section>
        <div
          className={cn('pl-[17rem]', {
            'pt-16': !hasTabs,
            'pt-28': hasTabs,
          })}
        >
          <section className="pt-8 ps-16 pe-4 flex">
            <div className="min-w-0 flex-1 pr-0 xl:pr-12">
              <Content />
              <PreviousNext />
              <div className="h-px bg-black/5 dark:bg-white/5 my-12"></div>
              <Footer />
            </div>
            <div className="hidden xl:block relative w-[17rem]">
              <TableOfContents />
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
