import React from 'react';
import Convert from 'ansi-to-html';

import StackTracey from 'stacktracey';
import { deserializeError } from 'serialize-error';
import { Row } from './Row';

const convert = new Convert({
  newline: true,
  escapeXML: true,
  fg: '#000',
});

function RenderError({ error }: { error: any }) {
  const e = deserializeError(error);
  const stack = new StackTracey(e).withSources().clean();

  const msg = String(error && error.message);

  return (
    <section className="mx-auto max-w-5xl border rounded font-mono divide-y">
      <Row title="Error Message" header />
      <div className="flex p-3">
        <RenderMessage message={msg} />
      </div>
      <Row title="Stack Trace" header />
      {stack.items.map((e, i) => {
        return (
          <div className="flex p-3">
            <RenderStackEntry entry={e} i={i} />
          </div>
        );
      })}
    </section>
  );
}

function RenderStackEntry({ entry, i }) {
  return (
    <div>
      <span>{entry?.beforeParse}</span>
    </div>
  );
}

function RenderMessage({ message }) {
  const msg = convert.toHtml(message);

  return <div style={{ whiteSpace: 'break-spaces' }} dangerouslySetInnerHTML={{ __html: msg }} />;
}

export { RenderError };
