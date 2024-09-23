import { usePageContext } from "~/context";
import { cn } from "~/utils";

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
  const ctx = usePageContext();

  const socials = Object.entries(ctx.bundle.config?.social || {});

  // Sorting here ensures that the socials are always displayed in the same order,
  // on client and server side.
  const sorted = socials.sort(([a], [b]) => a.localeCompare(b));

  return (
    <footer className="md:flex items-center gap-12 pb-12 space-y-3 md:space-y-0">
      <div className="text-sm flex items-center justify-center md:justify-start gap-1">
        <span>Powered by</span>
        <span>⬡</span>
        <code>
          <a href="https://invertase.io">invertase</a>/
          <a href="https://docs.page">docs.page</a>
        </code>
      </div>
      <div className="flex-1 flex flex-wrap items-center justify-center md:justify-end gap-5">
        {sorted.map(([name, url]) => (
          <div key={name}>
            <a
              className="opacity-25 dark:opacity-50 hover:opacity-75 hover:dark:opacity-75 transition-opacity"
              rel="noopener noreferrer"
              target="_blank"
              href={links[name](url)}
            >
              <i className={cn(icons[name], "text-xl")} />
            </a>
          </div>
        ))}
      </div>
    </footer>
  );
}
