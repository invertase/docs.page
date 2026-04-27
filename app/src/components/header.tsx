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

export function Header() {
  const hasTabs = useDocTabs().length > 0;

  return (
    <header
      id="docs-app-header"
      className="sticky top-0 z-30 bg-background"
    >
      <div className="mx-auto w-full max-w-8xl px-3">
        <div className="flex min-h-16 items-center justify-between py-3">
          <Logo />
          <Actions />
        </div>
        {hasTabs && (
          <div className="mt-5 w-full">
            <div className="pb-2">
              <Tabs />
            </div>
            <div className="h-px w-full bg-border" aria-hidden />
          </div>
        )}
      </div>
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
    <div className="flex min-w-0 flex-1 items-center justify-start">
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
    </div>
  );
}

function Actions() {
  const { meta } = useDocPageContext();

  return (
    <div className="flex min-w-0 flex-1 items-center justify-end gap-0.5">
      <div className="flex items-center gap-1.5">
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
      <Link href={`https://github.com/${bundle.source.owner}/${bundle.source.repository}`} target="_blank">
        <RiGithubFill className="size-5" />
        <span className="relative top-px text-xs text-muted-foreground">
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
      <TabsList className="bg-transparent p-0">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className={cn(
              "relative w-auto !h-8 !min-h-0 !shrink-0 !flex-none !max-h-8 !px-2.5 !py-0",
              "no-underline",
              "visited:text-foreground/60 dark:visited:text-muted-foreground",
              // Only the active tab matches the Search (⌘K) outline button
              "data-[state=active]:!border-border data-[state=active]:!bg-background",
              "data-[state=active]:!text-foreground",
              "data-[state=active]:!shadow-none [box-shadow:none]",
              "data-[state=active]:hover:!bg-muted",
              "dark:data-[state=active]:!border-input dark:data-[state=active]:!bg-input/30",
              "dark:data-[state=active]:hover:!bg-input/50",
              "data-[state=active]:visited:!text-foreground dark:data-[state=active]:visited:!text-foreground",
            )}
            asChild
          >
            <Link href={tab.href}>{tab.title}</Link>
          </TabsTrigger>
        ))}
      </TabsList>
    </TabsRoot>
  );
}
