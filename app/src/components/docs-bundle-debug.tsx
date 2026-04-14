import type { ReactNode } from "react";

type MetadataRow = {
  label: string;
  value: ReactNode;
};

type DocsDebugShellProps = {
  eyebrow: string;
  title: string;
  rows?: MetadataRow[];
  children: ReactNode;
  maxWidthClassName?: string;
};

export function DocsDebugShell({
  eyebrow,
  title,
  rows = [],
  children,
  maxWidthClassName = "max-w-4xl",
}: DocsDebugShellProps) {
  return (
    <main className="flex min-h-screen flex-1 justify-center bg-zinc-50 px-6 py-16 dark:bg-black">
      <div
        className={`flex w-full ${maxWidthClassName} flex-col gap-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950`}
      >
        <header className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
            {eyebrow}
          </p>
          <h1 className="text-3xl font-semibold text-zinc-950 dark:text-zinc-50">
            {title}
          </h1>
          {rows.length > 0 ? (
            <div className="space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
              {rows.map((row) => (
                <p key={row.label}>
                  {row.label}: {row.value}
                </p>
              ))}
            </div>
          ) : null}
        </header>

        {children}
      </div>
    </main>
  );
}

export function DocsBundleSection({ bundle }: { bundle: unknown }) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
        Bundle data
      </h2>
      <pre className="overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">
        {JSON.stringify(bundle, null, 2)}
      </pre>
    </section>
  );
}

export function DocsBundleErrorCard({
  error,
}: {
  error: {
    name: string;
    message: string;
    source?: string;
  };
}) {
  return (
    <main className="flex min-h-screen flex-1 justify-center bg-zinc-50 px-6 py-16 dark:bg-black">
      <div className="flex w-full max-w-3xl flex-col gap-4 rounded-xl border border-red-200 bg-white p-6 shadow-sm dark:border-red-950 dark:bg-zinc-950">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-red-600 dark:text-red-400">
          Bundle error
        </p>
        <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
          {error.name}
        </h1>
        <p className="text-sm text-zinc-700 dark:text-zinc-300">
          {error.message}
        </p>
        {error.source ? (
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Source: {error.source}
          </p>
        ) : null}
      </div>
    </main>
  );
}
