import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import type { AppProps } from "next/app";
import "@/styles/globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>{`
        :root {
          --font-geist-sans: ${geistSans.style.fontFamily};
          --font-geist-mono: ${geistMono.style.fontFamily};
          --font-mono: ${jetbrainsMono.style.fontFamily};
        }

        html {
          font-family: var(--font-mono);
        }
      `}</style>
      <Component {...pageProps} />
    </>
  );
}
