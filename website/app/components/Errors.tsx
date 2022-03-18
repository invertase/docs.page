import type { ThrownBundleError, ThrownNotFoundError } from '../loaders/documentation.server';
import { DocsLink } from './DocsLink';
import { QuickLinks } from './Quicklinks';

export function PreviewNotFound(): JSX.Element {
  const configFound = true;
  return (
    <ErrorContainer title={'This page could not be found'} code={404}>
      {configFound ? (
        <>
          <div>
            We couldn't find your docs in this directory. Make sure you select a directory with a{' '}
            <code>docs.json</code> file, and a <code>docs/index.mdx</code> file.
          </div>
          <div>
            If you think something else is up, please let us know by filing an{' '}
            <a className="text-blue-600" href="https://github.com/invertase/docs.page/issues">
              issue
            </a>
            .
          </div>
          <div className="mt-10">
            Return to{' '}
            <a className="text-blue-600" href="/preview">
              {' '}
              Preview Mode
            </a>
          </div>
        </>
      ) : (
        <div>docs.json not found</div>
      )}
    </ErrorContainer>
  );
}

export function PageNotFound() {
  return (
    <ErrorContainer title={'This page could not be found'} code={404}>
      <></>
    </ErrorContainer>
  );
}

export function NotFound({ error }: { error: ThrownNotFoundError }) {
  const { owner, repo, path, reason } = error.data;
  console.log(reason);
  switch (reason) {
    case 'REPO_NOT_FOUND':
      return (
        <ErrorContainer title={'This page could not be found'} code={error.status}>
          <RepoNotFound owner={owner} repo={repo} />
        </ErrorContainer>
      );
    case 'MISSING_CONFIG':
      return (
        <ErrorContainer title={'This page could not be found'} code={error.status}>
          <ConfigNotFound owner={owner} repo={repo} />
        </ErrorContainer>
      );
  }
  return (
    <ErrorContainer title={'This page could not be found'} code={error.status}>
      <FileNotFound owner={owner} repo={repo} path={path} />
    </ErrorContainer>
  );
}

export function BadRequest({ error }: { error: ThrownBundleError }) {
  return (
    <ErrorContainer title={'This page could not be generated'} code={error.status}>
      <div>{'This may be due to an error in your mdx.'}</div>
    </ErrorContainer>
  );
}

export function ServerError({ title }: { title: string }) {
  return (
    <ErrorContainer title={title} code={500}>
      <div>
        {'Something went wrong. Try again later or report an issue with us using the link below.'}
      </div>
    </ErrorContainer>
  );
}

function ErrorContainer({
  title,
  code,
  children,
}: {
  title: string;
  code: number;
  children: React.ReactElement;
}) {
  return (
    <div className="mx-auto mt-20 max-w-lg">
      <Title statusCode={code} title={title} />
      <div className="mt-10 flex-col">{children}</div>
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
          <span
            data-testid="error-status-code"
            className="bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent"
          >
            {statusCode}
          </span>
        </h1>
        <h2
          data-testid="error-title"
          className="text-5xl text-gray-900 dark:text-white lg:text-4xl"
        >
          {title}
        </h2>
      </div>
    </>
  );
}

const RepoNotFound = ({ owner, repo }: { owner: string; repo: string }) => (
  <>
    <p>
      The GitHub repository{' '}
      <DocsLink className="text-blue-600" to={`https://github.com/${owner}/${repo}`}>
        {owner}/{repo}
      </DocsLink>{' '}
      was not found.
    </p>
    <p>
      To get started, create a new repository on{' '}
      <DocsLink className="text-blue-600" to="https://github.com/new">
        GitHub
      </DocsLink>
      .
    </p>
  </>
);

const ConfigNotFound = ({ owner, repo }: { owner: string; repo: string }) => (
  <>
    <p>
      The GitHub repository{' '}
      <DocsLink className="text-blue-600" to={`https://github.com/${owner}/${repo}`}>
        {owner}/{repo}
      </DocsLink>{' '}
      is missing a configuration file.
    </p>
    <p className="pt-4">
      To fix this, see our docs on{' '}
      <DocsLink className="text-blue-600" to="https://use.docs.page/configuration">
        configuring your docs.page project
      </DocsLink>
      .
    </p>
  </>
);

const FileNotFound = ({ owner, repo, path }: { owner: string; repo: string; path: string }) => (
  <>
    <p>
      The file{' '}
      <DocsLink
        className="text-blue-600"
        to={`https://github.com/${owner}/${repo}/blob/main/${path}.mdx`}
      >
        {path}.mdx
      </DocsLink>{' '}
      was not found.
    </p>
    <p>
      This could be because of a typo in your sidebar config, or you've not made a file at this
      path.
    </p>
  </>
);
