import { BookTextIcon, LockIcon } from "lucide-react";

export function Platform() {
  return (
    <section className="max-w-5xl mx-auto py-32 space-y-6">
      <p className="flex items-center justify-center gap-3 text-brand-50">
        <BookTextIcon size={18} />
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
            <img src="/manage.png" alt="" className="mx-auto" />
          </PlatformCard>
          <PlatformCard
            title="Publish Instantly"
            description="Create fully managed documentation sites in seconds, without complex setup."
          />
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
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-6 justify-around gap-3 mt-3">
          <div className="hidden lg:block col-start-2 col-end-4">
            <PlatformCard
              title="Beautiful by Design"
              description="Publish visually stunning, responsive documentation sites straight out of the box."
            >
              <div className="relative border border-brand-300/20 rounded-md">
                <div className="absolute inset-0 bg-gradient-to-t from-black/40" />
                <img src="/image-2.png" alt="Platform" className="rounded-md" />
              </div>
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
    <div className="bg-gradient-to-b from-brand-100/5 rounded-xl border border-white/5 max-w-[400px] mx-auto md:mx-auto">
      <div className="h-[200px] p-3">{props.children}</div>
      <div className="text-center px-3 py-6 space-y-3">
        <h4>{props.title}</h4>
        <p className="text-brand-50 text-sm">{props.description}</p>
      </div>
    </div>
  );
}

function Preview() {
  return (
    <div className="select-none bg-black rounded-md border border-brand-300/20">
      <div className="flex items-center gap-1 px-2 pb-1 pt-2">
        <div className="bg-red-500 rounded-full size-2" />
        <div className="bg-yellow-500 rounded-full size-2" />
        <div className="bg-green-500 rounded-full size-2" />
      </div>
      <div className="p-2">
        <div className="flex items-center gap-2 bg-brand-950 rounded-full px-2 py-px">
          <LockIcon size={13} className="text-green-500" />
          <span className="text-brand-50 text-[12px] relative top-px">
            https://docs.page/preview
          </span>
        </div>
        <div className="mt-2 border rounded border-brand-900 p-1">
          <div className="flex items-center gap-2">
            <div className="rounded-full size-3 bg-brand-700" />
            <div className="w-6 h-1 bg-brand-950" />
            <div className="grow flex justify-end gap-2">
              <div className="w-6 h-1 bg-brand-950" />
              <div className="w-6 h-1 bg-brand-950" />
            </div>
          </div>
          <div className="flex mt-2">
            <div className="w-[40px] space-y-1">
              <div className="w-6 h-1 bg-brand-950 opacity-75" />
              <div className="w-9 h-1 bg-brand-950" />
              <div className="w-10 h-1 bg-brand-950" />
              <div className="w-5 h-1 bg-brand-950" />
              <div className="w-9 w h-1 bg-brand-950" />
              <div className="h-1" />
              <div className="w-6 h-1 bg-brand-950 opacity-75" />
              <div className="w-9 h-1 bg-brand-950" />
              <div className="w-7 h-1 bg-brand-950" />
              <div className="w-10 h-1 bg-brand-950" />
              <div className="w-6 h-1 bg-brand-950" />
              <div className="h-1" />
              <div className="h-1" />
            </div>
            <div className="grow px-8 ">
              <p className="text-[9px] mb-1">Getting Started</p>
              <div className="text-[4px] space-y-1">
                <p>
                  docs.page reads files directly from your GitHub repository and
                  uses them to generate a documentation website. This guide will
                  walk you through the steps to get started with docs.page.
                </p>
                <p>
                  There are two core principles to keep in mind when working
                  with docs.page:
                </p>
                <ul className="list-disc pl-3">
                  <li>
                    Every project requires a docs.json file at the root of the
                    project.
                  </li>
                  <li>
                    All documentation files are stored in a docs directory as
                    .mdx files.
                  </li>
                </ul>
              </div>
              <p className="text-[7px] mt-2">Quick Start</p>
              <p className="text-[4px]">
                To get started, either use the CLI tool or manually create the
                required files.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Customize() {
  return (
    <div>
      <pre className="select-none bg-gradient-to-b from-black/70 p-3 rounded-md text-sm border-t border-brand-300/20">
        <code>
          <div>{"{"}</div>
          <div>
            {"  "}
            <span className="text-brand-400">"name"</span>
            <span>{": "}</span>
            <span>"API Docs",</span>
          </div>
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
