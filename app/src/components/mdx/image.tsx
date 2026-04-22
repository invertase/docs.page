import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type ImageProps = {
  src?: unknown;
  alt?: unknown;
  zoom?: unknown;
  className?: string;
};

export function Image({ src, alt, zoom, className }: ImageProps) {
  const imageSrc = typeof src === "string" ? src : "";
  const imageAlt = typeof alt === "string" ? alt : "";
  const isZoomEnabled = coerceBooleanProp(zoom);

  if (!imageSrc) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
        Invalid Image component: missing <code>src</code>.
      </div>
    );
  }

  const image = (
    <img
      src={imageSrc}
      alt={imageAlt}
      loading="lazy"
      className={cn(
        "my-6 w-full rounded-xl border border-border bg-card object-cover shadow-sm",
        isZoomEnabled && "cursor-zoom-in transition-opacity hover:opacity-95",
        className,
      )}
    />
  );

  if (!isZoomEnabled) {
    return image;
  }

  return (
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
  );
}

function coerceBooleanProp(value: unknown) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return (
      normalized === "" ||
      normalized === "true" ||
      normalized === "1" ||
      normalized === "yes"
    );
  }

  return false;
}