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
import { depthSignal } from "@/lib/depthSignal";

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

/**
 * Smoothing constant for depth itself, in milliseconds.
 *
 * Depth used to track scroll position exactly, so every dropped frame read as
 * a step — the camera, the veil and the readout all jumped with it. Easing
 * toward the scroll target instead lets the whole descent glide even when the
 * scroll arrives in chunks, which is what actually makes it feel smooth.
 */
const DEPTH_TAU_MS = 110;

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
  const lastCommit = useRef(0);
  const eased = useRef(0);

  useEffect(() => {
    startedAt.current = performance.now();
    lastT.current = startedAt.current;

    const ZONE_IDS = new Set(ZONES.map((z) => z.id as string));

    /*
     * Section geometry, measured once and re-measured only when it can have
     * changed. Reading offsetTop and offsetHeight forces the browser to flush
     * layout, and doing that for six sections inside a per-frame loop — right
     * after writing custom properties that dirty style — is a synchronous
     * layout every single frame.
     */
    type Band = { id: ZoneId; top: number; height: number };
    let bands: Band[] = [];
    let maxScroll = 0;

    const measureLayout = () => {
      const sections =
        document.querySelectorAll<HTMLElement>("main section[id]");
      bands = [];
      for (const el of sections) {
        if (!ZONE_IDS.has(el.id)) continue;
        bands.push({
          id: el.id as ZoneId,
          top: el.offsetTop,
          height: Math.max(el.offsetHeight, 1),
        });
      }
      maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    };

    measureLayout();
    const ro = new ResizeObserver(measureLayout);
    ro.observe(document.body);
    window.addEventListener("resize", measureLayout);

    /**
     * Depth comes from position within the zone's own section, not from raw
     * page progress: the zones are wildly unequal in metres but roughly equal
     * on screen, so raw progress reads 3,600 m under a heading that says
     * Twilight.
     */
    const measureDepth = (): number => {
      if (bands.length === 0 || maxScroll <= 0) {
        return progressToDepth(0);
      }

      // Land on the deepest point exactly: sub-pixel rounding in the measured
      // offsets otherwise leaves the page bottom a few metres short of the
      // Challenger Deep, which the contact zone's copy names precisely.
      if (window.scrollY >= maxScroll - 1) return MAX_DEPTH;

      // The anchor slides from the top of the viewport at the top of the page
      // to its bottom at the bottom, so it sweeps the whole document — a fixed
      // offset never reaches the end of the final section.
      const through = window.scrollY / maxScroll;
      const anchor = window.scrollY + window.innerHeight * through;

      let current = bands[0];
      for (const b of bands) {
        if (b.top <= anchor) current = b;
      }

      return zoneProgressToDepth(current.id, (anchor - current.top) / current.height);
    };

    const tick = () => {
      const now = performance.now();
      const target = measureDepth();
      const dt = Math.max(now - lastT.current, 1);

      // Exponential ease toward the scroll-derived target, frame-rate
      // independent so it behaves the same at 30fps and 120.
      const k = 1 - Math.exp(-dt / DEPTH_TAU_MS);
      let depth = eased.current + (target - eased.current) * k;

      // Settle rather than approach forever: within a metre, snap. Otherwise
      // the bottom of the page never quite reads 11,034.
      if (Math.abs(target - depth) < 1) depth = target;
      eased.current = depth;

      const instant = ((depth - lastDepth.current) / dt) * 1000;
      const alpha = 1 - Math.exp(-dt / RATE_TAU_MS);
      rate.current += (instant - rate.current) * alpha;

      lastDepth.current = depth;
      lastT.current = now;

      const veil = depthToVeil(depth);
      const snow = depthToSnowDensity(depth);
      // Near-surface scrim: the swell is brightest here and the veil has barely
      // started, so this covers the gap between them.
      const scrim = Math.max(0, 1 - depth / 400);
      // Hadal presence: nothing until the abyssal zone, full by 7,000 m.
      const hadal = Math.min(1, Math.max(0, (depth - 4000) / 3000));
      // The lamp earns its keep with depth; near the surface there is plenty
      // of light without it.
      const lamp = 0.25 + 0.75 * Math.min(depth / 3000, 1);

      // Plain numbers for the canvases, which run their own loops and must not
      // have to ask the style engine what depth it is.
      depthSignal.depth = depth;
      depthSignal.veil = veil;
      depthSignal.snow = snow;
      depthSignal.scrim = scrim;
      depthSignal.hadal = hadal;
      depthSignal.lamp = lamp;

      // Custom properties for the layers that are styled in CSS. A style
      // mutation, not a React render.
      const root = document.documentElement.style;
      root.setProperty("--depth-veil", veil.toFixed(4));
      root.setProperty("--snow-density", snow.toFixed(4));
      root.setProperty("--depth-tint", (1 - depth / MAX_DEPTH).toFixed(4));
      root.setProperty("--surface-scrim", scrim.toFixed(4));
      root.setProperty("--hadal-presence", hadal.toFixed(4));
      root.setProperty("--lamp-strength", lamp.toFixed(3));

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

      // Commit at most every 80ms. Every consumer of this state renders text a
      // human is reading; twelve updates a second is past the point anyone can
      // follow, and reconciling the tree sixty times a second during a scroll
      // is most of what made scrolling feel heavy.
      const due = now - lastCommit.current >= 80;

      if (
        due &&
        (roundedDepth !== pushedDepth.current ||
          roundedRate !== pushedRate.current ||
          second !== pushedSecond.current)
      ) {
        lastCommit.current = now;
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
    return () => {
      cancelAnimationFrame(raf.current);
      ro.disconnect();
      window.removeEventListener("resize", measureLayout);
    };
  }, []);

  return <DepthContext.Provider value={state}>{children}</DepthContext.Provider>;
}
