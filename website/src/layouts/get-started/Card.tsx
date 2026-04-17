import { cva } from "class-variance-authority";
import type { ReactNode } from "react";

import { Card as UICard } from "~/components/ui/card";
import { cn } from "~/lib/utils";

const getStartedCardSurface = cva(
  "ring-0 !ring-0 border bg-transparent shadow-none border-marketing-step-badge-border/45 dark:border-marketing-step-badge-border-dark dark:!bg-marketing-step-badge-fill-dark",
);

const stepBadgeVariants = cva(
  "absolute -left-10 top-5 z-10 hidden size-9 items-center justify-center rounded-full border bg-background font-mono text-sm font-semibold text-foreground shadow-sm border-marketing-step-badge-border/45 dark:border-marketing-step-badge-border-dark dark:bg-marketing-step-badge-fill-dark lg:flex",
);

const stepConnectorVariants = cva(
  "pointer-events-none absolute -left-[1.375rem] top-[2.375rem] z-0 hidden h-[calc(100%+1.5rem)] w-px bg-marketing-step-rail/35 dark:bg-marketing-step-rail-dark lg:block",
);

type Props = {
  /** When true, no connector segment is drawn below this step (line ends at this badge). */
  isLast?: boolean;
  step: number;
  title: string;
  description: string;
  asset: ReactNode;
  meta?: ReactNode;
  children: ReactNode;
};

/**
 * Light: no extra wash — the page is already `bg-background` + `.homepage-spot-grid`.
 * A tinted fill here stacked with the inner grid (and we previously doubled the wash on the
 * inner wrapper) read as a muddy “inner yellow”. Dark: solid panel like platform cards.
 */
export function Card(props: Props) {
  return (
    <div className="relative z-10">
      {!props.isLast ? (
        <div className={stepConnectorVariants()} aria-hidden />
      ) : null}
      <div className={stepBadgeVariants()}>{props.step}</div>
      <UICard
        className={cn(
          "p-6 text-base text-card-foreground lg:ml-6",
          getStartedCardSurface(),
        )}
      >
        <div className="relative isolate flex flex-col gap-6 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:gap-y-6">
          <div className="col-start-1 col-end-6 flex flex-col">
            <h2 className="font-mono text-xl font-medium tracking-tight text-foreground md:text-2xl">
              <span className="lg:hidden">{props.step}. </span>
              <span>{props.title}</span>
            </h2>
            <p className="mb-6 mt-4 text-muted-foreground/70">
              {props.description}
            </p>
            {props.meta ? (
              <div
                className={cn(
                  "mb-4 text-sm font-light text-muted-foreground/70",
                  "[&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2",
                )}
              >
                {props.meta}
              </div>
            ) : null}
            <div className="lg:hidden">{props.asset}</div>
            <div className="mt-10 lg:hidden">{props.children}</div>
          </div>
          <div className="col-start-6 col-end-13 hidden flex-col items-end gap-4 lg:flex">
            {props.asset}
            {props.children}
          </div>
        </div>
      </UICard>
    </div>
  );
}
