import { Footer } from '../homepage/Footer';
import { detect } from 'detect-browser';

export function Preview({ onSelect }: { onSelect: () => void }): JSX.Element {
  const browser = detect();

  return (
    <div className="dark:text-white">
      <section className="py-16 lg:py-32 items-center text-center px-4 lg:text-left">
        <div className="max-w-6xl mx-auto tracking-wider">
          <div className="flex items-center justify-center lg:justify-between mb-4 space-x-4">
            <div className="flex items-center justify-start space-x-4">
              <h3 className="font-anton text-4xl">docs.page</h3>
              <a
                href="https://github.com/invertase/docs.page"
                className="text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors duration-100"
              >
                <svg className="h-10 w-10 " fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <h3 className="italic">Local Preview Mode (Beta)</h3>
            </div>
            {/* <div className="pl-6">
              <div className="cursor-pointer bg-green-600 hover:bg-green-500 flex px-3 py-2 text-xs rounded-lg shadow text-white transition-colors whitespace-nowrap">
                {children}
              </div>
            </div> */}
          </div>
          <h1 className=" text-center font-anton mt-40 mb-4 text-2xl lg:text-5xl bg-clip-text text-transparent bg-gradient-to-br from-gray-900 dark:from-gray-100 via-gray-700 dark:via-gray-300 to-gray-900 dark:to-gray-200">
            Preview from your machine, with{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-br from-red-600 to-black dark:from-yellow-200 dark:to-red-400">
              hot reload.
            </span>{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-br from-red-800 to-violet-500"></span>
          </h1>
          {browser.name === 'chrome' ? (
            <>
              <p className="text-center pt-20">
                To get started, simply select the local directory of your project configured with
                docs.page:
              </p>
              <div className="w-100% pt-8 text-center items-center justify-center content-center">
                <button
                  className="cursor-pointer bg-green-600 hover:bg-green-500 px-3 py-2 text-s rounded-lg shadow text-white transition-colors whitespace-nowrap"
                  onClick={onSelect}
                >
                  Select Directory!
                </button>
              </div>
            </>
          ) : (
            <p className="text-center pt-20">
              Local Preview Mode is only available on Chrome at the moment, sorry :(
            </p>
          )}
        </div>
        <div className="mt-32 max-w-5xl mx-auto px-4 lg:px-0">
          <Footer />
        </div>
      </section>
    </div>
  );
}
