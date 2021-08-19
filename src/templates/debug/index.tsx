import React from 'react';
import { Footer } from '../homepage/Footer';
import { QuickLinks } from '../error/QuickLinks';
import { Title } from './Title';
import { Hydrate } from '../../mdx';
import { PageContent } from '../../utils/content';
import { SlugProperties } from '../../utils/properties';
import Table from './Table';
interface ISerializationErrorProps {
  blameUrl: string;
  errors: {
    line?: number;
    column?: number;
    message?: string;
    start?: number;
    end?: number;
  }[];
  properties: SlugProperties;
  content: PageContent;
  warnings: string[];
  statusCode: number;
  existence: any;
}

export function Debug({
  blameUrl,
  errors,
  warnings,
  properties,
  content,
  statusCode = 500,
  existence,
  filePath
}: ISerializationErrorProps): JSX.Element {
  const errorData =
    statusCode === 404 || !errors.length
      ? {
          header: 'Errors',
          id: 'errors',
          data: [['No serialization errors found.']],
        }
      : formatToTableData(
          'Errors',
          'errors',
          ['Line', 'Column', 'Message'],
          errors.map(({ line, column, message }) => ({ line, column, message })),
          'no errors found',
        );
  const warningData =
    statusCode === 404 || !warnings.length
      ? {
          header: 'Warnings',
          id: 'warnings',
          data: [['No Warnings found']],
        }
      : formatToTableData(
          'Warnings',
          'warnings',
          ['Warning', 'Line', 'Column', 'Detail'],
          warnings,
          'no warnings found',
        );

  const { name, logo, theme, docsearch, headerDepth } = content.config;
  const configData =
    statusCode === 404 || !content.flags.hasConfig
      ? {
          header: 'Configuration',
          id: 'configuration',
          data: [['No configuration file found.']],
        }
      : {
          header: 'Configuration',
          id: 'configuration',
          data: [
            ['Field:', 'Value:'],
            ['Name', name],
            ['Logo', logo],
            ['Theme', theme],
            ['DocSearch', docsearch],
            ['headerDepth', headerDepth],
          ],
        };

  const { owner, repository } = properties;
  const repoData = {
    header: 'Project Details',
    id: 'repoinfo',
    data: [
      ['Field:', 'Looked for:', 'Found:'],
      ['Owner', owner, existence.owner],
      ['Repository', repository, existence.name],
      ['Path', filePath, existence.path],
    ],
  };

  const tablesData = [repoData, configData, errorData, warningData];

  return (
    <>
      <section className="py-16 lg:py-32 text-center lg:text-left">
        <Title statusCode={statusCode} />
        <div>
          <p>
            This page is to assist in debugging any errors we encounter when building your
            documentation. Navigate between the different files we found in your repo on the left.
          </p>
          <p>
            Below we provide debug information about the specific page. Use the sidebar on the right
            for quick navigation.
          </p>
        </div>
        {tablesData.map(table => (
          <article className="mt-6" id={table.id} key={table.id}>
            <Table header={table.header} data={table.data} />
            {table.id === 'errors' &&
              errors.map((e, i) => (
                <div key={i}>
                  <Hydrate source={e.src} />
                  <a href={getBlameLink(blameUrl, e.start, e.end)}>Blame url</a>
                </div>
              ))}
          </article>
        ))}
        <section className="mt-20 max-w-4xl mx-auto px-2">
          <QuickLinks />
        </section>
        <Footer />
      </section>
    </>
  );
}

function getBlameLink(blameUrl, start, end) {
  return `${blameUrl}/#L${start}-L${end}`;
}

const formatToTableData = (header, id, columnNames, data, emptyState?) => {
  const values = data.map(datum => Object.values(datum));
  const formattedData = data ? [columnNames].concat(values) : [[emptyState]];

  return {
    header,
    id,
    data: formattedData,
  };
};
