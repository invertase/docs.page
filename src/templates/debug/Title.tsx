import React from 'react';
import Head from 'next/head';

interface TitleProps {
  statusCode: number;
}

export function Title({ statusCode }: TitleProps): JSX.Element {
  const title = 'docs.page: Debug';

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="font-anton mb-4 text-center lg:text-left mx-auto">
        <h1 className="text-6xl lg:text-6xl text-gray-900 dark:text-white">Debug</h1>
        <h2 className="text-3xl lg:text-3xl py-4">
          <span className="bg-clip-text  text-gray-900 dark:text-white mr-4">Status Code:</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
            {statusCode}
          </span>
        </h2>
      </div>
    </>
  );
}
