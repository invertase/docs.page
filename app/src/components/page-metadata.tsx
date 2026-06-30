import { useDocPageContext } from "@/hooks/use-doc-page-context";
import { ActionMenu } from "./action-menu";
import { Heading } from "./mdx/heading";
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

  const title =
    typeof bundle.frontmatter.title === "string"
      ? bundle.frontmatter.title
      : null;
  const description = bundle.frontmatter.description;
  const image = bundle.frontmatter.image;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          {showPageTitle && title && <Heading type="h1">{title}</Heading>}
        </div>
        <ActionMenu />
      </div>
      {showPageTitle && !!description && (
        <p className="text-lg text-muted-foreground">{String(description)}</p>
      )}
      {showPageImage && !!image && <Image zoom={false} src={String(image)} />}
    </div>
  );
}
