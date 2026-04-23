"use client";

import dynamic from "next/dynamic";
import { RiSearch2Line } from "@remixicon/react";
import { useHotkeys } from "react-hotkeys-hook";
import { useCallback, useMemo, useState } from "react";
import { useDocPageContext } from "@/hooks/use-doc-page-context";
import { prewarmSearch } from "@/lib/search-client";
import { Kbd } from "./ui/kbd";
import { Button } from "./ui/button";

const SearchDialog = dynamic(() => import("./search-dialog"), {
  ssr: false,
});

export function Search() {
  const { route } = useDocPageContext();
  // TODO: This probably needs to work for custom domains + vanity domains
  const searchUrl = useMemo(
    () => `/${route.owner}/${route.repository}/search.json`,
    [route.owner, route.repository],
  );
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
