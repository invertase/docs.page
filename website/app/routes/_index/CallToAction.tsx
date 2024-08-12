import { HandshakeIcon } from "lucide-react";

export function CallToAction() {
  return (
    <section className="max-w-5xl mx-auto py-16 space-y-6">
      <p className="flex items-center gap-3 justify-center">
        <HandshakeIcon size={18} />
        <span>Free to use</span>
      </p>
      <h3 className="text-brand-100 text-4xl md:text-5xl !leading-[3.5rem] text-center">
        What are you waiting for?
      </h3>
      <p className="text-brand-10 text-center">
        Begin publishing great documentation today.
      </p>
    </section>
  );
}
