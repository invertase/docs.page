import { useState } from "react";
import { Content } from "./components/Content";
import { Edit } from "./components/Edit";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { PreviousNext } from "./components/PreviousNext";
import { Scripts } from "./components/Scripts";
import { Sidebar } from "./components/Sidebar";
import { TableOfContents } from "./components/TableOfContents";
import { Tabs } from "./components/Tabs";
import { ThemeScripts } from "./components/Theme";
import { useTabs } from "./context";
import { cn } from "./utils";

export function Layout() {
  const hasTabs = useTabs().length > 0;
  const [sidebar, setSidebar] = useState(false);

  function toggleSidebar() {
    setSidebar((prev) => {
      const open = !prev;

      if (open) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }

      return open;
    });
  }

  return (
    <>
      <ThemeScripts />
      <Scripts />
      <section className="fixed z-10 inset-x-0 top-0 bg-background-dark/90 backdrop-blur">
        <Header onMenuToggle={toggleSidebar} />
        <Tabs onMenuToggle={toggleSidebar} />
      </section>
      <div className="max-w-8xl mx-auto px-5">
        <section
          className={cn(
            "fixed w-[17rem] bottom-0 overflow-y-auto translate-x-[-19rem] lg:translate-x-0 transition-transform",
            {
              "top-16": !hasTabs,
              "top-28": hasTabs,
              "translate-x-0 top-0 z-20 bg-background border-r border-black/10 dark:border-white/10":
                sidebar,
            },
          )}
        >
          <Sidebar onMenuToggle={toggleSidebar} />
        </section>
        <div
          className={cn("relative lg:pl-[17rem]", {
            "pt-16": !hasTabs,
            "pt-28": hasTabs,
          })}
        >
          <div
            role="button"
            className={cn(
              "bg-background/50 z-10 absolute inset-0 lg:opacity-0 transition-opacity",
              {
                "pointer-events-none opacity-0": !sidebar,
                "pointer-events-auto opacity-100": sidebar,
              },
            )}
            onClick={() => toggleSidebar()}
            onKeyDown={() => toggleSidebar()}
          />
          <section className="pt-8 ps-4 lg:ps-16 pe-4 flex">
            <div className="min-w-0 flex-1 pr-0 xl:pr-12">
              <Content />
              <Edit />
              <PreviousNext />
              <div className="h-px bg-black/5 dark:bg-white/5 my-12" />
              <Footer />
            </div>
            <div className="hidden xl:block relative lg:w-[17rem]">
              <TableOfContents />
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
