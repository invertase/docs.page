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

import { loader as docsRouteLoader } from "~/routes/$/route";
import { LoaderFunctionArgs } from "@vercel/remix";

export const links = getLinkDescriptors;
export const meta = getMetadata;

export const loader = async (args: LoaderFunctionArgs) => {
  const url = new URL(args.request.url);

  console.log('URL HOSTNAME', url.hostname);

  // If url hostname is not docs.page or staging.docs.page, we need to return the docsRouteLoader
  if (!["docs.page", "staging.docs.page"].includes(url.hostname)) {
    return docsRouteLoader(args);
  }

  return {};
};

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
