import { SearchIcon } from "lucide-react";
import { lazy, useRef } from "react";
import { usePageContext } from "~/context";

import type { DocSearchHandle } from "./DocSearch";
const DocSearch = lazy(() => import("./DocSearch"));

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
        type="button"
        onClick={handleSearchEvent}
        className="group transition-all bg-background bg-gradient-to-b shadow-sm dark:from-white/[0.02] border border-black/10 dark:border-white/10 hover:border-black/20 hover:dark:border-white/20 rounded-md flex items-center gap-3 pl-2 pr-3 py-1.5 w-full"
      >
        <SearchIcon size={18} className="opacity-75" />
        <span className="grow text-left text-sm opacity-75">Search...</span>
        <kbd className="flex items-center gap-1 font-mono opacity-50">
          <span>⌘</span>
          <span className="text-[10px] font-bold">K</span>
        </kbd>
      </button>
      {!!docsearch && <DocSearch ref={docsearchRef} {...docsearch} />}
    </>
  );
}
