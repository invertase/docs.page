import { Link } from 'remix';
import { useDocumentationContext } from '~/context';
import { usePreviewMode } from '~/utils/local-preview-mode';
import { DarkModeToggle } from './DarkModeToggle';
import { DocsLink } from './DocsLink';

type FooterProps = {
  generic?: boolean
}

export function Footer(props: FooterProps): JSX.Element {
  const previewMode = usePreviewMode()
  const { source, baseBranch, path } = useDocumentationContext();

  if (props.generic) {
    return <GenericFooter />
  }


  // TODO: fix editUrl
  const editUrl = previewMode.enabled ? '' : `https://github.com/${source.owner}/${source.repository}/edit/${source.type === 'branch' ? source.ref : baseBranch}/docs/${path || 'index'}.mdx`;
  return (
    <footer className="mt-16 py-8 px-4 lg:px-8 border-t border-gray-900/10">
      <div className="flex text-sm font-medium text-gray-500 dark:text-gray-300">
        <div className="flex-grow">
          Powered by{' '}
          <Link to="/" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
            docs.page
          </Link>
        </div>
        {previewMode.enabled ?
          '' :
          <div className="flex-shrink-0">
            <a
              href={editUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              Edit this page
            </a>
          </div>
        }
      </div>
    </footer>
  );
}

function GenericFooter() {
  return <footer className="mt-20 flex font-mono opacity-50 hover:opacity-100 transition-opacity text-sm mb-5 py-4">
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
}
