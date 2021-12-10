import axios from 'axios';
import { LoaderFunction, MetaFunction, json, useLoaderData } from 'remix';
import { Footer } from '~/components/Footer';
import { Header } from '~/components/Header';
import { Theme } from '~/components/Theme';

export const loader: LoaderFunction = async ({ params }) => {
  const owner = params.owner!;
  const repo = params.repo!;
  const path = params['*']!;
  let res;
  try {
    res = await axios.post(
      `http://localhost:8000/github?owner=${owner}&repository=${repo}${path ? `path=${path}` : ''}`,
    );
  } catch (error) {
    //@ts-ignore
    return error.response.data;
  }

  return res.data;
};

export const meta: MetaFunction = () => ({
  title: '',
  description: '',
});

export default function Page() {
  const data = useLoaderData();
  console.log(data);

  return (
    <>
      <Theme />
      <Header />
      <div className="max-w-7xl mx-auto">
        <div className="fixed inset-0 py-10 px-8 overflow-x-auto top-14 left-[max(0px,calc(50%-40rem))] w-64">
          <ul className="space-y-4">
            <li>Menu</li>
            <li>Menu</li>
            <li>Menu</li>
            <li>Menu</li>
            <li>Menu</li>
            <li>Menu</li>
            <li>Menu</li>
            <li>Menu</li>
            <li>Menu</li>
            <li>Menu</li>
            <li>Menu</li>
            <li>Menu</li>
            <li>Menu</li>
            <li>Menu</li>
            <li>Menu</li>
            <li>Menu</li>
            <li>Menu</li>
          </ul>
        </div>
        <div className="pt-10 pl-72">
          <div className="mr-52 pr-16">
            <main>
              Content Here
              <div>{JSON.stringify(data.bundle)}</div>
            </main>
            <Footer />
          </div>
          <aside className="pt-10 px-8 fixed top-14 bottom-0 w-52 overflow-y-auto right-[max(0px,calc(50%-40rem))]">
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
