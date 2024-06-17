import { NavLink } from '@remix-run/react';
import { usePageContext, useTabs } from '~/context';
import { cn, getHref, isExternalLink } from '~/utils';

export function Tabs() {
  const ctx = usePageContext();
  const tabs = useTabs();

  if (!tabs.length) {
    return null;
  }

  return (
    <nav className="max-w-8xl mx-auto px-5">
      <ul className="font-display relative px-5 border-b border-black/5 dark:border-white/5 flex items-center space-x-6 text-sm font-medium tracking-wide">
        {tabs.map(tab => {
          const href = getHref(ctx, tab.href);

          return (
            <li key={href}>
              <NavLink
                to={href}
                target={isExternalLink(href) ? '_blank' : undefined}
                className={({ isActive }) =>
                  cn('relative top-px flex items-center h-12 border-b-[1.5px]', {
                    'border-transparent opacity-75 hover:opacity-100 transition-opacity': !isActive,
                    'border-primary': isActive,
                  })
                }
              >
                {tab.title}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
