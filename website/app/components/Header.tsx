import { Link } from 'remix';

// TODO link
export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-gray-900/10 bg-white/95 supports-backdrop-blur:bg-white/60">
      <div className="max-w-7xl mx-auto flex items-center h-14 px-4 lg:px-8">
        <div className="flex-shrink-0">
          <Link to="/ehesp/testing" className="font-bold">go_router</Link>
        </div>
        <div className="flex-grow flex justify-end">
          <ul>
            <li>Docs</li>
          </ul>
        </div>
      </div>
    </header>
  );
}
