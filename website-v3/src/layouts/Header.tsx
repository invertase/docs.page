import { useStore } from '@nanostores/react';
import Link from '@components/Link';
import context from 'src/context';
import { getImagePath } from 'src/utils';
import { BarsIcon, MagnifyingGlassIcon } from '@components/icons';

export default function Header() {
  const { config, owner, repository } = useStore(context);

  return (
    <header className="bg:white sticky top-0 z-20 border-b backdrop-blur dark:border-slate-800/80">
      <div className="absolute inset-0 z-0 bg-white dark:bg-zinc-900/90 dark:text-white"></div>
      <div className="max-w-8xl relative z-10 mx-auto">
        <div className="mx-4 flex h-16 items-center px-4 lg:mx-0 lg:px-8">
          <span>Owner: {owner}</span>
          <Link
            href="/"
            className="inline-flex flex-1 items-center gap-3 truncate transition-opacity hover:opacity-75"
          >
            {!!config.logo && (
              <img
                alt="Logo"
                // class:list={['inline-block h-[30px]', { 'dark:hidden': !!config.logoDark }]}
                src={getImagePath(config.logo)}
              />
            )}
            {!!config.logoDark && (
              <img
                alt="Logo"
                className="hidden h-[30px] dark:inline-block"
                src={getImagePath(config.logoDark)}
              />
            )}
            {!!config.automaticallyDisplayName && (
              <span className="truncate text-xl font-bold">
                {config.name || `${owner}/${repository}`}
              </span>
            )}
          </Link>
          {/* <div
            class:list={{
              'hidden lg:block lg:w-64 xl:w-80': !!config.docsearch,
            }}
          >
            {!!config.docsearch && <SearchBar />}
          </div> */}
          <div className="flex flex-1 flex-shrink-0 items-center justify-end gap-6">
            {!!config.docsearch && (
              <button className="h-6 w-6 lg:hidden" data-docsearch-override>
                <MagnifyingGlassIcon />
              </button>
            )}
            <div className="hidden lg:block">{/* <RefBadge /> */}</div>
            {/* <ThemeToggle /> */}
            <div className="flex items-center lg:hidden">
              <button data-sidebar-toggle className="h-6 w-6 transition-opacity hover:opacity-75">
                <BarsIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
