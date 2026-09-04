import { RiArrowRightSLine } from "@remixicon/react";
import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Background } from "./background";
import { Footer } from "./footer";
import { Header } from "./header";
import styles from "./homepage.module.css";

const NotFoundTriangleLed = dynamic(
  () =>
    import("./not-found-triangle-led").then((mod) => ({
      default: mod.NotFoundTriangleLed,
    })),
  { ssr: false },
);

export function SiteNotFoundPage() {
  return (
    <>
      <Head>
        <link rel="icon" href="/_docs.page/logo-icon.svg" />
        <title>Page Not Found | docs.page</title>
      </Head>
      <div
        className={cn(
          styles.site,
          "dark relative min-h-svh w-full text-foreground",
        )}
      >
        <Background />
        <div className="relative z-10 mx-auto flex min-h-svh w-full min-w-0 max-w-8xl flex-col px-0 font-mono md:px-4">
          <div className="flex min-h-svh flex-1 flex-col md:border-x">
            <Header />
            <main className="flex flex-col items-center justify-start overflow-hidden px-6 py-8 text-center">
              <NotFoundTriangleLed />
              <h1 className="mt-4 font-heading font-light text-4xl sm:text-5xl md:text-6xl">
                Page Not Found
              </h1>
              <p className="mt-4 max-w-md text-sm font-light leading-relaxed text-neutral-400 sm:text-base">
                Sorry, we couldn't find the page you are looking for.
              </p>
              <Button
                asChild
                size="lg"
                className="mt-6 sm:mt-8 group rounded-full px-6 py-6 text-lg"
              >
                <Link href="/">
                  <span>Back to docs.page</span>
                  <RiArrowRightSLine className="size-6 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </main>
            <Footer showCloser={false} />
          </div>
        </div>
      </div>
    </>
  );
}
