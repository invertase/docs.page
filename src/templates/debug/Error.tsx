import React from 'react';

function Error({ children }: { children: string }): JSX.Element {
  return (
    <section className="mx-auto mt-10 max-w-3xl rounded font-mono divide-y bg-red-300">
      <div className="flex p-3 text-red-800 font-bold uppercase">{children}</div>
    </section>
  );
}

export { Error };
