import type { ComponentProps, ReactElement } from "react";
import Zoom from "react-medium-image-zoom";
import { useAssetSrc, usePageContext } from "~/context";
import { cn } from "~/utils";

type ImageProps = ComponentProps<"img"> & {
	zoom?: boolean;
	caption?: string;
};

export function Image(props: ImageProps) {
	const ctx = usePageContext();
	const { width, height, className, alt, ...other } = props;
	const src = useAssetSrc(props.src ?? "");

	// Get the zoom configuration from the props or the bundle content.
	const zoom =
		props.zoom === false
			? false
			: Boolean(props.zoom) || Boolean(ctx.bundle.config.content?.zoomImages);

	// Wrap the image in a zoom container if zoom is enabled.
	const container = (child: ReactElement) => {
		return zoom ? <Zoom classDialog="!bg-background">{child}</Zoom> : child;
	};

	return (
		<figure>
			{container(
				<img
					{...other}
					data-zoom={`${zoom}`}
					alt={alt ?? ""}
					src={src}
					loading="lazy"
					className={cn("mx-auto rounded-md", className, {
						"mb-1": props.caption,
					})}
					style={{
						width: width ? Number.parseInt(width.toString()) : "inherit",
						height: height ? Number.parseInt(height.toString()) : "inherit",
					}}
				/>,
			)}
			{!!props.caption && (
				<figcaption className="text-center">{props.caption}</figcaption>
			)}
		</figure>
	);
}
