import Head from "next/head";
import Link from "next/link";

import type { DocsDebugDetailsProps } from "@/components/docs-debug";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import type { DocsBranding } from "@/lib/docs-bundle-api";
import { cn } from "@/lib/utils";

export type DocsNotFoundContent = {
  title?: string;
  description?: string;
  source?: string;
  branding?: DocsBranding;
};

export type DocsNotFoundPageData = DocsNotFoundContent & {
  debug?: DocsDebugDetailsProps;
};

function NotFoundLogo({ branding }: { branding?: DocsBranding }) {
  const light = branding?.logo?.light;
  const dark = branding?.logo?.dark;
  const hasLightLogo = Boolean(light);
  const hasDarkLogo = Boolean(dark);
  const alt = branding?.name ?? "Logo";

  if (hasLightLogo || hasDarkLogo) {
    return (
      <EmptyMedia variant="default" className="mb-0">
        {hasLightLogo ? (
          <img
            className={cn("h-8 w-auto", hasDarkLogo && "dark:hidden")}
            src={light}
            alt={alt}
          />
        ) : null}
        {hasDarkLogo ? (
          <img
            className={cn(
              "h-8 w-auto",
              hasLightLogo ? "hidden dark:block" : "block",
            )}
            src={dark}
            alt={alt}
          />
        ) : null}
      </EmptyMedia>
    );
  }

  return (
    <EmptyMedia variant="icon">
      <img src="/_docs.page/logo-icon.svg" alt="" />
    </EmptyMedia>
  );
}

export function DocsNotFoundPage({
  title = "Page not found",
  description = "The page you're looking for doesn't exist or may have moved.",
  source,
  branding,
}: DocsNotFoundContent = {}) {
  return (
    <>
      <Head>
        <title>{`${title}${branding?.name ? ` | ${branding.name}` : " | docs.page"}`}</title>
      </Head>
      <main className="flex min-h-svh flex-1 items-center justify-center px-6 py-16">
        <Empty className="max-w-lg border-none">
          <EmptyHeader>
            <NotFoundLogo branding={branding} />
            <EmptyTitle className="text-2xl">{title}</EmptyTitle>
            <EmptyDescription
              className="[&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:font-mono [&_code]:text-xs [&_code]:text-foreground"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </EmptyHeader>
          <EmptyContent className="flex-row flex-wrap justify-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/">Back to home</Link>
            </Button>
            {source ? (
              <Button variant="ghost" size="sm" asChild>
                <a href={source} rel="noreferrer">
                  View on GitHub
                </a>
              </Button>
            ) : null}
          </EmptyContent>
        </Empty>
      </main>
    </>
  );
}
