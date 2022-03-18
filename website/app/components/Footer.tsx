import { useDocumentationContext } from '~/context';
import { usePreviewMode } from '~/utils/preview';
import { DarkModeToggle } from './DarkModeToggle';
import { DocsLink } from './DocsLink';
import { PencilIcon } from '@heroicons/react/solid';
type FooterProps = {
  generic?: boolean;
};

export function Footer(props: FooterProps): JSX.Element {
  const previewMode = usePreviewMode();
  const { source, baseBranch, path } = useDocumentationContext();

  if (props.generic) {
    return <GenericFooter />;
  }

  const editUrl = previewMode.enabled
    ? ''
    : `https://github.com/${source.owner}/${source.repository}/edit/${source.type === 'branch' && source.ref !== 'HEAD' ? source.ref : baseBranch
    }/docs/${path || 'index'}.mdx`;
  return (
    <footer className="mt-16 border-t border-gray-900/10 py-8 px-4 lg:px-8">
      <div className="flex text-sm font-medium text-gray-500 dark:text-gray-300">
        <div className="flex-grow pt-2">
          Powered by{' '}
          <a
            href="https://docs.page"
            className="transition-colors hover:text-gray-900 dark:hover:text-gray-100"
          >
            docs.page
          </a>
        </div>
        {previewMode.enabled ? (
          ''
        ) : (
          <a
            href={editUrl}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-gray-900 dark:hover:text-gray-100"
          >
            <div className="flex flex-row rounded border p-2 px-2 text-xs font-medium hover:border-gray-300 focus:outline-none dark:border-gray-700 dark:hover:border-gray-600">
              <div className="mr-2  flex">
                <PencilIcon width={14} />
              </div>
              <div>Edit this page</div>
            </div>
          </a>
        )}
      </div>
    </footer>
  );
}

function GenericFooter() {
  return (
    <footer className="mt-20 mb-5 flex p-4 font-mono text-sm opacity-50 transition-opacity hover:opacity-100">
      <div className="flex-grow dark:text-white ">
        <div>
          © {new Date().getFullYear()}{' '}
          <DocsLink to="https://invertase.io" className="hover:underline">
            Invertase
          </DocsLink>{' '}
          | docs.page
        </div>
      </div>
      <div className="flex-shrink-0">
        <DarkModeToggle />
      </div>
    </footer>
  );
}
