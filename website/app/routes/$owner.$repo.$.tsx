import { LoaderFunction, MetaFunction, json, useLoaderData, LinksFunction } from 'remix';
import { Banner } from '~/components/Banner';
import { Footer } from '~/components/Footer';
import { Header } from '~/components/Header';
import { YouTube } from '~/components/mdx';
import { Sidebar } from '~/components/Sidebar';
import { Theme } from '~/components/Theme';

import docsearch from '../styles/docsearch.css';

export const loader: LoaderFunction = async ({ params }) => {
  const owner = params.owner!;
  const repo = params.repo!;
  const path = params['*']!;

  return json({});
};

export let links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/@docsearch/css@alpha' },
    { rel: 'stylesheet', href: docsearch },
  ];
};

export const meta: MetaFunction = () => ({
  title: '',
  description: '',
});

export default function Page() {
  const data = useLoaderData();

  return (
    <>
      <Theme />
      <Banner />
      <Header />
      <div className="max-w-8xl mx-auto">
        <div className="fixed inset-0 py-10 px-8 overflow-x-auto top-14 left-[max(0px,calc(50%-45rem))] w-64">
          <Sidebar />
        </div>
        <div className="pt-10 pl-72">
          <div className="mr-52 pr-16">
            <main className="prose max-w-none">
              <h1>Welcome!</h1>
              <p>Welcome to foo bar baz</p>
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
