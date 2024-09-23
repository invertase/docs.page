import { HeroGradient } from "~/components/HeroGradient";
import { Footer } from "~/layouts/Footer";
import { Header } from "~/layouts/Header";
import { Site } from "~/layouts/Site";

import { Affiliation } from "./Affiliation";
import { CallToAction } from "./CallToAction";
import { Demo } from "./Demo";
import { Features } from "./Features";
import { Hero } from "./Hero";
import { Platform } from "./Platform";

export function Homepage() {
  return (
    <Site>
      <HeroGradient fadeInMs={850} />
      <Header />
      <Hero />
      <Demo />
      <Affiliation />
      <Platform />
      <Features />
      {/* <Testimonials /> */}
      <CallToAction />
      <Footer />
    </Site>
  );
}
