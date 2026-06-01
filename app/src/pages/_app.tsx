import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import "@/styles/globals.css";
import "streamdown/styles.css";
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
                "flex min-h-svh w-full flex-1 flex-col items-stretch overflow-x-clip font-sans",
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
