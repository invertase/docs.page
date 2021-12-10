import { LoaderFunction, MetaFunction, json, useLoaderData } from 'remix';

export const loader: LoaderFunction = async ({ params }) => {
  const owner = params.owner!;
  const repo = params.repo!;
  const path = params['*']!;

  return json({});
};

export const meta: MetaFunction = () => ({
  title: '',
  description: '',
});

export default function Page() {
  const data = useLoaderData();

  return <div>TODO</div>;
}
