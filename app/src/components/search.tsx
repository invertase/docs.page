"use client";

import { RiSearch2Line } from "@remixicon/react";
import { useHotkeys } from "react-hotkeys-hook";
import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";
import { useDocPageContext } from "@/hooks/use-doc-page-context";
import { prewarmSearch } from "@/lib/search-client";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { Kbd } from "./ui/kbd";

const SearchDialog = dynamic(() => import("./search-dialog"), {
  ssr: false,
});

export function Search() {
  const { route } = useDocPageContext();
  const searchUrl = useMemo(
    () => `/${route.owner}/${route.repository}/search.json`,
    [route.owner, route.repository],
  );
  const [open, setOpen] = useState(false);

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

  return (
    <>
      <div className="">
        <InputGroup
          className="w-20"
          role="button"
          onClick={() => setOpen(true)}
          onMouseEnter={warm}
          onFocus={warm}
        >
          <InputGroupInput readOnly />
          <InputGroupAddon>
            <RiSearch2Line className="text-foreground" />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <Kbd>⌘K</Kbd>
          </InputGroupAddon>
        </InputGroup>
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
