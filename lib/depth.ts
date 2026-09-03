export const MAX_DEPTH = 11034;

export type ZoneId =
  | "surface"
  | "sunlight"
  | "twilight"
  | "midnight"
  | "abyssal"
  | "hadal";

export interface Zone {
  id: ZoneId;
  label: string;
  min: number;
  max: number;
}

export const ZONES: readonly Zone[] = [
  { id: "surface", label: "Surface", min: 0, max: 40 },
  { id: "sunlight", label: "Sunlight", min: 40, max: 200 },
  { id: "twilight", label: "Twilight", min: 200, max: 1000 },
  { id: "midnight", label: "Midnight", min: 1000, max: 4000 },
  { id: "abyssal", label: "Abyssal", min: 4000, max: 6000 },
  { id: "hadal", label: "Hadal", min: 6000, max: MAX_DEPTH },
] as const;

const clamp = (v: number, lo: number, hi: number) =>
  v < lo ? lo : v > hi ? hi : v;

/**
 * A depth exactly on a boundary belongs to the deeper zone, so descending past
 * 200 m reads as "Twilight" rather than lingering on "Sunlight". MAX_DEPTH is
 * the sole exception — there is no deeper zone to fall into.
 */
export function depthToZone(depth: number): Zone {
  const d = clamp(depth, 0, MAX_DEPTH);
  for (let i = ZONES.length - 1; i >= 0; i--) {
    if (d >= ZONES[i].min) return ZONES[i];
  }
  return ZONES[0];
}

export function depthToPressure(depth: number): number {
  return clamp(depth, 0, MAX_DEPTH) / 10 + 1;
}

export function progressToDepth(progress: number): number {
  return clamp(progress, 0, 1) * MAX_DEPTH;
}

/**
 * Depth from a position *within one zone's section*, rather than from overall
 * scroll progress.
 *
 * The zones are wildly unequal in metres — Surface spans 40 m, Hadal spans
 * 5,034 — but their sections are roughly equal on screen. Mapping raw scroll
 * progress across the whole page therefore puts the reader at 3,600 m while
 * the heading above them still says Twilight. Interpolating inside the zone
 * the reader is actually in keeps the nav, the headings and the HUD agreeing.
 */
export function zoneProgressToDepth(zoneId: ZoneId, t: number): number {
  const z = ZONES.find((x) => x.id === zoneId) ?? ZONES[0];
  return z.min + clamp(t, 0, 1) * (z.max - z.min);
}

/** Where the view begins returning to the surface. Mirrors the ocean renderer. */
const HADAL_START = 6000;

/**
 * Overlay alpha. Square-rooted so the light falls off fast near the surface,
 * which is how water actually behaves — most of the sunlight is gone by 200 m.
 *
 * It then lifts again across the hadal zone. That is not oceanography: the
 * page ends on the lit surface it opened with, and the veil has to get out of
 * the way for that to be visible. Capped at 0.46 even at its darkest, because
 * past that it crushes the ocean behind it into a flat black rectangle.
 */
export function depthToVeil(depth: number): number {
  const d = clamp(depth, 0, MAX_DEPTH);
  const t = d / MAX_DEPTH;
  const rise = clamp((d - HADAL_START) / (MAX_DEPTH - HADAL_START), 0, 1);
  return 0.46 * Math.sqrt(t) * (1 - rise);
}

/** Gaussian centred on the twilight zone, where marine snow is thickest. */
export function depthToSnowDensity(depth: number): number {
  const d = clamp(depth, 0, MAX_DEPTH);
  const peak = 600;
  const width = 2200;
  return Math.exp(-((d - peak) ** 2) / (2 * width ** 2));
}
