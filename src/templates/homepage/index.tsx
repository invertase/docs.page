import React from 'react';
import Head from 'next/head';
import Script from 'next/script';

import { Checkout } from './Checkout';
import { Heading } from './Heading';
import { Feature } from './Feature';
import { DocsDirectory, IndexExample } from './Skeletons';
import {
  Adjustments,
  PullRequest,
  GlobeAlt,
  Template,
  Annotation,
  SearchCircle,
} from '../../components/Icons';
import { Footer } from './Footer';

export default function IndexPage(): JSX.Element {
  return (
    <>
      <Head>
        <title>docs.page | Create an instant Open Source docs page with zero configuration.</title>

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
          content="Create an instant Open Source docs page with zero configuration."
        />
        <meta property="og:image" content="http://docs.page/assets/docs-page-social.png" />
        <meta property="og:url" content="http://docs.page" />

        <meta name="twitter:title" content="docs.page" />
        <meta
          name="twitter:description"
          content="Create an instant Open Source docs page with zero configuration."
        />
        <meta name="twitter:image" content="http://docs.page/assets/docs-page-social.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Script>
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-W89J6BX');`}
      </Script>
      <style global jsx>{`
        p a {
          text-decoration: underline;
        }
        p a:hover {
          opacity: 0.8;
        }
      `}</style>
      <div className="dark:text-white">
        <section className="py-16 lg:py-32 text-center px-4 lg:text-left">
          <div className="max-w-6xl mx-auto tracking-wider">
            <div className="flex items-center justify-center lg:justify-start mb-4 space-x-4">
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
            </div>
            <h1 className="font-anton mb-4 text-6xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-br from-gray-900 dark:from-gray-100 via-gray-700 dark:via-gray-300 to-gray-900 dark:to-gray-200">
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
              <p className="text-lg px-3">
                docs.page sources content directly from any Open Source GitHub repository.
              </p>
              <p className="mt-4 text-lg px-3">
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
                  index.mdx
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
              <p className="text-lg px-3">
                Create a <code className="text-blue-500">{`index.mdx`}</code> file at the root of
                your <code className="text-blue-500">/docs</code> directory. docs.page supports
                nested pages based on your directory structure of the directory.
              </p>
              <p className="mt-4 text-lg px-3">
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
          <div className="lg:ml-20 mt-10 grid lg:grid-cols-2 gap-16 text-center">
            <Feature
              href="https://use.docs.page/configuration"
              title={<span className="text-blue-500">Configure</span>}
              text={
                <span>
                  Add a <code className="text-blue-400">docs.json</code> file to the roof of the
                  repository to configure your project by adding a theme, search, navigation,
                  analytics and more.
                </span>
              }
              icon={<Adjustments size={80} />}
            />
            <Feature
              href="https://use.docs.page/previews"
              title={<span className="text-pink-400">Previews</span>}
              text={
                <span>
                  Previewing changes on branches and pull requests works out of the box with zero
                  configuration. Install our GitHub bot for preview assistance.
                </span>
              }
              icon={<PullRequest size={80} />}
            />
            <Feature
              href="https://use.docs.page/components"
              title={<span className="text-yellow-400">Components</span>}
              text={
                <span>
                  By using MDX we provide custom React components to help you build better
                  documentation.
                </span>
              }
              icon={<Template size={80} />}
            />
            <Feature
              href="https://use.docs.page/custom-domains"
              title={<span className="text-green-400">Domains</span>}
              text={
                <span>
                  Using a custom domain name? Simply create a pull request & point your domain to
                  our servers. We&apos;ll take care of the rest.
                </span>
              }
              icon={<GlobeAlt size={80} />}
            />
            <Feature
              href="https://use.docs.page/github-bot"
              title={<span className="text-purple-500">GitHub Bot</span>}
              text={
                <span>
                  Install our GitHub bot on repositories using docs.page. Any new Pull Requests will
                  automatically display a publicly available deployment preview URL for your
                  documentation.
                </span>
              }
              icon={<Annotation size={80} />}
            />
            <Feature
              href="https://use.docs.page/search"
              title={<span className="text-red-500">Search</span>}
              text={
                <span>
                  Add your DocSearch application ID to your configuration file and instantly get
                  full blown documentation search for free, powered by Algolia.
                </span>
              }
              icon={<SearchCircle size={80} />}
            />
          </div>
        </div>
        <div className="mt-32 max-w-5xl mx-auto px-4 lg:px-0">
          <Footer />
        </div>
      </div>
    </>
  );
}
