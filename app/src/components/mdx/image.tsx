import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useDocPageContext } from "@/hooks/use-doc-page-context";
import { cn } from "@/lib/utils";

type ImageProps = {
  src?: unknown;
  alt?: unknown;
  zoom?: unknown;
  caption?: unknown;
  theme?: unknown;
  width?: unknown;
  height?: unknown;
  className?: string;
};

export function Image({
  src,
  alt,
  zoom,
  caption,
  theme,
  width,
  height,
  className,
}: ImageProps) {
  const { bundle } = useDocPageContext();
  const defaultZoom = Boolean(bundle.config.content?.zoomImages);
  const imageSrc = typeof src === "string" ? src : "";
  const imageAlt = typeof alt === "string" ? alt : "";
  const imageCaption = typeof caption === "string" ? caption : "";
  const themeVariant = normalizeTheme(theme);
  const isZoomEnabled = resolveZoomState(zoom, defaultZoom);

  const image = (
    <img
      src={imageSrc}
      alt={imageAlt}
      loading="lazy"
      data-zoom={`${isZoomEnabled}`}
      className={cn(
        "mx-auto rounded-md",
        isZoomEnabled && "cursor-zoom-in transition-opacity hover:opacity-95",
        imageCaption && "mb-1",
        className,
      )}
      style={{
        width: toImageDimension(width),
        height: toImageDimension(height),
      }}
    />
  );

  if (!isZoomEnabled) {
    return (
      <figure
        className={cn("mb-6", {
          "hidden dark:block": themeVariant === "dark",
          "dark:hidden": themeVariant === "light",
        })}
      >
        {image}
        {Boolean(imageCaption) && (
          <figcaption className="text-center">{imageCaption}</figcaption>
        )}
      </figure>
    );
  }

  return (
    <figure
      className={cn("mb-6", {
        "hidden dark:block": themeVariant === "dark",
        "dark:hidden": themeVariant === "light",
      })}
    >
      <Dialog>
        <DialogTrigger asChild>
          <button type="button" className="block w-full text-left">
            {image}
          </button>
        </DialogTrigger>
        <DialogContent
          className="max-w-6xl border-none bg-transparent p-0 shadow-none ring-0"
          showCloseButton={false}
        >
          <img
            src={imageSrc}
            alt={imageAlt}
            className="max-h-[85vh] w-full rounded-xl object-contain"
          />
        </DialogContent>
      </Dialog>
      {Boolean(imageCaption) && (
        <figcaption className="text-center">{imageCaption}</figcaption>
      )}
    </figure>
  );
}

function resolveZoomState(value: unknown, defaultZoom: boolean) {
  const parsedValue = parseBooleanish(value);
  if (parsedValue === undefined) {
    return defaultZoom;
  }
  return parsedValue;
}

function parseBooleanish(value: unknown) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (
      normalized === "" ||
      normalized === "true" ||
      normalized === "1" ||
      normalized === "yes"
    ) {
      return true;
    }
    if (normalized === "false" || normalized === "0" || normalized === "no") {
      return false;
    }
  }

  return undefined;
}

function normalizeTheme(value: unknown) {
  if (value === "light" || value === "dark") {
    return value;
  }
  return undefined;
}

function toImageDimension(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return "inherit";
}
