"use client";

import { RiArrowRightSLine } from "@remixicon/react";
import { MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { Fragment, useState } from "react";
import { fonts } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { Button, buttonTrailingIconClass } from "../ui/button";
import { Sheet, SheetContent, SheetTitle } from "../ui/sheet";
import styles from "./homepage.module.css";

const NAV_LINKS = [
  { href: "https://use.docs.page", label: "GitHub" },
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
    <Button asChild variant="nav" size="default" className={className}>
      <Link href={href} onClick={onNavigate}>
        <span>{label}</span>
        <RiArrowRightSLine
          data-icon="inline-end"
          className={buttonTrailingIconClass}
        />
      </Link>
    </Button>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className={cn(
        "flex items-center px-4 py-4 sm:px-6",
        styles.homepageBorderBGradient,
      )}
    >
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
            className="text-foreground hover:text-foreground aria-expanded:text-foreground dark:hover:text-foreground dark:aria-expanded:text-foreground"
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
