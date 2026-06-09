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
const image = "https://docs.page/_docs.page/social-preview.png";

export function Homepage() {
  return (
    <>
      <Head>
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
      </Head>
      <div
        className={cn(
          styles.site,
          "dark relative min-h-svh w-full text-foreground",
        )}
      >
        <Background />
        <div className="relative z-10 mx-auto w-full min-w-0 max-w-8xl px-4 font-mono">
          <div
            className="absolute top-48 -right-48 bg-no-repeat size-[700px] bg-center bg-cover opacity-75 z-[-1]"
            style={{ backgroundImage: `url(${hexagon.src})` }}
          />
          <div className="border-x">
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
