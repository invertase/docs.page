import Head from "next/head";
import { cn } from "@/lib/utils";
import hexagon from "./assets/hexagon-bg.svg";
import { Background } from "./background";
import { Explore } from "./explore";
import { Features } from "./features/features";
import { Footer } from "./footer";
import { Header } from "./header";
import { Hero } from "./hero";
import styles from "./homepage.module.css";
import { Preview } from "./preview/preview";

const title = "docs.page | Docs for humans + agents";
const description =
  "Instantly serve markdown from any GitHub branch as modern, agent-ready docs, with AI chat, MCP, and llms.txt.";
const image = "https://docs.page/_docs.page/social-image.png";

// schema.org structured data describing docs.page as a SoftwareApplication
// published by Invertase, alongside WebSite and Organization entities. This
// gives search engines and LLMs a machine-readable entity to cite.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://invertase.io/#organization",
      name: "Invertase",
      url: "https://invertase.io",
      logo: "https://static.invertase.io/assets/invertase/invertase-rounded-avatar.png",
      sameAs: ["https://github.com/invertase", "https://x.com/invertaseio"],
    },
    {
      "@type": "WebSite",
      "@id": "https://docs.page/#website",
      name: "docs.page",
      url: "https://docs.page",
      description,
      publisher: { "@id": "https://invertase.io/#organization" },
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://docs.page/#software",
      name: "docs.page",
      url: "https://docs.page",
      image,
      description,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any",
      isAccessibleForFree: true,
      license: "https://www.apache.org/licenses/LICENSE-2.0",
      codeRepository: "https://github.com/invertase/docs.page",
      author: { "@id": "https://invertase.io/#organization" },
      publisher: { "@id": "https://invertase.io/#organization" },
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  ],
};

export function Homepage() {
  return (
    <>
      <Head>
        <link rel="icon" href="/_docs.page/logo-icon.svg" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        <meta name="twitter:site" content="@invertaseio" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      <div
        className={cn(
          styles.site,
          "dark relative min-h-svh w-full text-foreground",
        )}
      >
        <Background />
        <div className="relative z-10 mx-auto w-full min-w-0 max-w-8xl px-0 md:px-4 font-mono">
          <div
            className="absolute top-72 -right-72 bg-no-repeat size-[700px] bg-center bg-cover opacity-60 z-[-1]"
            style={{ backgroundImage: `url(${hexagon.src})` }}
          />
          <div className="md:border-x">
            <div
              className="absolute bottom-72 -left-72 bg-no-repeat size-[700px] bg-center bg-cover opacity-60 z-[-1]"
              style={{ backgroundImage: `url(${hexagon.src})` }}
            />
            <Header />
            <Hero />
            <Preview />
            <Features />
            <Explore />
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}
