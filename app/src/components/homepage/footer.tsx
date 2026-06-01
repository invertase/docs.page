import { RiArrowRightSLine } from "@remixicon/react";
import { Button } from "../ui/button";

export function Footer() {
  return (
    <>
      <div className="grid grid-cols-2 border-x px-20 py-32">
        <div className="space-y-8">
          <h3 className="text-5xl leading-[65px] font-heading font-light tracking-loose">
            Bring your docs <br /> into the <b>agentic</b> age
          </h3>

          <Button variant="default" size="lg">
            Get started <RiArrowRightSLine className="size-5" />
          </Button>
        </div>
        <div className="flex items-center justify-center">
          <img
            src="/_docs.page/logo-icon.svg"
            alt="Logo"
            className="h-[300px] w-auto"
          />
        </div>
      </div>
      <footer className="border-x border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 p-6">
            <img src="/_docs.page/logo.svg" alt="Logo" className="h-8 w-auto" />
          </div>
        </div>
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <a
              href="https://invertase.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-neutral-400 hover:text-foreground"
            >
              Built by Invertase
            </a>
          </div>
          <div>
            <div className="text-sm text-neutral-400">
              &copy; {new Date().getFullYear()} Invertase
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
