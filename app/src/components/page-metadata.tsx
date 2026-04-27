import {
  RiArrowDownLine,
  RiArrowDownSLine,
  RiFileCopyLine,
} from "@remixicon/react";
import { useDocPageContext } from "@/hooks/use-doc-page-context";
import { useDocTabs } from "@/hooks/use-doc-tabs";
import { docsContentTopPaddingClassName } from "@/lib/docs-layout";
import { resolveActiveTabId } from "@/lib/docs-routing";
import { getActiveTopLevelSidebarGroupLabel } from "@/lib/docs-sidebar";
import { cn } from "@/lib/utils";
import { ActionMenu } from "./action-menu";
import { Heading } from "./mdx/heading";
import { Image } from "./mdx/image";
import { Button } from "./ui/button";
import { ButtonGroup } from "./ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { SidebarGroupLabel } from "./ui/sidebar";

export function PageMetadata() {
  const { bundle, route } = useDocPageContext();
  const tabs = useDocTabs();
  const hasTabs = tabs.length > 0;
  const activeTabId = resolveActiveTabId(route, tabs, bundle.config.locales);
  const sectionLabel = getActiveTopLevelSidebarGroupLabel(
    route,
    bundle.config,
    bundle.config.locales,
    hasTabs,
    activeTabId,
  );

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

  const title =
    typeof bundle.frontmatter.title === "string"
      ? bundle.frontmatter.title
      : null;
  const description = bundle.frontmatter.description;
  const image = bundle.frontmatter.image;

  const showMeta = showPageTitle || showPageImage;

  const hasSectionLabel = sectionLabel != null && sectionLabel !== "";

  return (
    <div className={cn("flex flex-col gap-4", docsContentTopPaddingClassName)}>
      <div className="flex flex-col gap-2">
        {hasSectionLabel ? (
          <div className="flex h-8 w-full min-w-0 max-w-full shrink-0 items-center justify-between gap-4">
            <SidebarGroupLabel className="min-w-0 flex-1 font-light opacity-50 pl-0 pr-2">
              {sectionLabel}
            </SidebarGroupLabel>
            <div className="flex h-8 shrink-0 items-center">
              <ActionMenu />
            </div>
          </div>
        ) : null}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            {showMeta && title && <Heading type="h1">{title}</Heading>}
          </div>
          {!hasSectionLabel ? <ActionMenu /> : null}
        </div>
      </div>
      {showMeta && !!description && (
        <p className="text-lg font-light opacity-70">{String(description)}</p>
      )}
      {showMeta && !!image && showPageImage && (
        <Image zoom={false} src={String(image)} />
      )}
    </div>
  );
}
