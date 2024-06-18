import { SearchIcon } from 'lucide-react';
import { lazy, useRef } from 'react';
import { usePageContext } from '~/context';

import type { DocSearchHandle } from './DocSearch';
const DocSearch = lazy(() => import('./DocSearch'));

export function Search() {
  const docsearchRef = useRef<DocSearchHandle>(null);
  const ctx = usePageContext();

  const search = ctx.bundle.config.search;
  const docsearch = search?.docsearch;
  const hasSearch = !!docsearch;

  function handleSearchEvent() {
    if (docsearchRef.current) {
      docsearchRef.current.trigger();
    }
  }

  if (!hasSearch) {
    return null;
  }

  return (
    <>
      <button
        onClick={handleSearchEvent}
        data-search
        className="group transition-all bg-gradient-to-b shadow-sm dark:from-white/[0.02] border border-black/10 dark:border-white/10 hover:border-black/20 hover:dark:border-white/20 rounded-md flex items-center gap-3 pl-2 pr-3 py-1.5 min-w-[300px]"
      >
        <SearchIcon size={18} className="opacity-75" />
        <span className="text-sm opacity-75">Search...</span>
      </button>
      {!!docsearch && <DocSearch ref={docsearchRef} {...docsearch} />}
    </>
  );
}
