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

/*
 * A reload starts the dive again from the surface.
 *
 * Two separate things otherwise leave a reader mid-descent. The browser
 * restores the old scroll offset on reload, and the in-page nav leaves a
 * "#twilight" on the URL that the browser then jumps to as a fragment.
 *
 * scrollRestoration is a property of the *history entry*, not of the page, so
 * setting it while the reloaded page parses is already too late — the browser
 * committed to restoring at navigation start, and it restores anyway. Measured:
 * the offset was back at 8,000px before DOMContentLoaded. So it is set
 * unconditionally, which marks the entry for every later reload, and the first
 * reload after arriving is caught by putting the offset back before paint.
 *
 * Only reloads reset. A link someone was sent — abyss/#hadal — is a fresh
 * navigation and still lands where it points.
 */
const RESET_SCROLL_ON_RELOAD = `(function () {
  try {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";

    // Turning restoration off means the page owns scroll on history
    // traversal too, so back and forward have to be put back by hand —
    // otherwise stepping back to #twilight leaves the reader wherever they
    // happened to be. scrollIntoView inherits the page's smooth behaviour, so
    // this moves exactly like clicking the same zone in the nav.
    window.addEventListener("popstate", function () {
      var id = location.hash.slice(1);
      var target = id && document.getElementById(id);
      if (target) target.scrollIntoView();
      else window.scrollTo(0, 0);
    });

    var entry = performance.getEntriesByType("navigation")[0];
    var reloaded = entry
      ? entry.type === "reload"
      : performance.navigation && performance.navigation.type === 1;
    if (!reloaded) return;

    if (location.hash) {
      history.replaceState(null, "", location.pathname + location.search);
    }

    var toTop = function () {
      // Not scrollTo({behavior}) — the page sets scroll-behavior: smooth, and
      // a smooth correction is the visible slide this is meant to avoid.
      window.scrollTo(0, 0);
    };
    toTop();
    // The restore lands once the document is tall enough to hold the old
    // offset, which is after this script and before load.
    document.addEventListener("readystatechange", toTop);
    window.addEventListener("DOMContentLoaded", toTop);
    window.addEventListener("load", function () {
      toTop();
      requestAnimationFrame(toTop);
    });
  } catch (e) {}
})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`dark ${plexMono.variable} ${pixelify.variable} ${instrumentSerif.variable}`}
    >
      <body>
        <script
          // Parse-time on purpose. The browser restores the previous scroll
          // offset itself, before React has hydrated, so anything that waits
          // for an effect corrects the position visibly instead of preventing
          // it. Inline and blocking, this runs first and there is no jump.
          dangerouslySetInnerHTML={{ __html: RESET_SCROLL_ON_RELOAD }}
        />
        {children}
      </body>
    </html>
  );
}
