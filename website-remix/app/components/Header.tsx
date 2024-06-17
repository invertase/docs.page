import { cn } from '~/utils';
import { GitHubCard } from './GitHubCard';
import { Logo } from './Logo';
import { ThemeToggle } from './Theme';
import { usePageContext } from '~/context';

export function Header() {
  return (
    <header className="max-w-7xl mx-auto px-5">
      <div className="px-5 py-5 border-b border-black/5 dark:border-white/5 flex items-center">
        <div>
          <Logo />
        </div>
        <div className="flex-1 flex items-center justify-end pr-4 gap-8">
          <Links />
          <GitHubCard />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

function Links() {
  const ctx = usePageContext();
  const links = ctx.bundle.config.header?.links;

  if (!links || !links.length) {
    return null;
  }

  return (
    <ul className="flex flex-row-reverse items-center gap-6">
      {links.map((link, index) => (
        <li key={index}>
          <a
            href={link.href}
            className={cn('font-medium transition-all tracking-wide', {
              'px-4 py-1 rounded-full bg-primary hover:bg-primary/90 text-white dark:bg-primary/10 border-[0.5px] dark:text-primary border-transparent dark:border-primary/60 hover:dark:border-primary':
                link.cta,
              'hover:text-primary': !link.cta,
            })}
          >
            <span className="text-sm tracking-wide">{link.title}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}