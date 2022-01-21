import React from 'react';
import { DocSearch } from '@docsearch/react';

import { Link } from './Link';

export interface SearchProps {
  appId?: string;
  apiKey: string;
  indexName: string;
}

/**
 * A wrapper around https://docsearch.algolia.com
 */
export function Search({ appId, apiKey, indexName }: SearchProps): JSX.Element {
  return (
    <DocSearch
      appId={appId}
      apiKey={apiKey}
      indexName={indexName}
      hitComponent={({ hit, children }) => <Link href={hit.url}>{children}</Link>}
    />
  );
}
