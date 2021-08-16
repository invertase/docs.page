import { ProjectConfig, SidebarItem } from '../../utils/projectConfig';
import React from 'react';
import { Row } from './Row';
import Table from './Table';

function Configuration({ config }: { config: ProjectConfig }): JSX.Element {

  const {name, logo,theme,docsearch,headerDepth} = config
  const data=[
    ['Field:','Value:'],
    ["Name",name],
    ['Logo', logo],
    ["Theme",theme],
    ["DocSearch",docsearch],
    ["headerDepth",headerDepth],
  ]

  return (
    <Table header="Configuration" data={data}></Table>
  );
}

export { Configuration };
