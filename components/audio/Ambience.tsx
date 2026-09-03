"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MAX_DEPTH } from "@/lib/depth";
import { useDepth } from "@/components/depth/DepthProvider";

const STORAGE_KEY = "abyss:ambience";

/**
 * Ambience, synthesised rather than played from a file.
 *
 * Nothing is shipped and nothing is licensed: it is filtered noise for the
 * water, a low drone for pressure, and an occasional ping. Because it is
 * generated, it can follow the depth — the filter closes as you descend, so
 * the water muffles the way it actually does, and the drone drops.
 *
 * It never autoplays. Browsers block that, and a page that makes noise at a
 * stranger uninvited deserves to be closed.
 */
export function Ambience() {
  const { depth } = useDepth();
  const [on, setOn] = useState(false);

  const ctxRef = useRef<AudioContext | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const droneRef = useRef<OscillatorNode | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const pingRef = useRef<number | null>(null);
  const depthRef = useRef(0);

  const teardown = useCallback(() => {
    if (pingRef.current) window.clearTimeout(pingRef.current);
    pingRef.current = null;
    droneRef.current?.stop();
    droneRef.current = null;
    void ctxRef.current?.close();
    ctxRef.current = null;
    filterRef.current = null;
    masterRef.current = null;
  }, []);

  const start = useCallback(() => {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new Ctx();
    ctxRef.current = ctx;

    const master = ctx.createGain();
    master.gain.value = 0.0001;
    master.connect(ctx.destination);
    masterRef.current = master;
    // Ease in, so switching it on is not a slap.
    master.gain.exponentialRampToValueAtTime(0.22, ctx.currentTime + 1.6);

    // --- water: two seconds of noise, looped through a moving lowpass ------
    const frames = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < frames; i++) {
      // Brown noise: integrated white. Heavier and less hissy than white,
      // which is what moving water sounds like.
      last = (last + Math.random() * 2 - 1) * 0.5;
      data[i] = last * 3.2;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 900;
    filter.Q.value = 0.6;
    filterRef.current = filter;

    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.5;

    noise.connect(filter).connect(noiseGain).connect(master);
    noise.start();

    // --- pressure: a low drone that sinks with you ------------------------
    const drone = ctx.createOscillator();
    drone.type = "sine";
    drone.frequency.value = 62;
    const droneGain = ctx.createGain();
    droneGain.gain.value = 0.16;
    drone.connect(droneGain).connect(master);
    drone.start();
    droneRef.current = drone;

    // --- the occasional return --------------------------------------------
    const schedule = () => {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      // Deeper pings come back lower, as a longer sound path would.
      osc.frequency.setValueAtTime(
        880 - 420 * Math.min(depthRef.current / MAX_DEPTH, 1),
        t,
      );
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.09, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.5);
      osc.connect(g).connect(master);
      osc.start(t);
      osc.stop(t + 1.6);
      pingRef.current = window.setTimeout(schedule, 7000 + Math.random() * 9000);
    };
    pingRef.current = window.setTimeout(schedule, 3500);
  }, []);

  // Depth drives the filter and the drone while it is running.
  useEffect(() => {
    const ctx = ctxRef.current;
    const filter = filterRef.current;
    const drone = droneRef.current;
    if (!ctx || !filter || !drone) return;

    depthRef.current = depth;
    const t = Math.min(depth / MAX_DEPTH, 1);
    // Water muffles as it deepens: 900 Hz at the surface down to 180 Hz.
    filter.frequency.setTargetAtTime(900 - 720 * t, ctx.currentTime, 0.4);
    drone.frequency.setTargetAtTime(62 - 22 * t, ctx.currentTime, 0.6);
  }, [depth]);

  useEffect(() => teardown, [teardown]);

  const toggle = () => {
    if (on) {
      teardown();
      setOn(false);
      try {
        localStorage.setItem(STORAGE_KEY, "off");
      } catch {
        // Private mode. The toggle still works for this visit.
      }
      return;
    }
    start();
    setOn(true);
    try {
      localStorage.setItem(STORAGE_KEY, "on");
    } catch {
      // As above.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      data-ambience={on ? "on" : "off"}
      aria-pressed={on}
      aria-label={on ? "Turn ambience off" : "Turn ambience on"}
      className="flex items-center gap-2 border-2 px-2.5 py-1.5 font-mono text-[10px] tracking-[0.2em] uppercase transition-colors"
      style={{
        borderColor: on ? "var(--signal)" : "var(--border)",
        color: on ? "var(--signal)" : "var(--muted-foreground)",
      }}
    >
      <span aria-hidden="true">{on ? "▮▮▮" : "▮▯▯"}</span>
      <span className="hidden sm:inline">Sonar</span>
    </button>
  );
}
