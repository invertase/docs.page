import React from 'react';
import { DocSearch } from '@docsearch/react';

import { Link } from './Link';

export interface SearchProps {
  apiKey: string;
  indexName: string;
}

/**
 * A wrapper around https://docsearch.algolia.com
 */
export function Search({ apiKey, indexName }: SearchProps): JSX.Element {
  return (
    <DocSearch
      apiKey={apiKey}
      indexName={indexName}
      hitComponent={({ hit, children }) => <Link href={hit.url}>{children}</Link>}
    />
  );
}
