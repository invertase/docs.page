import type { LoaderFunctionArgs } from "@vercel/remix";
import type { Context } from "~/context";
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
import { getRequestContext } from "~/utils";
import { useLoaderData } from "@remix-run/react";
import { DocsPage } from "~/layouts/DocsPage";

export const links = getLinkDescriptors;
export const meta = getMetadata;

export const loader = async (args: LoaderFunctionArgs) => {
  let ctx: Context | undefined = undefined;

  const customDomain = args.request.headers.get("x-docs-page-custom-domain");
  console.log(customDomain);
  // If the request to the homepage has come from a custom domain, this means that:
  //  1. The custom domain request (e.g. melos.invertase.dev) was proxied to docs.page/invertase/melos correctly.
  //  2. The client hydrated, sending a client fetch request to the data route, e.g. melos.invertase.dev?_data=homepage
  //  3. The domain proxy intercepts this, but ignores _data requests and forwards directly on to docs.page root (the homepage).
  //  4. The homepage loader is called, but the headers are set to indicate the custom domain, so to ensure the correct hydration flow, we need
  //    to grab the page context for this request, and return the documentation layout with it.
  if (customDomain) {
    // Header comes through as invertase/melos
    const [owner, repository] = customDomain.split("/");

    // Manually get the context for the custom domain request.
    ctx = await getRequestContext(args, {
      owner,
      repository,
      path: "", // The path will be the root, so we don't need to set it.
      ref: undefined, // TODO check me - technically a custom domain would send the request as /~ref, but we don't need to set it here.
      vanity: false,
    });
  }

  return { ctx };
};

export default function Homepage() {
  const { ctx } = useLoaderData<typeof loader>();

  if (ctx) {
    return <DocsPage ctx={ctx} />;
  }

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
