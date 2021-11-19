import React from 'react';
import Head from 'next/head';

interface TitleProps {
  statusCode: number;
}

export function Title({ statusCode }: TitleProps): JSX.Element {
  const title = statusCode === 500 ? 'Something went wrong' : 'Page not found';

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="font-anton mb-4 text-center lg:text-left">
        <h1 className="text-7xl lg:text-9xl">
          <span className="bg-clip-text text-transparent bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
            {statusCode}
          </span>
        </h1>
        <h2 className="text-6xl lg:text-6xl text-gray-900 dark:text-white">{title}</h2>
      </div>
    </>
  );
}
