import { cn } from "@/lib/utils";
import { Background } from "./background";
import { Explore } from "./explore";
import { FeatureStack } from "./feature-stack";
import { Footer } from "./footer";
import { Header } from "./header";
import { Hero } from "./hero";
import styles from "./homepage.module.css";
import { Preview } from "./preview";

export function Homepage() {
  return (
    <div
      className={cn(
        styles.site,
        "dark relative min-h-svh w-full [--primary:var(--color-honey-500)]",
      )}
    >
      <Background />
      <div className="relative overflow-visible">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        >
          <div
            className={cn(styles.homepageHexagon, styles.homepageHexagonRight)}
          />
          <div
            className={cn(styles.homepageHexagon, styles.homepageHexagonLeft)}
          />
        </div>
        <div className="relative z-10 mx-auto w-full min-w-0 max-w-8xl px-4 font-mono">
          <div className="relative z-30">
            <Header />
          </div>
          <div className="relative z-10">
            <Hero />
            <Preview />
            <FeatureStack />
            <Explore />
            <Footer />
          </div>
        </div>
        {/* Continuous side rails (px-4 inset) — sole vertical borders for the homepage column. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-20">
          <div className="relative mx-auto h-full min-h-full w-full max-w-8xl">
            <div
              className={cn(
                "absolute top-0 bottom-0 left-4",
                styles.homepageLineV,
                styles.homepageRailLeft,
              )}
            />
            <div
              className={cn(
                "absolute top-0 bottom-0 right-4",
                styles.homepageLineV,
                styles.homepageRailRight,
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
