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

/** Shared with theme picker so stacked media widths match. */
export const FEATURE_MEDIA_FRAME_CLASS =
  "relative mx-auto w-[90%] max-w-full";

type FeatureSectionMediaProps = {
  alt: string;
  image: StaticImageData;
  video?: string;
  className?: string;
  mediaEnlarged?: boolean;
  mediaGlowPosition?: FeatureMediaGlowPosition;
};

/** Matches `ModernInterfaceThemePicker` preset preview frame. */
const VIDEO_FRAME_CLASS =
  "relative w-full overflow-hidden rounded-lg border border-neutral-700 shadow-lg";

const imageClassName =
  "relative z-1 h-auto w-full rounded-xl object-cover shadow-lg";

const videoClassName = "relative z-1 h-auto w-full object-cover";

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
        "relative flex w-full justify-center px-4 sm:px-6 lg:px-0",
        className,
      )}
    >
      <div className={FEATURE_MEDIA_FRAME_CLASS}>
        {video ? (
          <div className={VIDEO_FRAME_CLASS}>
            <video
              src={video}
              poster={image.src}
              autoPlay
              loop
              muted
              playsInline
              aria-label={alt}
              className={videoClassName}
            />
          </div>
        ) : (
          <Image
            src={image}
            alt={alt}
            sizes="(max-width: 1023px) 90vw, 50vw"
            className={cn(
              imageClassName,
              mediaEnlarged && "origin-top lg:scale-[1.1]",
            )}
          />
        )}
      </div>
    </div>
  );
}
