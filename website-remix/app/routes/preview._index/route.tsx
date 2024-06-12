import { useEffect } from 'react';
import { type ActionFunctionArgs } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient, useDirectoryHandle, usePageContent, useSelectDirectory } from './utils';
import { getPreviewBundle } from '../../api';
import { PageContext } from '../../context';
import { Layout } from '../../Layout';

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
  const fetcher = useFetcher<typeof action>({ key: 'bundle' });
  const directory = useDirectoryHandle();
  const selectDirectory = useSelectDirectory();
  const content = usePageContent(directory.data);
  const context = fetcher.data?.bundle;

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

  if (!context) {
    return <div>Not got yet...</div>;
  }

  return (
    <PageContext.Provider
      value={{
        preview: true,
        bundle: context,
      }}
    >
      <Layout />
    </PageContext.Provider>
  );
}
