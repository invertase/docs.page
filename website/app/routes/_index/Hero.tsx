import { ChevronRightIcon } from "lucide-react";
import { Button } from "./Button";

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
        <Button cta href="https://use.docs.page/getting-started">
          Start Publishing
        </Button>
      </div>
    </section>
  );
}
