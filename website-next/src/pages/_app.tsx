import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { JetBrains_Mono, Open_Sans } from "next/font/google";

const openSans = Open_Sans({
  variable: "--font-open-sans",
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${openSans.variable} ${jetBrainsMono.variable}`}>
      <Component {...pageProps} />
    </div>
  );
}
