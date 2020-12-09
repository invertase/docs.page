import React, { useEffect, useState } from 'react';
import cx from 'classnames';

import { Close, SearchCircle } from './Icons';

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
  const [visible, setVisible] = useState<boolean>(false);

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
    <>
      <style global jsx>{`
        .algolia-autocomplete {
          width: 100%;
        }
      `}</style>
      <div
        className="desktop:hidden pl-4"
        role="button"
        tabIndex={0}
        onClick={() => setVisible(true)}
      >
        <SearchCircle size={26} />
      </div>
      <div
        className={cx('desktop:block pl-4', {
          hidden: !visible,
          'absolute inset-0 z-50 bg-white dark:bg-gray-800 flex items-center px-4': visible,
        })}
      >
        <input
          id="docsearch"
          type="text"
          placeholder="Search..."
          className={cx('w-full appearance-none bg-gray-200 dark:bg-gray-900 px-3 py-2 rounded-lg')}
        />
        <div className="desktop:hidden pl-4" role="button" onClick={() => setVisible(false)}>
          <Close size={26} />
        </div>
      </div>
    </>
  );
}
