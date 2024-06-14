import { Content } from './components/Content';
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
      <div className="max-w-8xl relative mx-auto px-8">
        <section className="fixed inset-x-0 top-0">
          <Header />
          <Tabs />
        </section>
        <section
          className={cn('fixed left-0 top-16 bottom-0 px-4', {
            'top-16': !hasTabs,
            'top-28': true,
          })}
        >
          <Sidebar />
        </section>
        <div
          className={cn('pl-52', {
            'pt-16': !hasTabs,
            'pt-28': true,
          })}
        >
          <section className="pe-4">
            <Content />
          </section>
        </div>
      </div>
    </>
  );
}