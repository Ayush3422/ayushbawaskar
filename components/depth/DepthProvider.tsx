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

  useEffect(() => {
    startedAt.current = performance.now();
    lastT.current = startedAt.current;

    const tick = () => {
      const now = performance.now();
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      const depth = progressToDepth(progress);

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
