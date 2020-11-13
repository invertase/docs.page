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
      <section className="py-24 flex flex-col items-center justify-center text-center bg-gradient-to-b from-gray-200 via-white  to-gray-200">
        <div className="font-anton">
          <h1 className="mb-4 text-8xl bg-clip-text text-transparent bg-gradient-to-br from-gray-900 via-gray-700  to-gray-900">
            docs.page
          </h1>
          <h2 className="text-3xl uppercase bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800  to-gray-900">
            Zero configuration GitHub documentation websites
          </h2>
        </div>

        <div className="mt-8 flex items-center space-x-10">
          <a
            href="https://github.com/invertase/docs.page"
            className="uppercase border-4 border-teal-500 hover:text-teal-500 rounded-lg px-8 py-2 text-3xl font-bold transition-colors duration-100"
          >
            GitHub
          </a>
          <a
            href="https://github.com/invertase/docs.page"
            className="uppercase border-4 border-teal-500 hover:text-teal-500 rounded-lg px-8 py-2 text-3xl font-bold transition-colors duration-100"
          >
            Get Started
          </a>
        </div>
      </section>
    </>
  );
}
