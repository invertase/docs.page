import React from 'react';
import { ExternalLink, Link } from '../../components/Link';

export function Footer() {
  return (
    <footer className="flex font-mono text-gray-500 hover:text-gray-300 transition-colors text-sm mb-5 py-4">
      <div className="flex-1">
        <div>© {new Date().getFullYear()} Invertase</div>
      </div>
      <div className="flex space-x-6">
        <ExternalLink href="https://github.com/invertase/docs.page" className="hover:underline">
          GitHub
        </ExternalLink>
        <ExternalLink href="https://invertase.io" className="hover:underline">
          Invertase
        </ExternalLink>
        <ExternalLink
          href="https://github.com/invertase/docs.page/issues"
          className="hover:underline"
        >
          Report an issue
        </ExternalLink>
      </div>
    </footer>
  );
}
