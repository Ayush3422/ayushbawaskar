# ABYSS Foundry Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a personal portfolio site for Ayush Bawaskar organised around a scroll-driven ocean-depth metaphor, with a WebGL2 FFT ocean backdrop, a dive-computer HUD, and a sonar contact scope in place of a project grid.

**Architecture:** A single scroll-derived depth value (0–11,034 m) held in one React context is the site's only source of truth for visual state. Every consumer — ocean shader uniforms, HUD readouts, CSS custom properties, zone reveals — reads from it and nothing recomputes it. The ocean is one fixed full-viewport WebGL2 canvas behind the whole page, not a hero element. All page content is real DOM, so every canvas feature can fail without taking the site down.

**Tech Stack:** Next.js 15 (App Router), TypeScript (strict), Tailwind CSS v4, shadcn/ui, Motion, raw WebGL2 (no three.js), Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-09-03-abyss-foundry-design.md`

## Global Constraints

- **Dark mode only.** No light theme, no theme toggle, no `dark:` variants. `<html>` carries `class="dark"` permanently.
- **`--signal` (coral `#e57373`) is reserved.** Use it only for: an active sonar return, the HUD ascent-rate warning, a focus ring, or a hyperlink. Never decorative. Every other surface is graphite.
- **Verifiable claims only.** Every factual assertion in `data/` must trace to a repository README or a confirmed biographical fact. Do not invent metrics, dates, awards, or certifications. Do not restore the excluded items listed in spec §6.
- **No runtime network calls.** All content is static, imported at build time. No `fetch` in any component.
- **Node 20+, Next 15+, React 19, Tailwind v4.**
- **Content must survive canvas failure.** No text, link, or navigation target may exist only inside a `<canvas>`.
- **`prefers-reduced-motion: reduce` is honoured everywhere.** Never gate content behind an animation.
- **Never `git push`.** Commit locally only. Pushing requires Ayush's explicit instruction.

---

### Task 1: Project scaffold, graphite tokens, test harness

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `components.json`
- Create: `app/layout.tsx`, `app/page.tsx`, `app/globals.css`
- Create: `vitest.config.ts`, `playwright.config.ts`
- Test: `tests/unit/tokens.test.ts`

**Interfaces:**
- Consumes: nothing (first task)
- Produces: a running Next.js app at `localhost:3000`; `npm run test:unit` and `npm run test:e2e` both execute; CSS custom properties `--background`, `--card`, `--border`, `--foreground`, `--muted-foreground`, `--primary`, `--signal` defined on `:root`

- [ ] **Step 1: Scaffold Next.js**

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm --yes
```

- [ ] **Step 2: Add shadcn/ui and the components used by this plan**

```bash
npx shadcn@latest init -d
npx shadcn@latest add sheet card button badge separator
npm install motion
```

- [ ] **Step 3: Install and configure the test harness**

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @playwright/test
npx playwright install chromium
```

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: { environment: "jsdom", include: ["tests/unit/**/*.test.ts?(x)"] },
  resolve: { alias: { "@": path.resolve(__dirname, ".") } },
});
```

Create `playwright.config.ts`:

```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  use: { baseURL: "http://localhost:3000" },
  webServer: {
    command: "npm run build && npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
```

Add to `package.json` scripts:

```json
"test:unit": "vitest run",
"test:e2e": "playwright test"
```

- [ ] **Step 4: Write the failing token test**

Create `tests/unit/tokens.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";

const css = readFileSync("app/globals.css", "utf8");

describe("graphite tokens", () => {
  it("defines every required token on :root", () => {
    for (const token of [
      "--background", "--card", "--border",
      "--foreground", "--muted-foreground", "--primary", "--signal",
    ]) {
      expect(css).toContain(token);
    }
  });

  it("defines the reserved signal colour as coral", () => {
    expect(css).toMatch(/--signal:\s*#e57373/);
  });

  it("declares no light-mode block", () => {
    expect(css).not.toContain("prefers-color-scheme: light");
  });
});
```

- [ ] **Step 5: Run the test to verify it fails**

Run: `npm run test:unit -- tokens`
Expected: FAIL — `--signal` not found in `app/globals.css`.

- [ ] **Step 6: Write the graphite token block**

Replace `app/globals.css` with:

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:where(.dark, .dark *));

:root {
  --background: #0a0a0a;
  --foreground: #fafafa;
  --card: #141414;
  --card-foreground: #fafafa;
  --popover: #141414;
  --popover-foreground: #fafafa;
  --primary: #d4d4d4;
  --primary-foreground: #0a0a0a;
  --secondary: #2a2a2a;
  --secondary-foreground: #fafafa;
  --muted: #2a2a2a;
  --muted-foreground: #a1a1a1;
  --accent: #2a2a2a;
  --accent-foreground: #fafafa;
  --border: #262626;
  --input: #262626;
  --ring: #e57373;

  /* Reserved. Live state only: sonar return, HUD warning, focus, link. */
  --signal: #e57373;

  /* Written each frame by the depth provider. */
  --depth-veil: 0;
  --depth-tint: 0;
  --snow-density: 0;

  --radius: 0.5rem;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-signal: var(--signal);
  --font-sans: var(--font-inter);
  --font-mono: var(--font-geist-mono);
  --radius-lg: var(--radius);
}

* { border-color: var(--border); }

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans), ui-sans-serif, system-ui, sans-serif;
  overscroll-behavior-y: none;
}

a:focus-visible,
button:focus-visible,
[tabindex]:focus-visible {
  outline: 2px solid var(--signal);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 7: Set fonts and permanent dark class in the layout**

Replace `app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: "Ayush Bawaskar — ABYSS",
  description:
    "Applied ML, blockchain and systems work by Ayush Bawaskar. Every claim on this page links to the repository that backs it.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 8: Run the test to verify it passes**

Run: `npm run test:unit -- tokens`
Expected: PASS, 3 tests.

- [ ] **Step 9: Verify the app builds and serves**

Run: `npm run build`
Expected: build completes with no type errors.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js app with graphite dark tokens and test harness"
```

---

### Task 2: Depth core

**Files:**
- Create: `lib/depth.ts`
- Create: `lib/hooks/useReducedMotion.ts`
- Create: `components/depth/DepthProvider.tsx`
- Test: `tests/unit/depth.test.ts`

**Interfaces:**
- Consumes: Task 1 CSS custom properties
- Produces:
  - `MAX_DEPTH: number` (11034)
  - `ZONES: readonly Zone[]` where `Zone = { id: ZoneId; label: string; min: number; max: number }`
  - `ZoneId = "surface" | "sunlight" | "twilight" | "midnight" | "abyssal" | "hadal"`
  - `depthToZone(depth: number): Zone`
  - `depthToPressure(depth: number): number`
  - `progressToDepth(progress: number): number`
  - `depthToVeil(depth: number): number`
  - `depthToSnowDensity(depth: number): number`
  - `useDepth(): DepthState` where `DepthState = { depth: number; zone: Zone; pressureBar: number; descentRate: number; elapsedMs: number }`
  - `<DepthProvider>` React client component
  - `useReducedMotion(): boolean`

- [ ] **Step 1: Write the failing depth tests**

Create `tests/unit/depth.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
  MAX_DEPTH, ZONES, depthToZone, depthToPressure,
  progressToDepth, depthToVeil, depthToSnowDensity,
} from "@/lib/depth";

describe("MAX_DEPTH", () => {
  it("is the Challenger Deep", () => {
    expect(MAX_DEPTH).toBe(11034);
  });
});

describe("ZONES", () => {
  it("covers 0 to MAX_DEPTH with no gap or overlap", () => {
    expect(ZONES[0].min).toBe(0);
    expect(ZONES[ZONES.length - 1].max).toBe(MAX_DEPTH);
    for (let i = 1; i < ZONES.length; i++) {
      expect(ZONES[i].min).toBe(ZONES[i - 1].max);
    }
  });
});

describe("depthToZone", () => {
  it("maps interior depths to the right zone", () => {
    expect(depthToZone(0).id).toBe("surface");
    expect(depthToZone(20).id).toBe("surface");
    expect(depthToZone(120).id).toBe("sunlight");
    expect(depthToZone(600).id).toBe("twilight");
    expect(depthToZone(2500).id).toBe("midnight");
    expect(depthToZone(5000).id).toBe("abyssal");
    expect(depthToZone(9000).id).toBe("hadal");
  });

  it("assigns a boundary depth to the deeper zone", () => {
    expect(depthToZone(40).id).toBe("sunlight");
    expect(depthToZone(200).id).toBe("twilight");
    expect(depthToZone(1000).id).toBe("midnight");
    expect(depthToZone(4000).id).toBe("abyssal");
    expect(depthToZone(6000).id).toBe("hadal");
  });

  it("clamps out-of-range input rather than returning undefined", () => {
    expect(depthToZone(-500).id).toBe("surface");
    expect(depthToZone(MAX_DEPTH).id).toBe("hadal");
    expect(depthToZone(99999).id).toBe("hadal");
  });
});

describe("depthToPressure", () => {
  it("is 1 bar at the surface and adds a bar per 10 m", () => {
    expect(depthToPressure(0)).toBe(1);
    expect(depthToPressure(10)).toBeCloseTo(2);
    expect(depthToPressure(1000)).toBeCloseTo(101);
  });
});

describe("progressToDepth", () => {
  it("maps clamped scroll progress onto the depth range", () => {
    expect(progressToDepth(0)).toBe(0);
    expect(progressToDepth(0.5)).toBeCloseTo(MAX_DEPTH / 2);
    expect(progressToDepth(1)).toBe(MAX_DEPTH);
    expect(progressToDepth(-1)).toBe(0);
    expect(progressToDepth(2)).toBe(MAX_DEPTH);
  });
});

describe("depthToVeil", () => {
  it("runs from clear at the surface to 0.72 in the hadal zone", () => {
    expect(depthToVeil(0)).toBe(0);
    expect(depthToVeil(MAX_DEPTH)).toBeCloseTo(0.72);
  });

  it("increases monotonically", () => {
    let prev = -1;
    for (let d = 0; d <= MAX_DEPTH; d += 500) {
      const v = depthToVeil(d);
      expect(v).toBeGreaterThanOrEqual(prev);
      prev = v;
    }
  });
});

describe("depthToSnowDensity", () => {
  it("peaks in the twilight zone and thins above and below", () => {
    const twilight = depthToSnowDensity(600);
    expect(twilight).toBeGreaterThan(depthToSnowDensity(0));
    expect(twilight).toBeGreaterThan(depthToSnowDensity(9000));
  });

  it("never leaves the 0..1 range", () => {
    for (let d = 0; d <= MAX_DEPTH; d += 250) {
      const v = depthToSnowDensity(d);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    }
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test:unit -- depth`
Expected: FAIL — cannot resolve `@/lib/depth`.

- [ ] **Step 3: Implement the depth math**

Create `lib/depth.ts`:

```ts
export const MAX_DEPTH = 11034;

export type ZoneId =
  | "surface" | "sunlight" | "twilight"
  | "midnight" | "abyssal" | "hadal";

export interface Zone {
  id: ZoneId;
  label: string;
  min: number;
  max: number;
}

export const ZONES: readonly Zone[] = [
  { id: "surface",  label: "Surface",  min: 0,    max: 40 },
  { id: "sunlight", label: "Sunlight", min: 40,   max: 200 },
  { id: "twilight", label: "Twilight", min: 200,  max: 1000 },
  { id: "midnight", label: "Midnight", min: 1000, max: 4000 },
  { id: "abyssal",  label: "Abyssal",  min: 4000, max: 6000 },
  { id: "hadal",    label: "Hadal",    min: 6000, max: MAX_DEPTH },
] as const;

const clamp = (v: number, lo: number, hi: number) =>
  v < lo ? lo : v > hi ? hi : v;

/**
 * A depth exactly on a boundary belongs to the deeper zone, so descending
 * past 200 m reads as "Twilight" rather than lingering on "Sunlight".
 * MAX_DEPTH is the sole exception — there is no deeper zone to fall into.
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

export function depthToVeil(depth: number): number {
  const t = clamp(depth, 0, MAX_DEPTH) / MAX_DEPTH;
  return 0.72 * Math.sqrt(t);
}

/** Gaussian centred on the twilight zone, where marine snow is thickest. */
export function depthToSnowDensity(depth: number): number {
  const d = clamp(depth, 0, MAX_DEPTH);
  const peak = 600;
  const width = 2200;
  return Math.exp(-((d - peak) ** 2) / (2 * width ** 2));
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test:unit -- depth`
Expected: PASS, all cases.

- [ ] **Step 5: Add the reduced-motion hook**

Create `lib/hooks/useReducedMotion.ts`:

```ts
"use client";

import { useEffect, useState } from "react";

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
```

- [ ] **Step 6: Implement the depth provider**

Create `components/depth/DepthProvider.tsx`:

```tsx
"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  MAX_DEPTH, ZONES, type Zone,
  depthToPressure, depthToSnowDensity, depthToVeil, depthToZone, progressToDepth,
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

  useEffect(() => {
    startedAt.current = performance.now();
    lastT.current = startedAt.current;

    const tick = () => {
      const now = performance.now();
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      const depth = progressToDepth(progress);

      const dt = Math.max(now - lastT.current, 1);
      const instant = ((depth - lastDepth.current) / dt) * 1000;
      const alpha = 1 - Math.exp(-dt / RATE_TAU_MS);
      rate.current += (instant - rate.current) * alpha;

      lastDepth.current = depth;
      lastT.current = now;

      const root = document.documentElement.style;
      root.setProperty("--depth-veil", depthToVeil(depth).toFixed(4));
      root.setProperty("--snow-density", depthToSnowDensity(depth).toFixed(4));
      root.setProperty("--depth-tint", (1 - depth / MAX_DEPTH).toFixed(4));

      setState({
        depth,
        zone: depthToZone(depth),
        pressureBar: depthToPressure(depth),
        descentRate: rate.current,
        elapsedMs: now - startedAt.current,
      });

      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  return <DepthContext.Provider value={state}>{children}</DepthContext.Provider>;
}
```

- [ ] **Step 7: Run the full unit suite**

Run: `npm run test:unit`
Expected: PASS — tokens and depth suites both green.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add depth math, reduced-motion hook, and depth provider"
```

---

### Task 3: Data layer

**Files:**
- Create: `data/types.ts`, `data/profile.ts`, `data/projects.ts`, `data/skills.ts`, `data/timeline.ts`
- Test: `tests/unit/data.test.ts`

**Interfaces:**
- Consumes: `MAX_DEPTH` from `lib/depth`
- Produces:
  - `Project = { slug, name, domain, bearing, range, summary, lede, metrics, stack, repoUrl, caveat? }`
  - `Metric = { label: string; value: string; note?: string }`
  - `Skill = { name: string; depth: number; evidenceSlug: string; evidenceLabel: string }`
  - `TimelineEntry = { when: string; title: string; detail: string }`
  - `Profile` with `name`, `heroLine`, `role`, `education`, `links`, `interests`, `about`
  - `projects: Project[]`, `skills: Skill[]`, `timeline: TimelineEntry[]`, `profile: Profile`

**Content rule for this task:** every string below is drawn from spec §6, which in turn is drawn from Ayush's own README files. Do not embellish. Do not add metrics that are not listed here.

- [ ] **Step 1: Write the failing data tests**

Create `tests/unit/data.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { MAX_DEPTH } from "@/lib/depth";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";
import { profile } from "@/data/profile";

describe("projects", () => {
  it("plots exactly the five agreed contacts", () => {
    expect(projects.map((p) => p.slug).sort()).toEqual(
      ["booksense", "energy-forecasting", "nostro", "quantumchat", "vortifi"],
    );
  });

  it("excludes the Dynamo task and the nonexistent kisan-mitra", () => {
    const blob = JSON.stringify(projects).toLowerCase();
    expect(blob).not.toContain("dynamo");
    expect(blob).not.toContain("kisan");
  });

  it("gives every contact a bearing in [0,360) and a range within the depth range", () => {
    for (const p of projects) {
      expect(p.bearing).toBeGreaterThanOrEqual(0);
      expect(p.bearing).toBeLessThan(360);
      expect(p.range).toBeGreaterThan(0);
      expect(p.range).toBeLessThanOrEqual(MAX_DEPTH);
    }
  });

  it("gives every contact a distinct bearing so contacts never overlap", () => {
    const bearings = projects.map((p) => p.bearing);
    expect(new Set(bearings).size).toBe(bearings.length);
  });

  it("links every contact to a real repository under Ayush3422", () => {
    for (const p of projects) {
      expect(p.repoUrl).toMatch(/^https:\/\/github\.com\/Ayush3422\/[\w.-]+$/);
    }
  });

  it("carries the honesty caveats that the spec requires", () => {
    const quantum = projects.find((p) => p.slug === "quantumchat")!;
    expect(quantum.caveat).toMatch(/simulated/i);
    const nostro = projects.find((p) => p.slug === "nostro")!;
    expect(nostro.caveat).toMatch(/razorpay-side/i);
  });

  it("ranks NOSTRO deepest", () => {
    const deepest = [...projects].sort((a, b) => b.range - a.range)[0];
    expect(deepest.slug).toBe("nostro");
  });
});

describe("skills", () => {
  it("cites a project that exists for every skill", () => {
    const slugs = new Set([...projects.map((p) => p.slug), "abyss"]);
    for (const s of skills) {
      expect(slugs.has(s.evidenceSlug)).toBe(true);
    }
  });

  it("places each skill at the depth of the project it cites", () => {
    for (const s of skills) {
      const p = projects.find((x) => x.slug === s.evidenceSlug);
      if (p) expect(s.depth).toBe(p.range);
    }
  });

  it("uses no self-assigned percentage scores", () => {
    for (const s of skills) {
      expect(s).not.toHaveProperty("level");
    }
  });
});

describe("profile", () => {
  it("carries the decided hero line", () => {
    expect(profile.heroLine).toBe(
      "I hold the data out before I believe the number.",
    );
  });

  it("omits the claims excluded by the spec", () => {
    const blob = JSON.stringify(profile).toLowerCase();
    for (const banned of [
      "dean's list", "research publication", "professional ml engineer",
      "study group", "open-source contributor",
    ]) {
      expect(blob).not.toContain(banned);
    }
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test:unit -- data`
Expected: FAIL — cannot resolve `@/data/projects`.

- [ ] **Step 3: Define the types**

Create `data/types.ts`:

```ts
export interface Metric {
  label: string;
  value: string;
  note?: string;
}

export interface Project {
  slug: string;
  name: string;
  /** Sonar bearing label, e.g. "Applied ML / finance". */
  domain: string;
  /** Degrees clockwise from north. Distinct per contact. */
  bearing: number;
  /** Sonar range in metres — how deep the work goes, not where it sits on the page. */
  range: number;
  /** One line, shown on the blip label. */
  summary: string;
  /** Opening paragraph of the contact sheet. */
  lede: string;
  metrics: Metric[];
  stack: string[];
  repoUrl: string;
  /**
   * A limitation stated in the project's own README. Rendered prominently,
   * never as fine print — the site's premise is checkable claims.
   */
  caveat?: string;
}

export interface Skill {
  name: string;
  /** Depth of the deepest project that used it. */
  depth: number;
  evidenceSlug: string;
  evidenceLabel: string;
}

export interface TimelineEntry {
  when: string;
  title: string;
  detail: string;
}

export interface Profile {
  name: string;
  heroLine: string;
  role: string;
  education: { degree: string; institution: string; period: string }[];
  links: { label: string; href: string }[];
  interests: string[];
  about: string[];
}
```

- [ ] **Step 4: Write the profile**

Create `data/profile.ts`:

```ts
import type { Profile } from "./types";

export const profile: Profile = {
  name: "Ayush Bawaskar",
  heroLine: "I hold the data out before I believe the number.",
  role: "Applied ML · Blockchain · Systems",
  education: [
    {
      degree: "BTech, Computer Science & Engineering (AI-ML)",
      institution: "New LJ Institute of Engineering & Technology",
      period: "Aug 2024 — 2028",
    },
    {
      degree: "Minor, AI & Data Science",
      institution: "IIT Mandi",
      period: "In progress",
    },
  ],
  links: [
    { label: "Email", href: "mailto:ayushbawaskar4@gmail.com" },
    { label: "GitHub", href: "https://github.com/Ayush3422" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/ayush-bawaskar-254322340/" },
  ],
  interests: ["Cricket", "Strategy and FPS games", "Hackathons"],
  about: [
    "I build machine-learning systems and then try to find the number that proves they do not work. Most of what I have learned came from that second step: holding data out before fitting anything to it, splitting time series chronologically instead of at random, and tracking catalog coverage next to precision so a model cannot win by hiding behind whatever is already popular.",
    "The work below spans applied ML, a Solidity voting contract, and an educational post-quantum messaging prototype. Every result on this page was produced by a script in the repository it links to, and where a project has a limitation, the limitation is on the card.",
  ],
};
```

- [ ] **Step 5: Write the projects**

Create `data/projects.ts`:

```ts
import type { Project } from "./types";

export const projects: Project[] = [
  {
    slug: "nostro",
    name: "NOSTRO",
    domain: "Applied ML / finance",
    bearing: 30,
    range: 9200,
    summary: "Three-way settlement reconciliation, evaluated on held-out cycles.",
    lede:
      "Three-way settlement reconciliation for Indian merchants — Razorpay settlement report against bank statement against ERP ledger — built for the Razorpay AI Buildathon, Track 4 (AI Finance Controller). Nine of thirty settlement cycles were withheld from both the calibrator and the auto-post threshold and scored only after fitting was done.",
    metrics: [
      { label: "Precision", value: "0.9937", note: "held-out · 0.9905 in-sample" },
      { label: "Recall", value: "0.6894", note: "held-out · 0.6874 in-sample" },
      { label: "F1", value: "0.8140", note: "held-out · 0.8116 in-sample" },
      { label: "Match rate", value: "0.9413", note: "held-out, Razorpay-side" },
      { label: "Dataset", value: "5,982 rows", note: "2,443 Razorpay · 1,328 bank · 2,211 ERP" },
    ],
    stack: ["Python", "pandas", "NumPy"],
    repoUrl: "https://github.com/Ayush3422/NOSTRO",
    caveat:
      "Match rate is reported Razorpay-side on purpose. Bank and ERP rows carry no settlement-cycle id, so a holdout built on those sources would be scoped to rows a holdout match already touched — making the figure tautologically near 100% and not comparable. Every number here was produced by scripts/build_evaluation.py, not typed by hand.",
  },
  {
    slug: "energy-forecasting",
    name: "ENERGY_FORECASTING",
    domain: "Applied ML / time series",
    bearing: 70,
    range: 5400,
    summary: "Hour-ahead grid load forecasting, 88% below the naive baseline.",
    lede:
      "Hour-ahead electricity demand forecasting for the PJM East grid region. The headline finding is that load is U-shaped against temperature — demand rises in both directions away from about 15–20°C — so temperature belongs in the model as a first-class feature rather than time-of-day alone.",
    metrics: [
      { label: "MAE", value: "255 MW", note: "naive baseline 2,184 MW" },
      { label: "RMSE", value: "348 MW", note: "naive baseline 3,009 MW" },
      { label: "MAPE", value: "0.81%", note: "naive baseline 6.93%" },
      { label: "Error reduction", value: "~88%", note: "tuned XGBoost vs load 24h ago" },
    ],
    stack: ["Python", "XGBoost", "SHAP", "pandas"],
    repoUrl: "https://github.com/Ayush3422/ENERGY_FORECASTING",
    caveat:
      "The split is chronological, not random k-fold — shuffling this data lets lag and rolling features carry the future into training. Residuals are worst where the model matters most: 390 MW mean absolute error on the hottest 5% of hours, against 223 MW at mid-range temperatures.",
  },
  {
    slug: "booksense",
    name: "BookSense AI",
    domain: "Applied ML / recommenders",
    bearing: 105,
    range: 4600,
    summary: "Hybrid recommender measured on ranking metrics and cold start.",
    lede:
      "A hybrid recommender over goodbooks-10k — 10,000 books, 5,976,479 ratings, 53,424 users — blending ALS collaborative filtering with TF-IDF content similarity over authors and community genre tags. The user-item matrix is 98.88% empty and the top 1% of titles take 17.1% of all ratings, which is why coverage is tracked alongside precision.",
    metrics: [
      { label: "Precision@10", value: "0.258", note: "warm hybrid · 0.231 collaborative · 0.156 content" },
      { label: "NDCG@10", value: "0.306", note: "warm hybrid" },
      { label: "Recall@10", value: "0.178", note: "warm hybrid" },
      { label: "Cold-start coverage", value: "19.1%", note: "vs 8.0% collaborative" },
      { label: "Blend weight", value: "α = 0.6", note: "grid search on held-out Precision@10" },
    ],
    stack: ["Python", "implicit / ALS", "scikit-learn", "TF-IDF"],
    repoUrl: "https://github.com/Ayush3422/book-recommendation-system",
    caveat:
      "The cold-start result is the interesting one and it is not a clean win. Collaborative filtering looks competitive on raw precision with only three interactions, but its catalog coverage collapses to 8% because a user vector refit from almost no data falls back on globally popular items. The hybrid trades precision for 2.4x broader coverage. Cold start is simulated by truncating 300 real users to three interactions, since every goodbooks user already has at least nineteen.",
  },
  {
    slug: "vortifi",
    name: "VortiFi",
    domain: "Blockchain",
    bearing: 180,
    range: 1900,
    summary: "Ethereum voting DApp with token-gated ballots.",
    lede:
      "A decentralised voting application for Rotaract club elections. A Solidity contract holds candidates, voter registration and tallies; a React frontend talks to it over ethers.js, with token-based voter authentication and separate admin and voter flows.",
    metrics: [
      { label: "Contract", value: "RotaractVoting.sol" },
      { label: "Deployment", value: "Hardhat Ignition" },
      { label: "Auth", value: "One-time voter tokens" },
    ],
    stack: ["Solidity", "Hardhat", "React", "ethers.js"],
    repoUrl: "https://github.com/Ayush3422/VortiFi",
  },
  {
    slug: "quantumchat",
    name: "QuantumChat",
    domain: "Cryptography",
    bearing: 285,
    range: 1200,
    summary: "End-to-end encrypted messaging over a simulated Kyber KEM.",
    lede:
      "Real-time end-to-end encrypted messaging over WebSocket. Each client generates a post-quantum key pair, clients exchange public keys to establish a shared secret, and messages are encrypted with AES-256-GCM.",
    metrics: [
      { label: "KEM", value: "Kyber-1024", note: "simulated" },
      { label: "Cipher", value: "AES-256-GCM" },
      { label: "Transport", value: "WebSocket" },
    ],
    stack: ["Node.js", "Express", "WebSocket", "JavaScript"],
    repoUrl: "https://github.com/Ayush3422/quantum_crypto",
    caveat:
      "The Kyber-1024 key exchange is simulated, not a production implementation, and this project is educational. It demonstrates the shape of a lattice-based KEM and where it sits in a messaging protocol — it does not provide real post-quantum security.",
  },
];
```

- [ ] **Step 6: Write the skills and timeline**

Create `data/skills.ts`:

```ts
import type { Skill } from "./types";

/**
 * Depth is evidence, not self-assessment: each skill sits at the depth of the
 * deepest project that actually used it. "abyss" is this site.
 */
export const skills: Skill[] = [
  { name: "Python", depth: 9200, evidenceSlug: "nostro", evidenceLabel: "NOSTRO" },
  { name: "pandas / NumPy", depth: 9200, evidenceSlug: "nostro", evidenceLabel: "NOSTRO" },
  { name: "Evaluation design", depth: 9200, evidenceSlug: "nostro", evidenceLabel: "NOSTRO" },
  { name: "XGBoost", depth: 5400, evidenceSlug: "energy-forecasting", evidenceLabel: "ENERGY_FORECASTING" },
  { name: "Time-series validation", depth: 5400, evidenceSlug: "energy-forecasting", evidenceLabel: "ENERGY_FORECASTING" },
  { name: "SHAP / explainability", depth: 5400, evidenceSlug: "energy-forecasting", evidenceLabel: "ENERGY_FORECASTING" },
  { name: "scikit-learn", depth: 4600, evidenceSlug: "booksense", evidenceLabel: "BookSense AI" },
  { name: "ALS / matrix factorisation", depth: 4600, evidenceSlug: "booksense", evidenceLabel: "BookSense AI" },
  { name: "TF-IDF / content similarity", depth: 4600, evidenceSlug: "booksense", evidenceLabel: "BookSense AI" },
  { name: "React", depth: 1900, evidenceSlug: "vortifi", evidenceLabel: "VortiFi" },
  { name: "Solidity", depth: 1900, evidenceSlug: "vortifi", evidenceLabel: "VortiFi" },
  { name: "Hardhat / ethers.js", depth: 1900, evidenceSlug: "vortifi", evidenceLabel: "VortiFi" },
  { name: "Node.js / Express", depth: 1200, evidenceSlug: "quantumchat", evidenceLabel: "QuantumChat" },
  { name: "WebSockets", depth: 1200, evidenceSlug: "quantumchat", evidenceLabel: "QuantumChat" },
  { name: "Applied cryptography", depth: 1200, evidenceSlug: "quantumchat", evidenceLabel: "QuantumChat" },
  { name: "TypeScript", depth: 600, evidenceSlug: "abyss", evidenceLabel: "This site" },
  { name: "Next.js / Tailwind", depth: 600, evidenceSlug: "abyss", evidenceLabel: "This site" },
  { name: "WebGL2 / GLSL", depth: 600, evidenceSlug: "abyss", evidenceLabel: "This site" },
];
```

Create `data/timeline.ts`:

```ts
import type { TimelineEntry } from "./types";

export const timeline: TimelineEntry[] = [
  {
    when: "Aug 2024",
    title: "Began BTech CSE (AI-ML)",
    detail: "New LJ Institute of Engineering & Technology, Ahmedabad.",
  },
  {
    when: "Aug 2025",
    title: "First shipped repositories",
    detail: "VortiFi and QuantumChat — a Solidity voting DApp and an educational post-quantum messaging prototype.",
  },
  {
    when: "2025 — 2026",
    title: "Minor in AI & Data Science",
    detail: "IIT Mandi, alongside the BTech.",
  },
  {
    when: "Jul — Aug 2026",
    title: "Applied ML portfolio",
    detail: "ENERGY_FORECASTING and BookSense AI — grid load forecasting and a hybrid recommender, both evaluated against real baselines.",
  },
  {
    when: "Sep 2026",
    title: "NOSTRO",
    detail: "Three-way settlement reconciliation for the Razorpay AI Buildathon, Track 4.",
  },
];
```

- [ ] **Step 7: Run the test to verify it passes**

Run: `npm run test:unit -- data`
Expected: PASS, all cases.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add typed data layer with verifiable project and skill content"
```

---

### Task 4: Page shell — nav, zones, CSS ocean fallback

**Files:**
- Create: `components/nav/DepthNav.tsx`, `components/ocean/OceanFallback.tsx`, `components/zones/Zone.tsx`
- Modify: `app/page.tsx`
- Test: `tests/e2e/smoke.spec.ts`

**Interfaces:**
- Consumes: `useDepth`, `DepthProvider`, `ZONES`, `profile`
- Produces: `<Zone id label depthLabel>` section wrapper; `<DepthNav />`; `<OceanFallback />`; a page with six landmark sections whose ids match `ZoneId`

- [ ] **Step 1: Write the failing smoke test**

Create `tests/e2e/smoke.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

const ZONE_IDS = ["surface", "sunlight", "twilight", "midnight", "abyssal", "hadal"];

test("renders every zone as a landmark section", async ({ page }) => {
  await page.goto("/");
  for (const id of ZONE_IDS) {
    await expect(page.locator(`section#${id}`)).toHaveCount(1);
  }
});

test("exposes a skip link as the first focusable element", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.locator(":focus")).toHaveAttribute("href", "#main");
});

test("logs no console errors on load", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  expect(errors).toEqual([]);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test:e2e`
Expected: FAIL — no `section#surface`.

- [ ] **Step 3: Build the zone wrapper**

Create `components/zones/Zone.tsx`:

```tsx
import type { ZoneId } from "@/lib/depth";

export function Zone({
  id, label, depthLabel, children, className = "",
}: {
  id: ZoneId;
  label: string;
  depthLabel: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`relative min-h-screen px-6 py-24 md:px-12 ${className}`}
    >
      <header className="mb-12 flex items-baseline gap-4 border-b border-border pb-4">
        <h2 id={`${id}-heading`} className="text-sm font-medium uppercase tracking-[0.3em]">
          {label}
        </h2>
        <span className="font-mono text-xs text-muted-foreground">{depthLabel}</span>
      </header>
      {children}
    </section>
  );
}
```

- [ ] **Step 4: Build the nav and the CSS ocean fallback**

Create `components/nav/DepthNav.tsx`:

```tsx
"use client";

import { ZONES } from "@/lib/depth";
import { useDepth } from "@/components/depth/DepthProvider";

export function DepthNav() {
  const { zone } = useDepth();

  return (
    <nav
      aria-label="Depth zones"
      className="fixed inset-x-0 top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur"
    >
      <div className="flex items-center justify-between px-6 py-3 md:px-12">
        <a href="#surface" className="font-mono text-xs tracking-[0.3em]">
          AYUSH<span className="text-signal"> // </span>ABYSS
        </a>
        <ul className="hidden gap-6 md:flex">
          {ZONES.map((z) => (
            <li key={z.id}>
              <a
                href={`#${z.id}`}
                aria-current={z.id === zone.id ? "true" : undefined}
                className={`font-mono text-[10px] uppercase tracking-[0.2em] transition-colors ${
                  z.id === zone.id ? "text-signal" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {z.label} · {z.min}m
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
```

Create `components/ocean/OceanFallback.tsx`:

```tsx
/** Shown whenever the WebGL ocean cannot run. Purely decorative. */
export function OceanFallback() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10"
      style={{
        background:
          "radial-gradient(120% 80% at 50% -10%, #1d2a33 0%, #101820 35%, #0a0a0a 75%)",
      }}
    />
  );
}
```

- [ ] **Step 5: Compose the page**

Replace `app/page.tsx`:

```tsx
import { DepthProvider } from "@/components/depth/DepthProvider";
import { DepthNav } from "@/components/nav/DepthNav";
import { OceanFallback } from "@/components/ocean/OceanFallback";
import { Zone } from "@/components/zones/Zone";
import { profile } from "@/data/profile";

export default function Page() {
  return (
    <DepthProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-card focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <OceanFallback />
      <DepthNav />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-[5] bg-black"
        style={{ opacity: "var(--depth-veil)" }}
      />
      <main id="main">
        <Zone id="surface" label="Surface" depthLabel="0 — 40 m">
          <h1 className="max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
            {profile.heroLine}
          </h1>
          <p className="mt-6 font-mono text-sm text-muted-foreground">
            {profile.name} · {profile.role}
          </p>
        </Zone>
        <Zone id="sunlight" label="Sunlight" depthLabel="40 — 200 m" />
        <Zone id="twilight" label="Twilight" depthLabel="200 — 1,000 m" />
        <Zone id="midnight" label="Midnight" depthLabel="1,000 — 4,000 m" />
        <Zone id="abyssal" label="Abyssal" depthLabel="4,000 — 6,000 m" />
        <Zone id="hadal" label="Hadal" depthLabel="6,000 — 11,034 m" />
      </main>
    </DepthProvider>
  );
}
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npm run test:e2e`
Expected: PASS, 3 tests.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add page shell with depth nav, zone sections, and ocean fallback"
```

---

### Task 5: FFT math (pure TypeScript, no WebGL)

**Files:**
- Create: `components/ui/fft-ocean-utils/fft.ts`, `components/ui/fft-ocean-utils/spectrum.ts`
- Test: `tests/unit/fft.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `bitReverse(index: number, bits: number): number`
  - `butterflyTable(N: number): Float32Array` — length `log2(N) * N * 4`, each texel `[twiddleRe, twiddleIm, topIdx, bottomIdx]`
  - `ifft1D(re: Float32Array, im: Float32Array): { re: Float32Array; im: Float32Array }`
  - `naiveIDFT(re: Float32Array, im: Float32Array): { re: Float32Array; im: Float32Array }` (test oracle, exported for reuse)
  - `phillips(kx: number, kz: number, opts: SpectrumOptions): number`
  - `SpectrumOptions = { windSpeed: number; windDirX: number; windDirZ: number; amplitude: number; smallWave: number }`
  - `initialSpectrum(N: number, L: number, opts: SpectrumOptions): Float32Array` — RGBA, `[h0Re, h0Im, h0ConjRe, h0ConjIm]` per texel

**Why this task is separate:** the butterfly index table is the single most error-prone piece of the ocean, and a mistake in it produces a plausible-looking but wrong surface that no visual inspection will catch. Verified against a reference DFT here, in plain TypeScript, before any GPU code exists.

- [ ] **Step 1: Write the failing FFT tests**

Create `tests/unit/fft.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { bitReverse, butterflyTable, ifft1D, naiveIDFT } from
  "@/components/ui/fft-ocean-utils/fft";
import { phillips, initialSpectrum } from
  "@/components/ui/fft-ocean-utils/spectrum";

describe("bitReverse", () => {
  it("reverses bit patterns of the given width", () => {
    expect(bitReverse(0b000, 3)).toBe(0b000);
    expect(bitReverse(0b001, 3)).toBe(0b100);
    expect(bitReverse(0b011, 3)).toBe(0b110);
    expect(bitReverse(0b101, 3)).toBe(0b101);
  });
});

describe("butterflyTable", () => {
  it("has one texel per stage per element, four floats each", () => {
    expect(butterflyTable(8).length).toBe(3 * 8 * 4);
    expect(butterflyTable(16).length).toBe(4 * 16 * 4);
  });

  it("stores a bit-reversed permutation in the first stage", () => {
    const t = butterflyTable(8);
    const top = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => t[i * 4 + 2]);
    expect(new Set(top).size).toBe(8);
  });
});

const randomSignal = (N: number) => {
  const re = new Float32Array(N);
  const im = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    re[i] = Math.sin(i * 1.7) * 3 + Math.cos(i * 0.4);
    im[i] = Math.cos(i * 2.3) - Math.sin(i * 0.9) * 2;
  }
  return { re, im };
};

describe("ifft1D", () => {
  for (const N of [8, 16]) {
    it(`matches a reference inverse DFT at N=${N}`, () => {
      const { re, im } = randomSignal(N);
      const fast = ifft1D(re, im);
      const slow = naiveIDFT(re, im);
      for (let i = 0; i < N; i++) {
        expect(fast.re[i]).toBeCloseTo(slow.re[i], 4);
        expect(fast.im[i]).toBeCloseTo(slow.im[i], 4);
      }
    });
  }
});

describe("phillips", () => {
  const opts = {
    windSpeed: 14, windDirX: 1, windDirZ: 0,
    amplitude: 4e-7, smallWave: 1,
  };

  it("returns zero at k = 0 rather than dividing by zero", () => {
    expect(phillips(0, 0, opts)).toBe(0);
    expect(Number.isFinite(phillips(0, 0, opts))).toBe(true);
  });

  it("suppresses waves travelling across the wind", () => {
    const along = phillips(0.1, 0, opts);
    const across = phillips(0, 0.1, opts);
    expect(along).toBeGreaterThan(across);
  });

  it("is never negative", () => {
    for (let kx = -1; kx <= 1; kx += 0.25) {
      for (let kz = -1; kz <= 1; kz += 0.25) {
        expect(phillips(kx, kz, opts)).toBeGreaterThanOrEqual(0);
      }
    }
  });
});

describe("initialSpectrum", () => {
  it("produces four finite floats per texel", () => {
    const data = initialSpectrum(32, 512, {
      windSpeed: 14, windDirX: 1, windDirZ: 0,
      amplitude: 4e-7, smallWave: 1,
    });
    expect(data.length).toBe(32 * 32 * 4);
    for (const v of data) expect(Number.isFinite(v)).toBe(true);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test:unit -- fft`
Expected: FAIL — cannot resolve the fft module.

- [ ] **Step 3: Implement the FFT**

Create `components/ui/fft-ocean-utils/fft.ts`:

```ts
export function bitReverse(index: number, bits: number): number {
  let r = 0;
  for (let i = 0; i < bits; i++) {
    r = (r << 1) | ((index >> i) & 1);
  }
  return r >>> 0;
}

/**
 * Cooley-Tukey butterfly indices and twiddle factors, laid out one texel per
 * (stage, element) so a fragment shader can read them directly.
 *
 * Layout per texel: [twiddleRe, twiddleIm, topIndex, bottomIndex].
 * Stage 0 additionally encodes the bit-reversal permutation in its indices,
 * which is why the driver below never permutes its input separately.
 */
export function butterflyTable(N: number): Float32Array {
  const stages = Math.log2(N);
  if (!Number.isInteger(stages)) {
    throw new Error(`FFT size must be a power of two, got ${N}`);
  }

  const out = new Float32Array(stages * N * 4);

  for (let stage = 0; stage < stages; stage++) {
    const span = 1 << stage;
    for (let i = 0; i < N; i++) {
      const k = (i * (N / (span * 2))) % N;
      const angle = (2 * Math.PI * k) / N;
      const twRe = Math.cos(angle);
      const twIm = Math.sin(angle);

      const isTop = (i % (span * 2)) < span;
      let top: number;
      let bottom: number;

      if (stage === 0) {
        const base = isTop ? i : i - span;
        top = bitReverse(base, stages);
        bottom = bitReverse(base + span, stages);
      } else {
        const base = isTop ? i : i - span;
        top = base;
        bottom = base + span;
      }

      const o = (stage * N + i) * 4;
      out[o] = twRe;
      out[o + 1] = isTop ? twIm : -twIm;
      out[o + 2] = top;
      out[o + 3] = bottom;
    }
  }

  return out;
}

/**
 * Inverse DFT driven by the same butterfly table the GPU uses, so a passing
 * test here means the table itself is correct — not merely that some FFT works.
 */
export function ifft1D(
  re: Float32Array,
  im: Float32Array,
): { re: Float32Array; im: Float32Array } {
  const N = re.length;
  const stages = Math.log2(N);
  const table = butterflyTable(N);

  let curRe = Float32Array.from(re);
  let curIm = Float32Array.from(im);
  let nextRe = new Float32Array(N);
  let nextIm = new Float32Array(N);

  for (let stage = 0; stage < stages; stage++) {
    for (let i = 0; i < N; i++) {
      const o = (stage * N + i) * 4;
      const twRe = table[o];
      const twIm = table[o + 1];
      const top = table[o + 2];
      const bottom = table[o + 3];

      const aRe = curRe[top];
      const aIm = curIm[top];
      const bRe = curRe[bottom];
      const bIm = curIm[bottom];

      // a + twiddle * b, complex.
      nextRe[i] = aRe + (twRe * bRe - twIm * bIm);
      nextIm[i] = aIm + (twRe * bIm + twIm * bRe);
    }
    [curRe, nextRe] = [nextRe, curRe];
    [curIm, nextIm] = [nextIm, curIm];
  }

  return { re: curRe, im: curIm };
}

/** Reference oracle. O(N^2) and only ever used by tests. */
export function naiveIDFT(
  re: Float32Array,
  im: Float32Array,
): { re: Float32Array; im: Float32Array } {
  const N = re.length;
  const outRe = new Float32Array(N);
  const outIm = new Float32Array(N);

  for (let n = 0; n < N; n++) {
    let sRe = 0;
    let sIm = 0;
    for (let k = 0; k < N; k++) {
      const a = (2 * Math.PI * k * n) / N;
      const c = Math.cos(a);
      const s = Math.sin(a);
      sRe += re[k] * c - im[k] * s;
      sIm += re[k] * s + im[k] * c;
    }
    outRe[n] = sRe;
    outIm[n] = sIm;
  }

  return { re: outRe, im: outIm };
}
```

- [ ] **Step 4: Implement the Phillips spectrum**

Create `components/ui/fft-ocean-utils/spectrum.ts`:

```ts
export const GRAVITY = 9.81;

export interface SpectrumOptions {
  windSpeed: number;
  windDirX: number;
  windDirZ: number;
  amplitude: number;
  /** Wavelengths below this are suppressed, in metres. */
  smallWave: number;
}

export function phillips(kx: number, kz: number, o: SpectrumOptions): number {
  const kLen2 = kx * kx + kz * kz;
  if (kLen2 < 1e-12) return 0;

  const kLen = Math.sqrt(kLen2);
  const L = (o.windSpeed * o.windSpeed) / GRAVITY;

  const wLen = Math.hypot(o.windDirX, o.windDirZ) || 1;
  const wx = o.windDirX / wLen;
  const wz = o.windDirZ / wLen;

  // Directional term: waves travelling across the wind are damped.
  const dot = (kx / kLen) * wx + (kz / kLen) * wz;
  const directional = dot * dot;

  const p =
    (o.amplitude * Math.exp(-1 / (kLen2 * L * L)) * directional) / (kLen2 * kLen2);

  // Suppress detail finer than the grid can represent.
  return p * Math.exp(-kLen2 * o.smallWave * o.smallWave);
}

/** Box-Muller, so the surface is a proper Gaussian field rather than uniform noise. */
function gaussianPair(): [number, number] {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const r = Math.sqrt(-2 * Math.log(u));
  return [r * Math.cos(2 * Math.PI * v), r * Math.sin(2 * Math.PI * v)];
}

/**
 * h0(k) and conj(h0(-k)) packed into one RGBA texture, computed once at init.
 * Time evolution on the GPU only needs these two, so this never re-runs.
 */
export function initialSpectrum(
  N: number,
  L: number,
  o: SpectrumOptions,
): Float32Array {
  const data = new Float32Array(N * N * 4);
  const half = N / 2;

  for (let z = 0; z < N; z++) {
    for (let x = 0; x < N; x++) {
      const kx = (2 * Math.PI * (x - half)) / L;
      const kz = (2 * Math.PI * (z - half)) / L;

      const [g1, g2] = gaussianPair();
      const [g3, g4] = gaussianPair();

      const s = Math.sqrt(phillips(kx, kz, o) / 2);
      const sConj = Math.sqrt(phillips(-kx, -kz, o) / 2);

      const i = (z * N + x) * 4;
      data[i] = g1 * s;
      data[i + 1] = g2 * s;
      data[i + 2] = g3 * sConj;
      data[i + 3] = -g4 * sConj;
    }
  }

  return data;
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm run test:unit -- fft`
Expected: PASS. If the `ifft1D` cases fail, the butterfly table is wrong — fix `butterflyTable`, not the test.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add FFT butterfly table and Phillips spectrum, verified against reference DFT"
```

---

### Task 6: WebGL2 ocean renderer

**Files:**
- Create: `components/ui/fft-ocean-utils/gl.ts`, `components/ui/fft-ocean-utils/shaders.ts`, `components/ui/fft-ocean-utils/mesh.ts`, `components/ui/fft-ocean-utils/renderer.ts`
- Create: `components/ui/fft-ocean.tsx`
- Test: `tests/unit/renderer.test.ts`

**Interfaces:**
- Consumes: `butterflyTable`, `initialSpectrum` from Task 5
- Produces:
  - `isOceanSupported(canvas: HTMLCanvasElement): boolean`
  - `createRenderer(opts: { canvas: HTMLCanvasElement; depth?: number }): OceanRenderer`
  - `OceanRenderer = { ready: Promise<void>; dispose(): void; setDepth(depth: number): void }`
  - `<FftOcean depth?: number />` default export of `components/ui/fft-ocean.tsx`

**Deviation from spec §5.2, recorded deliberately:** the spec calls for `fft-ocean.tsx` to be byte-identical to the supplied snippet. It gains one **optional** `depth` prop defaulting to `0`, so the supplied usage `<Component />` behaves exactly as written. Duplicating the component to preserve a pristine copy would be worse than a backwards-compatible prop.

- [ ] **Step 1: Write the failing support-detection test**

Create `tests/unit/renderer.test.ts`:

```ts
import { describe, it, expect, vi } from "vitest";
import { isOceanSupported } from "@/components/ui/fft-ocean-utils/gl";

const canvasWith = (ctx: unknown) =>
  ({ getContext: vi.fn(() => ctx) }) as unknown as HTMLCanvasElement;

describe("isOceanSupported", () => {
  it("is false when WebGL2 is unavailable", () => {
    expect(isOceanSupported(canvasWith(null))).toBe(false);
  });

  it("is false when float render targets are unavailable", () => {
    expect(isOceanSupported(canvasWith({ getExtension: () => null }))).toBe(false);
  });

  it("is true when WebGL2 and float render targets are both present", () => {
    expect(isOceanSupported(canvasWith({ getExtension: () => ({}) }))).toBe(true);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test:unit -- renderer`
Expected: FAIL — cannot resolve `gl.ts`.

- [ ] **Step 3: Write the GL helpers**

Create `components/ui/fft-ocean-utils/gl.ts`:

```ts
export function isOceanSupported(canvas: HTMLCanvasElement): boolean {
  const gl = canvas.getContext("webgl2") as WebGL2RenderingContext | null;
  if (!gl) return false;
  return Boolean(gl.getExtension("EXT_color_buffer_float"));
}

export function compile(
  gl: WebGL2RenderingContext,
  type: number,
  src: string,
): WebGLShader {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh);
    gl.deleteShader(sh);
    throw new Error(`Shader compile failed: ${log}`);
  }
  return sh;
}

export function link(
  gl: WebGL2RenderingContext,
  vsSrc: string,
  fsSrc: string,
): WebGLProgram {
  const vs = compile(gl, gl.VERTEX_SHADER, vsSrc);
  const fs = compile(gl, gl.FRAGMENT_SHADER, fsSrc);
  const p = gl.createProgram()!;
  gl.attachShader(p, vs);
  gl.attachShader(p, fs);
  gl.linkProgram(p);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(p);
    gl.deleteProgram(p);
    throw new Error(`Program link failed: ${log}`);
  }
  return p;
}

export function floatTexture(
  gl: WebGL2RenderingContext,
  size: number,
  data: Float32Array | null,
): WebGLTexture {
  const t = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, t);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, size, size, 0, gl.RGBA, gl.FLOAT, data);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  return t;
}

/** Non-square float texture, for the (stages x N) butterfly table. */
export function butterflyTexture(
  gl: WebGL2RenderingContext,
  stages: number,
  n: number,
  data: Float32Array,
): WebGLTexture {
  const t = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, t);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, n, stages, 0, gl.RGBA, gl.FLOAT, data);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return t;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test:unit -- renderer`
Expected: PASS, 3 tests.

- [ ] **Step 5: Write the shaders**

Create `components/ui/fft-ocean-utils/shaders.ts`. Each export is a GLSL ES 3.00 source string.

```ts
export const QUAD_VS = `#version 300 es
in vec2 a_pos;
out vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

/** h(k,t) from h0(k) and conj(h0(-k)), plus the two choppiness components. */
export const TIME_SPECTRUM_FS = `#version 300 es
precision highp float;
in vec2 v_uv;
layout(location = 0) out vec4 o_height;
layout(location = 1) out vec4 o_choppy;
uniform sampler2D u_h0;
uniform float u_time;
uniform float u_N;
uniform float u_L;

vec2 cmul(vec2 a, vec2 b) {
  return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
}

void main() {
  vec2 xz = v_uv * u_N;
  vec2 k = vec2(6.28318530718) * (xz - u_N * 0.5) / u_L;
  float kLen = max(length(k), 1e-4);
  float w = sqrt(9.81 * kLen);

  vec4 h0 = texture(u_h0, v_uv);
  vec2 a = h0.xy;
  vec2 b = vec2(h0.z, -h0.w);

  float c = cos(w * u_time);
  float s = sin(w * u_time);
  vec2 e = vec2(c, s);
  vec2 eConj = vec2(c, -s);

  vec2 h = cmul(a, e) + cmul(b, eConj);
  o_height = vec4(h, 0.0, 0.0);

  // Horizontal displacement is i * (k / |k|) * h, per component.
  vec2 kn = k / kLen;
  o_choppy = vec4(vec2(-h.y, h.x) * kn.x, vec2(-h.y, h.x) * kn.y);
}`;

/** One butterfly stage. u_direction: 0 horizontal, 1 vertical. */
export const BUTTERFLY_FS = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 o_col;
uniform sampler2D u_butterfly;
uniform sampler2D u_src;
uniform float u_stage;
uniform float u_stages;
uniform float u_N;
uniform int u_direction;

vec2 cmul(vec2 a, vec2 b) {
  return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
}

void main() {
  vec2 px = v_uv * u_N;
  float idx = (u_direction == 0) ? px.x : px.y;

  vec4 bf = texture(u_butterfly, vec2(idx / u_N, (u_stage + 0.5) / u_stages));
  vec2 tw = bf.xy;
  float topI = bf.z;
  float botI = bf.w;

  vec2 topUV = (u_direction == 0)
    ? vec2((topI + 0.5) / u_N, v_uv.y)
    : vec2(v_uv.x, (topI + 0.5) / u_N);
  vec2 botUV = (u_direction == 0)
    ? vec2((botI + 0.5) / u_N, v_uv.y)
    : vec2(v_uv.x, (botI + 0.5) / u_N);

  vec2 a = texture(u_src, topUV).xy;
  vec2 b = texture(u_src, botUV).xy;
  o_col = vec4(a + cmul(tw, b), 0.0, 0.0);
}`;

/** Undo the FFT's sign flip and scale, writing displacement into one RGBA target. */
export const RESOLVE_FS = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 o_col;
uniform sampler2D u_height;
uniform sampler2D u_choppyX;
uniform sampler2D u_choppyZ;
uniform float u_N;
uniform float u_choppiness;

void main() {
  vec2 px = floor(v_uv * u_N);
  float sign = mod(px.x + px.y, 2.0) == 0.0 ? 1.0 : -1.0;
  float inv = 1.0 / (u_N * u_N);

  float h = texture(u_height, v_uv).x * sign * inv;
  float dx = texture(u_choppyX, v_uv).x * sign * inv * u_choppiness;
  float dz = texture(u_choppyZ, v_uv).x * sign * inv * u_choppiness;

  o_col = vec4(dx, h, dz, 1.0);
}`;

/** Central-difference normals plus a Jacobian-based foam mask. */
export const NORMAL_FS = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 o_col;
uniform sampler2D u_disp;
uniform float u_N;
uniform float u_L;

void main() {
  float t = 1.0 / u_N;
  float scale = u_L / u_N;

  vec3 r = texture(u_disp, v_uv + vec2(t, 0.0)).xyz;
  vec3 l = texture(u_disp, v_uv - vec2(t, 0.0)).xyz;
  vec3 u = texture(u_disp, v_uv + vec2(0.0, t)).xyz;
  vec3 d = texture(u_disp, v_uv - vec2(0.0, t)).xyz;

  vec3 n = normalize(vec3(l.y - r.y, 2.0 * scale, d.y - u.y));

  float jxx = (r.x - l.x) / (2.0 * scale);
  float jzz = (u.z - d.z) / (2.0 * scale);
  float jxz = (r.z - l.z) / (2.0 * scale);
  float jacobian = (1.0 + jxx) * (1.0 + jzz) - jxz * jxz;
  float foam = clamp(1.0 - jacobian, 0.0, 1.0);

  o_col = vec4(n, foam);
}`;

export const OCEAN_VS = `#version 300 es
in vec2 a_grid;
out vec3 v_world;
out vec2 v_uv;
out float v_foam;
uniform sampler2D u_disp;
uniform sampler2D u_normal;
uniform mat4 u_viewProj;
uniform float u_patch;

void main() {
  v_uv = a_grid;
  vec3 d = texture(u_disp, a_grid).xyz;
  vec3 world = vec3(
    (a_grid.x - 0.5) * u_patch + d.x,
    d.y,
    (a_grid.y - 0.5) * u_patch + d.z
  );
  v_world = world;
  v_foam = texture(u_normal, a_grid).w;
  gl_Position = u_viewProj * vec4(world, 1.0);
}`;

/**
 * Graphite water. Above the surface it is a dark specular sheet; below, it is
 * seen from underneath with light shafts, fading to black as depth increases.
 */
export const OCEAN_FS = `#version 300 es
precision highp float;
in vec3 v_world;
in vec2 v_uv;
in float v_foam;
out vec4 o_col;
uniform sampler2D u_normal;
uniform vec3 u_camera;
uniform float u_below;
uniform float u_darkness;

const vec3 DEEP    = vec3(0.031, 0.043, 0.055);
const vec3 SHALLOW = vec3(0.114, 0.157, 0.184);
const vec3 SUN     = vec3(0.93, 0.94, 0.96);

void main() {
  vec3 n = normalize(texture(u_normal, v_uv).xyz);
  if (u_below > 0.5) n = -n;

  vec3 view = normalize(u_camera - v_world);
  vec3 lightDir = normalize(vec3(0.4, 0.85, 0.3));

  float fresnel = pow(1.0 - max(dot(n, view), 0.0), 4.0);
  float diffuse = max(dot(n, lightDir), 0.0);
  float spec = pow(max(dot(reflect(-lightDir, n), view), 0.0), 90.0);

  vec3 water = mix(DEEP, SHALLOW, diffuse);
  water += SUN * spec * (1.0 - u_below);
  water = mix(water, vec3(0.28), fresnel * 0.35);
  water = mix(water, vec3(0.82), clamp(v_foam, 0.0, 1.0) * 0.5);

  water *= (1.0 - clamp(u_darkness, 0.0, 1.0));

  o_col = vec4(water, 1.0);
}`;
```

- [ ] **Step 6: Build the mesh and the renderer**

Create `components/ui/fft-ocean-utils/mesh.ts`:

```ts
/** Unit grid in [0,1]^2, displaced in the vertex shader. */
export function gridMesh(segments: number): {
  positions: Float32Array;
  indices: Uint32Array;
} {
  const side = segments + 1;
  const positions = new Float32Array(side * side * 2);
  let p = 0;
  for (let z = 0; z < side; z++) {
    for (let x = 0; x < side; x++) {
      positions[p++] = x / segments;
      positions[p++] = z / segments;
    }
  }

  const indices = new Uint32Array(segments * segments * 6);
  let i = 0;
  for (let z = 0; z < segments; z++) {
    for (let x = 0; x < segments; x++) {
      const a = z * side + x;
      const b = a + 1;
      const c = a + side;
      const d = c + 1;
      indices[i++] = a; indices[i++] = c; indices[i++] = b;
      indices[i++] = b; indices[i++] = c; indices[i++] = d;
    }
  }

  return { positions, indices };
}
```

Create `components/ui/fft-ocean-utils/renderer.ts` implementing the `OceanRenderer` contract. It must:

1. Acquire `webgl2` and `EXT_color_buffer_float`; if either is missing, reject nothing — resolve `ready` and render nothing, leaving the CSS fallback visible.
2. Build `initialSpectrum(N=256, L=512, {windSpeed:14, windDirX:1, windDirZ:0, amplitude:4e-7, smallWave:1})` into a float texture, and `butterflyTable(256)` into a `256 x 8` float texture.
3. Per frame: run `TIME_SPECTRUM_FS` into two MRT targets; run `BUTTERFLY_FS` for 8 stages horizontally then 8 vertically over three fields (height, choppyX, choppyZ), ping-ponging between two float targets; run `RESOLVE_FS` into the displacement target; run `NORMAL_FS` into the normal target; draw the grid with `OCEAN_VS`/`OCEAN_FS`.
4. Expose `setDepth(depth)`, mapping depth to camera Y (above the surface at 0 m, crossing it at 120 m, below it thereafter), the `u_below` flag, and `u_darkness` rising to 1 by 4,000 m.
5. Stop the rAF loop when `document.hidden`, and run exactly one frame at `t=0` when `matchMedia("(prefers-reduced-motion: reduce)").matches`.
6. Listen for `webglcontextlost`, call `dispose()`, and never re-acquire.
7. `dispose()` cancels the rAF, deletes every texture, framebuffer, buffer and program, and is safe to call twice.

Wrap the entire init in `try/catch`; on any throw, log once with `console.warn` and resolve `ready` so React never sees a rejection.

- [ ] **Step 7: Write the React component**

Create `components/ui/fft-ocean.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import { createRenderer } from "./fft-ocean-utils/renderer";

export function FftOcean({ depth = 0 }: { depth?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<ReturnType<typeof createRenderer> | null>(null);

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
```

- [ ] **Step 8: Verify the build and the unit suite**

Run: `npm run test:unit && npm run build`
Expected: all unit tests pass; build succeeds with no type errors.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add WebGL2 FFT ocean renderer with graceful degradation"
```

---

### Task 7: Mount the ocean behind the page

**Files:**
- Create: `components/ocean/OceanLayer.tsx`
- Modify: `app/page.tsx`
- Test: `tests/e2e/ocean.spec.ts`

**Interfaces:**
- Consumes: `FftOcean`, `isOceanSupported`, `useDepth`
- Produces: `<OceanLayer />` — a fixed full-viewport layer that renders `FftOcean` when supported and `OceanFallback` otherwise

- [ ] **Step 1: Write the failing test**

Create `tests/e2e/ocean.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test("page content is readable with WebGL disabled", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type: string, ...rest: unknown[]) {
      if (type === "webgl2") return null;
      // @ts-expect-error passthrough
      return original.call(this, type, ...rest);
    };
  });

  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator("section#hadal")).toHaveCount(1);
});

test("ocean layer is hidden from assistive technology", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("[data-ocean-layer]")).toHaveAttribute("aria-hidden", "true");
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test:e2e -- ocean`
Expected: FAIL — no `[data-ocean-layer]`.

- [ ] **Step 3: Build the ocean layer**

Create `components/ocean/OceanLayer.tsx`:

```tsx
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

export function OceanLayer() {
  const { depth } = useDepth();
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setSupported(isOceanSupported(document.createElement("canvas")));
  }, []);

  return (
    <div data-ocean-layer aria-hidden="true" className="fixed inset-0 -z-10">
      {supported ? <FftOcean depth={depth} /> : <OceanFallback />}
    </div>
  );
}
```

- [ ] **Step 4: Swap it into the page**

In `app/page.tsx`, replace `<OceanFallback />` with `<OceanLayer />` and update the import.

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm run test:e2e`
Expected: PASS, all specs including the existing smoke suite.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: mount depth-driven ocean layer behind the page"
```

---

### Task 8: Dive computer HUD

**Files:**
- Create: `components/hud/DiveComputer.tsx`
- Modify: `app/page.tsx`
- Test: `tests/e2e/hud.spec.ts`

**Interfaces:**
- Consumes: `useDepth`
- Produces: `<DiveComputer />`, marked `aria-hidden="true"`, carrying `data-testid="dive-computer"` and `data-warning={"true"|"false"}`

- [ ] **Step 1: Write the failing test**

Create `tests/e2e/hud.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test("HUD is present and hidden from assistive technology", async ({ page }) => {
  await page.goto("/");
  const hud = page.getByTestId("dive-computer");
  await expect(hud).toHaveCount(1);
  await expect(hud).toHaveAttribute("aria-hidden", "true");
});

test("HUD depth increases as the page is scrolled", async ({ page }) => {
  await page.goto("/");
  const readout = page.getByTestId("hud-depth");
  const before = await readout.textContent();
  await page.mouse.wheel(0, 4000);
  await page.waitForTimeout(400);
  const after = await readout.textContent();
  expect(after).not.toBe(before);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test:e2e -- hud`
Expected: FAIL — no `dive-computer` test id.

- [ ] **Step 3: Implement the HUD**

Create `components/hud/DiveComputer.tsx`:

```tsx
"use client";

import { useDepth } from "@/components/depth/DepthProvider";

/** Metres per second above which the descent reads as uncontrolled. */
const RATE_WARN = 900;

const pad = (ms: number) => {
  const total = Math.floor(ms / 1000);
  const m = String(Math.floor(total / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${m}:${s}`;
};

export function DiveComputer() {
  const { depth, zone, pressureBar, descentRate, elapsedMs } = useDepth();
  const warning = Math.abs(descentRate) > RATE_WARN;

  return (
    <div
      data-testid="dive-computer"
      data-warning={String(warning)}
      aria-hidden="true"
      className="fixed bottom-4 right-4 z-40 rounded-lg border border-border bg-card/85 p-3 font-mono backdrop-blur md:bottom-6 md:right-6 md:p-4"
    >
      <div className="flex items-baseline gap-2">
        <span data-testid="hud-depth" className="text-2xl tabular-nums md:text-3xl">
          {Math.round(depth).toLocaleString("en-US")}
        </span>
        <span className="text-xs text-muted-foreground">m</span>
      </div>

      <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {zone.label}
      </div>

      <dl className="mt-3 hidden gap-x-4 gap-y-1 text-[10px] md:grid md:grid-cols-[auto_auto]">
        <dt className="text-muted-foreground">RATE</dt>
        <dd
          className="tabular-nums"
          style={{ color: warning ? "var(--signal)" : undefined }}
        >
          {descentRate >= 0 ? "+" : ""}
          {Math.round(descentRate)} m/s
        </dd>

        <dt className="text-muted-foreground">PRESS</dt>
        <dd className="tabular-nums">{pressureBar.toFixed(1)} bar</dd>

        <dt className="text-muted-foreground">TIME</dt>
        <dd className="tabular-nums">{pad(elapsedMs)}</dd>
      </dl>

      {warning && (
        <p
          className="mt-2 hidden text-[10px] uppercase tracking-[0.2em] md:block"
          style={{ color: "var(--signal)" }}
        >
          Descent rate
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Mount it**

In `app/page.tsx`, add `<DiveComputer />` immediately after `<DepthNav />`.

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm run test:e2e -- hud`
Expected: PASS, 2 tests.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add dive computer HUD driven by depth state"
```

---

### Task 9: Sonar contact scope

**Files:**
- Create: `lib/sonar.ts`, `components/sonar/SonarScope.tsx`, `components/sonar/ContactSheet.tsx`
- Modify: `app/page.tsx` (twilight zone)
- Test: `tests/unit/sonar.test.ts`, `tests/e2e/sonar.spec.ts`

**Interfaces:**
- Consumes: `projects` from `@/data/projects`, `MAX_DEPTH`
- Produces:
  - `contactToXY(bearingDeg: number, rangeM: number, radiusPx: number): { x: number; y: number }`
  - `<SonarScope />`, `<ContactSheet project open onOpenChange />`

- [ ] **Step 1: Write the failing projection tests**

Create `tests/unit/sonar.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { contactToXY } from "@/lib/sonar";
import { MAX_DEPTH } from "@/lib/depth";

describe("contactToXY", () => {
  it("puts bearing 0 straight up", () => {
    const { x, y } = contactToXY(0, MAX_DEPTH, 100);
    expect(x).toBeCloseTo(0);
    expect(y).toBeCloseTo(-100);
  });

  it("puts bearing 90 to the right", () => {
    const { x, y } = contactToXY(90, MAX_DEPTH, 100);
    expect(x).toBeCloseTo(100);
    expect(y).toBeCloseTo(0);
  });

  it("puts bearing 180 straight down", () => {
    const { x, y } = contactToXY(180, MAX_DEPTH, 100);
    expect(x).toBeCloseTo(0);
    expect(y).toBeCloseTo(100);
  });

  it("scales radius linearly with range", () => {
    const half = contactToXY(90, MAX_DEPTH / 2, 100);
    expect(half.x).toBeCloseTo(50);
  });

  it("clamps range beyond the deepest point to the outer ring", () => {
    const beyond = contactToXY(90, MAX_DEPTH * 3, 100);
    expect(beyond.x).toBeCloseTo(100);
  });

  it("places the origin at zero range", () => {
    const { x, y } = contactToXY(217, 0, 100);
    expect(x).toBeCloseTo(0);
    expect(y).toBeCloseTo(0);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test:unit -- sonar`
Expected: FAIL — cannot resolve `@/lib/sonar`.

- [ ] **Step 3: Implement the projection**

Create `lib/sonar.ts`:

```ts
import { MAX_DEPTH } from "./depth";

/**
 * Polar projection for the sonar scope. Bearing is degrees clockwise from
 * north (screen up); range is metres on the same 0..MAX_DEPTH scale the page
 * uses for depth, so "deeper" means "further out" and the two readings agree.
 * Returns offsets from the scope centre in pixels.
 */
export function contactToXY(
  bearingDeg: number,
  rangeM: number,
  radiusPx: number,
): { x: number; y: number } {
  const t = Math.min(Math.max(rangeM / MAX_DEPTH, 0), 1);
  const r = t * radiusPx;
  const rad = ((bearingDeg - 90) * Math.PI) / 180;
  return { x: r * Math.cos(rad), y: r * Math.sin(rad) };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test:unit -- sonar`
Expected: PASS, 6 tests.

- [ ] **Step 5: Write the failing scope accessibility test**

Create `tests/e2e/sonar.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test("every contact is a real button, deepest first", async ({ page }) => {
  await page.goto("/");
  const contacts = page.locator("[data-contact]");
  await expect(contacts).toHaveCount(5);
  const names = await contacts.evaluateAll((els) =>
    els.map((e) => e.getAttribute("data-contact")),
  );
  expect(names).toEqual([
    "nostro", "energy-forecasting", "booksense", "vortifi", "quantumchat",
  ]);
});

test("a contact opens its sheet from the keyboard", async ({ page }) => {
  await page.goto("/");
  const first = page.locator('[data-contact="nostro"]');
  await first.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog")).toContainText("0.9937");
});

test("contact names carry domain and depth", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('[data-contact="nostro"]')).toHaveAccessibleName(
    /NOSTRO.*Applied ML.*9,200/,
  );
});
```

- [ ] **Step 6: Run the test to verify it fails**

Run: `npm run test:e2e -- sonar`
Expected: FAIL — no `[data-contact]` elements.

- [ ] **Step 7: Build the contact sheet**

Create `components/sonar/ContactSheet.tsx`:

```tsx
"use client";

import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/data/types";

export function ContactSheet({
  project, open, onOpenChange,
}: {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!project) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            {project.domain} · bearing {project.bearing}° · range{" "}
            {project.range.toLocaleString("en-US")} m
          </p>
          <SheetTitle className="text-2xl">{project.name}</SheetTitle>
          <SheetDescription className="text-base leading-relaxed">
            {project.lede}
          </SheetDescription>
        </SheetHeader>

        <dl className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
          {project.metrics.map((m) => (
            <div key={m.label} className="bg-card p-4">
              <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {m.label}
              </dt>
              <dd className="mt-1 font-mono text-xl tabular-nums">{m.value}</dd>
              {m.note && (
                <dd className="mt-1 font-mono text-[10px] text-muted-foreground">
                  {m.note}
                </dd>
              )}
            </div>
          ))}
        </dl>

        {project.caveat && (
          <div
            className="mt-6 rounded-lg border p-4"
            style={{ borderColor: "var(--signal)" }}
          >
            <p
              className="font-mono text-[10px] uppercase tracking-[0.25em]"
              style={{ color: "var(--signal)" }}
            >
              What this does not claim
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {project.caveat}
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          {project.stack.map((s) => (
            <Badge key={s} variant="secondary" className="font-mono text-[10px]">
              {s}
            </Badge>
          ))}
        </div>

        <a
          href={project.repoUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-block font-mono text-sm underline underline-offset-4"
          style={{ color: "var(--signal)" }}
        >
          Read the code and the evaluation →
        </a>
      </SheetContent>
    </Sheet>
  );
}
```

- [ ] **Step 8: Build the scope**

Create `components/sonar/SonarScope.tsx`:

```tsx
"use client";

import { useState } from "react";
import { ZONES } from "@/lib/depth";
import { contactToXY } from "@/lib/sonar";
import { projects } from "@/data/projects";
import type { Project } from "@/data/types";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { ContactSheet } from "./ContactSheet";

/** Scope geometry in SVG user units; the container scales it responsively. */
const R = 260;
const SWEEP_SECONDS = 6;

export function SonarScope() {
  const [active, setActive] = useState<Project | null>(null);
  const reduced = useReducedMotion();

  // Deepest first: this order is what keyboard users tab through.
  const contacts = [...projects].sort((a, b) => b.range - a.range);

  return (
    <div className="max-w-3xl">
      <p className="mb-10 max-w-2xl text-muted-foreground">
        Bearing is the domain. Range is how deep the work goes — the same scale
        as the depth you are at. Deeper contacts took more to get right.
      </p>

      <div className="relative mx-auto aspect-square w-full max-w-[560px]">
        <svg
          aria-hidden="true"
          viewBox={`${-R} ${-R} ${R * 2} ${R * 2}`}
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            <linearGradient id="sweep" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--signal)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--signal)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {ZONES.map((z) => (
            <circle
              key={z.id}
              cx="0"
              cy="0"
              r={Math.abs(contactToXY(0, z.max, R).y)}
              fill="none"
              stroke="var(--border)"
              strokeWidth="1"
            />
          ))}

          <line x1={-R} y1="0" x2={R} y2="0" stroke="var(--border)" strokeWidth="1" />
          <line x1="0" y1={-R} x2="0" y2={R} stroke="var(--border)" strokeWidth="1" />

          <g
            style={
              reduced
                ? undefined
                : { animation: `sonar-sweep ${SWEEP_SECONDS}s linear infinite`,
                    transformOrigin: "0 0" }
            }
          >
            <path d={`M 0 0 L 0 ${-R} A ${R} ${R} 0 0 1 ${R * 0.5} ${-R * 0.87} Z`}
                  fill="url(#sweep)" />
          </g>
        </svg>

        {contacts.map((p) => {
          const { x, y } = contactToXY(p.bearing, p.range, 50);
          return (
            <button
              key={p.slug}
              type="button"
              data-contact={p.slug}
              onClick={() => setActive(p)}
              aria-label={`${p.name}, ${p.domain}, range ${p.range.toLocaleString("en-US")} metres`}
              className="group absolute -translate-x-1/2 -translate-y-1/2 rounded-full p-2"
              style={{ left: `${50 + x}%`, top: `${50 + y}%` }}
            >
              <span
                aria-hidden="true"
                className="block h-2.5 w-2.5 rounded-full bg-muted-foreground transition-colors group-hover:bg-[var(--signal)] group-focus-visible:bg-[var(--signal)]"
                style={
                  reduced
                    ? { background: "var(--signal)" }
                    : {
                        animation: `sonar-ping ${SWEEP_SECONDS}s ease-out infinite`,
                        animationDelay: `${(p.bearing / 360) * SWEEP_SECONDS}s`,
                      }
                }
              />
              <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground transition-colors group-hover:text-foreground">
                {p.name}
              </span>
            </button>
          );
        })}
      </div>

      <ContactSheet
        project={active}
        open={active !== null}
        onOpenChange={(o) => !o && setActive(null)}
      />
    </div>
  );
}
```

Add the two keyframes to `app/globals.css`:

```css
@keyframes sonar-sweep {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

@keyframes sonar-ping {
  0%       { background: var(--signal); }
  18%, 100% { background: var(--muted-foreground); }
}
```

- [ ] **Step 9: Mount it in the twilight zone**

In `app/page.tsx`, put `<SonarScope />` inside the `twilight` `<Zone>`, above a short lede paragraph explaining the scope: bearing is domain, range is how deep the work goes.

- [ ] **Step 10: Run the tests to verify they pass**

Run: `npm run test:unit && npm run test:e2e`
Expected: PASS across all suites.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat: add sonar contact scope with keyboard-accessible project contacts"
```

---

### Task 10: Capability sounding, career log, and remaining zone content

**Files:**
- Create: `components/zones/Capability.tsx`, `components/zones/CareerLog.tsx`, `components/zones/About.tsx`, `components/zones/Contact.tsx`
- Modify: `app/page.tsx`
- Test: `tests/e2e/content.spec.ts`

**Interfaces:**
- Consumes: `skills`, `timeline`, `profile`, `projects`, `MAX_DEPTH`
- Produces: four zone content components

- [ ] **Step 1: Write the failing content test**

Create `tests/e2e/content.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test("skills cite the project that evidences them", async ({ page }) => {
  await page.goto("/");
  const python = page.locator('[data-skill="Python"]');
  await expect(python).toContainText("NOSTRO");
  await expect(python).toContainText("9,200");
});

test("no self-assigned percentage scores appear", async ({ page }) => {
  await page.goto("/");
  const sounding = page.getByTestId("capability-sounding");
  await expect(sounding).not.toContainText("%");
});

test("contact details are present and linked", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("link", { name: /ayushbawaskar4@gmail\.com/ }),
  ).toHaveAttribute("href", "mailto:ayushbawaskar4@gmail.com");
});

test("excluded claims never appear", async ({ page }) => {
  await page.goto("/");
  const body = (await page.locator("body").textContent())!.toLowerCase();
  for (const banned of [
    "dean's list", "research publication",
    "professional ml engineer", "dynamo", "kisan",
  ]) {
    expect(body).not.toContain(banned);
  }
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test:e2e -- content`
Expected: FAIL — no `[data-skill]` elements.

- [ ] **Step 3: Build the capability sounding**

Create `components/zones/Capability.tsx`:

```tsx
"use client";

import { MAX_DEPTH } from "@/lib/depth";
import { skills } from "@/data/skills";

export function Capability() {
  const sorted = [...skills].sort((a, b) => b.depth - a.depth);

  return (
    <div data-testid="capability-sounding" className="max-w-3xl">
      <p className="mb-10 max-w-2xl text-muted-foreground">
        No self-assigned scores. Each skill sits at the depth of the deepest
        project that actually used it, and names that project — so every marker
        resolves to a repository you can open.
      </p>

      <ol className="relative border-l border-border pl-6">
        {sorted.map((s) => (
          <li
            key={s.name}
            data-skill={s.name}
            className="group relative mb-5 flex items-baseline justify-between gap-6"
            style={{ marginLeft: `${(s.depth / MAX_DEPTH) * 28}%` }}
          >
            <span
              aria-hidden="true"
              className="absolute -left-[1.6rem] top-2 h-px w-5 bg-border transition-colors group-hover:bg-[var(--signal)]"
            />
            <span className="text-sm">{s.name}</span>
            <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
              {s.depth.toLocaleString("en-US")} m · {s.evidenceLabel}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
```

- [ ] **Step 4: Build About, CareerLog and Contact**

Create `components/zones/About.tsx`:

```tsx
import { profile } from "@/data/profile";

export function About() {
  return (
    <div className="max-w-2xl space-y-6">
      {profile.about.map((p) => (
        <p key={p.slice(0, 24)} className="leading-relaxed text-muted-foreground">
          {p}
        </p>
      ))}

      <dl className="mt-10 space-y-4 border-t border-border pt-6">
        {profile.education.map((e) => (
          <div key={e.degree}>
            <dt className="text-sm">{e.degree}</dt>
            <dd className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
              {e.institution} · {e.period}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
```

Create `components/zones/CareerLog.tsx`:

```tsx
import { timeline } from "@/data/timeline";

export function CareerLog() {
  return (
    <ol className="max-w-2xl space-y-8 border-l border-border pl-6">
      {timeline.map((t) => (
        <li key={t.when + t.title} className="relative">
          <span
            aria-hidden="true"
            className="absolute -left-[1.65rem] top-2 h-1.5 w-1.5 rounded-full bg-border"
          />
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {t.when}
          </p>
          <h3 className="mt-1 text-lg">{t.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {t.detail}
          </p>
        </li>
      ))}
    </ol>
  );
}
```

Create `components/zones/Contact.tsx`:

```tsx
import { profile } from "@/data/profile";

export function Contact() {
  return (
    <div className="max-w-2xl">
      <p className="text-2xl leading-snug md:text-3xl">
        Open to internships and graduate roles in applied ML, data, and backend
        engineering.
      </p>

      <ul className="mt-10 space-y-3">
        {profile.links.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel={l.href.startsWith("http") ? "noreferrer" : undefined}
              className="font-mono text-sm underline underline-offset-4"
              style={{ color: "var(--signal)" }}
            >
              {l.href.replace(/^mailto:/, "").replace(/^https:\/\//, "")}
            </a>
          </li>
        ))}
      </ul>

      <p className="mt-16 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        11,034 m · Challenger Deep · you have reached the bottom
      </p>
    </div>
  );
}
```

- [ ] **Step 5: Wire them into the page**

In `app/page.tsx`, place `<About />` in `sunlight`, `<Capability />` in `midnight`, `<CareerLog />` in `abyssal`, and `<Contact />` in `hadal`.

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npm run test:e2e -- content`
Expected: PASS, 4 tests.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add capability sounding, career log, about and contact zones"
```

---

### Task 11: Marine snow, accessibility pass, and final verification

**Files:**
- Create: `components/ocean/MarineSnow.tsx`
- Modify: `app/page.tsx`
- Test: `tests/e2e/a11y.spec.ts`

**Interfaces:**
- Consumes: `useReducedMotion`, `--snow-density`
- Produces: `<MarineSnow />`

- [ ] **Step 1: Write the failing accessibility test**

Create `tests/e2e/a11y.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test("reduced motion does not break the page", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));

  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator("[data-contact]")).toHaveCount(5);
  expect(errors).toEqual([]);

  await context.close();
});

test("decorative layers are hidden from assistive technology", async ({ page }) => {
  await page.goto("/");
  for (const sel of ["[data-ocean-layer]", "[data-marine-snow]", "[data-testid=dive-computer]"]) {
    await expect(page.locator(sel)).toHaveAttribute("aria-hidden", "true");
  }
});

test("every section heading is reachable in document order", async ({ page }) => {
  await page.goto("/");
  const headings = await page.locator("section > header h2").allTextContents();
  expect(headings).toEqual([
    "Surface", "Sunlight", "Twilight", "Midnight", "Abyssal", "Hadal",
  ]);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test:e2e -- a11y`
Expected: FAIL — no `[data-marine-snow]`.

- [ ] **Step 3: Implement marine snow**

Create `components/ocean/MarineSnow.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

const MAX_PARTICLES = 220;

export function MarineSnow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: MAX_PARTICLES }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.4 + 0.3,
      v: Math.random() * 0.00022 + 0.00006,
    }));

    const draw = () => {
      const density = parseFloat(
        getComputedStyle(document.documentElement)
          .getPropertyValue("--snow-density") || "0",
      );
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const visible = Math.floor(MAX_PARTICLES * density);
      for (let i = 0; i < visible; i++) {
        const p = particles[i];
        p.y -= p.v;
        if (p.y < 0) {
          p.y = 1;
          p.x = Math.random();
        }
        ctx.beginPath();
        ctx.arc(p.x * canvas.width, p.y * canvas.height, p.r * dpr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(250,250,250,${0.05 + p.r * 0.05})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      data-marine-snow
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-[6]"
    />
  );
}
```

- [ ] **Step 4: Mount it**

In `app/page.tsx`, add `<MarineSnow />` directly after `<OceanLayer />`.

- [ ] **Step 5: Run the whole suite**

Run: `npm run test:unit && npm run test:e2e`
Expected: PASS across every suite.

- [ ] **Step 6: Verify the production build**

Run: `npm run build`
Expected: succeeds, no type errors, no ESLint errors.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add marine snow layer and accessibility verification suite"
```

---

## Verification Checklist

Run before declaring the site done. Every line needs observed output, not assumption.

- [ ] `npm run test:unit` — all suites pass
- [ ] `npm run test:e2e` — all suites pass
- [ ] `npm run build` — clean
- [ ] Manually scroll the full page: depth climbs 0 → 11,034, HUD tracks it, ocean camera crosses the surface
- [ ] Tab from the top of the page: skip link first, then nav, then every sonar contact in range order
- [ ] Set the OS to reduced motion, reload: ocean is a still frame, sweep is stopped, all content readable
- [ ] Disable WebGL in the browser, reload: CSS fallback shows, page fully functional
- [ ] Lighthouse accessibility ≥ 95

**Do not push.** Ayush pushes when he decides to.

## Known Deferrals

Both are recorded in spec §6.4 and neither blocks completion:

- The 2025 hackathon result is omitted from `data/timeline.ts` pending the event name.
- IIT Mandi minor dates are shown as "In progress" pending confirmation.
