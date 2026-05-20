import { useDocPageContext } from "@/hooks/use-doc-page-context";
import { useDocTabs } from "@/hooks/use-doc-tabs";
import { cn } from "@/lib/utils";
import { RiListUnordered } from "@remixicon/react"
import { useEffect, useState } from "react";

export function TableOfContents() {
  const [activeId, setActiveId] = useState("");
  const { bundle } = useDocPageContext();
  const hasTabs = useDocTabs().length > 0;
  const headings = bundle.headings.filter((heading) => heading.includeInToc);

  useEffect(() => {
    const headingIds = new Set(headings.map((heading) => heading.id));
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>(
        'main [data-heading="true"][id]',
      ),
    ).filter((heading) => headingIds.has(heading.id));
    if (sections.length === 0) {
      setActiveId("");
      return;
    }

    // Keep active heading aligned with the content offset used by sticky UI.
    const activeOffset = 96;
    let frame: number | null = null;

    const updateActiveId = () => {
      let currentId = sections[0].id;

      for (const section of sections) {
        if (section.getBoundingClientRect().top <= activeOffset) {
          currentId = section.id;
        } else {
          break;
        }
      }

      setActiveId((prev) => (prev === currentId ? prev : currentId));
    };

    const scheduleUpdate = () => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(() => {
        frame = null;
        updateActiveId();
      });
    };

    updateActiveId();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [headings]);

  return (
    <div
      className={cn(
        "sticky px-4 pt-10",
        hasTabs
          ? "top-[calc(6rem+1px)]"
          : "top-[calc(4rem+1px)]",
      )}
    >
      <h3 className="flex items-center gap-2 text-foreground ">
        <RiListUnordered className="size-4.5" />
        <span className="font-heading text-sm">On this page</span>
      </h3>
      <ul className="mt-4 space-y-2 border-l ml-1">
        {headings.map((heading) => {
          return (
            <li
              key={heading.id}
              className={cn("-ml-px border-l pl-6", {
                "border-transparent": activeId !== heading.id,
                "border-primary": activeId === heading.id,
              })}
            >
              <a
                href={`#${heading.id}`}
                className={cn("block truncate text-[14px]", {
                  "text-muted-foreground hover:text-foreground":
                    activeId !== heading.id,
                  "text-primary": activeId === heading.id,
                })}
                style={{
                  paddingLeft: `${((heading.rank || 2) - 2) * 0.75}rem`,
                }}
              >
                {heading.title}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}