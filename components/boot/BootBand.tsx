"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { bootSignal, MILESTONES, type Milestone } from "@/lib/bootSignal";

/**
 * Below this the sequence is a flash rather than a sequence. On a warm cache
 * the milestones can all land inside 200ms, and a bar that appears already
 * full reads as a glitch. The reading stays honest — it is the easing that is
 * held back, never the number.
 */
const MIN_DWELL_MS = 900;

/**
 * If a milestone never arrives — a driver that accepts a WebGL2 context and
 * then stalls, a font request that never answers — the band stops waiting and
 * reads as ready. It covers nothing, so this is cosmetic rather than a way out
 * of a trap, but a bar stuck at 75 forever would still be a lie.
 */
const ABANDON_MS = 6000;

const stripes = (color: string) =>
  `repeating-linear-gradient(100deg, ${color} 0 4px, transparent 4px 9px)`;

/**
 * The dive status band, across the foot of the landing screen.
 *
 * It reports real work rather than a timer: React hydrating, the WebGL2
 * capability probe, the ocean's spectrum and first frame, the three faces
 * loading. Everything on this site is meant to be checkable, and a progress
 * bar animating to a fixed schedule is the smallest possible lie — it looks
 * like a measurement and is not one.
 *
 * It deliberately covers nothing. An earlier pass put this full-screen over
 * the page, which meant the site's own content waited on an animation; here
 * the hero is readable from the first paint and the band simply reports, then
 * turns into the invitation to scroll.
 */
export function BootBand() {
  const reduced = useReducedMotion();
  const [reached, setReached] = useState<Milestone[]>([]);
  const [shown, setShown] = useState(0);

  // Read by the animation loop, which must not restart on every change.
  const reachedRef = useRef(0);
  const abandonedRef = useRef(false);

  useEffect(() => {
    const sync = () => {
      const now = bootSignal.reached();
      reachedRef.current = now.length;
      setReached(now);
    };
    const unsubscribe = bootSignal.subscribe(sync);
    sync();

    bootSignal.mark("hull");
    // document.fonts is missing in a few older engines. Treat that as done
    // rather than waiting on an API that will never answer.
    if (document.fonts?.ready) {
      void document.fonts.ready.then(() => bootSignal.mark("type"));
    } else {
      bootSignal.mark("type");
    }

    const abandon = window.setTimeout(() => {
      abandonedRef.current = true;
    }, ABANDON_MS);

    return () => {
      unsubscribe();
      window.clearTimeout(abandon);
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    let value = 0;

    const tick = (now: number) => {
      const complete =
        abandonedRef.current || reachedRef.current >= MILESTONES.length;
      // performance.now() is milliseconds since navigation started, which is
      // what the dwell should be measured against — the reader has been
      // looking at this since the request, not since React woke up. Timing it
      // from the effect instead added however long hydration took on top.
      const dwelt = now >= (reduced ? 0 : MIN_DWELL_MS);

      // The real reading, held just short of full until the work is actually
      // done — the bar must never sit at 100 while the page is still building.
      const measured = (reachedRef.current / MILESTONES.length) * 100;
      const target = complete && dwelt ? 100 : Math.min(measured, 96);

      value = reduced ? target : value + (target - value) * 0.2;
      if (target - value < 0.6) value = target;
      setShown(value);

      if (value >= 100) return;
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  const percent = Math.round(shown);
  const done = reached.length;
  const settled = shown >= 100;

  /*
   * The caption follows whichever is further behind, the bar or the work.
   * Taking it from the milestone count alone printed "Ready to dive" over a
   * bar reading 14%, because the steps had all landed while the sweep was
   * still catching up — a caption contradicting the number beside it.
   */
  const byBar = Math.floor((shown / 100) * MILESTONES.length);
  const step = Math.min(byBar, done, MILESTONES.length - 1);
  const caption = settled
    ? "Scroll to descend · 0 m → 11,034 m"
    : `${MILESTONES[Math.max(step, 0)].line} …`;

  return (
    <>
      {/*
       * Without JavaScript nothing ever marks a milestone, so the bar would sit
       * at zero under the word LOADING and say the page had failed when it had
       * not. The scroll cue underneath is plain markup and survives on its own.
       */}
      <noscript>
        <style>{`[data-boot]{display:none!important}`}</style>
      </noscript>

      <div
        data-boot
        data-boot-settled={settled ? "true" : "false"}
        className="relative mt-14 border-t-2 border-border pt-8"
        style={{ color: "var(--signal)" }}
      >
        <Brackets />

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-7">
          <Counter percent={percent} settled={settled} />

          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-baseline justify-between gap-4">
              <span className="font-mono text-[11px] tracking-[0.3em] text-foreground/80 uppercase">
                {settled ? "Ready" : "Loading"}
              </span>
              <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground/70 uppercase">
                {/* Counted off the same step as the caption. Reading it
                    straight from the milestone set said "4 of 4 systems"
                    beside a caption still working on the fourth. */}
                {settled ? MILESTONES.length : step} of {MILESTONES.length} systems
              </span>
            </div>

            <div className="flex items-center gap-3">
              <SideRig />
              <div
                className="relative h-6 flex-1 overflow-hidden"
                role="progressbar"
                aria-label="Preparing the dive"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={percent}
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    backgroundImage: stripes(
                      "color-mix(in srgb, var(--signal) 26%, transparent)",
                    ),
                  }}
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0"
                  style={{
                    width: `${shown}%`,
                    backgroundImage: stripes("var(--signal)"),
                    filter: "drop-shadow(0 0 7px var(--signal))",
                  }}
                />
              </div>
              <SideRig flipped />
            </div>

            <p className="mt-3 flex items-center gap-3 font-mono text-[10px] tracking-[0.25em] text-muted-foreground/80 uppercase">
              {settled && (
                <span
                  aria-hidden="true"
                  /* h-6, not h-4: the descend keyframe travels 20px, so a
                     shorter rail leaves the mark falling out below it. */
                  className="relative block h-6 w-px shrink-0 self-start bg-border"
                >
                  <span
                    className="descend absolute -left-[2px] block h-[5px] w-[5px]"
                    style={{ background: "var(--signal)" }}
                  />
                </span>
              )}
              {caption}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

/** The counter plate, with a registration cross at each corner. */
function Counter({ percent, settled }: { percent: number; settled: boolean }) {
  const corners = [
    "-top-2.5 -left-2.5",
    "-top-2.5 -right-2.5",
    "-bottom-2.5 -left-2.5",
    "-bottom-2.5 -right-2.5",
  ];

  return (
    <div className="relative shrink-0 self-start">
      {corners.map((position) => (
        <span
          key={position}
          aria-hidden="true"
          className={`absolute ${position} font-mono text-[12px] leading-none`}
        >
          +
        </span>
      ))}

      <div
        className="border-2 px-5 py-1.5"
        style={{
          borderColor: `color-mix(in srgb, var(--signal) ${settled ? 40 : 55}%, transparent)`,
          background: "color-mix(in srgb, var(--signal) 7%, transparent)",
        }}
      >
        <span
          className="font-display text-4xl leading-none tabular-nums"
          style={{ textShadow: "0 0 16px var(--signal)" }}
        >
          {percent}
        </span>
      </div>
    </div>
  );
}

/** The rig flanking the bar: a gauge over a ticked base plate. */
function SideRig({ flipped = false }: { flipped?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="hidden shrink-0 items-center gap-2 md:flex"
      style={flipped ? { flexDirection: "row-reverse" } : undefined}
    >
      <span
        className="block h-[2px] w-3"
        style={{ background: "var(--signal)" }}
      />
      <svg width="22" height="34" viewBox="0 0 22 34" fill="none">
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.3" />
        <line x1="2" y1="23" x2="20" y2="23" stroke="currentColor" strokeWidth="1.3" />
        {[5, 9, 13, 17].map((x) => (
          <line
            key={x}
            x1={x}
            y1="26"
            x2={x}
            y2="30"
            stroke="currentColor"
            strokeWidth="1.1"
          />
        ))}
      </svg>
    </div>
  );
}

/** Registration marks at the corners of the band. */
function Brackets() {
  const corners = ["top-4 left-0", "top-4 right-0"];

  return (
    <>
      {corners.map((position) => (
        <svg
          key={position}
          aria-hidden="true"
          width="26"
          height="26"
          viewBox="0 0 34 34"
          fill="none"
          className={`pointer-events-none absolute ${position} hidden opacity-70 lg:block`}
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
