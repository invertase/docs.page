import React from 'react';
import { Footer } from '../homepage/Footer';
import { QuickLinks } from '../error/QuickLinks';
import { Title } from './Title';
import { RepoInfo } from './RepoInfo';
import { Hydrate } from '../../mdx';
import { Tabs, TabItem } from '../../mdx/Tabs';
import { Configuration } from './Configuration';
import { PageContent } from '../../utils/content';
import { Properties } from '../../utils/properties';
import { ISerializationDetail } from '../../utils/error';
import { AbstractSidebar } from '../../components/Sidebar';
import { Row } from './Row';
import Table from './Table';
interface ISerializationErrorProps {
  blameUrl: string;
  errors: ISerializationDetail[];
  properties: Properties;
  content: PageContent;
  warnings: string[];
}

export function Debug({
  blameUrl,
  errors,
  warnings,
  properties,
  content,
  statusCode = 500,
}: ISerializationErrorProps): JSX.Element {
  console.log('it got to here');

  const errorData = errors?.length ? [["Line","Column","Message","Start","End",]].concat(errors.map((e,i) => [e.line,e.column,e.message,e.start,e.end])) : [["(no serialization errors detected)"]];
  const warningData = warnings?.length ?  [["Warning","Line"]].concat(warnings.map(w => [w.warningType, w.line])) : [["(no warnings detected)"]]
  return (
    <>
      <section className="py-16 lg:py-32 text-center lg:text-left">
        <Title statusCode={statusCode} />
        <div>
          <p>
            This page is to assist in debugging any errors we encounter when building your documentation. Navigate between the different files we found in your repo on the left.</p>
            <p>Below we provide debug information about the specific page. Use the sidebar on the right for quick navigation.</p>
          <a href={properties.githubUrl}>{properties.githubUrl}</a>
        </div>
        <section className="mt-6" id="repoinfo">
          <RepoInfo properties={properties}></RepoInfo>
        </section>
        <section className="mt-8" id="configuration">
          <Configuration config={content.config} />
        </section>
        <section id="errors" className="mt-6 mx-auto max-w-4xl border rounded font-mono divide-y bg-white">
            <Table header="Errors" data={errorData}></Table>
            {errors.map((e,i) => <Hydrate source={e.src}/>)}
        </section>
        <section id="warnings" className="mt-6 mx-auto max-w-4xl border rounded font-mono divide-y bg-white">
            <Table header="Warnings" data={warningData}></Table>
        </section>
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
