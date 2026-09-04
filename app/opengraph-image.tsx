import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { headlineStats, profile } from "@/data/profile";

export const alt =
  "Ayush Bawaskar — ABYSS. Measured, not asserted. Applied ML, blockchain and systems work.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/*
 * The share card.
 *
 * Rendered from the same data as the hero rather than typed out again, so the
 * numbers on the card cannot drift from the numbers on the page — the site's
 * whole claim is that its figures are checkable, and a stale preview image
 * would be the easiest place to break that quietly.
 *
 * The two faces are read off disk instead of fetched at build time. ImageResponse
 * has no access to next/font, and a network fetch here would make the build
 * depend on Google Fonts being reachable.
 */
export default async function Image() {
  const fonts = join(process.cwd(), "app/_og-fonts");
  const [pixelify, plex] = await Promise.all([
    readFile(join(fonts, "pixelify.ttf")),
    readFile(join(fonts, "plex-mono.ttf")),
  ]);

  const BG = "#0a0a0a";
  const FG = "#fafafa";
  const MUTED = "#a1a1a1";
  const SIGNAL = "#e57373";
  const BORDER = "#262626";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: BG,
          color: FG,
          fontFamily: "Plex",
          padding: "48px 64px",
          // The graph paper the page itself sits on.
          backgroundImage:
            "linear-gradient(to right, rgba(250,250,250,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(250,250,250,0.035) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            letterSpacing: "0.22em",
            color: MUTED,
          }}
        >
          <div style={{ display: "flex", fontFamily: "Pixelify", fontSize: 30, color: FG }}>
            AYUSH // ABYSS
          </div>
          <div style={{ display: "flex" }}>0 M → 11,034 M</div>
        </div>

        <div style={{ display: "flex", height: 3, background: BORDER, margin: "22px 0 34px" }} />

        <div style={{ display: "flex", flexDirection: "column", fontFamily: "Pixelify", fontSize: 84, lineHeight: 1.06 }}>
          <div style={{ display: "flex" }}>MEASURED</div>
          <div style={{ display: "flex", color: SIGNAL }}>NOT</div>
          <div style={{ display: "flex" }}>ASSERTED</div>
        </div>

        <div style={{ display: "flex", marginTop: 22, fontSize: 26, color: MUTED }}>
          {profile.heroLine}
        </div>

        <div style={{ display: "flex", flex: 1 }} />

        <div style={{ display: "flex", height: 3, background: BORDER, marginBottom: 22 }} />

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {headlineStats.map((s) => (
            <div key={s.label} style={{ display: "flex", flexDirection: "column", width: 250 }}>
              <div style={{ display: "flex", fontSize: 38, color: s.signal ? SIGNAL : FG }}>
                {s.value}
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 17,
                  letterSpacing: "0.16em",
                  color: MUTED,
                  marginTop: 8,
                }}
              >
                {s.label.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Pixelify", data: pixelify, style: "normal", weight: 600 },
        { name: "Plex", data: plex, style: "normal", weight: 500 },
      ],
    },
  );
}
