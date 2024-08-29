import { ShieldCheckIcon } from "lucide-react";

export function Testimonials() {
  return (
    <section className="max-w-5xl mx-auto py-16 space-y-6">
      <p className="flex items-center gap-3 justify-center">
        <ShieldCheckIcon size={18} />
        <span>Trusted by developers</span>
      </p>
      <h3 className="text-brand-100 text-4xl md:text-5xl !leading-[3.5rem] text-center">
        See why developers use docs.page
      </h3>
      <p className="font-light text-brand-50 text-center">
        Built for the open-source community
      </p>
      <div>TODO Testimonial grid</div>
    </section>
  );
}
