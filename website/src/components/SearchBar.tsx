import { MagnifyingGlassIcon } from './icons';

export default function SearchBar() {
  return (
    <button
      data-docsearch-override
      className="flex w-full items-center gap-2 rounded border bg-gradient-to-b from-gray-100 to-gray-100 px-4 py-2 text-sm text-gray-500 transition hover:border-zinc-700/30 dark:border-zinc-800 dark:from-zinc-800/80 dark:to-zinc-800/40 dark:text-white/70 dark:hover:border-zinc-700/50 dark:hover:text-white/90"
    >
      <span className="h-4 w-4">
        <MagnifyingGlassIcon />
      </span>
      <span>Search...</span>
      <span className="flex flex-1 items-center justify-end font-semibold opacity-50">⌘K</span>
    </button>
  );
}
