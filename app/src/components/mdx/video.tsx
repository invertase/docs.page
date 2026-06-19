import type { ComponentProps } from "react";
import { useDocPageContext } from "@/hooks/use-doc-page-context";
import { getAssetSrc } from "@/lib/docs-assets";
import { cn } from "@/lib/utils";

type VideoProps = Omit<ComponentProps<"video">, "src"> & {
  src?: string;
  type?: string;
};

export function Video({
  src,
  type,
  className,
  controls = true,
  title = "Video",
  ...props
}: VideoProps) {
  const ctx = useDocPageContext();

  if (!src) {
    return null;
  }

  const videoSrc = getAssetSrc(ctx.bundle, String(src));

  return (
    <video
      {...props}
      controls={controls}
      title={title}
      className={cn(
        "aspect-video w-full rounded-md overflow-hidden",
        className,
      )}
    >
      <source src={videoSrc} type={type} />
    </video>
  );
}
