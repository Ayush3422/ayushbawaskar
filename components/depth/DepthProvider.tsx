"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  MAX_DEPTH,
  ZONES,
  type Zone,
  depthToPressure,
  depthToSnowDensity,
  depthToVeil,
  depthToZone,
  progressToDepth,
  zoneProgressToDepth,
  type ZoneId,
} from "@/lib/depth";

export interface DepthState {
  depth: number;
  zone: Zone;
  pressureBar: number;
  descentRate: number;
  elapsedMs: number;
}

const INITIAL: DepthState = {
  depth: 0,
  zone: ZONES[0],
  pressureBar: 1,
  descentRate: 0,
  elapsedMs: 0,
};

const DepthContext = createContext<DepthState>(INITIAL);

export function useDepth(): DepthState {
  return useContext(DepthContext);
}

/** Smoothing constant for the descent-rate EMA, in milliseconds. */
const RATE_TAU_MS = 250;

export function DepthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DepthState>(INITIAL);

  const raf = useRef(0);
  const startedAt = useRef(0);
  const lastDepth = useRef(0);
  const lastT = useRef(0);
  const rate = useRef(0);

  // What the last committed render saw, so we can skip no-op setState calls.
  const pushedDepth = useRef(-1);
  const pushedRate = useRef(Number.NaN);
  const pushedSecond = useRef(-1);
  const pushedPressure = useRef(-1);

  useEffect(() => {
    startedAt.current = performance.now();
    lastT.current = startedAt.current;

    const ZONE_IDS = new Set(ZONES.map((z) => z.id as string));

    /**
     * Depth comes from position within the zone's own section, not from raw
     * page progress: the zones are wildly unequal in metres but roughly equal
     * on screen, so raw progress reads 3,600 m under a heading that says
     * Twilight. Falls back to page progress if the sections are not in the
     * DOM yet.
     */
    const measureDepth = (): number => {
      const sections = document.querySelectorAll<HTMLElement>("main section[id]");
      if (sections.length === 0) {
        const scrollable =
          document.documentElement.scrollHeight - window.innerHeight;
        return progressToDepth(scrollable > 0 ? window.scrollY / scrollable : 0);
      }

      // The anchor slides from the top of the viewport at the top of the page
      // to its bottom at the bottom of the page. A fixed offset (say 35% down)
      // never sweeps past the final section, so the deepest reachable reading
      // would be ~7,750 m while the copy promises 11,034 — the site would be
      // contradicted by its own instrument. This reaches exactly 0 and exactly
      // MAX_DEPTH at the two ends.
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

      // Sub-pixel rounding in offsetTop/offsetHeight leaves the bottom of the
      // page a few metres short of the Challenger Deep. The contact zone's
      // copy names 11,034 exactly, so land on it exactly.
      if (maxScroll > 0 && window.scrollY >= maxScroll - 1) return MAX_DEPTH;

      const through = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      const anchor = window.scrollY + window.innerHeight * through;

      let current: HTMLElement | null = null;
      for (const s of sections) {
        if (!ZONE_IDS.has(s.id)) continue;
        if (s.offsetTop <= anchor) current = s;
      }
      if (!current) current = sections[0];

      const t = (anchor - current.offsetTop) / Math.max(current.offsetHeight, 1);
      return zoneProgressToDepth(current.id as ZoneId, t);
    };

    const tick = () => {
      const now = performance.now();
      const depth = measureDepth();

      const dt = Math.max(now - lastT.current, 1);
      const instant = ((depth - lastDepth.current) / dt) * 1000;
      const alpha = 1 - Math.exp(-dt / RATE_TAU_MS);
      rate.current += (instant - rate.current) * alpha;

      lastDepth.current = depth;
      lastT.current = now;

      // Custom properties are written every frame: it is a style mutation, not
      // a React render, so it costs nothing meaningful.
      const root = document.documentElement.style;
      root.setProperty("--depth-veil", depthToVeil(depth).toFixed(4));
      root.setProperty("--snow-density", depthToSnowDensity(depth).toFixed(4));
      root.setProperty("--depth-tint", (1 - depth / MAX_DEPTH).toFixed(4));
      // Near-surface scrim. The swell is brightest here and the depth veil has
      // barely started, so this covers the gap between them.
      root.setProperty(
        "--surface-scrim",
        Math.max(0, 1 - depth / 400).toFixed(4),
      );
      // Hadal presence: nothing until the abyssal zone, full by 7,000 m.
      root.setProperty(
        "--hadal-presence",
        Math.min(1, Math.max(0, (depth - 4000) / 3000)).toFixed(4),
      );

      // The lamp earns its keep with depth; near the surface there is plenty
      // of light without it.
      root.setProperty(
        "--lamp-strength",
        (0.25 + 0.75 * Math.min(depth / 3000, 1)).toFixed(3),
      );

      /*
       * Pressure, quantised to twentieths. It drives letter-spacing and
       * padding, which force layout — writing a fresh value every frame would
       * relayout the whole document sixty times a second. Twenty steps across
       * the whole descent is invisible as a jump and nearly free.
       */
      const pressure = Math.round((depth / MAX_DEPTH) * 20) / 20;
      if (pressure !== pushedPressure.current) {
        pushedPressure.current = pressure;
        root.setProperty("--pressure", pressure.toFixed(2));
      }

      // React state, by contrast, re-renders every consumer. Commit only when a
      // value someone actually displays has changed: whole metres of depth,
      // 10 m/s of rate, or a tick of the dive clock. Without this gate the whole
      // tree re-renders 60 times a second while the page sits still.
      const roundedDepth = Math.round(depth);
      const roundedRate = Math.round(rate.current / 10) * 10;
      const second = Math.floor((now - startedAt.current) / 1000);

      if (
        roundedDepth !== pushedDepth.current ||
        roundedRate !== pushedRate.current ||
        second !== pushedSecond.current
      ) {
        pushedDepth.current = roundedDepth;
        pushedRate.current = roundedRate;
        pushedSecond.current = second;

        setState({
          depth,
          zone: depthToZone(depth),
          pressureBar: depthToPressure(depth),
          descentRate: rate.current,
          elapsedMs: now - startedAt.current,
        });
      }

      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  return <DepthContext.Provider value={state}>{children}</DepthContext.Provider>;
}
