import type { ThrownBundleError, ThrownNotFoundError } from '../loaders/documentation.server';
import { DocsLink } from './DocsLink';
import { QuickLinks } from './Quicklinks';

export function NotFound({ error }: { error: ThrownNotFoundError }) {

  const { owner, repo, path, repositoryFound } = error.data;

  return (
    <div className="mt-20 max-w-lg mx-auto">
      <Title statusCode={error.status} title="This page could not be found" />
      <div className="mt-10 flex-col">
        {
          repositoryFound ? <><p>
            The file {' '}
            <DocsLink className="text-blue-600" to={`https://github.com/${owner}/${repo}/blob/main/${path}.mdx`}>
              {path}.mdx
            </DocsLink>{' '}
            was not found.
          </p>
            <p>
              This could be because of a typo in your sidebar config, or you've not made a file at this path.
            </p></> :
            <><p>
              The GitHub repository{' '}
              <DocsLink className="text-blue-600" to={`https://github.com/${owner}/${repo}`}>
                {owner}/{repo}
              </DocsLink>{' '}
              was not found.
            </p>
              <p>
                To get started, create a new repository on{' '}
                <DocsLink className="text-blue-600" to="https://github.com/new">GitHub</DocsLink>.
              </p></>
        }
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
          <span data-testid='error-status-code' className="bg-clip-text text-transparent bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
            {statusCode}
          </span>
        </h1>
        <h2 data-testid='error-title' className="text-5xl lg:text-4xl text-gray-900 dark:text-white">{title}</h2>
      </div>
    </>
  );
}