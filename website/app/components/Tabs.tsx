import { NavLink } from "@remix-run/react";
import { useActiveTab, usePageContext, useTabs } from "~/context";
import { cn, getHref, isExternalLink } from "~/utils";

export function Tabs() {
  const ctx = usePageContext();
  const tabs = useTabs();
  const activeTab = useActiveTab();

  if (!tabs.length) {
    return null;
  }

  return (
    <nav className="max-w-8xl mx-auto px-5">
      <ul className="font-semibold relative px-5 border-b border-black/5 dark:border-white/5 flex items-center space-x-6 text-sm">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          const href = getHref(ctx, tab.href);

          return (
            <li key={href}>
              <NavLink
                to={href}
                target={isExternalLink(href) ? "_blank" : undefined}
                className={cn(
                  "relative top-px flex items-center h-12 border-b-[1.5px] border-transparent",
                  {
                    "hover:border-black/20 dark:hover:border-white/20 opacity-75 hover:opacity-100 transition-all":
                      !isActive,
                    "border-primary": isActive,
                  },
                )}
              >
                {tab.title}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
