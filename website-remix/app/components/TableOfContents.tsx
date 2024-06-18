import { ListTreeIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePageContext } from '~/context';
import { cn } from '~/utils';

export function TableOfContents() {
  const ctx = usePageContext();
  const headings = ctx.bundle.headings;
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('main section[data-section]');
      let active = '';

      for (const section of sections) {
        const span = section.querySelector('span:first-child');
        if (span && span.getBoundingClientRect().y < 1) {
          active = section.getAttribute('data-section') || '';
        }
      }

      setActiveId(active);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className="hidden xl:block relative w-[17rem]">
      <div className="sticky top-32">
        <h3 className="flex items-center gap-2 opacity-75 font-display font-medium text-[15px] mb-2 tracking-wider">
          <ListTreeIcon size={20} />
          <span>On this page</span>
        </h3>
        <ul className="mt-4 space-y-2">
          {headings.map(heading => {
            return (
              <li
                key={heading.id}
                style={{
                  paddingLeft: `${((heading.rank || 2) - 2) * 0.75}rem`,
                }}
              >
                <a
                  href={`#${heading.id}`}
                  className={cn('font-light text-[14px]', {
                    'text-primary font-bold': activeId === heading.id,
                  })}
                >
                  {heading.title}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
