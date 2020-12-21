import { useRouter } from 'next/router';
import React from 'react';
import { Logo } from '../components/Logo';

export function Loading() {
  const { asPath } = useRouter();

  return (
    <>
      <style jsx>{`
        section {
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      `}</style>
      <div className="text-white fixed inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800">
        <section className="absolute flex flex-col items-center dark:text-white">
          <Logo size={100} />
          <h2 className="mt-6 font-thin text-lg text-center">Fetching content, one moment...</h2>
        </section>
      </div>
    </>
  );
}

