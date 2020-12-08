import ReactDOMServer from 'react-dom/server';
import React from 'react';
import { Row } from './Row';

function MetaTags({ tags }: { tags: any }) {
  return (
    <section className="mx-auto max-w-5xl border rounded font-mono divide-y bg-white">
      <Row title="Header Tags" header />
      {tags.map(tag => {
        return (
          <div className="flex items-center divide-x">
            <div className="flex-1 p-4 overflow-auto">
              {ReactDOMServer.renderToStaticMarkup(tag)}
            </div>
          </div>
        );
      })}
    </section>
  );
}

export { MetaTags };
