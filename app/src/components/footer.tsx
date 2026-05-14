import { useDocPageContext } from "@/hooks/use-doc-page-context";

export function Footer() {
  const ctx = useDocPageContext();
  const socials = Object.entries(ctx.bundle.config?.social || {});

  // Sorting here ensures that the socials are always displayed in the same order,
  // on client and server side.
  const sorted = socials.sort(([a], [b]) => a.localeCompare(b));

  return (
    <footer className="py-12 border-t flex text-muted-foreground">
      <div className="font-mono text-sm flex items-center gap-1.5">
        <a
          href="https://docs.page"
          className="underline underline-offset-5 hover:text-foreground"
        >
          docs.page
        </a>
        <span className="text-muted-foreground">by</span>
        <a
          href="https://invertase.io"
          className="underline underline-offset-5 hover:text-foreground"
        >
          invertase.io
        </a>
      </div>
    </footer>
  );
}
