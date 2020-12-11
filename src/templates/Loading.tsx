import { useRouter } from 'next/router';
import React from 'react';
import { GitHub, LightningBolt } from '../components/Icons';
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
          <div className="mt-6 flex">
            <Button href="/">Homepage</Button>
            <Button href={`/_debug${asPath}`}>
              <LightningBolt size={18} className="mr-2" />
              Debug
            </Button>
            <Button href="https://github.com/invertase/docs.page">
              <GitHub size={18} className="mr-2" /> GitHub
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}

function Button({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="transition-all flex items-center whitespace-nowrap text-sm px-4 py-2 border border-gray-700 rounded mx-2 hover:border-gray-100 hover:shadow-lg"
    >
      {children}
    </a>
  );
}
