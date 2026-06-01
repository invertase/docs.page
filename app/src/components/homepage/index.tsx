import { cn } from "@/lib/utils";
import { Background } from "./background";
import { Header } from "./header";
import { Hero } from "./hero";

import { AgentAccess } from "./agent-access";
import { Explore } from "./explore";
import { Footer } from "./footer";
import { GitPublishing } from "./git-publishing";
import styles from "./homepage.module.css";
import { IntelligentSearch } from "./intelligent-search";
import { MarkdownComponents } from "./markdown-components";
import { ModernInterface } from "./modern-interface";
import { Preview } from "./preview";

export function Homepage() {
  return (
    <div className={cn(styles.site, "dark relative min-h-svh w-full")}>
      <Background />
      <div className="relative z-10 mx-auto w-full min-w-0 max-w-8xl px-4 font-mono">
        <Header />
        <Hero />
        <Preview />
        <AgentAccess />
        <GitPublishing />
        <IntelligentSearch />
        <MarkdownComponents />
        <ModernInterface />
        <Explore />
        <Footer />
      </div>
    </div>
  );
}
