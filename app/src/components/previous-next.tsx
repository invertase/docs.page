import type { SidebarGroup } from "@/server/config/models/sidebar";
import { Link } from "./doc-link";
import { useDocPageContext } from "@/hooks/use-doc-page-context";
import { useSidebar } from "@/hooks/use-sidebar";
import { isExternalLink } from "@/lib/docs-assets";
import { docPathMatchesSidebarHref } from "@/lib/docs-routing";
import { Button } from "./ui/button";
import { RiArrowLeftLine, RiArrowRightLine } from "@remixicon/react";

type AnchorSource = { title: string; href: string };

export function PreviousNext() {
  const ctx = useDocPageContext();
  const sidebar = useSidebar();

  const frontmatter = ctx.bundle.frontmatter;

  // Whether to automatically infer the next and previous pages.
  // This can be disabled by setting `content.automaticallyInferNextPrevious`
  // to `false` in the bundle config. Otherwise, it will be enabled by default.
  const automaticallyInferNextPrevious = !(
    ctx.bundle.config.content?.automaticallyInferNextPrevious === false
  );

  // A flattened list of all sidebar items.
  const flattened: AnchorSource[] = [];

  // Recursively flatten the sidebar (internal doc links only).
  function flattenGroup(group: SidebarGroup) {
    if ("href" in group && group.href && !isExternalLink(group.href) && group.group) {
      flattened.push({ href: group.href, title: group.group });
    }

    for (const page of group.pages) {
      if ("pages" in page) {
        flattenGroup(page);
      } else if (!isExternalLink(page.href)) {
        flattened.push(page);
      }
    }
  }

  // Flatten the sidebar.
  sidebar.forEach(flattenGroup);

  function findAnchor(href: string) {
    return flattened.find((anchor) => anchor.href === href);
  }

  let previous: AnchorSource | undefined;
  let next: AnchorSource | undefined;

  // If the user has automatic page inference, find the previous and next pages
  // based on the current page's position in the sidebar.
  if (automaticallyInferNextPrevious) {
    const currentIndex = flattened.findIndex((anchor) =>
      docPathMatchesSidebarHref(
        ctx.route.docPath,
        anchor.href,
        ctx.bundle.config.locales,
      ),
    );
    if (currentIndex !== -1) {
      const previousCursor = flattened[currentIndex - 1];
      const nextCursor = flattened[currentIndex + 1];
      if (previousCursor)
        previous = { title: previousCursor.title, href: previousCursor.href };
      if (nextCursor) next = { title: nextCursor.title, href: nextCursor.href };
    }
  }

  const previousHref = frontmatter.previous
    ? String(frontmatter.previous)
    : undefined;
  if (previousHref && !isExternalLink(previousHref)) {
    previous = {
      title: frontmatter.previousTitle
        ? String(frontmatter.previousTitle)
        : (findAnchor(previousHref)?.title ?? ""),
      href: previousHref,
    };
  }

  const nextHref = frontmatter.next ? String(frontmatter.next) : undefined;
  if (nextHref && !isExternalLink(nextHref)) {
    next = {
      title: frontmatter.nextTitle
        ? String(frontmatter.nextTitle)
        : (findAnchor(nextHref)?.title ?? ""),
      href: nextHref,
    };
  }

  if (previous && !previous.title) previous = undefined;
  if (next && !next.title) next = undefined;
  if (!previous && !next) return null;

  return (
    <div className="flex items-center gap-3">
      {previous ? (
        <div className="flex-1">
          <Anchor {...previous} type="previous" />
        </div>
      ) : null}
      {next ? (
        <div className="flex-1 flex justify-end">
          <Anchor {...next} type="next" />
        </div>
      ) : null}
    </div>
  );
}

function Anchor(props: AnchorSource & { type: "previous" | "next" }) {
  return (
    <Button variant="secondary" asChild>
      <Link href={props.href}>
        {props.type === "previous" ? <RiArrowLeftLine size={16} /> : ""}
        <span>{props.title}</span>
        {props.type === "next" ? <RiArrowRightLine size={16} /> : ""}
      </Link>
    </Button>
  );
}
