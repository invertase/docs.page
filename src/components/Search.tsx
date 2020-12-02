import React, { useEffect } from 'react';

export interface SearchProps {
  apiKey: string;
  indexName: string;
}

type DocSearch = {
  inputSelector: string;
  indexName: string;
  apiKey: string;
};

declare global {
  interface Window {
    docsearch: (options: DocSearch) => void;
  }
}

export function Search({ apiKey, indexName }: SearchProps) {
  useEffect(() => {
    if (window.docsearch) {
      window.docsearch({
        inputSelector: '#docsearch',
        indexName,
        apiKey,
      });
    }
  }, [apiKey, indexName]);

  return (
    <input
      id="docsearch"
      type="text"
      placeholder="Search..."
      className="appearance-none bg-gray-200 dark:bg-gray-900 px-3 py-2 rounded-lg"
    />
  );
}
