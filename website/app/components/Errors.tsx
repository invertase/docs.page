import type { ThrownBundleError, ThrownNotFoundError } from '../loaders/documentation.server';
import { QuickLinks } from './Quicklinks';

// TODO descriptions etc

export function NotFound({ error }: { error: ThrownNotFoundError }) {
  return (
    <div className="mt-20 max-w-lg mx-auto">
      <Title statusCode={error.status} title="This page could not be found" />
      <div className="mt-10 flex-col">
        <div>{true ? 'The GitHub repository X could not be found.' : "We could not find the file Y"}</div>
        <div>{true ? 'To get started, create a new repository on Github (add link)' : "Check the file exists in your repository here (add link)"}</div>
      </div>
      <QuickLinks />
    </div>
  );
}

export function BadRequest({ error }: { error: ThrownBundleError }) {
  return (
    <div className="mt-20 max-w-lg mx-auto">
      <Title statusCode={error.status} title="This page could not be generated" />
      <div className="mt-10 flex-col">
        <div>{'This may be due to an error in your mdx syntax.'}</div>
      </div>
      <QuickLinks />
    </div>
  );
}

export function ServerError({ title }: { title: string }) {
  return (
    <div className="mt-20 max-w-lg mx-auto">
      <Title statusCode={500} title={title} />
      <div className="mt-10 flex-col">
        <div>{'Something went wrong. Try again later or report an issue with us using the link below.'}</div>
      </div>
      <QuickLinks />
    </div>
  );
}

interface TitleProps {
  statusCode: number;
  title?: string;
}

export function Title({ statusCode, title }: TitleProps): JSX.Element {
  return (
    <>
      <div className="font-anton mb-4 text-center lg:text-left">
        <h1 className="text-7xl lg:text-9xl">
          <span className="bg-clip-text text-transparent bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
            {statusCode}
          </span>
        </h1>
        <h2 className="text-5xl lg:text-4xl text-gray-900 dark:text-white">{title}</h2>
      </div>
    </>
  );
}