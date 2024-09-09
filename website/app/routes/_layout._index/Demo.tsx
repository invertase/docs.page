import { useRef } from "react";
import { cn } from "~/utils";

export function Demo() {
  const video = useRef<HTMLVideoElement>(null);

  return (
    <section className="max-w-5xl mx-auto pt-12 px-4">
      <div className="outline outline-[6px] md:outline-[12px] outline-white/5 rounded-md bg-black">
        {/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
        <video
          ref={video}
          controls
          preload="metadata"
          className="w-full rounded-xl"
        >
          <source src="/docs-page-hero-video.webm#t=1" type="video/webm" />
        </video>
      </div>
    </section>
  );
}
