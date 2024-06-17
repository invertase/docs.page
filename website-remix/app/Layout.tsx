import { Content } from './components/Content';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Tabs } from './components/Tabs';
import { ThemeScripts } from './components/Theme';
import { useTabs } from './context';
import { cn } from './utils';

export function Layout() {
  const hasTabs = useTabs().length > 0;

  return (
    <>
      <ThemeScripts />
      <section className="fixed z-10 inset-x-0 top-0 bg-background-dark/70 backdrop-blur-md">
        <Header />
        <Tabs />
      </section>
      <div className="max-w-8xl mx-auto px-5">
        <section
          className={cn('fixed w-[17rem] bottom-0 overflow-y-auto', {
            'top-16': !hasTabs,
            'top-28': true,
          })}
        >
          <Sidebar />
        </section>
        <div
          className={cn('pl-[17rem]', {
            'pt-16': !hasTabs,
            'pt-36': true,
          })}
        >
          <section className="ps-16 pe-4">
            <Content />
            <div className="h-px bg-black/5 dark:bg-white/5 my-12"></div>
            <Footer />
          </section>
        </div>
      </div>
    </>
  );
}
