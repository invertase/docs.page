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
            <img
              src="/assets/manage-docs-as-code.png"
              alt="Manage Docs as Code"
              className="absolute inset-x-0 top-[-40px]"
            />
          </PlatformCard>
          <PlatformCard
            title="Publish Instantly"
            description="Create fully managed documentation sites in seconds, without complex setup."
          >
            <img
              src="/assets/publish-instantly.png"
              alt="Publish Instantly"
              className="absolute inset-x-0 top-[-50px] scale-[1.15]"
            />
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
    <div className="relative overflow-hidden bg-gradient-to-b from-brand-100/5 rounded-xl border border-white/5 max-w-[400px] mx-auto md:mx-auto">
      <div className="h-[200px]">{props.children}</div>
      <div className="text-center px-3 py-6 space-y-3">
        <h4>{props.title}</h4>
        <p className="text-brand-50 text-sm">{props.description}</p>
      </div>
    </div>
  );
}

function BeautifulByDesign() {
  return (
    <img
      src="/assets/beautiful-by-design.png"
      alt="Publish Instantly"
      className="absolute inset-x-0 top-0 opacity-g0"
    />
  );
}

function Preview() {
  return <div />;
}

function Customize() {
  return (
    <div
      style={
        {
          // background: "radial-gradient(#201B03, transparent)",
        }
      }
    >
      <pre className="select-none p-6 rounded-md text-xs">
        <code>
          <div>{"{"}</div>
          <div>
            {"  "}
            <span className="text-brand-400">"logo"</span>
            <span>{": {"}</span>
          </div>
          <div>
            {"    "}
            <span className="text-brand-400">"light"</span>
            <span>{": "}</span>
            <span>"/assets/logo.png",</span>
          </div>
          <div>
            {"    "}
            <span className="text-brand-400">"dark"</span>
            <span>{": "}</span>
            <span>"/assets/logo-dark.png"</span>
          </div>
          <div>{"  },"}</div>
          <div>
            {"  "}
            <span className="text-brand-400">"theme"</span>
            <span>{": {"}</span>
          </div>
          <div>
            {"    "}
            <span className="text-brand-400">"defaultTheme"</span>
            <span>{": "}</span>
            <span>"dark",</span>
          </div>
          <div>
            {"    "}
            <span className="text-brand-400">"primary"</span>
            <span>{": "}</span>
            <span>{'"'}</span>
            <span className="bg-[#FF5722]">#FF5722</span>
            <span>{'"'}</span>
            <span>{","}</span>
          </div>
          <div>
            {"    "}
            <span className="text-brand-400">"primaryDark"</span>
            <span>{": "}</span>
            <span>{'"'}</span>
            <span className="bg-[#E64A19]">#E64A19</span>
            <span>{'"'}</span>
          </div>
          <div>{"  }"}</div>
          <div>{"}"}</div>
        </code>
      </pre>
    </div>
  );
}
