import Link from "next/link";
import { useActiveTab, usePageContext, useTabs } from "~/context";
import { cn, getHref } from "~/utils";
import { MenuToggle } from "./MenuToggle";

type Props = {
  onMenuToggle: () => void;
};

export function Tabs(props: Props) {
  const ctx = usePageContext();
  const tabs = useTabs();
  const activeTab = useActiveTab();

  if (!tabs.length) {
    return null;
  }

  return (
    <nav className="relative max-w-8xl mx-auto px-3 md:px-8 lg:px-3">
      <div className="flex items-center gap-6 border-b border-black/5 dark:border-white/5 h-12">
        <MenuToggle onClick={props.onMenuToggle} />
        <div className="absolute inset-0 left-16 md:left-20 lg:left-10 overflow-y-hidden overflow-x-auto h-14">
          <ul className="shrink-0 font-semibold relative flex items-center space-x-6 text-sm pr-6">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTab;
              const href = getHref(ctx, tab.href);

              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      "relative top-px flex items-center h-12 border-b-[1.5px] border-transparent whitespace-nowrap",
                      {
                        "hover:border-black/20 dark:hover:border-white/20 opacity-75 hover:opacity-100 transition-all":
                          !isActive,
                        "border-primary": isActive,
                      },
                    )}
                  >
                    {tab.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
