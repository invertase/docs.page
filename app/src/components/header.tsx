import { Link } from "@/components/doc-link";
import { useDocPageContext } from "@/hooks/use-doc-page-context";
import { useDocTabs } from "@/hooks/use-doc-tabs";
import { getAssetSrc } from "@/lib/docs-assets";
import { resolveActiveTabId } from "@/lib/docs-routing";
import { cn } from "@/lib/utils";
import {
  RiSunFill,
  RiMoonFill,
  RiSparkling2Fill,
  RiGithubFill,
} from "@remixicon/react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Search } from "@/components/search";
import { useAgentPanel } from "@/hooks/use-agent-panel";
import { Kbd } from "@/components/ui/kbd";
import { Tabs as TabsRoot, TabsList, TabsTrigger } from "./ui/tabs";
import { useEffect, useState } from "react";
import { RefBadge } from "./ref-badge";

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
        <div className="h-12 flex items-center justify-between">
          <Logo />
          <Actions />
        </div>
        {hasTabs && (
          <div className="h-8">
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

  return (
    <div className="flex min-w-0 flex-1 items-center justify-start gap-3">
      <Link href="/" className="inline-flex min-w-0 items-center gap-3">
        {hasLightLogo && (
          <img
            className={`relative block h-6 w-auto shrink-0 ${hasDarkLogo ? "dark:hidden" : ""}`}
            src={lightLogoSrc}
            alt="Light logo"
          />
        )}
        {hasDarkLogo && (
          <img
            className={`relative h-6 w-auto shrink-0 ${hasLightLogo ? "hidden dark:block" : "block"}`}
            src={darkLogoSrc}
            alt="Dark logo"
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
  const { meta } = useDocPageContext();

  return (
    <div className="flex min-w-0 flex-1 items-center justify-end gap-1">
      <div className="flex items-center gap-2">
        {meta.hasAgent && <Agent />}
        <Search />
        <HeaderLinks />
      </div>
      <div>
        <GitHubLink />
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
      aria-label="Toggle theme"
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

  if (!links || !links.length) {
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
  const { bundle, route } = useDocPageContext();
  const tabs = useDocTabs();
  const activeTabId = resolveActiveTabId(route, tabs, bundle.config.locales);

  return (
    <TabsRoot defaultValue={activeTabId ?? undefined} className="">
      <TabsList className="dark:bg-background">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id} className="px-2.5" asChild>
            <Link href={tab.href}>{tab.title}</Link>
          </TabsTrigger>
        ))}
      </TabsList>
    </TabsRoot>
  );
}
