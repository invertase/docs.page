import { ProjectConfig, SidebarItem } from '../../utils/projectConfig';
import React from 'react';
import { Row } from './Row';

function Configuration({ config }: { config: ProjectConfig }) {
  return (
    <section className="mx-auto max-w-5xl border rounded font-mono divide-y bg-white">
      <Row title="Configuration" header />
      <Row title="Name">{config.name}</Row>
      <Row title="Logo">
        <div className="flex flex-row items-center justify-end h-10 lg:h-12">
          <img src={config.logo} alt={config.name} style={{ maxHeight: '100%' }} />
        </div>
      </Row>
      <Row title="Theme">
        <div className="flex flex-row items-center space-x-2 justify-end">
          <div
            style={{
              width: '10px',
              height: '10px',
              backgroundColor: config.theme,
            }}
          />
          <span>{config.theme}</span>
        </div>
      </Row>
      <Row title="Doc Search">{config.docsearch}</Row>
      <Row title="Header Depth">{config.headerDepth}</Row>
      <Row title="Sidebar" header />
      {config.sidebar.map((item: SidebarItem) => {
        const title = item[0];
        const value = item[1];
        if (typeof value === 'object') {
          //TODO: Loop sidebar nested arrays
        } else {
          return <Row title={title}>{value}</Row>;
        }
      })}
    </section>
  );
}

export { Configuration };
