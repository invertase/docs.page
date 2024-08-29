import { HandshakeIcon } from "lucide-react";
import { Button } from "../../components/Button";

export function CallToAction() {
  return (
    <section className="max-w-5xl mx-auto py-16 space-y-6">
      <p className="md:flex text-center items-center justify-center gap-3 text-brand-50">
        <HandshakeIcon size={18} className="mb-3 mx-auto md:m-0" />
        <span>Free to use</span>
      </p>
      <h3 className="text-brand-100 text-4xl md:text-5xl !leading-[3.5rem] text-center">
        What are you waiting for?
      </h3>
      <p className="text-brand-10 text-center text-brand-50">
        Begin publishing great documentation today.
      </p>
      <div className="flex justify-center gap-6 pt-6">
        <Button as="a" cta href="/get-started">
          Start Publishing
        </Button>
      </div>
    </section>
  );
}
