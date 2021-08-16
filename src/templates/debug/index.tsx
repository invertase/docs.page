import React from 'react';
import { Footer } from '../homepage/Footer';
import NextHead from 'next/head';
import { QuickLinks } from '../error/QuickLinks';
import { Title } from './Title';
import { RepoInfo } from './RepoInfo';
import { Hydrate } from '../../mdx';
import { Tabs, TabItem } from '../../mdx/Tabs';
import { Configuration } from './Configuration';
import { PageContent } from '../../utils/content';
import { Properties } from '../../utils/properties';
import { ISerializationDetail } from '../../utils/error';
interface ISerializationErrorProps {
  blameUrl: string;
  errors: ISerializationDetail[];
  properties: Properties;
  content: PageContent;
}

export function Debug({
  blameUrl,
  errors,
  properties,
  content,
}: ISerializationErrorProps): JSX.Element {
  console.log(content);
  return (
    <>
      <NextHead>
        <meta key="noindex" name="robots" content="noindex" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Anton&display=swap" rel="stylesheet" />

        <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
      </NextHead>
      <section className="py-16 lg:py-32 text-center px-4 lg:text-left">
        <Title statusCode={500} />
        <div>
          <a href={properties.githubUrl}>{properties.githubUrl}</a>
        </div>
        <Tabs
          defaultValue="apple"
          values={[
            { label: 'Repo Info', value: 'repoinfo' },
            { label: 'Config', value: 'config' },
            { label: 'Serialization', value: 'serialization' },
          ]}
        >
          <TabItem value="repoinfo">
            <RepoInfo properties={properties}></RepoInfo>
          </TabItem>
          <TabItem value="config">
            <Configuration config={content.config} />
          </TabItem>
          <TabItem value="serialization">
            <span className="text-xl">Serialization Errors:</span>
            {errors.map((e, i) => (
              <div key={i}>
                <div className="p-2">
                  <div className="mb-4">
                    <span className="text-xl">{`At line ${e.line}, column ${e.column}:`}</span>
                  </div>
                  <span className="flex">{e.message}</span>
                  <div className="mt-4">
                    <span className="text-xl">Blame link is here:</span>
                  </div>
                  <a href={getBlameLink(blameUrl, e.start, e.end)}>Blame</a>
                </div>
                <Hydrate source={e.src} />
              </div>
            ))}
          </TabItem>
        </Tabs>
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
