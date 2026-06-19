import { useDocPageContext } from "@/hooks/use-doc-page-context";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const icons: Record<string, string> = {
  website: "fa-solid fa-globe",
  x: "fa-brands fa-twitter",
  youtube: "fa-brands fa-youtube",
  facebook: "fa-brands fa-facebook",
  instagram: "fa-brands fa-instagram",
  linkedin: "fa-brands fa-linkedin",
  github: "fa-brands fa-github",
  slack: "fa-brands fa-slack",
  discord: "fa-brands fa-discord",
};

const links: Record<string, (value: string) => string> = {
  website: (value) => value,
  x: (value) => `https://twitter.com/${value}`,
  youtube: (value) => `https://youtube.com/${value}`,
  facebook: (value) => `https://facebook.com/${value}`,
  instagram: (value) => `https://instagram.com/${value}`,
  linkedin: (value) => `https://linkedin.com/in/${value}`,
  github: (value) => `https://github.com/${value}`,
  slack: (value) => `https://${value}.slack.com`,
  discord: (value) => `https://discord.gg/${value}`,
};

export function Footer() {
  const ctx = useDocPageContext();
  const socials = Object.entries(ctx.bundle.config?.social || {});

  const params = new URLSearchParams();
  params.set(
    "utm_source",
    `${ctx.route.owner}-${ctx.route.repository}`.toLowerCase(),
  );
  params.set("utm_medium", "footer");
  params.set("utm_campaign", "docs.page");

  // Sorting here ensures that the socials are always displayed in the same order,
  // on client and server side.
  const sorted = socials.sort(([a], [b]) => a.localeCompare(b));

  return (
    <footer className="py-12 border-t flex text-muted-foreground">
      <div className="font-mono text-sm flex items-center gap-1.5">
        <a
          href={`https://docs.page?${params.toString()}`}
          className="underline underline-offset-5 hover:text-foreground"
        >
          docs.page
        </a>
        <span className="text-muted-foreground">by</span>
        <a
          href={`https://invertase.io?${params.toString()}`}
          className="underline underline-offset-5 hover:text-foreground"
        >
          invertase.io
        </a>
      </div>
      <div className="flex-1 flex items-center justify-end gap-0.5">
        {sorted.map(([name, url]) => (
          <Button key={name} variant="ghost" size="icon-sm" asChild>
            <a
              href={links[name](url)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className={cn(icons[name], "text-[16px]")} />
            </a>
          </Button>
        ))}
      </div>
    </footer>
  );
}
