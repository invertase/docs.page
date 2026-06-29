"use client";

import { RiArrowRightSLine } from "@remixicon/react";
import { MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { Fragment, useState } from "react";
import { fonts } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTitle } from "../ui/sheet";
import styles from "./homepage.module.css";

const NAV_LINKS = [
  { href: "https://github.com/invertase/docs.page", label: "GitHub" },
  { href: "https://use.docs.page", label: "Docs" },
] as const;

function NavLink({
  href,
  label,
  className,
  onNavigate,
}: {
  href: string;
  label: string;
  className?: string;
  onNavigate?: () => void;
}) {
  return (
    <Button
      asChild
      variant="ghost"
      size="default"
      className={cn(
        "group rounded-full border-0 bg-transparent font-light text-foreground hover:bg-transparent hover:text-primary dark:bg-transparent dark:hover:bg-transparent dark:hover:text-primary",
        className,
      )}
    >
      <Link href={href} onClick={onNavigate}>
        <span>{label}</span>
        <RiArrowRightSLine
          data-icon="inline-end"
          className="group-hover:translate-x-1 transition-transform"
        />
      </Link>
    </Button>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={cn("flex items-center px-4 py-4 sm:px-6 border-b")}>
      <Link href="/" className="inline-flex min-w-0 items-center gap-3">
        <img
          src="/_docs.page/logo.svg"
          alt="Logo"
          className="h-7 w-auto shrink-0"
        />
      </Link>

      <div className="hidden flex-1 items-center justify-end gap-1 md:flex">
        {NAV_LINKS.map((link) => (
          <NavLink key={link.label} href={link.href} label={link.label} />
        ))}
      </div>

      <div className="flex flex-1 items-center justify-end md:hidden">
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            className="rounded-full size-12 font-light text-foreground hover:text-foreground aria-expanded:text-foreground dark:hover:text-foreground dark:aria-expanded:text-foreground [&_svg:not([class*='size-'])]:size-6"
            aria-expanded={menuOpen}
            aria-controls="homepage-header-menu"
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
            id="homepage-header-menu"
            side="right"
            showCloseButton={false}
            className={cn(
              styles.site,
              fonts["jetbrains-mono"].variable,
              "dark font-mono w-[min(100vw,18rem)] gap-0 border-border bg-black p-0 text-foreground sm:max-w-xs",
            )}
            aria-describedby={undefined}
          >
            <SheetTitle className="sr-only">Navigation menu</SheetTitle>
            <nav className="flex w-full flex-col items-start gap-3 p-4 pt-6">
              {NAV_LINKS.map((link, index) => (
                <Fragment key={link.label}>
                  <NavLink
                    href={link.href}
                    label={link.label}
                    onNavigate={() => setMenuOpen(false)}
                  />
                  {index < NAV_LINKS.length - 1 ? (
                    <div
                      aria-hidden
                      className={cn(
                        "w-full",
                        styles.homepageLineH,
                        styles.homepageLineHGradient,
                      )}
                    />
                  ) : null}
                </Fragment>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
