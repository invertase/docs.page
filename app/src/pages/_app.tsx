import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import "@/styles/globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { fonts } from "@/lib/fonts";
import { cn } from "@/lib/utils";

const fontVariableClasses = Object.values(fonts).map((font) => font.variable);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ThemeProvider attribute="class">
        <TooltipProvider>
          <SidebarProvider className="w-full">
            <div
              className={cn(
                // Avoid overflow-x-clip: it can create a scrollport that breaks
                // position: sticky for the docs left nav. Use w-full + min-w-0 on
                // flex children where needed to prevent rare horizontal layout blowout.
                "flex min-h-svh w-full min-w-0 max-w-full flex-col font-sans",
                fontVariableClasses,
              )}
            >
              <Component {...pageProps} />
            </div>
          </SidebarProvider>
        </TooltipProvider>
      </ThemeProvider>
    </>
  );
}
