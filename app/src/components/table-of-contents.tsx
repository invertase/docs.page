import { useDocPageContext } from "@/hooks/use-doc-page-context";
import { cn } from "@/lib/utils";
import { RiListIndefinite } from "@remixicon/react"
import { useEffect, useState } from "react";

export function TableOfContents() {
  const [activeId, setActiveId] = useState("");
  const { bundle } = useDocPageContext();
  const headings = bundle.headings.filter((heading) => heading.includeInToc);

  useEffect(() => {
    const headingIds = new Set(headings.map((heading) => heading.id));
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>(
        '.prose [data-doc-heading="true"][id]',
      ),
    ).filter((heading) => headingIds.has(heading.id));
    if (sections.length === 0) return;

    const visible = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.set(entry.target.id, entry.boundingClientRect.top);
          } else {
            visible.delete(entry.target.id);
          }
        }

        if (visible.size > 0) {
          const [topId] = [...visible.entries()].sort(
            ([, a], [, b]) => a - b,
          )[0];
          setActiveId(topId);
          return;
        }

        // nothing currently in the band — fall back to the last heading above it
        let above: { id: string; top: number } | null = null;
        for (const section of sections) {
          const top = section.getBoundingClientRect().top;
          if (top < 0 && (!above || top > above.top)) {
            above = { id: section.id, top };
          }
        }
        if (above) setActiveId(above.id);
      },
      {
        rootMargin: "-80px 0px -70% 0px", // TODO align me when we do the anchor positioning
        threshold: 0,
      },
    );

    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, [headings]);

  return (
    <div className="sticky top-30 px-4">
      <h3 className="flex items-center gap-2 text-muted-foreground ">
        <RiListIndefinite className="size-5" />
        <span className="font-heading text-sm font-semibold">On this page</span>
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