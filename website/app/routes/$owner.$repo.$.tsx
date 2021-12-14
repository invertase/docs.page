import { useHydratedMdx } from '@docs.page/client';
import { MetaFunction, useLoaderData, LinksFunction } from 'remix';
import { Banner } from '~/components/Banner';
import { Footer } from '~/components/Footer';
import { Header } from '~/components/Header';
import { YouTube } from '~/components/mdx';
import { Sidebar } from '~/components/Sidebar';
import { Theme } from '~/components/Theme';
import documentationLoader from '../loaders/documentation.server';

export const loader = documentationLoader;

export let links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/@docsearch/css@alpha' },
    // { rel: 'stylesheet', href: docsearch },
  ];
};

export const meta: MetaFunction = () => ({
  title: '',
  description: '',
});

export default function Page() {
  const data = useLoaderData();
  const Component = useHydratedMdx({ code: data.bundle });

  return (
    <>
      <Theme />
      <Header />
      <div className="max-w-8xl mx-auto">
        <div className="fixed inset-0 py-10 px-8 overflow-x-auto top-14 left-[max(0px,calc(50%-45rem))] w-64">
          <Sidebar />
        </div>
        <div className="pt-10 pl-72">
          <div className="mr-52 pr-16">
            <main>
              <Component />
            </main>
            <Footer />
          </div>
          <aside className="pt-10 px-8 fixed top-14 bottom-0 w-52 overflow-y-auto right-[max(0px,calc(50%-45rem))]">
            <ul className="text-sm space-y-4">
              <li className="font-semibold">Syntax Support</li>
              <li>JetBrains IDEs</li>
            </ul>
          </aside>
        </div>
      </div>
    </>
  );
}
