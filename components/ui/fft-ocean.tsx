"use client";

import { useEffect, useRef } from "react";
import { createRenderer, type OceanRenderer } from "./fft-ocean-utils/renderer";

/**
 * `depth` and `onReady` are both optional, so <FftOcean /> with no props
 * behaves exactly as the standalone component does.
 *
 * `onReady` fires once the renderer has settled — spectrum built, butterfly
 * table uploaded, first frame drawn — or once it has given up and gone inert.
 * It never fires twice and never reports failure differently, because the only
 * caller uses it to stop waiting.
 */
export function FftOcean({
  depth = 0,
  onReady,
}: {
  depth?: number;
  onReady?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<OceanRenderer | null>(null);
  // Held in a ref so a caller passing an inline function cannot tear down and
  // rebuild the whole GL context on every render. Synced in an effect rather
  // than during render, which React forbids; the initial value covers the
  // first pass, and this effect is declared above the one that builds the
  // context so it has already run by the time anything can fire.
  const onReadyRef = useRef(onReady);
  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let live = true;
    const renderer = createRenderer({ canvas });
    rendererRef.current = renderer;
    void renderer.ready.then(() => {
      if (live) onReadyRef.current?.();
    });
    return () => {
      live = false;
      rendererRef.current = null;
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    rendererRef.current?.setDepth(depth);
  }, [depth]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      <canvas ref={canvasRef} className="block h-full w-full touch-none" />
    </div>
  );
}

export default FftOcean;
