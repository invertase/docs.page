import {
  BookOpenIcon,
  ChevronRightIcon,
  GithubIcon,
  MoonIcon,
  SunIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

import { DocsPageLogo } from "~/components/DocsPageLogo";
import { Link } from "~/components/Link";
import { Button, buttonVariants } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { LINKS, MARKETING_THEME_STORAGE_KEY } from "~/constants/links";
import { cn } from "~/lib/utils";

import { platformCardVariants } from "~/layouts/homepage/platformCardSurface";

export function Header() {
  return (
    <header className="w-full">
      <div className="mx-auto w-full max-w-6xl px-4">
        <Card
          className={cn(
            platformCardVariants(),
            "gap-0 border-t-0 p-4 text-foreground sm:p-5 md:p-6",
          )}
        >
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/"
              className="group flex items-center transition-opacity hover:opacity-90"
            >
              <DocsPageLogo />
            </Link>

            <div className="flex w-full flex-wrap items-center justify-center gap-3 sm:w-auto sm:grow sm:justify-end">
              <nav className="flex flex-wrap items-center justify-center gap-1 md:gap-2">
                <MarketingHeaderThemeToggle />
                <ul className="flex flex-wrap items-center justify-center gap-1 md:gap-2">
                  <li className="hidden sm:block">
                    <Link variant="marketingNav" href={LINKS.githubRepo}>
                      GitHub
                      <ChevronRightIcon aria-hidden />
                    </Link>
                  </li>
                  <li className="hidden sm:block">
                    <Link variant="marketingNav" href={LINKS.docs}>
                      Documentation
                      <ChevronRightIcon aria-hidden />
                    </Link>
                  </li>
                  <li className="sm:hidden">
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={LINKS.githubRepo}
                      className="text-muted-foreground/70 hover:text-yellow-600 dark:hover:text-yellow-400"
                      aria-label="GitHub"
                    >
                      <GithubIcon className="size-6" />
                    </a>
                  </li>
                  <li className="sm:hidden">
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={LINKS.docs}
                      className="text-muted-foreground/70 hover:text-yellow-600 dark:hover:text-yellow-400"
                      aria-label="Documentation"
                    >
                      <BookOpenIcon className="size-6" />
                    </a>
                  </li>
                </ul>
                <Link
                  href={LINKS.preview}
                  className={cn(
                    buttonVariants({
                      variant: "primary",
                      size: "lg",
                    }),
                    "dark:border dark:border-zinc-700 dark:bg-transparent dark:text-yellow-400 dark:hover:bg-zinc-800",
                  )}
                >
                  Local Preview
                  <ChevronRightIcon aria-hidden />
                </Link>
              </nav>
            </div>
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
