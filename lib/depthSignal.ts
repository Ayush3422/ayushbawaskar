/**
 * The depth values, as plain mutable numbers.
 *
 * The canvases used to read these back out of CSS custom properties with
 * getComputedStyle inside their animation loops. That forces a style
 * recalculation on every read, twice a frame, while the depth provider is
 * writing those same properties — a textbook thrash. They read from here now;
 * the custom properties remain, because CSS-driven layers still need them.
 *
 * Deliberately not React state: these change every frame and nothing that
 * reads them renders.
 */
export const depthSignal = {
  depth: 0,
  veil: 0,
  snow: 0,
  scrim: 1,
  hadal: 0,
  lamp: 0.25,
};
