import { fetchBundle } from '@docs.page/server';
import { LoaderFunction } from 'remix';

const loader: LoaderFunction = async ({ params }) => {
  const owner = params.owner!;
  const repo = params.repo!;
  const path = params['*']!;
  let data;
  try {
    data = await fetchBundle({ owner, repository: repo, path });
  } catch (error) {
    console.log(error);
    //@ts-ignore
    return error.response.data;
  }

  return data;
};

export default loader;
