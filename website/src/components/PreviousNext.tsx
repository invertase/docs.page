import context from 'src/context';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';
import Link from './Link';
import { useStore } from '@nanostores/react';

// title, href
type Anchor = [string, string];

export default function PreviousNext() {
  const { relativePath, config, frontmatter, sidebar } = useStore(context);
  const { automaticallyInferNextPrevious } = config;

  let previous: Anchor | undefined;
  let next: Anchor | undefined;

  const links: [string, string][] = [];

  // Finds any links in the sidebar and pushes them to a flattened array.
  function iterateSidebarArray(array: typeof sidebar) {
    for (const [title, urlOrChildren] of array) {
      if (typeof urlOrChildren === 'string') links.push([title, urlOrChildren]);
      else if (Array.isArray(urlOrChildren)) iterateSidebarArray(urlOrChildren);
    }
  }

  // Iterate the sidebar
  iterateSidebarArray(sidebar);

  const titleForLink = (link: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return links.find(([_, href]) => href === link)?.at(0) || null;
  };

  // If the user has specified a previous or next page, use that.
  if (frontmatter.previous)
    previous = [
      frontmatter.previousTitle || titleForLink(frontmatter.previous) || '',
      frontmatter.previous,
    ];
  if (frontmatter.next)
    next = [frontmatter.nextTitle || titleForLink(frontmatter.next) || '', frontmatter.next];

  // If the user wants auto infered previous/next, find them (if not already set).
  if (automaticallyInferNextPrevious) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const currentIndex = links.findIndex(([_, href]) => href === relativePath);
    if (currentIndex > -1 && !previous) previous = links[currentIndex - 1];
    if (currentIndex > -1 && !next) next = links[currentIndex + 1];
  }

  return !!previous || !!next ? (
    <nav className="flex items-center pt-6 text-sm font-semibold tracking-wide text-black dark:text-white">
      <div className="flex-1">
        {!!previous && (
          <Link
            href={previous[1]}
            className="group inline-flex items-center gap-2 opacity-75 transition hover:opacity-100"
          >
            <span className="group-hover:text-docs-theme h-4 w-4 flex-shrink-0 transition">
              <ChevronLeftIcon />
            </span>
            <span>{previous[0]}</span>
          </Link>
        )}
      </div>
      <div className="flex flex-1 justify-end">
        {!!next && (
          <Link
            href={next[1]}
            className="group inline-flex items-center gap-2 text-right opacity-75 transition hover:opacity-100"
          >
            <span>{next[0]}</span>
            <span className="group-hover:text-docs-theme h-4 w-4 flex-shrink-0 transition">
              <ChevronRightIcon />
            </span>
          </Link>
        )}
      </div>
    </nav>
  ) : null;
}
