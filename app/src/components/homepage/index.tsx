import { cn } from "@/lib/utils";
import { Background } from "./background";
import { Explore } from "./explore";
import { Footer } from "./footer";
import { Header } from "./header";
import { Hero } from "./hero";
import { Preview } from "./preview/preview";
import { Features } from "./features/features";
import styles from "./homepage.module.css";
import hexagon from "./assets/hexagon-bg.svg";

export function Homepage() {
  return (
    <div className={cn(styles.site, "dark relative min-h-svh w-full")}>
      <Background />
      <div className="relative z-10 mx-auto w-full min-w-0 max-w-8xl px-4 font-mono">
        <div className="absolute top-48 -right-48 bg-no-repeat size-[700px] bg-center bg-cover opacity-75 z-[-1]" style={{ backgroundImage: `url(${hexagon.src})` }} />
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
  );
}
