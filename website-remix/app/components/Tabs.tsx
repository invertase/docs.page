import { useTabs } from '~/context';

export function Tabs() {
  const tabs = useTabs();

  // if (!tabs.length) {
  //   return null;
  // }

  return (
    <nav className="max-w-7xl mx-auto px-5">
      <ul className="relative px-5 border-b border-gray-200/40 dark:border-white/10 flex items-center space-x-6 text-sm font-medium tracking-wide">
        <li>
          <a
            href="/"
            className="relative top-px flex items-center h-10 border-b-[1.5px] border-primary"
          >
            Home
          </a>
        </li>
        <li>
          <a href="/" className="flex items-center h-10 text-gray-600 dark:text-gray-400">
            Components
          </a>
        </li>
      </ul>
    </nav>
  );
}
