import type { Metadata } from "next";
import { IBM_Plex_Mono, Pixelify_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";

/** UI, labels and every instrument readout. */
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
});

/** Display face for headings and the wordmark. */
const pixelify = Pixelify_Sans({
  subsets: ["latin"],
  variable: "--font-pixelify",
});

/** Running prose — the passages where Ayush is talking rather than measuring. */
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
});

const description =
  "Applied ML, blockchain and systems work by Ayush Bawaskar. Every claim on this page links to the repository that backs it.";

export const metadata: Metadata = {
  // Required for the OG image to resolve to an absolute URL. Without it the
  // card is advertised as a relative path, which every scraper ignores.
  metadataBase: new URL("https://ayushbawaskar.vercel.app"),
  title: "Ayush Bawaskar — ABYSS",
  description,
  openGraph: {
    title: "Ayush Bawaskar — ABYSS",
    description,
    url: "/",
    siteName: "ABYSS",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ayush Bawaskar — ABYSS",
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`dark ${plexMono.variable} ${pixelify.variable} ${instrumentSerif.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
