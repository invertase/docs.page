import React from 'react';
import Head from 'next/head';

import { Checkout } from './Checkout';
import { Heading } from './Heading';
import { Feature } from './Feature';
import { DocsDirectory, IndexExample } from './Skeletons';
import { Adjustments, PullRequest, GlobeAlt, Template } from '../../components/Icons';
import { Footer } from './Footer';

export default function IndexPage() {
  return (
    <>
      <Head>
        <title>docs.page | Instant Open Source docs with zero configuration.</title>

        <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
        <link rel="manifest" href="/favicons/site.webmanifest" />
        <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />

        <meta property="og:title" content="docs.page" />
        <meta
          property="og:description"
          content="Instant Open Source docs with zero configuration."
        />
        <meta property="og:image" content="http://docs.page/assets/docs-page-social.png" />
        <meta property="og:url" content="http://docs.page" />

        <meta name="twitter:title" content="docs.page" />
        <meta
          name="twitter:description"
          content="Instant Open Source docs with zero configuration."
        />
        <meta name="twitter:image" content="http://docs.page/assets/docs-page-social.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <style global jsx>{`
        body {
          background: #1a202c;
          color: #fff;
        }

        p a {
          text-decoration: underline;
        }
        p a:hover {
          opacity: 0.8;
        }
      `}</style>
      <section className="py-16 lg:py-32 text-center px-4 lg:text-left">
        <div className="max-w-6xl mx-auto tracking-wider">
          <div className="flex items-center justify-center lg:justify-start mb-4 space-x-4">
            <h3 className="font-anton text-4xl bg-clip-text text-transparent bg-gradient-to-br from-gray-100 via-gray-400  to-gray-200">
              docs.page
            </h3>
            <a
              href="https://github.com/invertase/docs.page"
              className="text-gray-500 hover:text-gray-200 transition-colors duration-100"
            >
              <svg className="h-10 w-10 " fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
          <h1 className="font-anton mb-4 text-6xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-br from-gray-100 via-gray-300  to-gray-200">
            Instant{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-br from-green-400 to-blue-500">
              Open Source
            </span>{' '}
            docs <br /> with zero configuration.
          </h1>
        </div>
      </section>
      <div className="max-w-5xl mx-auto px-4 lg:px-0">
        <Heading
          step={1}
          title={
            <span>
              Add a{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
                docs
              </span>{' '}
              directory to your GitHub repository.
            </span>
          }
          from="from-purple-400"
          to="to-red-500"
        />
        <div className="lg:ml-20 mt-16 lg:flex items-center">
          <div className="flex-1">
            <p className="text-lg font-thin px-3">
              docs.page sources content directly from any Open Source GitHub repository.
            </p>
            <p className="mt-4 text-lg font-thin px-3">
              To get started, create an empty <code className="text-red-400">docs</code> directory
              at the root of your repository.
            </p>
          </div>
          <div className="flex-1">
            <div className="mt-10 lg:mt-0 lg:pl-8">
              <DocsDirectory />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-32 max-w-5xl mx-auto px-4 lg:px-0">
        <Heading
          step={2}
          title={
            <span>
              Create an{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-br from-green-400 to-blue-500">
                index.md
              </span>{' '}
              file.
            </span>
          }
          from="from-green-400"
          to="to-blue-500"
        />
        <div className="lg:ml-20 mt-16 flex flex-col-reverse lg:flex-row items-center">
          <div className="w-full flex-1">
            <div className="pr-5 mt-10 lg:mt-0">
              <IndexExample />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-lg font-thin px-3">
              Create an <code className="text-blue-500">{`index.md`}</code> file at the root of your{' '}
              <code className="text-blue-500">docs</code> directory. docs.page also supports{' '}
              <code className="text-blue-500">.mdx</code> and{' '}
              <code className="text-blue-500">.html</code> file extensions too!
            </p>
            <p className="mt-4 text-lg font-thin px-3">
              Start by writing some <a href="https://www.markdownguide.org/">Markdown</a> content.
              Installation pages are always a great place to start!
            </p>
          </div>
        </div>
      </div>
      <div className="mt-32 max-w-5xl mx-auto px-4 lg:px-0">
        <Heading
          step={3}
          title="Checkout your new documentation!"
          from="from-yellow-400"
          to="to-yellow-500"
        />
        <div className="lg:ml-20 mt-10 lg:flex">
          <div className="flex-1">
            <Checkout />
          </div>
          <div className="flex-1"></div>
        </div>
      </div>
      <div className="mt-32 max-w-5xl mx-auto px-4 lg:px-0">
        <Heading step={4} title="Learn more..." from="from-green-400" to="to-green-500" />
        <div className="lg:ml-20 mt-10">
          <div className="lg:flex flex-wrap text-center pl-3">
            <div className="lg:px-12 lg:w-1/2 mb-20">
              <Feature
                href="/"
                title={<span className="text-blue-500">Configure</span>}
                text={
                  <span>
                    Add a <code className="text-blue-400">docs.json</code> file to the roof of the
                    repository to configure your project by adding a theme, search, navigation,
                    analytics and more.
                  </span>
                }
                icon={<Adjustments size={80} className="text-white" />}
              />
            </div>
            <div className="lg:px-12 lg:w-1/2 mb-20">
              <div className="lg:px-12 flex flex-col items-center justify-center">
                <Feature
                  href="/"
                  title={<span className="text-pink-400">Previews</span>}
                  text={
                    <span>
                      Easily preview documentation changes to branches & pull requests. Use our
                      GitHub bot for seamless integration.
                    </span>
                  }
                  icon={<PullRequest size={80} className="text-white" />}
                />
              </div>
            </div>
            <div className="lg:px-12 lg:w-1/2 mb-20">
              <div className="lg:px-12 flex flex-col items-center justify-center">
                <Feature
                  href="/"
                  title={<span className="text-yellow-400">Components</span>}
                  text={
                    <span>
                      Use our built in React components or create your own for fully customizable
                      documentation pages.
                    </span>
                  }
                  icon={<Template size={80} className="text-white" />}
                />
              </div>
            </div>
            <div className="lg:px-12 lg:w-1/2 mb-20">
              <div className="lg:px-12 flex flex-col items-center justify-center">
                <Feature
                  title={<span className="text-green-400">Domains</span>}
                  text={
                    <span>
                      Using a custom domain name? Simply create a pull request & point your domain
                      to our servers. We'll take care of the rest.
                    </span>
                  }
                  icon={<GlobeAlt size={80} className="text-white" />}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-32 max-w-5xl mx-auto px-4 lg:px-0">
        <Footer />
      </div>
    </>
  );
}
