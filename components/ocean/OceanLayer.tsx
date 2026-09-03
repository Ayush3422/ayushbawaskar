"use client";

import { useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { isOceanSupported } from "@/components/ui/fft-ocean-utils/gl";
import { useDepth } from "@/components/depth/DepthProvider";
import { OceanFallback } from "./OceanFallback";

const FftOcean = dynamic(
  () => import("@/components/ui/fft-ocean").then((m) => m.FftOcean),
  { ssr: false, loading: () => null },
);

/** Capability cannot change for the life of the page, so nothing to subscribe to. */
const subscribe = () => () => {};

let cached: boolean | null = null;
const getSnapshot = () => {
  if (cached === null) {
    cached = isOceanSupported(document.createElement("canvas"));
  }
  return cached;
};
const getServerSnapshot = () => false;

/**
 * One fixed canvas behind the whole page. Support is probed on a throwaway
 * canvas, so an unsupported browser never sees a black rectangle appear and
 * then get replaced.
 */
export function OceanLayer() {
  const { depth } = useDepth();
  const supported = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return (
    <div data-ocean-layer aria-hidden="true" className="fixed inset-0 -z-10">
      {supported ? <FftOcean depth={depth} /> : <OceanFallback />}
    </div>
  );
}
