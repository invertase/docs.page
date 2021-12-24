import { usePreviewMode } from '~/utils/local-preview-mode';
import type { ThrownBundleError, ThrownNotFoundError } from '../loaders/documentation.server';
import { DocsLink } from './DocsLink';
import { QuickLinks } from './Quicklinks';

const RepoNotFound = ({ owner, repo }: { owner: string, repo: string }) => <><p>
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

const FileNotFound = ({ owner, repo, path }: { owner: string, repo: string, path: string }) => <><p>
  The file {' '}
  <DocsLink className="text-blue-600" to={`https://github.com/${owner}/${repo}/blob/main/${path}.mdx`}>
    {path}.mdx
  </DocsLink>{' '}
  was not found.
</p>
  <p>
    This could be because of a typo in your sidebar config, or you've not made a file at this path.
  </p></>

export function NotFound({ error }: { error: ThrownNotFoundError }) {

  const { owner, repo, path, repositoryFound } = error.data;

  const previewMode = usePreviewMode();

  return (
    <ErrorContainer title={"This page could not be found"} code={error.status}>
      {
        repositoryFound ? <FileNotFound owner={owner} repo={repo} path={path} /> :
          <RepoNotFound owner={owner} repo={repo} />
      }
    </ErrorContainer>
  );
}

export function BadRequest({ error }: { error: ThrownBundleError }) {
  return (
    <ErrorContainer title={"This page could not be generated"} code={error.status}>
      <div>{'This may be due to an error in your mdx.'}</div>
    </ErrorContainer>
  );
}

export function ServerError({ title }: { title: string }) {
  return (
    <ErrorContainer title={title} code={500}>
      <div>{'Something went wrong. Try again later or report an issue with us using the link below.'}</div>
    </ErrorContainer>
  );
}

function ErrorContainer({ title, code, children }: { title: string, code: number, children: React.ReactElement }) {
  return <div className="mt-20 max-w-lg mx-auto">
    <Title statusCode={code} title={title} />
    <div className="mt-10 flex-col">
      {children}
    </div>
    <QuickLinks />
  </div>
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