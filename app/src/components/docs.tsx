import { Header } from "./header";
import { Navigation } from "./navigation";
import { Prose } from "./prose";
import { TableOfContents } from "./table-of-contents";

export function Docs() {
  return (
    <>
      <Header />
      <div className="relative mx-auto flex min-h-0 w-full max-w-8xl flex-1 flex-row">
        <Navigation />
        <div className="min-w-0 flex-1 pl-4 flex">
          <div className="min-w-0 flex-1 pt-8 ps-4 pe-4 lg:ps-16 lg:pe-16 xl:pe-4">
            <Prose />
          </div>
          <div className="hidden xl:block relative shrink-0 lg:w-68">
            <TableOfContents />
          </div>
        </div>
      </div>
    </>
  );
}
