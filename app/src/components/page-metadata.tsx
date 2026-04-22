import { useDocPageContext } from "@/hooks/use-doc-page-context";
import { Heading } from "./mdx/heading";
import { Button } from "./ui/button";
import { ButtonGroup } from "./ui/button-group";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { RiArrowDownLine, RiArrowDownSLine, RiFileCopyLine } from "@remixicon/react";
import { ActionMenu } from "./action-menu";
import { Image } from "./mdx/image";

export function PageMetadata() {
  const { bundle } = useDocPageContext();

  const showPageTitle =
    bundle.frontmatter.showPageTitle === false
      ? false
      : Boolean(bundle.frontmatter.showPageTitle) ||
        Boolean(bundle.config.content?.showPageTitle) ||
        false;

  const showPageImage =
    bundle.frontmatter.showPageImage === false
      ? false
      : Boolean(bundle.frontmatter.showPageImage) ||
        Boolean(bundle.config.content?.showPageImage) ||
        false;

  const title = typeof bundle.frontmatter.title === "string" ? bundle.frontmatter.title : null;
  const description = bundle.frontmatter.description;
  const image = bundle.frontmatter.image;

  const showMeta = showPageTitle || showPageImage;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          {showMeta && title && (
            <Heading type="h1">
              {title}
            </Heading>
          )}
        </div>
        <ActionMenu />
      </div>
      {showMeta && !!description && (
        <p className="text-lg">{String(description)}</p>
      )}
      {showMeta && !!image && showPageImage && <Image zoom={false} src={String(image)} />}
    </div>
  );
}

