import { DocsPageLogo } from "~/components/DocsPageLogo";
import { Icon } from "~/components/Icon";
import { buttonVariants } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { LINKS } from "~/constants/links";
import { platformCardVariants } from "~/layouts/homepage/platformCardSurface";
import { cn } from "~/lib/utils";

const footerSocialLinkClass = cn(
  buttonVariants({ variant: "ghost", size: "icon-lg" }),
  "text-muted-foreground/70 dark:hover:text-foreground",
);

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full">
      <div className="mx-auto w-full max-w-6xl px-4">
        <Card
          className={cn(
            platformCardVariants(),
            "flex min-h-[13rem] min-w-0 flex-col border-b-0 text-foreground sm:min-h-[14rem]",
          )}
        >
          <div
            className={cn(
              "flex min-h-0 flex-1 flex-col px-6 pb-5 pt-6 font-heading sm:px-8 md:px-10",
            )}
          >
            <a
              href="/"
              className="flex w-fit shrink-0 items-center transition-opacity hover:opacity-90"
            >
              <DocsPageLogo />
            </a>

            <div className="mt-auto flex w-full flex-col gap-6 pt-8 sm:flex-row sm:items-end sm:justify-between sm:gap-8 md:pt-10">
              <div className="flex min-w-0 flex-col gap-4 text-sm text-muted-foreground/70 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8 md:gap-x-10">
                <p className="shrink-0 text-left">
                  <a
                    href={LINKS.invertase}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground"
                  >
                    Built and maintained by Invertase
                  </a>
                </p>
                <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-x-4 gap-y-2 text-right">
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

              <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 self-end sm:self-auto">
                <a
                  href={LINKS.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className={footerSocialLinkClass}
                  aria-label="Invertase on X"
                >
                  <Icon name="x-twitter" size={20} />
                </a>
                <a
                  href={LINKS.githubOrg}
                  target="_blank"
                  rel="noreferrer"
                  className={footerSocialLinkClass}
                  aria-label="Invertase on GitHub"
                >
                  <Icon name="github" size={20} />
                </a>
                <a
                  href={LINKS.discord}
                  target="_blank"
                  rel="noreferrer"
                  className={footerSocialLinkClass}
                  aria-label="Invertase on Discord"
                >
                  <Icon name="discord" size={20} />
                </a>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </footer>
  );
}
