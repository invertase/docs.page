import React from 'react';
import { DarkModeToggle } from './DarkModeToggle';
import { Pencil } from './Icons';
import { ExternalLink, Link } from './Link';

function SiteFooter() {
  return (
    <footer className="flex dark:text-white font-mono text-sm mb-5 pt-4 border-t border-gray-700">
      <div className="flex-1">
        <div>
          © 2020{' '}
          <ExternalLink href="https://invertase.io" className="font-bold hover:underline">
            Invertase
          </ExternalLink>
        </div>
      </div>
      <div className="flex space-x-6">
        <Link href={'www.google.com'} className="flex hover:underline">
          <span className="pl-2">Terms</span>
        </Link>
        <Link href={'www.google.com'} className="flex hover:underline">
          <span className="pl-2">Privacy</span>
        </Link>
        <Link href={'www.google.com'} className="flex hover:underline">
          <span className="pl-2">Security</span>
        </Link>{' '}
        <Link href={'www.google.com'} className="flex hover:underline">
          <span className="pl-2">Help</span>
        </Link>
        <Link href={'www.google.com'} className="flex hover:underline">
          <span className="pl-2">About</span>
        </Link>
      </div>
    </footer>
  );
}

export { SiteFooter };
