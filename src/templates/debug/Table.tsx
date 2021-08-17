import React from 'react';
import { Row } from './Row';

interface ITableProps {
  header: string;
  data: string[][];
}

export default function Table({ header, data }: ITableProps): JSX.Element {
  return (
    <section className="mx-auto max-w-4xl border rounded font-mono divide-y bg-white">
      {!!header && <Row header title={header}></Row>}
      {data.map((row, i) => (
        <div key={i} className="flex p-3 px-6">
          {row.map((col, j) => (
            <div className="flex-1" key={j}>
              {col}
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}
