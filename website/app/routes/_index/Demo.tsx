import { useRef } from "react";
import { cn } from "~/utils";

export function Demo() {
  const video = useRef<HTMLVideoElement>(null);

  return (
    <section className="max-w-5xl mx-auto pt-12">
      <div className="flex items-center justify-center mb-12">
        <Step start>1. Install</Step>
        <Step>2. Edit</Step>
        <Step>3. Preview</Step>
        <Step>4. Review</Step>
        <Step end>5. Collaborate</Step>
      </div>
      <div className="outline outline-[12px] outline-white/5 rounded-md bg-black">
        {/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
        <video ref={video} controls preload="metadata" className="w-full">
          <source src="/install-step.mp4#t=0.1" type="video/mp4" />
        </video>
      </div>
    </section>
  );
}

type Props = {
  children: string;
  start?: boolean;
  end?: boolean;
};

function Step(props: Props) {
  return (
    <div
      className={cn(
        "flex justify-center overflow-hidden relative border-brand-500/20 border-y py-1 bg-brand-900 hover:font-semibold w-40 transform skew-[-30deg)",
        {
          "border-l rounded-l-md": props.start,
          "border-r rounded-r-md": props.end,
          // "after:absolute after:size-8 after:border-brand-500/20 after:border-r after:border-b after:-rotate-45 after:right-2 after:-top-[-1px] after:rounded":
          //   !props.end,
        }
      )}
    >
      <span className="relative -left-2">{props.children}</span>
    </div>
  );
}
