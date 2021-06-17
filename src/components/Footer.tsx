import React from 'react';
import { useSlugProperties } from '../hooks';
import { DarkModeToggle } from './DarkModeToggle';
import { Pencil } from './Icons';
import { ExternalLink } from './Link';

function Footer(): JSX.Element {
  const editUrl = useSlugProperties().editUrl;

  return (
    <footer className="dark:text-white text-sm">
      <div className="flex items-center">
        <div className="flex-1">
          <DarkModeToggle />
        </div>
        <ExternalLink href={editUrl} className="flex items-center hover:opacity-75">
          <Pencil size={18} />
          <span className="pl-2">Edit this page</span>
        </ExternalLink>
      </div>
      <div className="text-center mt-8">
        <span className="mr-1">Powered by</span>
        <ExternalLink href="https://docs.page" className="font-bold hover:opacity-75">
          docs.page
        </ExternalLink>
      </div>
    </footer>
  );
}

export { Footer };
