import { RiArrowRightSLine } from "@remixicon/react";

import { cn } from "@/lib/utils";
import { Button, buttonTrailingIconClass } from "../ui/button";
import styles from "./homepage.module.css";

export function Footer() {
  return (
    <>
      <div
        className={cn(
          "flex flex-col items-center gap-10 border-t border-border px-6 py-16",
          "md:flex-row md:items-center md:justify-between md:gap-10 md:px-20 md:py-28",
          styles.homepageBorderT,
        )}
      >
        <div className="order-2 flex w-full min-w-0 flex-col items-center gap-8 text-center md:order-1 md:max-w-[min(100%,36rem)] md:items-start md:text-left">
          <h3 className="text-3xl leading-snug font-heading font-light tracking-loose md:text-5xl md:leading-tight">
            Bring your docs <br /> into the <b>agentic</b> age
          </h3>

          <Button size="lg">
            Get started{" "}
            <RiArrowRightSLine
              data-icon="inline-end"
              className={buttonTrailingIconClass}
            />
          </Button>
        </div>
        <div className="order-1 flex items-center justify-center md:order-2 md:flex-1 md:justify-center">
          <img
            src="/_docs.page/logo-icon.svg"
            alt=""
            aria-hidden
            className="h-40 w-auto md:h-60"
          />
        </div>
      </div>
      <footer className={styles.homepageBorderTGradient}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 p-6">
            <img src="/_docs.page/logo.svg" alt="Logo" className="h-8 w-auto" />
          </div>
        </div>
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
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
