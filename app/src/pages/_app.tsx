import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import "@/styles/globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

// const jetbrainsMono = JetBrains_Mono({
//   subsets: ["latin"],
//   variable: "--font-mono",
// });

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ThemeProvider attribute="class">
        <TooltipProvider>
          <SidebarProvider>
            <div className={`flex min-h-svh w-full flex-col ${geistSans.className} ${geistMono.className}`}>
              <Component {...pageProps} />
            </div>
          </SidebarProvider>
        </TooltipProvider>
      </ThemeProvider>
    </>
  );
}
