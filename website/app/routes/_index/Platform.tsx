import { BookTextIcon } from "lucide-react";

export function Platform() {
  return (
    <section className="max-w-5xl mx-auto py-32 space-y-6">
      <p className="flex items-center justify-center gap-3 text-brand-100">
        <BookTextIcon size={18} />
        <span>The documentation platform for open-source developers</span>
      </p>
      <h3 className="text-brand-100 text-5xl text-center leading-[3.5rem]">
        Documentation, made simple
      </h3>
      <p className="text-brand-100 font-light text-center">
        The easiest way to maintain open-source documentation
      </p>
      <div>
        <div className="grid grid-cols-3 gap-3">
          <PlatformCard
            title="Manage Docs as Code"
            description="Manage docs like your codebase, with branching, version
            control, reviews, and testing."
          />
          <PlatformCard
            title="Publish Instantly"
            description="Create fully managed documentation sites in seconds, without complex setup."
          />
          <PlatformCard
            title="Collaborate with Live Preview"
            description="Write in Markdown and see your changes in real-time. Share previews easily for feedback."
          />
        </div>
        <div className="grid grid-cols-6 justify-around gap-3 mt-3">
          <div className="col-start-2 col-end-4">
            <PlatformCard
              title="Beautiful by Design"
              description="Publish visually stunning, responsive documentation sites straight out of the box."
            />
          </div>
          <div className="col-start-4 col-end-6">
            <PlatformCard
              title="Customise and Theme"
              description="Add rich, interactive components, use custom domains, and tailor to match your brand."
            />
          </div>
        </div>
      </div>
    </section>
  );
}

type PlatformCardProps = {
  title: string;
  description: string;
};

function PlatformCard(props: PlatformCardProps) {
  return (
    <div className="bg-gradient-to-b from-brand-100/5 rounded-xl border border-white/5">
      <div className="h-[200px]" />
      <div className="text-center px-3 py-6 space-y-3">
        <h4>{props.title}</h4>
        <p className="text-brand-50 text-xs">{props.description}</p>
      </div>
    </div>
  );
}
