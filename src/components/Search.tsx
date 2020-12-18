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

/**
 * A wrapper around https://docsearch.algolia.com
 * 
 * If the `docsearch` config is provided, the JS/CSS will be automatically
 * injected into the page, allowing the `window.docsearch` function to be triggered
 * on page load.
 */
export function Search({ apiKey, indexName }: SearchProps) {
  const [visible, setVisible] = useState<boolean>(false);

  // useEffect(() => {
  //   if (window.docsearch) {
  //     window.docsearch({
  //       inputSelector: '#docsearch',
  //       indexName,
  //       apiKey,
  //     });
  //   }
  // }, [apiKey, indexName]);

  return (
    <>
      <style global jsx>{`
        .algolia-autocomplete {
          width: 100%;
        }
      `}</style>
      <div
        className="desktop:hidden pl-6"
        role="button"
        tabIndex={0}
        onClick={() => setVisible(true)}
      >
        <SearchCircle size={26} />
      </div>
      <div
        className={cx('desktop:block pl-6', {
          hidden: !visible,
          'absolute inset-0 z-50 bg-white dark:bg-gray-800 flex items-center px-4': visible,
        })}
      >
        <input
          id="docsearch"
          type="text"
          placeholder="Search..."
          className={cx('w-full appearance-none  bg-gray-100 dark:bg-gray-900 border hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600 focus:outline-none px-3 h-8 rounded')}
        />
        <div className="desktop:hidden pl-6" role="button" onClick={() => setVisible(false)}>
          <Close size={26} />
        </div>
      </div>
    </>
  );
}
