import Image, { type StaticImageData } from "next/image";

import { cn } from "@/lib/utils";

import type { FeatureMediaGlowPosition } from "./features-data";
import styles from "./homepage.module.css";

const MEDIA_GLOW_POSITION_CLASS: Record<
  FeatureMediaGlowPosition,
  string | undefined
> = {
  gitPublishing: styles.homepageFeatureMediaGlowGitPublishing,
};

/** Video / theme picker — slight bleed past column width. */
export const FEATURE_MEDIA_FRAME_CLASS =
  "relative mx-auto w-[155%] max-w-full";

/** Static screenshots — stay inside column; no radius (avoids clipping mockup corners). */
export const FEATURE_MEDIA_IMAGE_FRAME_CLASS =
  "relative mx-auto w-full max-w-full overflow-visible";

/** Horizontal inset for feature media columns (wider asset + right gutter). */
export const FEATURE_MEDIA_PADDING_CLASS =
  "px-4 sm:px-6 lg:pl-2 lg:pr-12";

type FeatureSectionMediaProps = {
  alt: string;
  image: StaticImageData;
  video?: string;
  className?: string;
  mediaEnlarged?: boolean;
  mediaGlowPosition?: FeatureMediaGlowPosition;
};

export function FeatureSectionMedia({
  alt,
  image,
  video,
  className,
  mediaEnlarged,
  mediaGlowPosition,
}: FeatureSectionMediaProps) {
  return (
    <div
      className={cn(
        styles.homepageFeatureMediaGlow,
        video
          ? styles.homepageFeatureMediaGlowVideo
          : styles.homepageFeatureMediaGlowImage,
        mediaEnlarged && styles.homepageFeatureMediaGlowSubtle,
        mediaGlowPosition && MEDIA_GLOW_POSITION_CLASS[mediaGlowPosition],
        "relative flex w-full justify-center overflow-visible",
        FEATURE_MEDIA_PADDING_CLASS,
        className,
      )}
    >
      <div
        className={video ? FEATURE_MEDIA_FRAME_CLASS : FEATURE_MEDIA_IMAGE_FRAME_CLASS}
      >
        {video ? (
          <div className="relative w-full overflow-hidden rounded-lg border border-neutral-700 shadow-lg">
            <video
              src={video}
              poster={image.src}
              autoPlay
              loop
              muted
              playsInline
              aria-label={alt}
              className="relative z-1 h-auto w-full object-cover"
            />
          </div>
        ) : (
          <Image
            src={image}
            alt={alt}
            sizes="(max-width: 1023px) 100vw, 58vw"
            className="relative z-1 block h-auto w-full max-w-full object-contain shadow-lg"
          />
        )}
      </div>
    </div>
  );
}
