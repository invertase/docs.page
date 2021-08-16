import React from 'react';
import { useDebugMode, usePageContent } from '../hooks';
import Scrollspy from 'react-scrollspy';

function TableOfContents(): JSX.Element {
  let { headings } = usePageContent();

  const debugMode = useDebugMode();
  if (debugMode) {
    headings = [
      {id: "repoinfo", title: "Project Details", rank:1},
      {id: "configuration", title: "Configuration", rank:1},
      {id: "errors", title: "Errors", rank:1},
      {id: "warnings", title: "Warnings", rank:1}
    ]
  }

  return (
    <div className="text-xs font-light">
      <Scrollspy items={headings.map(node => node.id)} currentClassName="is-current">
        <style jsx>{`
          li.is-current a,
          li a:hover {
            color: var(--theme-color);
          }
        `}</style>
        {headings.map(node => {
          return (
            <li
              key={node.id}
              className="py-1"
              style={{
                paddingLeft: `${node.rank - 2}rem`,
              }}
            >
              <a className="dark:text-gray-300 hover:text-theme-color" href={`#${node.id}`}>
                {node.title}
              </a>
            </li>
          );
        })}
      </Scrollspy>
    </div>
  );
}

export { TableOfContents };
