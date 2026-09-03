import { MAX_DEPTH } from "./depth";

/**
 * Polar projection for the sonar scope. Bearing is degrees clockwise from
 * north (screen up); range is metres on the same 0..MAX_DEPTH scale the page
 * uses for depth, so "deeper work" and "further out" are the same reading.
 *
 * Returns offsets from the scope centre, in whatever unit radius is given —
 * pixels for an SVG viewBox, or percent when positioning absolute children.
 */
export function contactToXY(
  bearingDeg: number,
  rangeM: number,
  radius: number,
): { x: number; y: number } {
  const t = Math.min(Math.max(rangeM / MAX_DEPTH, 0), 1);
  const r = t * radius;
  const rad = ((bearingDeg - 90) * Math.PI) / 180;
  // Rounded so server and client serialise identically; unrounded trig
  // diverges in the last bits and React reports a hydration mismatch.
  const round = (n: number) => Math.round(n * 1000) / 1000;
  return { x: round(r * Math.cos(rad)), y: round(r * Math.sin(rad)) };
}
