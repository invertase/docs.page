import { Link } from "@/components/doc-link";
import { useDocPageContext } from "@/hooks/use-doc-page-context";
import { useDocTabs } from "@/hooks/use-doc-tabs";
import { getAssetSrc } from "@/lib/docs-assets";
import { resolveActiveTabId } from "@/lib/docs-routing";
import { cn } from "@/lib/utils";
import { RiSunFill, RiMoonFill, RiSparkling2Fill } from "@remixicon/react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Search } from "@/components/search";
import { useAgentPanel } from "@/hooks/use-agent-panel";
import { Kbd } from "@/components/ui/kbd";

export function Header() {
  const hasTabs = useDocTabs().length > 0;

  return (
    <header className="sticky top-0 z-30 border-b bg-background">
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
            className={`relative block h-8 w-auto shrink-0 ${hasDarkLogo ? "dark:hidden" : ""}`}
            src={lightLogoSrc}
            alt="Light logo"
          />
        )}
        {hasDarkLogo && (
          <img
            className={`relative h-8 w-auto shrink-0 ${hasLightLogo ? "hidden dark:block" : "block"}`}
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
  const { hasAgent } = useDocPageContext();
  
  return (
    <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
      {hasAgent && <AgentPanelToggle />}
      <Search />
      <HeaderLinks />
      <ThemeToggle />
    </div>
  );
}

function AgentPanelToggle() {
  const { open, setOpen } = useAgentPanel();

  return (
    <Button
      variant="outline"
      aria-label="Toggle agent panel"
      onClick={() => setOpen(!open)}
    >
      <RiSparkling2Fill />
      <Kbd className="hidden md:block">⌘I</Kbd>
    </Button>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <RiSunFill className="hidden dark:block" />
      <RiMoonFill className="block dark:hidden" />
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
      className="px-4"
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
    <div className="h-8 flex items-center gap-4">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        return (
          <Link
            key={tab.id}
            href={tab.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "inline-flex gap-2 h-8 items-center px-1 text-sm border-b-2 -mb-px transition-colors",
              isActive
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
            )}
          >
            <span>{tab.title}</span>
          </Link>
        );
      })}
    </div>
  );
}
