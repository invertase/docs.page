import { BundleSuccess, SidebarItem } from '@docs.page/server';
import cx from 'classnames';
import { useLocation } from 'react-router-dom';
import { useDocumentationContext } from '~/context';
import { DocsLink } from './DocsLink';
import { ChevronLeft, ChevronRight } from './Icons';

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

/**
 * Return the previous item;
 * The found parameters allow use to know we should use this item or not.
 */
function findPreviousInSidebar(
  sidebarItems: SidebarItem[],
  url: string,
  previousItem?: { url: string; name: string; found?: boolean },
): { url: string; name: string; found?: boolean } | undefined {
  let previous = previousItem;
  for (const item of sidebarItems) {
    const [title, urlOrChildren] = item;
    if (typeof urlOrChildren === 'string') {
      if (urlOrChildren === url && previous) {
        return { ...previous, found: true };
      }
      previous = { url: urlOrChildren, name: title as string };
    } else {
      const previousRecursive = findPreviousInSidebar(urlOrChildren, url, previous);
      if (previousRecursive?.found) {
        return previousRecursive;
      } else {
        previous = previousRecursive;
      }
    }
  }
  return previous;
}

/**
 * Return the next item or a boolean;
 * If a boolean is returned, there were no next items.
 */
function findNextInSidebar(
  sidebarItems: SidebarItem[],
  url: string,
  takeNext: boolean,
): { url: string; name: string } | undefined | boolean {
  let _takeNext = takeNext;
  for (const item of sidebarItems) {
    const [title, urlOrChildren] = item;
    if (typeof urlOrChildren === 'string') {
      if (_takeNext) {
        return { url: urlOrChildren, name: title as string };
      }

      if (urlOrChildren === url) {
        _takeNext = true;
      }
    } else {
      const nextRecursive = findNextInSidebar(urlOrChildren, url, _takeNext);
      if (typeof nextRecursive === 'boolean') {
        _takeNext = nextRecursive;
      } else if (nextRecursive) {
        return nextRecursive;
      }
    }
  }
  if (_takeNext) {
    return true;
  }
  return undefined;
}

export function PreviousNext({ frontmatter }: PreviousNextProps) {
  const { owner, repo } = useDocumentationContext();
  const { sidebar, automaticallyInferNextPrevious } = useDocumentationContext().config;
  const { pathname } = useLocation();

  const formattedPathname = pathname.replace(`/${owner}/${repo}`, '') || '/';

  let previous: string | undefined = frontmatter.previous;
  let next: string | undefined = frontmatter.next;

  let previousTitle: string | undefined = frontmatter.previousTitle;
  let nextTitle: string | undefined = frontmatter.nextTitle;

  if (!previous && !next && !automaticallyInferNextPrevious) {
    return null;
  }

  if (previous === undefined && automaticallyInferNextPrevious) {
    const result = findPreviousInSidebar(sidebar, formattedPathname);
    if (result?.found) {
      previous = result?.url;
      previousTitle = result?.name;
    }
  }

  if (next === undefined && automaticallyInferNextPrevious) {
    const result = findNextInSidebar(sidebar, formattedPathname, false);
    if (typeof result !== 'boolean') {
      next = result?.url;
      nextTitle = result?.name;
    }
  }

  return (
    <nav
      aria-label="Docs pages navigation"
      className="mt-10 grid grid-cols-2 items-center justify-between gap-2 md:grid-cols-3"
    >
      {!!previous ? (
        <Action action="previous" url={previous}>
          <span>{previousTitle ?? findNameInSidebar(sidebar, previous)}</span>
        </Action>
      ) : (
        <div />
      )}
      <div className="hidden md:block" />
      {!!next && (
        <Action action="next" url={next}>
          <span>{nextTitle ?? findNameInSidebar(sidebar, next)}</span>
        </Action>
      )}
    </nav>
  );
}

type ActionProps = {
  action: 'previous' | 'next';
  url: string;
  children: JSX.Element;
};

function Action(props: ActionProps) {
  return (
    <DocsLink
      to={props.url}
      className={cx(
        'font-inter flex items-center gap-3 font-bold tracking-wide no-underline opacity-75 transition hover:opacity-100',
        {
          'justify-end': props.action === 'next',
        },
      )}
    >
      {props.action === 'previous' && (
        <span>
          <ChevronLeft size={16} />
        </span>
      )}
      <span>{props.children}</span>
      {props.action === 'next' && (
        <span>
          <ChevronRight size={16} />
        </span>
      )}
    </DocsLink>
  );
}
