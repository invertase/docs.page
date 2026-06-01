import { useDocPageContext } from "@/hooks/use-doc-page-context";
import { getAssetSrc } from "@/lib/docs-assets";
import type { ComponentProps, ReactElement } from "react";
import Zoom from "react-medium-image-zoom";

import "react-medium-image-zoom/dist/styles.css";
import { cn } from "@/lib/utils";

type ImageProps = ComponentProps<"img"> & {
  zoom?: boolean;
  caption?: string;
  theme?: "light" | "dark";
};

export function Image(props: ImageProps) {
  const ctx = useDocPageContext();
  const { width, height, className, alt, zoom, ...other } = props;
  const src = getAssetSrc(ctx.bundle, props.src ? String(props.src) : "");

  const shouldZoom =
    props.zoom === false
      ? false
      : Boolean(zoom) || Boolean(ctx.bundle.config.content?.zoomImages);

  // Wrap the image in a zoom container if zoom is enabled.
  const container = (child: ReactElement) => {
    return shouldZoom ? (
      <Zoom classDialog="!bg-background">{child}</Zoom>
    ) : (
      child
    );
  };

  return (
    <figure
      className={cn("", {
        "hidden dark:block": props.theme === "dark",
        "dark:hidden": props.theme === "light",
      })}
    >
      {container(
        <img
          {...other}
          data-zoom={`${shouldZoom}`}
          alt={alt ?? ""}
          src={src}
          loading="lazy"
          className={cn("mx-auto rounded-lg", className, {
            "mb-1": props.caption,
          })}
          style={{
            width: width ? Number.parseInt(width.toString()) : "inherit",
            height: height ? Number.parseInt(height.toString()) : "inherit",
          }}
        />,
      )}
      {!!props.caption && (
        <figcaption className="text-center text-muted-foreground text-sm pt-2">
          {props.caption}
        </figcaption>
      )}
    </figure>
  );
}
