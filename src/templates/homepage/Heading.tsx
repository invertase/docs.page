import React from 'react';
import cx from 'classnames';

export function Heading({
  step,
  title,
  from,
  to,
}: {
  step: number;
  title: React.ReactNode;
  from: string;
  to: string;
}): JSX.Element {
  return (
    <div className="flex items-center">
      <div
        className={cx(
          'w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br shadow-xl',
          from,
          to,
        )}
      >
        <span className="font-anton text-white text-4xl">{step}</span>
      </div>
      <h2 className="flex-1 ml-6 text-white font-anton text-4xl leading-relaxed">{title}</h2>
    </div>
  );
}
