import {
  RiGithubFill,
  RiMoonFill,
  RiSparkling2Fill,
  RiSunFill,
} from "@remixicon/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Link } from "@/components/doc-link";
import { Search } from "@/components/search";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { useActiveTab } from "@/hooks/use-active-tab";
import { useAgentPanel } from "@/hooks/use-agent-panel";
import { useDocPageContext } from "@/hooks/use-doc-page-context";
import { useDocTabs } from "@/hooks/use-doc-tabs";
import { getAssetSrc } from "@/lib/docs-assets";
import { cn } from "@/lib/utils";
import { RefBadge } from "./ref-badge";
import { SidebarTrigger } from "./ui/sidebar";
import { tabsListVariants } from "./ui/tabs";

export function Header() {
  const hasTabs = useDocTabs().length > 0;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-background">
      <div className="mx-auto w-full max-w-8xl px-4">
        <div className="h-14 flex items-center justify-between px-1">
          <div className="flex min-w-0 flex-1 items-center gap-1">
            {!hasTabs && (
              <div className="shrink-0 md:hidden">
                <SidebarTrigger />
              </div>
            )}
            <Logo />
          </div>
          <Actions />
        </div>
        {hasTabs && (
          <div className="flex h-8 min-w-0 items-center gap-1">
            <div className="shrink-0 md:hidden">
              <SidebarTrigger />
            </div>
            <Tabs />
          </div>
        )}
      </div>
      <div
        className={cn("mt-2 h-px bg-border transition-all duration-500", {
          "opacity-0": !scrolled,
          "opacity-100": scrolled,
        })}
      />
    </header>
  );
}

function Logo() {
  const { bundle } = useDocPageContext();
  const { config } = bundle;
  const logo = config.logo;
  const name = config.name;
  const showName = config.header?.showName ?? true;

  const hasLightLogo = Boolean(logo?.light);
  const hasDarkLogo = Boolean(logo?.dark);
  const lightLogoSrc = hasLightLogo ? getAssetSrc(bundle, logo!.light!) : "";
  const darkLogoSrc = hasDarkLogo ? getAssetSrc(bundle, logo!.dark!) : "";
  const logoAlt = showName && name ? "" : (name || "Home");

  return (
    <div className="flex min-w-0 flex-1 items-center justify-start gap-3">
      <Link href="/" className="inline-flex min-w-0 items-center gap-3">
        {hasLightLogo && (
          <img
            className={`relative block h-6 w-auto shrink-0 ${hasDarkLogo ? "dark:hidden" : ""}`}
            src={lightLogoSrc}
            alt={logoAlt}
          />
        )}
        {hasDarkLogo && (
          <img
            className={`relative h-6 w-auto shrink-0 ${hasLightLogo ? "hidden dark:block" : "block"}`}
            src={darkLogoSrc}
            alt={logoAlt}
          />
        )}
        {showName && !!name && (
          <span className="truncate font-heading font-medium">{name}</span>
        )}
      </Link>
      <div className="relative top-px">
        <RefBadge />
      </div>
    </div>
  );
}

function Actions() {
  const { meta, route } = useDocPageContext();
  const isPreview = route.requestMode === "preview";

  return (
    <div className="flex min-w-0 flex-1 items-center justify-end gap-1">
      <div className="flex items-center gap-2">
        {meta.hasAgent && <Agent />}
        <Search />
        <HeaderLinks />
      </div>
      <div>
        {!isPreview && <GitHubLink />}
        <ThemeToggle />
      </div>
    </div>
  );
}

function Agent() {
  const { toggle } = useAgentPanel();

  return (
    <Button variant="outline" aria-label="Toggle agent panel" onClick={toggle}>
      <RiSparkling2Fill />
      <span className="hidden md:inline">Ask AI</span>
      <Kbd className="hidden md:block h-[17px] gap-2">⌘I</Kbd>
    </Button>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="lg"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <RiSunFill className="hidden dark:block relative -top-px" />
      <RiMoonFill className="block dark:hidden relative -top-px" />
    </Button>
  );
}

function GitHubLink() {
  const { bundle } = useDocPageContext();
  let stars: string | number = bundle.stars;

  if (stars > 1000 && stars < 10_000) {
    const rounded = Math.round((stars / 1_000) * 10) / 10;
    stars = `${rounded.toString().replace(/\.0$/, "")}k`;
  } else if (stars > 10_000) {
    stars = `${Math.round(stars / 1_000)}k`;
  }

  return (
    <Button
      variant="ghost"
      size="lg"
      aria-label="View repository on GitHub"
      className="gap-2"
      asChild
    >
      <Link
        href={`https://github.com/${bundle.source.owner}/${bundle.source.repository}`}
        target="_blank"
      >
        <RiGithubFill className="size-5" />
        <span className="hidden md:block relative top-px text-xs text-muted-foreground">
          {stars}
        </span>
      </Link>
    </Button>
  );
}

function HeaderLinks() {
  const { bundle } = useDocPageContext();
  const { config } = bundle;
  const links = config.header?.links;

  if (!links?.length) {
    return null;
  }

  return links.map((link) => (
    <Button
      key={link.href}
      variant={link.cta ? "default" : "outline"}
      className="px-3"
      asChild
    >
      <Link href={link.href}>{link.title}</Link>
    </Button>
  ));
}

function Tabs() {
  const tabs = useDocTabs();
  const activeTabId = useActiveTab();

  return (
    <nav
      aria-label="Documentation sections"
      className="min-w-0 flex-1 max-md:overflow-x-auto max-md:no-scrollbar"
    >
      <div className={cn(tabsListVariants(), "dark:bg-sidebar-background")}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;

          return (
            <Link
              key={tab.id}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              data-active={isActive ? "" : undefined}
              className={cn(
                "relative inline-flex h-7 shrink-0 items-center justify-center rounded-lg border border-transparent px-3 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring dark:text-muted-foreground dark:hover:text-foreground max-md:flex-none",
                "data-active:bg-background data-active:text-foreground dark:data-active:border-input dark:data-active:bg-input/30 dark:data-active:text-foreground",
              )}
            >
              {tab.title}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
