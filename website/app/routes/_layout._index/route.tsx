import { Header } from "~/layouts/Header";
import { getLinkDescriptors, getMetadata } from "~/meta";
import { Footer } from "../../layouts/Footer";
import { HeroGradient } from "../../layouts/HeroGradient";
import { Affiliation } from "./Afilliation";
import { CallToAction } from "./CallToAction";
import { Demo } from "./Demo";
import { Features } from "./Features";
import { Hero } from "./Hero";
import { Platform } from "./Platform";

export const links = getLinkDescriptors;
export const meta = getMetadata;

export default function Homepage() {
  return (
    <>
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
    </>
  );
}
