import React from "react";
import Head from "next/head";

import { Checkout } from "./Checkout";
import { Heading } from "./Heading";
import { Button } from "./Button";
import { Feature } from "./Feature";
import { DocsDirectory, IndexExample } from "./Skeletons";

export default function IndexPage() {
  return (
    <>
      <Head>
        <title>
          docs.page | Zero configuration GitHub documentation websites
        </title>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&display=swap"
          rel="stylesheet"
        />
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
      <section className="py-32 text-center px-4 lg:text-left">
        <div className="max-w-6xl mx-auto tracking-wider">
          <div className="flex items-center mb-4 space-x-4">
            <h3 className="font-anton text-4xl bg-clip-text text-transparent bg-gradient-to-br from-gray-100 via-gray-400  to-gray-200">
              docs.page
            </h3>
            <a
              href="https://github.com/invertase/docs.page"
              className="text-gray-500 hover:text-gray-200 transition-colors duration-100"
            >
              <svg
                className="h-10 w-10 "
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
          <h1 className="font-anton mb-4 text-6xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-br from-gray-100 via-gray-400  to-gray-200">
            Instant{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-br from-teal-400 to-blue-500">
              Open Source
            </span>{" "}
            docs <br /> with zero configuration.
          </h1>
        </div>
      </section>
      <div className="max-w-5xl mx-auto px-4 lg:px-0">
        <Heading
          step={1}
          title={
            <span>
              Add a{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
                docs
              </span>{" "}
              directory to your GitHub repository.
            </span>
          }
          from="from-purple-400"
          to="to-red-500"
        />
        <div className="ml-20 mt-16 lg:flex items-center">
          <div className="flex-1">
            <p className="text-lg font-thin px-3">
              docs.page sources content directly from any Open Source GitHub
              repository.
            </p>
            <p className="mt-4 text-lg font-thin px-3">
              To get started, create an empty{" "}
              <code className="text-red-400">docs</code> directory at the root
              of your repository.
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
              Create an{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-br from-teal-400 to-blue-500">
                index.md
              </span>{" "}
              file.
            </span>
          }
          from="from-teal-400"
          to="to-blue-500"
        />
        <div className="ml-20 mt-16 flex flex-col-reverse lg:flex-row items-center">
          <div className="w-full flex-1">
            <div className="pr-5 mt-10 lg:mt-0">
              <IndexExample />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-lg font-thin px-3">
              Create an <code className="text-blue-500">{`index.md`}</code> file
              at the root of your <code className="text-blue-500">docs</code>{" "}
              directory. docs.page also supports{" "}
              <code className="text-blue-500">.mdx</code> and{" "}
              <code className="text-blue-500">.html</code> file extensions too!
            </p>
            <p className="mt-4 text-lg font-thin px-3">
              Start by writing some{" "}
              <a href="https://www.markdownguide.org/">Markdown</a> content.
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
          to="to-orange-500"
        />
        <div className="ml-20 mt-10 lg:flex">
          <div className="flex-1">
            <Checkout />
          </div>
          <div className="flex-1"></div>
        </div>
      </div>
      <div className="mt-32 max-w-5xl mx-auto px-4 lg:px-0">
        <Heading
          step={4}
          title="Learn more..."
          from="from-teal-400"
          to="to-green-500"
        />
        <div className="lg:ml-20 mt-10">
          <div className="lg:flex flex-wrap text-center pl-3">
            <div className="lg:px-12 lg:w-1/2 mb-20">
              <Feature
                href="/"
                title={<span className="text-blue-500">Configure</span>}
                text={
                  <span>
                    Add a <code className="text-blue-400">docs.yaml</code> file
                    to the roof of the repository to configure your project by
                    adding a theme, search, navigation, analytics and more.
                  </span>
                }
                icon={
                  <svg
                    width={80}
                    height={80}
                    className="text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      fill="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                }
              />
            </div>
            <div className="lg:px-12 lg:w-1/2 mb-20">
              <div className="lg:px-12 flex flex-col items-center justify-center">
                <Feature
                  href="/"
                  title={<span className="text-pink-400">Previews</span>}
                  text={
                    <span>
                      Easily preview documentation changes to branches & pull
                      requests. Use our GitHub bot for seamless integration.
                    </span>
                  }
                  icon={
                    <svg width={80} height={80} viewBox="0 0 16 16">
                      <path
                        fill="currentColor"
                        fillRule="evenodd"
                        d="M7.177 3.073L9.573.677A.25.25 0 0110 .854v4.792a.25.25 0 01-.427.177L7.177 3.427a.25.25 0 010-.354zM3.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122v5.256a2.251 2.251 0 11-1.5 0V5.372A2.25 2.25 0 011.5 3.25zM11 2.5h-1V4h1a1 1 0 011 1v5.628a2.251 2.251 0 101.5 0V5A2.5 2.5 0 0011 2.5zm1 10.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0zM3.75 12a.75.75 0 100 1.5.75.75 0 000-1.5z"
                      />
                    </svg>
                  }
                />
              </div>
            </div>
            <div className="lg:px-12 lg:w-1/2 mb-20">
              <div className="lg:px-12 flex flex-col items-center justify-center">
                <Feature
                  href="/"
                  title={<span className="text-orange-400">Components</span>}
                  text={
                    <span>
                      Use our built in React components or create your own for
                      fully customizable documentation pages.
                    </span>
                  }
                  icon={
                    <svg
                      width={80}
                      height={80}
                      className="text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        fill="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                      />
                    </svg>
                  }
                />
              </div>
            </div>
            <div className="lg:px-12 lg:w-1/2 mb-20">
              <div className="lg:px-12 flex flex-col items-center justify-center">
                <Feature
                  href="/"
                  title={<span className="text-green-400">Domains</span>}
                  text={
                    <span>
                      Using a custom domain name? Simply create a pull request &
                      point your domain to our servers. We'll take care of the
                      rest.
                    </span>
                  }
                  icon={
                    <svg
                      width={80}
                      height={80}
                      className="text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                      />
                    </svg>
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
