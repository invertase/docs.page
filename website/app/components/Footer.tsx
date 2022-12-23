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
    ? undefined
    : `https://github.com/${source.owner}/${source.repository}/edit/${
        source.type === 'branch' && source.ref !== 'HEAD' ? source.ref : baseBranch
      }/docs/${path || 'index'}.mdx`;
  return (
    <footer className="pb-12">
      <div className="flex text-sm font-medium text-gray-500 dark:text-gray-300">
        <div className="flex-grow">
          <a href="https://docs.page" className="opacity-75 transition hover:opacity-100">
            Powered by docs.page
          </a>
        </div>
        {!!editUrl && (
          <a
            href={editUrl}
            target="_blank"
            rel="noreferrer"
            className="item-center flex gap-3 opacity-75 transition hover:opacity-100"
          >
            <span className="relative top-[2px] ">
              <PencilIcon width={14} />
            </span>
            <span>Edit this page</span>
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
