"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { isOceanSupported } from "@/components/ui/fft-ocean-utils/gl";
import { useDepth } from "@/components/depth/DepthProvider";
import { OceanFallback } from "./OceanFallback";

const FftOcean = dynamic(
  () => import("@/components/ui/fft-ocean").then((m) => m.FftOcean),
  { ssr: false, loading: () => null },
);

/**
 * One fixed canvas behind the whole page. Support is probed on a throwaway
 * canvas before the real one mounts, so an unsupported browser never sees a
 * black rectangle appear and then get replaced.
 */
export function OceanLayer() {
  const { depth } = useDepth();
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setSupported(isOceanSupported(document.createElement("canvas")));
  }, []);

  return (
    <div data-ocean-layer aria-hidden="true" className="fixed inset-0 -z-10">
      {supported === true ? <FftOcean depth={depth} /> : <OceanFallback />}
    </div>
  );
}
