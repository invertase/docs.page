import { RiArrowRightSLine } from "@remixicon/react";
import Link from "next/link";
import { Button } from "../ui/button";

export function Footer() {
  return (
    <>
      <div className="flex flex-col items-center gap-10 px-6 py-16 text-center lg:grid lg:grid-cols-2 lg:items-center lg:gap-0 lg:px-20 lg:py-32 lg:text-left">
        <div className="order-2 flex flex-col items-center gap-8 lg:order-1 lg:items-start">
          <h3 className="text-4xl leading-snug font-heading font-light tracking-loose lg:text-5xl">
            Bring your docs <br /> into the <b>agentic</b> age
          </h3>

          <Button
            variant="default"
            size="lg"
            className="rounded-full px-4 py-5 group"
            asChild
          >
            <Link href="/get-started">
              Get started{" "}
              <RiArrowRightSLine className="size-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
        <div className="order-1 flex items-center justify-center lg:order-2">
          <img
            src="/_docs.page/logo-icon.svg"
            alt="Logo"
            className="h-40 w-auto lg:h-60"
          />
        </div>
      </div>
      <footer className="border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 p-6">
            <img src="/_docs.page/logo.svg" alt="Logo" className="h-8 w-auto" />
          </div>
        </div>
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <a
              href="https://invertase.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-neutral-400 hover:text-foreground"
            >
              Built by Invertase
            </a>
          </div>
          <div>
            <div className="text-sm text-neutral-400">
              &copy; {new Date().getFullYear()} Invertase
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
