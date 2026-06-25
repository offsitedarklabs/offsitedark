import type { Metadata } from "next";
import {
  Bebas_Neue,
  IBM_Plex_Sans,
  Instrument_Serif,
  JetBrains_Mono,
  VT323,
} from "next/font/google";

import { Nav } from "@/components/nav";
import { Nodes } from "@/components/nodes";
import { SITE } from "@/lib/constants";

import "./globals.css";

const bebas = Bebas_Neue({ weight: "400", variable: "--font-bebas", subsets: ["latin"] });
const ibmPlexSans = IBM_Plex_Sans({
  weight: ["400", "500"],
  variable: "--font-prose",
  subsets: ["latin"],
});
const instrumentSerif = Instrument_Serif({
  weight: "400",
  variable: "--font-instrument-serif",
  subsets: ["latin"],
});
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});
const vt323 = VT323({ weight: "400", variable: "--font-vt323", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: SITE.name, template: `%s — ${SITE.name}` },
  description: SITE.description,
  metadataBase: new URL(SITE.url),
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${bebas.variable} ${ibmPlexSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} ${vt323.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Nav />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Nodes />
      </body>
    </html>
  );
}
