import { Link } from 'remix';
import { DocSearch } from '@docsearch/react';

import { DarkModeToggle } from './DarkModeToggle';

// TODO link
export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-gray-900/10 dark:lg:border-gray-400/10 bg-white/60 dark:bg-[#202528]/60">
      <div className="max-w-8xl mx-auto flex items-center h-14 px-4 lg:px-8">
        <div className="flex-shrink-0">
          <Link to="/ehesp/testing" className="font-bold">
            go_router
          </Link>
        </div>
        <div className="flex-grow flex justify-end">
          <ul className="flex space-x-4">
            <li>
              <DocSearch
                appId="R2IYF7ETH7"
                apiKey="599cec31baffa4868cae4e79f180729b"
                indexName="docsearch"
              />
            </li>
            <li>
              <DarkModeToggle />
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
