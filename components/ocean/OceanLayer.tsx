"use client";

import { useEffect, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { isOceanSupported } from "@/components/ui/fft-ocean-utils/gl";
import { useDepth } from "@/components/depth/DepthProvider";
import { OceanFallback } from "./OceanFallback";
import { bootSignal } from "@/lib/bootSignal";

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

  // The capability probe has run by the time this renders, so the answer —
  // either answer — is a milestone the boot screen can stop waiting on. When
  // there is no ocean to build there is nothing further to wait for either, so
  // both are reported at once rather than leaving the bar hanging at half.
  useEffect(() => {
    bootSignal.mark("gauges");
    if (!supported) bootSignal.mark("spectrum");
  }, [supported]);

  return (
    <div data-ocean-layer aria-hidden="true" className="fixed inset-0 -z-10">
      {supported ? (
        <FftOcean depth={depth} onReady={() => bootSignal.mark("spectrum")} />
      ) : (
        <OceanFallback />
      )}
    </div>
  );
}
