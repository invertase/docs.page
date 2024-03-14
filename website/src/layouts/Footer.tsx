import { PencilIcon } from '@components/icons';
import { useStore } from '@nanostores/react';
import context from 'src/context';

export default function Footer() {
  const { githubPath } = useStore(context);
  return (
    <footer className="mt-12 flex items-center border-t py-12 text-xs dark:border-slate-800/80">
      <div>
        Docs powered by
        <a
          className="opacity-75 transition hover:opacity-100"
          href="https://invertase.io?utm_source=docspage"
          target="_blank"
          rel="noopener noreferrer"
        >
          invertase
        </a>
        /
        <a
          className="opacity-75 transition hover:opacity-100"
          href="https://docs.page"
          target="_blank"
          rel="noopener noreferrer"
        >
          docs.page
        </a>
      </div>
      {githubPath && (
        <div className="flex flex-1 justify-end">
          <a
            className="inline-flex items-center gap-1 opacity-75 transition hover:opacity-100"
            href={githubPath}
            target="_blank"
            rel="noreferrer"
          >
            <span className="h-4 w-4">
              <PencilIcon />
            </span>
            <span>Edit page</span>
          </a>
        </div>
      )}
    </footer>
  );
}
