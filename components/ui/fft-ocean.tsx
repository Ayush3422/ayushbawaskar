"use client";

import { useEffect, useRef } from "react";
import { createRenderer, type OceanRenderer } from "./fft-ocean-utils/renderer";

/**
 * `depth` is optional and defaults to 0, so <FftOcean /> with no props behaves
 * exactly as the standalone component does.
 */
export function FftOcean({ depth = 0 }: { depth?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<OceanRenderer | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const renderer = createRenderer({ canvas });
    rendererRef.current = renderer;
    void renderer.ready;
    return () => {
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
