"use client";

import { useCallback, useEffect, useState } from "react";
import { profile } from "@/data/profile";
import { ZONES, MAX_DEPTH } from "@/lib/depth";
import { BootBand } from "@/components/boot/BootBand";

/** Time at 100 before standing down, so the reader sees it complete. */
const HOLD_MS = 520;

/** The clearing fade. */
const FADE_MS = 520;

/**
 * The landing screen, ahead of the dive.
 *
 * A title card rather than a second hero: the wordmark on a plate, the three
 * facts that describe the descent, and the status band reporting what is still
 * loading. It carries no h1 — the page's heading is the claim in the zone
 * below, and this is a mark, not an argument.
 *
 * It is a gate. Once the band reaches 100 the card holds a moment, clears, and
 * hands over to the page underneath — which has been in the document the whole
 * time rather than waiting to be built, so nothing about the site's content
 * depends on this screen having run. A reader without JavaScript never sees it
 * at all, because nothing would be left to take it away again.
 */
export function Landing() {
  const [phase, setPhase] = useState<"up" | "clearing" | "gone">("up");

  const standDown = useCallback(() => setPhase("clearing"), []);

  useEffect(() => {
    if (phase !== "clearing") return;
    const done = window.setTimeout(() => setPhase("gone"), HOLD_MS + FADE_MS);
    return () => window.clearTimeout(done);
  }, [phase]);

  if (phase === "gone") return null;

  const clearing = phase === "clearing";

  const specs = [
    { label: "Depth", value: `${MAX_DEPTH.toLocaleString("en-US")} m` },
    { label: "Zones", value: String(ZONES.length) },
    { label: "Discipline", value: profile.role },
  ];

  return (
    <>
      {/*
       * Nothing here ever completes without JavaScript, so the gate would stay
       * shut over a page that is otherwise perfectly readable.
       */}
      <noscript>
        <style>{`#landing{display:none!important}`}</style>
      </noscript>

    <section
      id="landing"
      aria-label="Title"
      data-landing-clearing={clearing ? "true" : "false"}
      /* Fixed rather than in flow: the home page below is the document, and
         this sits over it until the dive can start. Opaque, or the hero would
         read through the card. */
      className="fixed inset-0 z-[90] flex flex-col px-6 pt-20 pb-36 sm:pb-24 md:px-12"
      style={{
        background: "var(--background)",
        backgroundImage:
          "linear-gradient(to right, rgba(250,250,250,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(250,250,250,0.03) 1px, transparent 1px)",
        backgroundSize: "64px 64px",
        opacity: clearing ? 0 : 1,
        pointerEvents: clearing ? "none" : undefined,
        transition: `opacity ${FADE_MS}ms ease-out ${HOLD_MS}ms`,
      }}
    >
      <div className="flex flex-1 items-center justify-center">
        <div className="relative w-full max-w-3xl">
          <Rings />
          <Corners />

          <div className="relative flex flex-col items-center gap-6 text-center">
            <span className="font-mono text-[10px] tracking-[0.4em] text-muted-foreground uppercase">
              Challenger Deep
            </span>

            {/* The plate. Registration crosses sit outside the rule, as on the
                counter in the band below, so the two read as one instrument.

                The scale is tuned tighter than it looks like it needs to be:
                the line does not wrap, and "| AYUSH BAWASKAR |" is four
                characters longer than the wordmark it replaced. Measured: it
                ran off a 390px screen at the old 2rem floor, and still ran
                three pixels past a 320px one at 1.35rem. */}
            <div className="relative">
              <Crosses />
              <p
                className="border-y-2 px-3 py-4 font-display text-[clamp(1.15rem,5vw,3.5rem)] leading-none tracking-[0.12em] whitespace-nowrap sm:px-6"
                style={{
                  borderColor: "color-mix(in srgb, var(--signal) 40%, transparent)",
                }}
              >
                <span style={{ color: "var(--signal)" }}>|</span> AYUSH BAWASKAR{" "}
                <span style={{ color: "var(--signal)" }}>|</span>
              </p>
            </div>

            {/* Backed by the education entry in the profile: BTech CSE (AI-ML),
                New LJ Institute, from August 2024. */}
            <p className="font-mono text-[11px] tracking-[0.28em] text-foreground/75 uppercase sm:text-xs">
              An CSE (AI-ML) student
            </p>

            <p className="max-w-lg font-serif text-lg text-foreground/75 md:text-xl">
              {profile.heroLine}
            </p>

            <dl className="mt-2 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {specs.map((s) => (
                <div key={s.label} className="flex items-baseline gap-2">
                  <dt className="font-mono text-[9px] tracking-[0.25em] text-muted-foreground/60 uppercase">
                    {s.label}
                  </dt>
                  <dd className="font-mono text-[11px] tracking-[0.14em] text-foreground/85 uppercase">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Middle-bottom: horizontally centred, in the lower part of the screen. */}
      <div className="mx-auto w-full max-w-4xl">
        <BootBand onSettled={standDown} />
      </div>
    </section>
    </>
  );
}

/**
 * Sonar rings behind the plate. Purely ornamental and marked as such — it is
 * the one thing on this screen that measures nothing, so it is a slow pulse
 * rather than anything that could be mistaken for a readout.
 */
function Rings() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="sonar-ring absolute rounded-full border"
          style={{
            width: "min(78vw, 34rem)",
            height: "min(78vw, 34rem)",
            borderColor: "color-mix(in srgb, var(--signal) 22%, transparent)",
            animationDelay: `${i * 2.4}s`,
          }}
        />
      ))}
    </div>
  );
}

/** Registration marks at the corners of the title block. */
function Corners() {
  const corners = [
    "-top-6 -left-2 sm:-left-6",
    "-top-6 -right-2 sm:-right-6",
    "-bottom-6 -left-2 sm:-left-6",
    "-bottom-6 -right-2 sm:-right-6",
  ];

  return (
    <>
      {corners.map((position) => (
        <svg
          key={position}
          aria-hidden="true"
          width="30"
          height="30"
          viewBox="0 0 34 34"
          fill="none"
          style={{ color: "var(--signal)" }}
          className={`pointer-events-none absolute ${position} opacity-70`}
        >
          <rect
            x="12.5"
            y="12.5"
            width="9"
            height="9"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          {[
            [5, 5],
            [29, 5],
            [5, 29],
            [29, 29],
          ].map(([cx, cy]) => (
            <g key={`${cx}-${cy}`} stroke="currentColor" strokeWidth="1.2">
              <line x1={cx - 3} y1={cy - 3} x2={cx + 3} y2={cy + 3} />
              <line x1={cx - 3} y1={cy + 3} x2={cx + 3} y2={cy - 3} />
            </g>
          ))}
        </svg>
      ))}
    </>
  );
}

/** The four crosses framing the wordmark plate. */
function Crosses() {
  const spots = [
    "-top-2.5 -left-2.5",
    "-top-2.5 -right-2.5",
    "-bottom-2.5 -left-2.5",
    "-bottom-2.5 -right-2.5",
  ];

  return (
    <>
      {spots.map((position) => (
        <span
          key={position}
          aria-hidden="true"
          className={`absolute ${position} font-mono text-[13px] leading-none`}
          style={{ color: "var(--signal)" }}
        >
          +
        </span>
      ))}
    </>
  );
}
