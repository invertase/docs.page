import React from 'react';
import { Logo } from '../components/Logo';

export function Loading(): JSX.Element {
  return (
    <>
      <style jsx>{`
        section {
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      `}</style>
      <div className="text-white fixed inset-0 bg-gradient-to-br bg-docs-background">
        <section className="absolute flex flex-col items-center dark:text-white">
          <Logo size={100} />
          <h2 className="mt-6 font-thin text-lg text-center">Fetching content, one moment...</h2>
        </section>
      </div>
    </>
  );
}
