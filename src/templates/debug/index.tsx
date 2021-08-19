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
    src?: string;
  }[];
  properties: SlugProperties;
  content: PageContent;
  warnings: string[];
  statusCode: number;
  existence: any;
}
// details, config,errors,warnings
export function Debug({
  repoData,
  configData,
  errors,
  warningData,
  statusCode = 500,
}: ISerializationErrorProps): JSX.Element {

  const tablesData = [repoData, configData, warningData];
  console.log(tablesData)

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
          <article className="mt-6 border p-1" id={table.id} key={table.id}>
            <Table header={table.header} data={table.data} />
          </article>
        ))}
        <article className="mt-6 border rounded p-1" id="errors">
          <Table header="Errors" data={[]}/>
          {errors.map((e) => 
          <>
            <div>
              <span>Line {e.line}, column {e.column}: </span>
            </div>
            <div className="bg-red-600 rounded">
              <span className="p-2 text-yellow-200"> {`\> `} {e.message}.</span>
            </div>
             <Hydrate source={e.src}/>
          </>
          )}
        </article>
        <section className="mt-20 max-w-4xl mx-auto px-2">
          <QuickLinks />
        </section>
        <Footer />
      </section>
    </>
  );
}
