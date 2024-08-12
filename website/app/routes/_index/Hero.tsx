import { ChevronRightIcon } from "lucide-react";

export function Hero() {
  return (
    <section className="max-w-xl md:max-w-3xl mx-auto pt-20 px-8 space-y-6">
      <h1 className="text-center text-4xl md:text-5xl lg:text-6xl !leading-[45px] md:!leading-[65px] lg:!leading-[80px] font-bold  text-brand-50 drop-shadow-md">
        Ship documentation,
        <br /> like you ship code
      </h1>
      <h2 className="text-center text-brand-100">
        Meet the docs as code platform made for open-source developers.
      </h2>
      <p className="text-center text-brand-100 font-light">
        Publish beautiful online documentation instantly,
        <br /> from your code editor using markdown and a public GitHub
        repository.
      </p>
      <div className="flex justify-center gap-6">
        <a
          href="/"
          className="inline-block p-px bg-gradient-to-b from-brand-700/60 to-brand-100/10 rounded-full hover:-translate-y-[2px] transition-all"
        >
          <div className="inline-flex px-6 py-3 items-center gap-2 bg-gradient-to-br from-brand-900 to-brand-950 rounded-full shadow-md shadow-brand-800/60 font-medium transition-all">
            <span>Get Started</span>
            <ChevronRightIcon size={18} />
          </div>
        </a>
        <a
          href="/"
          className="inline-block p-px rounded-full hover:-translate-y-[2px] transition-all"
        >
          <div className="inline-flex px-6 py-3 items-center gap-2 rounded-full font-medium transition-all">
            <span>Documentation</span>
            <ChevronRightIcon size={18} />
          </div>
        </a>
      </div>
    </section>
  );
}
