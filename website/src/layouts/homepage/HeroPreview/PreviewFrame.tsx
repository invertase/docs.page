import type { CSSProperties } from "react";

import { Icon } from "~/components/Icon";
import { cn } from "~/lib/utils";

import type { PreviewConfig, PreviewSidebarPage } from "./config";

type Props = {
  config: PreviewConfig;
  activePagePath: string;
  onActivatePage: (href: string) => void;
};

type ThemeStyle = CSSProperties & {
  "--preview-primary": string;
};

export function PreviewFrame(props: Props) {
  const { config, activePagePath, onActivatePage } = props;

  const allPages = config.sidebar.flatMap((group) => group.pages);
  const activePage =
    allPages.find((page) => page.href === activePagePath) ?? allPages[0];

  const themeStyle: ThemeStyle = {
    "--preview-primary": config.theme.primary,
  };

  return (
    <div
      className="flex h-full min-h-0 flex-col bg-background font-sans text-foreground"
      style={themeStyle}
    >
      <Chrome name={config.name} />
      <Header name={config.name} />
      <div className="grid min-h-0 flex-1 grid-cols-1 sm:grid-cols-[180px_1fr]">
        <Sidebar
          config={config}
          activePagePath={activePage?.href ?? "/"}
          onActivatePage={onActivatePage}
        />
        <Content config={config} activePage={activePage} />
      </div>
    </div>
  );
}

function Chrome({ name }: { name: string }) {
  return (
    <div className="flex h-9 shrink-0 items-center gap-3 border-b border-border bg-muted/30 px-3">
      <div className="flex items-center gap-1.5" aria-hidden>
        <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57] shadow-[0_0_0_0.5px_hsl(0_0%_0%/0.2)]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E] shadow-[0_0_0_0.5px_hsl(0_0%_0%/0.15)]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28C840] shadow-[0_0_0_0.5px_hsl(0_0%_0%/0.15)]" />
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div
          className="inline-flex items-center gap-0 px-2.5 py-1 font-sans text-[11px] text-muted-foreground"
        >
          <span className="whitespace-nowrap text-foreground/80">
            {`docs.page/invertase/${name || "foo"}`}
          </span>
        </div>
      </div>
      <div className="w-[3.5rem]" />
    </div>
  );
}

function Header({ name }: { name: string }) {
  return (
    <div className="flex h-9 shrink-0 items-center justify-between border-b border-border px-3">
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className="inline-block h-4 w-4 rounded-sm"
          style={{ backgroundColor: "var(--preview-primary)" }}
        />
        <span className="text-[12px] font-medium text-foreground">
          {name || "foo"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-1.5 rounded-sm border border-border bg-muted/40 px-1.5 py-1 text-[10px] text-muted-foreground md:inline-flex">
          <span className="sr-only">Search, Command K</span>
          <i aria-hidden className="fa-solid fa-magnifying-glass text-[10px]" />
          <span
            className="inline-flex select-none items-center font-sans text-[10px] font-normal leading-none tracking-tight"
            aria-hidden
          >
            <span className="inline-flex h-[1em] min-h-0 min-w-0 items-center">⌘</span>
            <span className="inline-flex h-[1em] min-h-0 min-w-0 items-center">K</span>
          </span>
        </div>
        <span className="text-muted-foreground">
          <i aria-hidden className="fa-brands fa-github text-[14px]" />
        </span>
      </div>
    </div>
  );
}

function Sidebar(props: {
  config: PreviewConfig;
  activePagePath: string;
  onActivatePage: (href: string) => void;
}) {
  return (
    <nav
      aria-label="Documentation sidebar"
      className="hidden min-h-0 overflow-y-auto border-r border-border bg-card/40 py-3 sm:block dark:bg-marketing-platform-inner-dark"
    >
      <div className="space-y-4">
        {props.config.sidebar.map((group, groupIndex) => (
          <div
            key={`${group.group}-${groupIndex}`}
            className="space-y-1 px-2"
          >
            <h4 className="px-2 text-[10px] font-semibold uppercase tracking-wider text-foreground/70">
              {group.group}
            </h4>
            <ul className="space-y-0.5">
              {group.pages.map((page, pageIndex) => {
                const isActive = page.href === props.activePagePath;
                return (
                  <li key={`${page.href}-${pageIndex}`}>
                    <button
                      type="button"
                      onClick={() => props.onActivatePage(page.href)}
                      aria-pressed={isActive}
                      className={cn(
                        "group/item flex w-full items-center gap-2 rounded px-2 py-1 text-left font-sans text-[12px] transition-colors",
                        isActive
                          ? "font-medium"
                          : "text-foreground/65 hover:bg-foreground/5 hover:text-foreground/90",
                      )}
                      style={
                        isActive
                          ? {
                              backgroundColor:
                                "color-mix(in srgb, var(--preview-primary) 15%, transparent)",
                              color: "var(--preview-primary)",
                            }
                          : undefined
                      }
                    >
                      {page.icon ? (
                        <span className="w-3 text-[10px] leading-none">
                          <Icon name={page.icon} size={10} />
                        </span>
                      ) : (
                        <span aria-hidden className="w-3" />
                      )}
                      <span className="truncate">{page.title}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}

function Content(props: {
  config: PreviewConfig;
  activePage: PreviewSidebarPage | undefined;
}) {
  const title = props.activePage?.title ?? "Documentation";

  return (
    <div className="min-h-0 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
      <div className="space-y-3">
        <h1
          className="text-base font-semibold leading-tight text-foreground sm:text-lg"
          style={{
            borderBottom: "2px solid var(--preview-primary)",
            paddingBottom: "0.25rem",
            display: "inline-block",
          }}
        >
          {title}
        </h1>
        <p className="text-[12px] leading-relaxed text-muted-foreground">
          {props.config.description}
        </p>
        <div className="space-y-2 text-[12px] leading-relaxed text-foreground/80">
          <p>
            Welcome to <span className="font-medium">{props.config.name}</span>.
            Edit the JSON on the left and watch this page update in real time —
            from the colour and copy down to the navigation structure.
          </p>
        </div>
        <div
          className="rounded-md border-l-2 px-3 py-2 text-[11px] text-foreground/80"
          style={{
            borderLeftColor: "var(--preview-primary)",
            backgroundColor:
              "color-mix(in srgb, var(--preview-primary) 8%, transparent)",
          }}
        >
          <span className="mr-1 text-[10px] font-semibold uppercase tracking-wider">
            Tip
          </span>
          Add a new page under <code className="font-sans">sidebar</code> to see
          it appear here instantly.
        </div>
        <pre className="overflow-x-auto rounded-md border border-border bg-muted/40 px-3 py-2 font-sans text-[11px] leading-relaxed text-foreground/80">
          <code>
            <span className="text-muted-foreground"># {title}</span>
            {"\n\n"}
            <span>Built with </span>
            <span className="text-[color:var(--preview-primary)]">
              docs.page
            </span>
            <span>.</span>
          </code>
        </pre>
      </div>
    </div>
  );
}
