"use client";

import { useDocPageContext } from "@/hooks/use-doc-page-context";
import { getSearchIndexPathname } from "@/lib/docs-paths";
import { prewarmSearch } from "@/lib/search-client";
import { RiSearch2Line } from "@remixicon/react";
import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Button } from "./ui/button";
import { Kbd } from "./ui/kbd";

const SearchDialog = dynamic(() => import("./search-dialog"), {
  ssr: false,
});

export function Search() {
  const { route } = useDocPageContext();
  const searchUrl = useMemo(() => getSearchIndexPathname(route), [route]);
  const [open, setOpen] = useState(false);
  const isPreview = route.requestMode === "preview";

  const warm = useCallback(() => prewarmSearch(searchUrl), [searchUrl]);

  useHotkeys(
    "mod+k",
    (event) => {
      event.preventDefault();
      warm();
      setOpen((open) => !open);
    },
    { enableOnFormTags: true },
  );

  if (isPreview) {
    return null;
  }

  return (
    <>
      <div>
        <Button
          variant="outline"
          aria-label="Search"
          className="gap-2"
          onClick={() => setOpen(!open)}
        >
          <RiSearch2Line />
          <Kbd className="hidden md:block h-[17px]">⌘K</Kbd>
        </Button>
      </div>
      {open ? (
        <SearchDialog
          open={open}
          onOpenChange={setOpen}
          searchUrl={searchUrl}
        />
      ) : null}
    </>
  );
}
