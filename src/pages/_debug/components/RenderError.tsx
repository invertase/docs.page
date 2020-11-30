import React from 'react';
import { Row } from './Row';
import Ansi from 'ansi-to-react';

function RenderError({ error }: { error: any }) {
  const trace = error.message.split('\n');
  return (
    <section className="mx-auto max-w-5xl border rounded font-mono divide-y">
      <Row title="Render Error" header highlight="#e34646" />
      <Row title="Error Code">{error.code}</Row>
      <div className="flex-1 p-4">
        {trace.map(line => {
          return (
            <p>
              <Ansi>{line}</Ansi>
            </p>
          );
        })}
      </div>
    </section>
  );
}

export { RenderError };
