import type { LinksFunction } from "@vercel/remix";
import { useInlineScript } from "~/hooks";
import { Affiliation } from "./Afilliation";
import { CallToAction } from "./CallToAction";
import { Demo } from "./Demo";
import { Features } from "./Features";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { HeroGradient } from "./HeroGradient";
import { Platform } from "./Platform";
import { Testimonials } from "./Testimonials";

export const links: LinksFunction = () => {
  return [
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/_docs.page/favicon/apple-touch-icon.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: "/_docs.page/favicon/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: "/_docs.page/favicon/favicon-16x16.png",
    },
    {
      rel: "manifest",
      href: "/_docs.page/favicon/site.webmanifest",
    },
    {
      rel: "mask-icon",
      href: "/_docs.page/favicon/safari-pinned-tab.svg",
      color: "#5bbad5",
    },
  ];
};

export default function Homepage() {
  const scripts = useInlineScript(`<script>(() => {
		document.documentElement.setAttribute('data-theme', 'dark');
        const root = document.documentElement;
			root.style.setProperty('--background-dark', '153 54% 3%');		
	})()</script>`);

  return (
    <>
      {scripts}
      <HeroGradient />
      <Header />
      <Hero />
      <Demo />
      <Affiliation />
      <Platform />
      <Features />
      <Testimonials />
      <CallToAction />
      <Footer />
    </>
  );
}
