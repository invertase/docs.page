import { SearchIcon } from "lucide-react";
import { usePageContext, useTabs } from "~/context";
import { cn } from "~/utils";
import { GitHubCard } from "./GitHubCard";
import { Locale } from "./Locale";
import { Logo } from "./Logo";
import { MenuToggle } from "./MenuToggle";
import { RefBadge } from "./RefBadge";
import { Search } from "./Search";
import { ThemeToggle } from "./Theme";

type Props = {
  onMenuToggle: () => void;
};

export function Header(props: Props) {
  const ctx = usePageContext();
  const hasTabs = useTabs().length > 0;
  const showName = ctx.bundle.config.header?.showName ?? true;

  const name = ctx.bundle.config.name;
  const logo = ctx.bundle.config.logo;

  return (
    <header className="max-w-8xl mx-auto px-8 lg:px-10">
      <div className="flex-1 h-16 py-1 border-b border-black/5 dark:border-white/5 flex items-center gap-4">
        {!hasTabs && (
          <div className="lg:hidden">
            <MenuToggle onClick={props.onMenuToggle} />
          </div>
        )}

        <a
          href={logo?.href || "/"}
          className="flex-1 inline-flex items-center gap-3"
        >
          <Logo />
          {showName && !!name && <span className="font-bold">{name}</span>}
        </a>
        <div className="hidden lg:block flex-1">
          <Search />
        </div>
        <div className="flex-1 flex items-center justify-end pr-4 gap-8">
          <Links />
          <RefBadge />
          <div className="hidden lg:block">
            <GitHubCard />
          </div>
          <Search>
            {(toggle) => (
              <div className="lg:hidden">
                <button
                  type="button"
                  onClick={toggle}
                  className="size-8 hover:bg-black/10 dark:hover:bg-white/10 rounded-full flex items-center justify-center"
                >
                  <SearchIcon size={20} />
                </button>
              </div>
            )}
          </Search>
          <Locale />
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
            className={cn("font-medium transition-all tracking-wide", {
              "text-sm px-3 py-1 rounded-full bg-primary hover:bg-primary/90 text-white dark:bg-primary/10 border-[0.5px] dark:text-primary border-transparent dark:border-primary/60 hover:dark:border-primary":
                link.cta,
              "hover:text-primary": !link.cta,
            })}
          >
            <span className="text-sm tracking-wide">{link.title}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
