import {
  ChevronRightIcon,
  Github,
  MenuIcon,
  MoonIcon,
  SunIcon,
  XIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

import { DocsPageLogo } from "~/components/DocsPageLogo";
import { Link } from "~/components/Link";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { LINKS, MARKETING_THEME_STORAGE_KEY } from "~/constants/links";
import { platformCardVariants } from "~/layouts/homepage/platformCardSurface";
import { cn } from "~/lib/utils";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <header className="w-full">
      <div className="mx-auto w-full min-w-0 max-w-8xl px-4">
        <Card
          className={cn(
            platformCardVariants(),
            "gap-0 border-t-0 p-3 text-foreground sm:p-3.5 md:p-4",
          )}
        >
          <div className="flex flex-col gap-0">
            <div className="flex w-full flex-row items-center justify-between gap-4">
              <Link
                href="/"
                className="flex shrink-0 items-center"
              >
                <DocsPageLogo />
              </Link>

              <div className="hidden min-w-0 flex-1 min-[813px]:flex min-[813px]:items-center min-[813px]:justify-end">
                <nav className="flex w-full flex-wrap items-center justify-end gap-0.5 md:gap-1">
                  <ul className="flex flex-wrap items-center justify-end gap-0">
                    <li>
                      <Link
                        variant="marketingNav"
                        href={LINKS.githubRepo}
                        className="!gap-0 !px-2"
                        aria-label="View docs.page on GitHub"
                      >
                        <Github className="size-4" aria-hidden />
                      </Link>
                    </li>
                    <li>
                      <Link variant="marketingNav" href={LINKS.docs}>
                        Docs
                        <ChevronRightIcon aria-hidden />
                      </Link>
                    </li>
                  </ul>
                  <MarketingHeaderThemeToggle />
                </nav>
              </div>

              <div className="flex min-[813px]:hidden shrink-0 items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-lg"
                  className="text-foreground hover:text-foreground aria-expanded:text-foreground dark:hover:text-foreground dark:aria-expanded:text-foreground"
                  aria-expanded={menuOpen}
                  aria-controls="marketing-header-menu"
                  aria-label={menuOpen ? "Close menu" : "Open menu"}
                  onClick={() => setMenuOpen((open) => !open)}
                >
                  {menuOpen ? (
                    <XIcon className="size-5" aria-hidden />
                  ) : (
                    <MenuIcon className="size-5" aria-hidden />
                  )}
                </Button>
                <MarketingHeaderThemeToggle />
              </div>
            </div>

            {menuOpen ? (
              <nav
                id="marketing-header-menu"
                className="mt-4 flex min-[813px]:hidden flex-col items-end gap-1 border-t border-border pt-4 text-right"
              >
                <Link
                  variant="marketingNav"
                  href={LINKS.githubRepo}
                  className="!gap-0 !px-2 w-fit self-end"
                  aria-label="View docs.page on GitHub"
                  onClick={() => setMenuOpen(false)}
                >
                  <Github className="size-4" aria-hidden />
                </Link>
                <Link
                  variant="marketingNav"
                  href={LINKS.docs}
                  className="w-full justify-end"
                  onClick={() => setMenuOpen(false)}
                >
                  Docs
                  <ChevronRightIcon aria-hidden />
                </Link>
              </nav>
            ) : null}
          </div>
        </Card>
      </div>
    </header>
  );
}

/** `data-theme` + `MARKETING_THEME_STORAGE_KEY`; uses `Button` `ghost` + `icon-lg`. */
function MarketingHeaderThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    const t =
      document.documentElement.getAttribute("data-theme") === "dark"
        ? "dark"
        : "light";
    setTheme(t);
  }, []);

  useEffect(() => {
    if (theme === null) return;
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(MARKETING_THEME_STORAGE_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  if (theme === null) {
    return <div className="size-9 shrink-0" aria-hidden />;
  }

  const isDark = theme === "dark";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-lg"
      className="text-foreground hover:text-foreground aria-expanded:text-foreground dark:hover:text-foreground dark:aria-expanded:text-foreground"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <SunIcon className="size-4" />
      ) : (
        <MoonIcon className="size-4" />
      )}
    </Button>
  );
}
