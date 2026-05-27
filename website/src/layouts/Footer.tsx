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
      <div className="mx-auto w-full min-w-0 max-w-8xl px-4">
        <Card
          className={cn(
            platformCardVariants(),
            "relative !bg-transparent shadow-none dark:!bg-transparent",
            "flex min-h-[13rem] min-w-0 flex-col border-0 border-b-0 border-t-0 ring-0",
            "gap-0 p-3 text-foreground sm:min-h-[14rem] sm:p-3.5 md:p-4",
          )}
        >
          <div
            className={cn(
              "flex min-h-0 flex-1 flex-col font-marketing-body",
              "items-center text-center marketingNav:items-stretch marketingNav:text-left",
            )}
          >
            <a
              href="/"
              className="flex w-fit shrink-0 items-center max-marketingNav:mx-auto marketingNav:mx-0"
            >
              <DocsPageLogo />
            </a>

            <div className="mt-auto flex w-full flex-col items-center gap-6 pt-8 text-center max-marketingNav:items-center marketingNav:flex-row marketingNav:items-end marketingNav:justify-between marketingNav:gap-8 marketingNav:text-right md:pt-10">
              <p className="shrink-0 text-sm text-muted-foreground/70">
                <a
                  href={LINKS.invertase}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground"
                >
                  Built and maintained by Invertase
                </a>
              </p>

              <div className="flex w-full min-w-0 flex-wrap items-center justify-center gap-x-4 gap-y-3 text-sm text-muted-foreground/70 max-marketingNav:justify-center marketingNav:w-auto marketingNav:justify-end">
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
                <span className="font-sans">© {year} docs.page. All rights reserved.</span>
                <span className="inline-flex flex-wrap items-center justify-center gap-2 marketingNav:justify-end">
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
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </footer>
  );
}
