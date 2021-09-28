import React from 'react';
import { Hydrate } from '../../mdx';

function Error({
  line,
  column,
  message,
  src,
  leftOver,
}: {
  line?: number;
  column?: number;
  message?: string;
  src?: string;
  leftOver?: string;
}): JSX.Element {
  return (
    <>
      <div>
        <span>
          Line {line}, column {column}:{' '}
        </span>
      </div>
      <div className="bg-red-600 rounded">
        <span className="p-2 text-yellow-200">
          {' '}
          {`\> `} {message}.
        </span>
      </div>
      {src && <Hydrate source={src} />}
      {leftOver && (
        <pre>
          {leftOver
            .split('\n')
            .slice(0, 10)
            .map((l, i) => `${line + i + 1} | ${l} \n`)}
        </pre>
      )}
    </>
  );
}

export { Error };
