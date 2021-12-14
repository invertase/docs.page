import { Link } from 'remix';

export function Footer() {
  return (
    <footer className="mt-16 py-8 px-4 lg:px-8 border-t border-gray-900/10">
      <div className="flex text-sm font-medium text-gray-500 dark:text-gray-300">
        <div className="flex-grow">
          Powered by{' '}
          <Link to="/" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
            docs.page
          </Link>
        </div>
        <div className="flex-shrink-0">
          <a
            href="https://todo.com"
            target="_blank"
            rel="noopener"
            className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            Edit this page
          </a>
        </div>
      </div>
    </footer>
  );
}
