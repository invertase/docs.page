import { DocsPageLogo } from "~/components/DocsPageLogo";
import { Icon } from "~/components/Icon";
import { buttonVariants } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { LINKS } from "~/constants/links";
import { platformCardVariants } from "~/layouts/homepage/platformCardSurface";
import { cn } from "~/lib/utils";

const footerSocialLinkClass = cn(
  buttonVariants({ variant: "ghost", size: "icon-lg" }),
  "text-2xl text-muted-foreground/70 dark:hover:text-foreground",
);

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full">
      <div className="mx-auto w-full max-w-6xl px-4">
        <Card
          className={cn(
            platformCardVariants(),
            "flex min-h-[13rem] min-w-0 flex-col border-b-0 px-4 pb-5 pt-12 text-foreground sm:min-h-[14rem] sm:px-5 md:px-6",
          )}
        >
          <div className="flex min-h-0 flex-1 flex-col items-center justify-between gap-6 md:flex-row md:items-start">
            <a
              href="/"
              className="flex items-center transition-opacity hover:opacity-90"
            >
              <DocsPageLogo />
            </a>

            <div className="flex flex-wrap items-center justify-center gap-3 md:justify-end">
              <a
                href={LINKS.twitter}
                target="_blank"
                rel="noreferrer"
                className={footerSocialLinkClass}
                aria-label="Invertase on X"
              >
                <Icon name="x-twitter" />
              </a>
              <a
                href={LINKS.githubOrg}
                target="_blank"
                rel="noreferrer"
                className={footerSocialLinkClass}
                aria-label="Invertase on GitHub"
              >
                <Icon name="github" />
              </a>
              <a
                href={LINKS.discord}
                target="_blank"
                rel="noreferrer"
                className={footerSocialLinkClass}
                aria-label="Invertase on Discord"
              >
                <Icon name="discord" />
              </a>
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-4 pt-10 text-center text-sm text-muted-foreground/70 md:flex-row md:items-center md:justify-between md:pt-12 md:text-left">
            <p>
              <a
                href={LINKS.invertase}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground"
              >
                Powered by Invertase
              </a>
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 md:justify-end">
              <a
                href={LINKS.terms}
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground"
              >
                Terms
              </a>
              <a
                href={LINKS.privacy}
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground"
              >
                Privacy Policy
              </a>
              <span>© {year} docs.page. All rights reserved.</span>
            </div>
          </div>
        </Card>
      </div>
    </footer>
  );
}
