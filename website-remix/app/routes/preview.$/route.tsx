import { useEffect } from 'react';
import { MetaFunction, type ActionFunctionArgs } from '@remix-run/node';
import { useFetcher, useParams } from '@remix-run/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient, useDirectoryHandle, usePageContent, useSelectDirectory } from './utils';
import { getPreviewBundle } from '../../api';
import { PageContext } from '../../context';
import { Layout } from '../../Layout';
import { Toolbar } from './Toolbar';

import docsearch from '@docsearch/css/dist/style.css?url';

export const meta: MetaFunction = () => {
  return [
    {
      tagName: 'link',
      rel: 'stylesheet',
      href: docsearch,
    },
  ];
};

export default function PreviewOutlet() {
  return (
    <QueryClientProvider client={queryClient}>
      <Preview />
    </QueryClientProvider>
  );
}

export const action = async (args: ActionFunctionArgs) => {
  const json = await args.request.json();

  return {
    bundle: await getPreviewBundle(json),
  };
};

function Preview() {
  const params = useParams();
  const path = params['*'] || '';

  const fetcher = useFetcher<typeof action>({ key: 'bundle' });
  const directory = useDirectoryHandle();
  const selectDirectory = useSelectDirectory();
  const content = usePageContent(path, directory.data);
  const bundle = fetcher.data?.bundle;

  useEffect(() => {
    if (content.data) {
      fetcher.submit(content.data, {
        method: 'POST',
        encType: 'application/json',
      });
    }
  }, [content.data]);

  if (directory.isLoading) {
    return <div>Loading...</div>;
  }

  if (directory.error) {
    return <div>Error: {directory.error.message}</div>;
  }

  if (content.isFetched && content.error) {
    return <div>Not found...</div>;
  }

  if (directory.data === null) {
    return (
      <button
        onClick={() => {
          selectDirectory.mutate();
        }}
      >
        {selectDirectory.isPending ? 'Loading...' : 'Select Directory'}
      </button>
    );
  }

  if (!bundle) {
    return <div>Not got yet...</div>;
  }

  return (
    <PageContext.Provider
      value={{
        path,
        preview: true,
        bundle,
      }}
    >
      <Layout />
      <Toolbar />
    </PageContext.Provider>
  );
}
