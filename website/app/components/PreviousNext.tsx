import { BundleSuccess, SidebarItem } from '@docs.page/server';
import { useDocumentationContext } from '~/context';
import { DocsLink } from './DocsLink';

interface PreviousNextProps {
  frontmatter: BundleSuccess['frontmatter'];
}

function findNameInSidebar(sidebarItems: SidebarItem[], url: string): string | undefined {
  for (const item of sidebarItems) {
    const [title, urlOrChildren] = item;
    if (typeof urlOrChildren === 'string') {
      if (urlOrChildren === url) {
        return title as string;
      }
    } else {
      const name = findNameInSidebar(urlOrChildren, url);
      if (name) {
        return name;
      }
    }
  }
}

export function PreviousNext({ frontmatter }: PreviousNextProps) {
  const previous = frontmatter.previous;
  const next = frontmatter.next;

  const previousTitle = frontmatter.previousTitle;
  const nextTitle = frontmatter.nextTitle;

  const { sidebar } = useDocumentationContext().config;

  if (!previous && !next) {
    return null;
  }

  return (
    <nav aria-label="Docs pages navigation" className="mt-10 flex items-center justify-between">
      {!!previous && (
        <DocsLink
          to={previous}
          className="transition-border rounded-md border p-4 no-underline hover:border-gray-300"
        >
          <div className="text-sm text-gray-600 dark:text-gray-200">Previous</div>
          <div className="text-docs-theme">
            « {previousTitle ?? findNameInSidebar(sidebar, previous)}
          </div>
        </DocsLink>
      )}
      <div />
      {!!next && (
        <DocsLink
          to={next}
          className="transition-border rounded-md border p-4 text-right no-underline hover:border-gray-300"
        >
          <div className="text-sm text-gray-600 dark:text-gray-200">Next</div>
          <div className="text-docs-theme">{nextTitle ?? findNameInSidebar(sidebar, next)} »</div>
        </DocsLink>
      )}
    </nav>
  );
}
