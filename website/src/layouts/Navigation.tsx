import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '@nanostores/react';
import context from 'src/context';

export default function Navigation() {
  const { headings } = useStore(context);
  const navRef = useRef(null);
  const [activeId, setActiveId] = useState('');
  const [currentActiveId, setCurrentActiveId] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('main section[data-id]');

      for (const section of sections) {
        const span = section.querySelector('span:first-child');
        if (span && span.getBoundingClientRect().y < 1) {
          setCurrentActiveId(section.getAttribute('data-id') || '');
        }
      }

      setActiveId(currentActiveId);
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <ul id="navigation" ref={navRef}>
      {headings.map((heading, index) => (
        <li key={`${heading.id}-${index}`}>
          <a
            data-id={heading.id}
            href={`#${heading.id}`}
            className={`block break-words py-1 font-medium opacity-75 transition hover:opacity-100 ${
              activeId === heading.id ? 'text-docs-theme' : ''
            }`}
            style={{
              paddingLeft: `${(heading.rank || 2) - 1 * 0.2}rem`,
            }}
          >
            {heading.title}
          </a>
        </li>
      ))}
    </ul>
  );
}
