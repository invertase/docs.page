import { ChevronRightIcon } from "lucide-react";

export function Hero() {
  return (
    <section className="max-w-3xl mx-auto pt-20 px-3 space-y-6">
      <h1 className="text-center text-6xl font-bold leading-[70px] text-brand-50 drop-shadow-md">
        Ship documentation,
        <br />
        like you ship code
      </h1>
      <h2 className="text-center text-brand-100">
        Meet the docs as code playform made for open-source developers.
      </h2>
      <p className="text-center text-brand-100 font-light">
        Publish beautiful online documentation instantly,
        <br /> from your code editor using markdown and a public GitHub
        repository.
      </p>
      <div className="flex justify-center gap-6">
        <a
          href="/"
          className="inline-flex items-center gap-3 bg-brand-400/5 outline outline-brand-400/5 outline-offset-4 outline-1 rounded-full px-8 py-3 transition-all hover:outline-brand-400/20 hover:bg-brand-400/10"
        >
          <span>Get Started</span>
          <ChevronRightIcon size={18} />
        </a>
        <a
          href="/"
          className="inline-flex items-center gap-3 rounded-full px-8 py-3"
        >
          <span>Documentation</span>
          <ChevronRightIcon size={18} />
        </a>
      </div>
    </section>
  );
}
