import {
  ChevronRightIcon,
  Github,
  MenuIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";

import { DocsPageLogo } from "~/components/DocsPageLogo";
import { Link } from "~/components/Link";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "~/components/ui/sheet";
import { LINKS } from "~/constants/links";
import { platformCardVariants } from "~/layouts/homepage/platformCardSurface";
import { cn } from "~/lib/utils";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full">
      <div className="mx-auto w-full min-w-0 max-w-8xl px-4">
        <Card
          className={cn(
            platformCardVariants(),
            "relative !bg-transparent shadow-none dark:!bg-transparent",
            "gap-0 border-0 border-b border-border border-t-0 ring-0 p-3 text-foreground sm:p-3.5 md:p-4",
          )}
        >
          <div className="flex w-full flex-row items-center justify-between gap-4">
            <Link href="/" className="flex shrink-0 items-center">
              <DocsPageLogo />
            </Link>

            <div className="hidden min-w-0 flex-1 marketingNav:flex marketingNav:items-center marketingNav:justify-end">
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
              </nav>
            </div>

            <div className="flex shrink-0 items-center gap-2 marketingNav:hidden">
              <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
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
                <SheetContent
                  id="marketing-header-menu"
                  side="right"
                  showCloseButton={false}
                  className="w-[min(100vw,18rem)] gap-0 p-0 sm:max-w-xs"
                  aria-describedby={undefined}
                >
                  <SheetTitle className="sr-only">Navigation menu</SheetTitle>
                  <nav className="flex flex-col items-stretch gap-1 p-4 pt-6">
                    <Link
                      variant="marketingNav"
                      href={LINKS.githubRepo}
                      className="w-full justify-start gap-2"
                      onClick={() => setMenuOpen(false)}
                    >
                      GitHub
                      <ChevronRightIcon className="size-4 shrink-0" aria-hidden />
                    </Link>
                    <Link
                      variant="marketingNav"
                      href={LINKS.docs}
                      className="w-full justify-start gap-2"
                      onClick={() => setMenuOpen(false)}
                    >
                      Docs
                      <ChevronRightIcon className="size-4 shrink-0" aria-hidden />
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </Card>
      </div>
    </header>
  );
}
