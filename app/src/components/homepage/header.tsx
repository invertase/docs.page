import { RiArrowRightSLine, RiGithubLine } from "@remixicon/react";
import Link from "next/link";
import { Button } from "../ui/button";

export function Header() {
  return (
    <header className="border-x border-b py-4 px-4 sm:px-6 flex items-center">
      <Link href="/" className="inline-flex min-w-0 items-center gap-3">
        <img
          src="/_docs.page/logo.svg"
          alt="Logo"
          className="h-7 w-auto shrink-0"
        />
      </Link>
      <div className="flex-1 flex items-center justify-end gap-3">
        <Button asChild variant="outline">
          <Link href="https://use.docs.page">
            <RiGithubLine />
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="https://use.docs.page">
            <span>Docs</span>
            <RiArrowRightSLine />
          </Link>
        </Button>
      </div>
    </header>
  );
}
