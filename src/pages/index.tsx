import Head from "next/head";

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
      `}</style>
      <section className="py-32 text-center px-4 lg:text-left">
        <div className="max-w-6xl mx-auto tracking-wider">
          <h3 className="font-anton mb-4 text-4xl bg-clip-text text-transparent bg-gradient-to-br from-gray-100 via-gray-400  to-gray-200">
            docs.page
          </h3>
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
        <div className="flex items-center">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 shadow-xl">
            <span className="font-anton text-white text-4xl">1</span>
          </div>
          <h2 className="flex-1 ml-6 text-white font-anton text-4xl">
            Add a{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
              docs
            </span>{" "}
            directory to any GitHub repository.
          </h2>
        </div>
        <div className="ml-20 mt-16 lg:flex">
          <div className="flex-1">
            <p className="text-lg font-thin px-3">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi non
              nibh pretium orci ultrices efficitur ac sed felis. Etiam euismod
              iaculis leo.
            </p>
            <p className="mt-4 text-lg font-thin px-3">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi non
              nibh pretium orci ultrices efficitur ac sed felis. Etiam euismod
              iaculis leo.
            </p>
          </div>
          <div className="flex-1"></div>
        </div>
      </div>
      <div className="mt-32 max-w-5xl mx-auto px-4 lg:px-0">
        <div className="flex items-center">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-blue-500 shadow-xl">
            <span className="font-anton text-white text-4xl">2</span>
          </div>
          <h2 className="flex-1 ml-6 text-white font-anton text-4xl">
            Create Markdown, MDX or HTML files.
          </h2>
        </div>
        <div className="ml-20 mt-16 lg:flex">
          <div className="flex-1"></div>
          <div className="flex-1">
            <p className="text-lg font-thin px-3">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi non
              nibh pretium orci ultrices efficitur ac sed felis. Etiam euismod
              iaculis leo.
            </p>
            <p className="mt-4 text-lg font-thin px-3">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi non
              nibh pretium orci ultrices efficitur ac sed felis. Etiam euismod
              iaculis leo.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-32 max-w-5xl mx-auto px-4 lg:px-0">
        <div className="flex items-center">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-xl">
            <span className="font-anton text-white text-4xl">3</span>
          </div>
          <h2 className="flex-1 ml-6 text-white font-anton text-4xl">
            Checkout your new documentation!
          </h2>
        </div>
        <div className="ml-20 mt-10 lg:flex">
          <div className="flex-1">
            <div className="px-3 mb-4">
              <input
                type="text"
                placeholder="https://github.com/invertase/docs.page"
                className="w-full px-3 py-3 appearance-none bg-transparent border rounded text-white placeholder-gray-500"
              />
            </div>
            <p className="text-lg font-thin px-3">
              Enter your GitHub repository URL above to view your new
              documentation!
            </p>
            <div className="px-3 mt-8">
              <button
                type="button"
                className="px-8 py-3 rounded bg-gradient-to-br from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-semibold"
              >
                View Docs
              </button>
            </div>
          </div>
          <div className="flex-1"></div>
        </div>
      </div>
      <div className="mt-32 max-w-5xl mx-auto px-4 lg:px-0">
        <div className="flex items-center">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-green-500 shadow-xl">
            <span className="font-anton text-white text-4xl">4</span>
          </div>
          <h2 className="ml-6 text-white font-anton text-4xl">Learn more...</h2>
        </div>
        <div className="lg:ml-20 mt-10">
          <div className="lg:flex flex-wrap text-center pl-3">
            <div className="lg:px-12 lg:w-1/2 mb-20">
              <div className="flex flex-col items-center justify-center">
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
                <h4 className="my-8 font-anton text-5xl tracking-wide text-blue-400">
                  Configure
                </h4>
                <p className="font-thin">
                  Add a <code className="text-blue-400">docs.yaml</code> file to
                  the roof of the repository to configure your project by adding
                  a theme, search, navigation, analytics and more.
                </p>
                <p className="mt-6">Learn more</p>
              </div>
            </div>
            <div className="lg:px-12 lg:w-1/2 mb-20">
              <div className="lg:px-12 flex flex-col items-center justify-center">
                <svg width={80} height={80} viewBox="0 0 16 16">
                  <path
                    fill="currentColor"
                    fill-rule="evenodd"
                    d="M7.177 3.073L9.573.677A.25.25 0 0110 .854v4.792a.25.25 0 01-.427.177L7.177 3.427a.25.25 0 010-.354zM3.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122v5.256a2.251 2.251 0 11-1.5 0V5.372A2.25 2.25 0 011.5 3.25zM11 2.5h-1V4h1a1 1 0 011 1v5.628a2.251 2.251 0 101.5 0V5A2.5 2.5 0 0011 2.5zm1 10.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0zM3.75 12a.75.75 0 100 1.5.75.75 0 000-1.5z"
                  />
                </svg>
                <h4 className="my-8 font-anton text-5xl tracking-wide text-pink-400">
                  Previewing
                </h4>
                <p className="font-thin">
                  Easily preview documentation changes to branches & pull
                  requests. Use our GitHub bot for seamless integration.
                </p>
                <p className="mt-6">Learn more</p>
              </div>
            </div>
            <div className="lg:px-12 lg:w-1/2 mb-20">
              <div className="lg:px-12 flex flex-col items-center justify-center">
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
                <h4 className="my-8 font-anton text-5xl tracking-wide text-orange-400">
                  Components
                </h4>
                <p className="font-thin">
                  Use our built in React components or create your own for fully
                  customizable documentation pages.
                </p>
                <p className="mt-6">Learn more</p>
              </div>
            </div>
            <div className="lg:px-12 lg:w-1/2 mb-20">
              <div className="lg:px-12 flex flex-col items-center justify-center">
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
                <h4 className="my-8 font-anton text-5xl tracking-wide text-green-400">
                  Domains
                </h4>
                <p className="font-thin">
                  Got your own custom domain name? Simply create a pull request
                  & point your domain to our servers. We'll take care of the
                  rest.
                </p>
                <p className="mt-6">Learn more</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-32"></div>
    </>
  );
}
