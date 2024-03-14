import Navigation from '@layouts/Navigation';
import PreviousNext from '@components/PreviousNext';
import Markdown from '@components/Markdown';
import Header from '@layouts/Header';
import Footer from '@layouts/Footer';
import Sidebar from '@layouts/Sidebar';

export default function DocsView() {
  return (
    <>
      <Header />
      <section className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8">
        <div
          data-sidebar
          data-visible="false"
          className="data-[visible=true]:translate-x-0 data-[visible=true]:bg-white data-[visible=true]:dark:bg-zinc-900 data-[visible=true]:border-t fixed top-16 bottom-0 left-0 right-auto z-20 w-[19.5rem] translate-x-[-46rem] overflow-y-auto px-6 pb-10 transition-transform dark:border-slate-800/80 sm:px-8 md:px-10 lg:left-[max(0px,calc(50%-46rem))] lg:block lg:translate-x-0"
        >
          <Sidebar />
        </div>
        <div className="lg:pl-[20rem]">
          <div className="flex flex-row items-stretch gap-12 pt-9">
            <div className="relative mx-auto max-w-3xl flex-grow overflow-auto text-slate-500 dark:text-slate-400 xl:-ml-12 xl:max-w-[47rem] xl:pr-1 xl:pl-12">
              <Markdown />
              <PreviousNext />
              <Footer />
            </div>
            <div className="z-10 hidden w-[17rem] flex-none pl-10 xl:flex">
              <nav className="fixed h-[calc(100%-8rem)] w-[16.5rem] overflow-y-auto text-sm leading-6">
                <Navigation />
              </nav>
            </div>
          </div>
        </div>
        <div data-docsearch></div>
        <div
          data-sidebar-mask
          data-visible="false"
          className="data-[visible=true]:opacity-100 data-[visible=false]:pointer-events-none fixed inset-0 z-10 bg-zinc-900/50 opacity-0 backdrop-blur transition-opacity lg:hidden"
        ></div>
      </section>
    </>
  );
}
