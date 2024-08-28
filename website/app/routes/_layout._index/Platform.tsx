import { BookTextIcon, LockIcon } from "lucide-react";

export function Platform() {
  return (
    <section className="max-w-5xl mx-auto py-20 space-y-6">
      <p className="md:flex text-center items-center justify-center gap-3 text-brand-50">
        <BookTextIcon size={18} className="mb-3 mx-auto md:m-0" />
        <span>The documentation platform for open-source developers</span>
      </p>
      <h3 className="text-brand-100 text-4xl md:text-5xl !leading-[3.5rem] text-center">
        Documentation, made simple
      </h3>
      <p className="text-brand-100 font-light text-center">
        The easiest way to maintain open-source documentation
      </p>
      <div className="px-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <PlatformCard
            title="Manage Docs as Code"
            description="Manage docs like your codebase, with branching, version
            control, reviews, and testing."
          >
            <Manage />
          </PlatformCard>
          <PlatformCard
            title="Publish Instantly"
            description="Create fully managed documentation sites in seconds, without complex setup."
          >
            <Publish />
          </PlatformCard>
          <PlatformCard
            title="Collaborate with Live Preview"
            description="Write in Markdown and see your changes in real-time. Share previews easily for feedback."
          >
            <Preview />
          </PlatformCard>
          <div className="lg:hidden">
            <PlatformCard
              title="Beautiful by Design"
              description="Publish visually stunning, responsive documentation sites straight out of the box."
            >
              <BeautifulByDesign />
            </PlatformCard>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-6 justify-around gap-3 mt-3">
          <div className="hidden lg:block col-start-2 col-end-4">
            <PlatformCard
              title="Beautiful by Design"
              description="Publish visually stunning, responsive documentation sites straight out of the box."
            >
              <BeautifulByDesign />
            </PlatformCard>
          </div>
          <div className="col-start-1 col-end-4 lg:col-start-4 lg:col-end-6">
            <PlatformCard
              title="Customise and Theme"
              description="Add rich, interactive components, use custom domains, and tailor to match your brand."
            >
              <Customize />
            </PlatformCard>
          </div>
        </div>
      </div>
    </section>
  );
}

type PlatformCardProps = {
  title: string;
  description: string;
  children?: React.ReactNode;
};

function PlatformCard(props: PlatformCardProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-brand-1000 to-brand-1000/50 rounded-xl border border-white/5 max-w-[400px] mx-auto md:mx-auto">
      <div className="h-[200px]">{props.children}</div>
      <div className="text-center px-3 py-6 space-y-3">
        <h4>{props.title}</h4>
        <p className="text-brand-50 text-sm">{props.description}</p>
      </div>
    </div>
  );
}

function Manage() {
  return (
    <img
      src="/assets/manage-docs-as-code.png?v=1"
      alt="Manage Docs as Code"
      className="absolute inset-x-0 top-[10px]"
    />
  );
}

function BeautifulByDesign() {
  return (
    <img
      src="/assets/beautiful-by-design.png?v=1"
      alt="Publish Instantly"
      className="absolute inset-x-0 top-2"
    />
  );
}

function Preview() {
  return (
    <img
      src="/assets/collaborate-with-live-preview.png?v=1"
      alt="Publish Instantly"
      className="absolute inset-0 top-2 scale-95"
    />
  );
}

function Publish() {
  return (
    <img
      src="/assets/publish-instantly.png?v=1"
      alt="Publish Instantly"
      className="absolute inset-x-0 top-[-50px] scale-[1.15]"
    />
  );
}

function Customize() {
  return (
    <img src="/assets/customise-and-theme.png?v=1" alt="Publish Instantly" />
  );
}
