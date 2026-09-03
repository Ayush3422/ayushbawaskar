# ABYSS — Design Spec

**Date:** 2026-09-03
**Owner:** Ayush Bawaskar
**Status:** Approved for planning

## 1. Purpose

A personal portfolio site — "foundry" — for Ayush Bawaskar. It replaces nothing; the existing site at ayushbawaskar.vercel.app stays live and untouched. This is a new repository.

The site takes structural inspiration from a peer's portfolio (myselfpavan.vercel.app) in one respect only: every claim it makes is checkable. It borrows none of that site's metaphor, sections, or visual language.

### Success criteria

1. A visitor can verify every factual claim on the page by following a link.
2. The site is visually unmistakable from the peer site it was inspired by.
3. It works — content readable, navigation usable — with WebGL disabled.
4. It works with `prefers-reduced-motion: reduce` set.
5. Lighthouse accessibility >= 95.

### Non-goals

- No light mode. The concept is a descent into darkness; a brightness toggle contradicts it and doubles the styling surface.
- No backend, no database, no runtime API calls. All content is static.
- No resume PDF. Ayush has none; the hero's secondary CTA points to GitHub.
- No blog, no learning log, no CMS.

## 2. Concept: ABYSS

The organizing metaphor is a **descent**. Scroll position maps to ocean depth, 0 m to 11,034 m (the Challenger Deep). Every visual and behavioural property of the page derives from that one number.

| Zone | Depth range | Section |
|---|---|---|
| Surface | 0 – 40 m | Hero |
| Sunlight (epipelagic) | 40 – 200 m | About |
| Twilight (mesopelagic) | 200 – 1,000 m | Work — sonar scope |
| Midnight (bathypelagic) | 1,000 – 4,000 m | Capability |
| Abyssal (abyssopelagic) | 4,000 – 6,000 m | Career log |
| Hadal | 6,000 – 11,034 m | Contact |

The FFT ocean is not a hero decoration. It is a single fixed full-viewport canvas behind the entire page, and the depth value drives its camera: above the waves at 0 m, through the surface around 120 m, looking up at the underside of the swell with light shafts to roughly 400 m, then progressive darkness. This is what makes the simulation structurally necessary rather than ornamental.

## 3. Stack

| Concern | Choice | Rationale |
|---|---|---|
| Framework | Next.js 15, App Router | Matches the shadcn ecosystem; static output |
| Language | TypeScript, strict | |
| Styling | Tailwind CSS v4 | |
| Components | shadcn/ui | Sheet, Card, Button, Badge, Tooltip, Separator |
| UI animation | Motion (`motion/react`) | |
| Ocean | Raw WebGL2, no three.js | The FFT needs render-to-float-texture ping-pong regardless; a scene graph adds ~150 KB and buys nothing |
| Tests | Vitest (unit), Playwright (smoke) | |
| Deploy | Vercel | |

No 21st.dev / Magic MCP server is connected to the build session. Components are hand-authored against shadcn primitives. If that server is connected later it can be used for additional component generation without changing this design.

## 4. Visual system

### Palette — Graphite dark, single mode

Base tokens follow the shadcn "Graphite" dark theme.

| Token | Value | Use |
|---|---|---|
| `--background` | `#0a0a0a` | Page ground |
| `--card` | `#141414` | Panels, HUD, sheets |
| `--border` | `#262626` | Hairlines, rings |
| `--muted-foreground` | `#a1a1a1` | Secondary text, units |
| `--foreground` | `#fafafa` | Primary text |
| `--primary` | `#d4d4d4` | Primary buttons (light on dark) |
| `--signal` | `#e57373` (coral) | **Reserved** |

`--signal` is reserved exclusively for things that are *live*: an active sonar return, a HUD warning state, a focused interactive element, a hyperlink. It must never be used decoratively. This single-accent discipline is what keeps a maximalist, high-density layout reading as deliberate rather than noisy, and it is the primary visual differentiator from the peer site.

### Depth-derived tokens

Three values are computed from depth and applied as CSS custom properties on the document root each frame (throttled to animation frames):

- `--depth-veil` — an overlay alpha, 0 at the surface to 0.72 in the hadal zone.
- `--depth-tint` — hue shift of card surfaces, graphite-neutral at depth, faintly blue near the surface.
- `--snow-density` — marine snow particle count multiplier, peaking in the twilight zone and thinning below.

### Typography

- Inter for prose and headings.
- A monospace face (Geist Mono) for **every instrument readout** — HUD values, sonar bearings and ranges, project metrics, timeline dates. The prose/mono split is the visual grammar: prose is Ayush talking, mono is the instrument measuring.

## 5. Components

### 5.1 Depth store — `lib/depth.ts`, `lib/hooks/useDepth.ts`

Single source of truth. A scroll listener (passive, rAF-throttled) converts `scrollY / (scrollHeight - innerHeight)` to a depth in metres, and exposes:

```
{ depth, zone, pressureBar, descentRate, elapsedMs }
```

Every consumer reads from this. Nothing computes depth independently. `pressureBar = depth / 10 + 1`. `descentRate` is a 250 ms exponential moving average of d(depth)/dt, in metres per second, to keep the HUD readable rather than jittery.

Pure functions, unit-tested:

- `depthToZone(depth): Zone`
- `depthToPressure(depth): number`
- `contactToXY(bearingDeg, rangeM, radiusPx): {x, y}`

### 5.2 FFT ocean — `components/ui/fft-ocean.tsx` + `fft-ocean-utils/`

`fft-ocean.tsx` is exactly the file provided in the source snippet, unmodified. It mounts a canvas and calls `createRenderer({ canvas })`, awaits `renderer.ready`, and calls `renderer.dispose()` on unmount. All work happens behind that contract.

`fft-ocean-utils/` modules:

| File | Responsibility |
|---|---|
| `renderer.ts` | `createRenderer({canvas}) -> {ready, dispose}`. WebGL2 context, `EXT_color_buffer_float`, resize observer, rAF loop, visibility pause, uniform bus |
| `spectrum.ts` | Phillips spectrum, generates h0(k) and h0*(-k) into RGBA32F textures once at init |
| `fft.ts` | Butterfly-index precompute texture; ping-pong IFFT driver |
| `mesh.ts` | Displaced grid geometry and index buffer |
| `shaders/*.ts` | GLSL sources as template strings |

Simulation parameters: FFT size N = 256, patch size L = 512 m, wind speed 14 m/s, Phillips cutoff to suppress waves below the grid Nyquist. Three inverse transforms per frame — vertical displacement, and X/Z choppiness — each 8 butterfly stages in two directions, giving 48 ping-pong passes per frame plus a permutation pass. A fourth pass derives normals and a Jacobian-based foam mask from the displacement field.

**Correctness check.** The butterfly index precompute is unit-tested against a reference DFT at N = 8 and N = 16. This is the single most error-prone piece and the one place where a silent bug produces a plausible-looking but wrong ocean.

**Uniforms driven by depth:** camera Y, fog density, sun elevation, water extinction coefficients, and a `u_belowSurface` flag that switches the fragment shader between above-water and under-water shading paths.

**Degradation ladder:**

1. No WebGL2, or no `EXT_color_buffer_float` — render nothing; a CSS radial gradient fallback element is shown instead.
2. Context lost — dispose, swap in the CSS fallback, do not retry in a loop.
3. `prefers-reduced-motion: reduce` — run the simulation for exactly one frame at t = 0, then stop the rAF loop. A still ocean, not a blank canvas.
4. Tab hidden or canvas fully scrolled out — pause the loop.

The page must be fully readable and navigable in every one of these states.

### 5.3 Dive computer HUD — `components/hud/DiveComputer.tsx`

Fixed bottom-right card, mono throughout. Readouts: depth (large), descent rate, elapsed dive time, pressure in bar, current zone name.

When `descentRate` exceeds 900 m/s the rate readout switches to `--signal` and an `ASCENT RATE` label appears. Every other use of coral on the page marks something the visitor can act on — a link, a focused control, a live sonar return. This warning is the sole exception, and it is state-driven rather than decorative, so the rule in §4 holds.

Collapses to a single depth chip below the `md` breakpoint. Marked `aria-hidden="true"` — it is a decorative instrument, and its values are meaningless to a screen reader — with the zone name additionally exposed through the nav, which is not hidden.

### 5.4 Sonar contact scope — `components/sonar/SonarScope.tsx`

Replaces the conventional project grid. A radial scope with range rings at each zone boundary and a sweep line rotating at 6 s per revolution.

Five contacts, positioned by **bearing** (technical domain) and **range** (how deep the work goes — deliberately the same 0–11,034 m scale as page depth, reinforcing the metaphor rather than introducing a second one).

| Contact | Bearing | Domain | Range |
|---|---|---|---|
| NOSTRO | 30° | Applied ML / finance | 9,200 m |
| ENERGY_FORECASTING | 70° | Applied ML / time series | 5,400 m |
| BookSense AI | 105° | Applied ML / recsys | 4,600 m |
| VortiFi | 180° | Blockchain | 1,900 m |
| QuantumChat | 285° | Cryptography | 1,200 m |

As the sweep crosses a contact it flashes to `--signal`, emits an expanding echo ring, and fades in its label. Between sweeps a contact decays back to dim.

**Accessibility is load-bearing here, not an afterthought.** The contacts are real `<button>` elements in the DOM in range order — deepest first — absolutely positioned over the scope. They are tab-navigable, have accessible names of the form `NOSTRO, applied ML, depth 9,200 metres`, and open the same sheet on Enter as on click. The canvas draws the rings and sweep only. A screen reader or keyboard user gets a working, ordered project list; the scope is presentation layered over it. Under reduced motion the sweep does not rotate and all contacts render lit.

`ContactSheet.tsx` — a shadcn Sheet holding the full project card: summary, measured results table, stack badges, and the repository link.

### 5.5 Capability sounding — `components/zones/Capability.tsx`

Skills are **not** rendered as self-assigned percentages. The old site's `skills.js` scored Python at 90 and Next.js at 70; those numbers are unverifiable and a reader is right to discount them.

Instead each skill is plotted on a vertical sounding line at **the depth of the deepest project that actually used it**, and hovering or focusing a marker names that project. The claim becomes checkable: "Python, 9,200 m" resolves to "because NOSTRO", which resolves to a repository.

| Skill | Depth | Evidence |
|---|---|---|
| Python | 9,200 m | NOSTRO |
| pandas / NumPy | 9,200 m | NOSTRO |
| Evaluation design (held-out splits, honest scoping) | 9,200 m | NOSTRO |
| XGBoost | 5,400 m | ENERGY_FORECASTING |
| Time-series validation | 5,400 m | ENERGY_FORECASTING |
| SHAP / explainability | 5,400 m | ENERGY_FORECASTING |
| scikit-learn | 4,600 m | BookSense AI |
| ALS / matrix factorisation | 4,600 m | BookSense AI |
| TF-IDF / content similarity | 4,600 m | BookSense AI |
| React | 1,900 m | VortiFi |
| Solidity | 1,900 m | VortiFi |
| Hardhat / ethers.js | 1,900 m | VortiFi |
| Node.js / Express | 1,200 m | QuantumChat |
| WebSockets | 1,200 m | QuantumChat |
| Applied cryptography (AES-256-GCM) | 1,200 m | QuantumChat |
| TypeScript | 600 m | ABYSS (this site) |
| Next.js / Tailwind | 600 m | ABYSS (this site) |
| WebGL2 / GLSL | 600 m | ABYSS (this site) |

### 5.6 Depth nav — `components/nav/DepthNav.tsx`

Fixed top bar: wordmark left, zone links right, each labelled with its depth (`TWILIGHT · 200m`). The active zone is marked with `--signal`. A skip-to-content link precedes it in the DOM.

### 5.7 Marine snow — `components/ocean/MarineSnow.tsx`

Canvas particle layer, drifting upward to sell descent. Density reads `--snow-density`. Disabled entirely under reduced motion. Purely decorative, `aria-hidden`.

## 6. Content

All copy derives from verified sources: Ayush's repository READMEs, his GitHub account, and the confirmed biographical facts below. Nothing is invented.

**Explicitly excluded**, as agreed — these appeared on the old site and cannot be substantiated: the research publication, Dean's List top-5%, Google Professional ML Engineer certification, "10+ open-source contributions", the 100+ member study group, and all eight learning-log posts. Also excluded: the `Dynamo---Fix-the-Broken-Terminal-Bench-Task` repository, at Ayush's instruction, and `kisan-mitra`, which does not exist.

### 6.1 Profile

- Ayush Bawaskar
- BTech, Computer Science & Engineering (AI-ML), New LJ Institute of Engineering & Technology — Aug 2024 to 2028
- Minor in AI & Data Science, IIT Mandi
- ayushbawaskar4@gmail.com
- github.com/Ayush3422
- linkedin.com/in/ayush-bawaskar-254322340
- Interests: cricket, strategy and FPS games, hackathons

### 6.2 Voice

The hero line and section copy adopt the register Ayush already writes in, taken from his own READMEs — measured, self-auditing, willing to name the weakness in its own result. NOSTRO's README separates held-out from in-sample numbers "as contrast, not as the headline". ENERGY_FORECASTING names the chronological-split leakage trap rather than quietly avoiding it. BookSense argues that a model winning on Precision@K "by hiding behind popularity isn't actually solving cold-start".

The hero line is **"I hold the data out before I believe the number."** This is the decided copy; implementation ships it. If Ayush wants a different line later it is a one-token change in `data/profile.ts`, not a design revision. Two alternates were considered and rejected as less specific: "Measured, not asserted." and "Every number here came out of a script."

### 6.3 Projects

**NOSTRO** — Three-way settlement reconciliation for Indian merchants: Razorpay settlement report against bank statement against ERP ledger. Built for the Razorpay AI Buildathon, Track 4 (AI Finance Controller).

Held-out results — 9 of 30 settlement cycles withheld from both the calibrator and the auto-post threshold, evaluated only after fitting:

| Metric | Held-out | In-sample |
|---|---|---|
| Precision | 0.9937 | 0.9905 |
| Recall | 0.6894 | 0.6874 |
| F1 | 0.8140 | 0.8116 |
| Match rate | 0.9413 (Razorpay-side) | 0.9096 |

Dataset: 2,443 Razorpay rows, 1,328 bank rows, 2,211 ERP rows. Every published number is generated by `scripts/build_evaluation.py`, not typed by hand. The card surfaces the honest-scoping note: match rate is reported Razorpay-side because bank and ERP rows carry no settlement-cycle id, which would make the figure tautologically ~100% on that side.

**ENERGY_FORECASTING** — Hour-ahead electricity demand forecasting for the PJM East grid region.

| Model | MAE (MW) | RMSE (MW) | MAPE |
|---|---|---|---|
| Naive baseline (load 24h ago) | 2,184 | 3,009 | 6.93% |
| XGBoost (tuned) | 255 | 348 | 0.81% |

~88% error reduction against baseline. Headline finding: load is U-shaped against temperature, so temperature is a first-class feature rather than time-of-day alone. Chronological train/test split, not random k-fold, to prevent lag and rolling features leaking the future. Residual analysis is included on the card because it is unflattering and therefore credible: mean absolute error is 390 MW on the hottest 5% of hours against 223 MW mid-range.

**BookSense AI** — Hybrid recommender over goodbooks-10k: 10,000 books, 5,976,479 ratings, 53,424 users. The user-item matrix is 98.88% empty; the top 1% of titles take 17.1% of all ratings.

| Scenario | Method | P@10 | R@10 | NDCG@10 | Coverage |
|---|---|---|---|---|---|
| Warm | Collaborative | 0.231 | 0.156 | 0.273 | 7.3% |
| Warm | Content | 0.156 | 0.109 | 0.186 | 15.9% |
| Warm | Hybrid | 0.258 | 0.178 | 0.306 | 12.0% |
| Cold-start | Collaborative | 0.069 | 0.050 | 0.075 | 8.0% |
| Cold-start | Hybrid | 0.050 | 0.035 | 0.059 | 19.1% |

ALS collaborative filtering blended with TF-IDF content similarity over authors (3x weighted) and top-15 community genre tags, alpha = 0.6 chosen by grid search on held-out Precision@10. Cold-start is simulated by truncating 300 real users to 3 interactions. The card leads with the nuanced result, not the flattering one: collaborative filtering *looks* competitive on cold-start precision while its catalog coverage collapses to 8%, and the hybrid trades precision for 2.4x broader coverage.

**VortiFi** — Decentralised voting DApp on Ethereum for Rotaract club elections. Solidity contract (`RotaractVoting.sol`) deployed via Hardhat Ignition, React frontend over ethers.js, token-based voter authentication, separate admin and voter flows.

**QuantumChat** — Real-time end-to-end encrypted messaging over WebSocket. Uses a **simulated** Kyber-1024 lattice KEM for key exchange and AES-256-GCM for message encryption, on Node.js/Express with a vanilla JS frontend.

The card states "simulated Kyber, educational" prominently rather than in fine print. The repository's own README says so, and a site whose entire premise is verifiable claims cannot describe a simulation as an implementation.

### 6.4 Career log

| When | Entry |
|---|---|
| Aug 2024 | Began BTech CSE (AI-ML), New LJIET |
| Aug 2025 | First shipped repositories — VortiFi, QuantumChat |
| 2025–2026 | Minor in AI & Data Science, IIT Mandi |
| Jul–Aug 2026 | ML portfolio built out — ENERGY_FORECASTING, BookSense AI |
| Sep 2026 | NOSTRO, for the Razorpay AI Buildathon (Track 4) |

**Open item.** The old site claimed a 2025 hackathon win ("Won Hackathon — Built AI Solution") with no event named. Under the verifiable-claims rule this entry is omitted unless Ayush supplies the event name and result, in which case it is restored. Likewise the IIT Mandi minor dates need confirming; they are inferred.

## 7. Data layer

Typed modules under `data/`, imported at build time. No runtime fetching — GitHub's API is rate-limited and unauthenticated calls from a client would produce both layout shift and intermittent blank sections.

```
data/profile.ts    name, education, links, interests
data/projects.ts   Project[] — slug, name, domain, bearing, range, summary,
                   metrics, stack, repoUrl, caveat?
data/skills.ts     Skill[] — name, depth, evidenceSlug
data/timeline.ts   TimelineEntry[]
```

`Project.caveat` is a first-class optional field, not a footnote — it carries QuantumChat's "simulated Kyber" and NOSTRO's match-rate scoping note. The type system treats honesty as structure.

## 8. File layout

```
foundry/
  app/
    layout.tsx           fonts, metadata, depth provider
    page.tsx             zone composition
    globals.css          tokens, depth custom properties
  components/
    ui/                  shadcn primitives
      fft-ocean.tsx      unmodified source snippet
      fft-ocean-utils/   renderer, spectrum, fft, mesh, shaders/
    ocean/MarineSnow.tsx
    hud/DiveComputer.tsx
    sonar/SonarScope.tsx, ContactSheet.tsx
    nav/DepthNav.tsx
    zones/Surface.tsx, About.tsx, Work.tsx, Capability.tsx,
          CareerLog.tsx, Contact.tsx
  lib/
    depth.ts
    hooks/useDepth.ts, useReducedMotion.ts
  data/
  tests/
    unit/depth.test.ts, fft.test.ts, sonar.test.ts
    e2e/smoke.spec.ts
```

## 9. Error handling

| Failure | Behaviour |
|---|---|
| No WebGL2 / no float textures | CSS gradient fallback, page fully functional |
| Context lost | Dispose, swap fallback, no retry loop |
| Shader compile or link failure | Log once, fall back, never throw into React |
| Reduced motion | One static frame, no rAF loop, sweep frozen |
| Tab hidden / canvas offscreen | Pause loop |
| JS disabled | All content server-rendered and readable; ocean and scope absent |

The site's content is real DOM throughout. Nothing meaningful exists only inside a canvas. This is what lets every row of this table degrade to "still works".

## 10. Testing

**Unit (Vitest)** — pure logic only:
- `depthToZone` boundaries, including exact zone edges
- `depthToPressure`
- `contactToXY` projection round-trips
- FFT butterfly index precompute against a reference DFT at N = 8 and N = 16

**Smoke (Playwright)**:
- All six zones render and are reachable
- Sonar contacts are keyboard-reachable in range order and open their sheets
- Reduced-motion path throws nothing
- Console is clean of errors on load
- Page is readable with WebGL stubbed out

TDD per the project workflow: tests precede implementation for the depth math, the FFT indices, and the sonar projection — the three places where a bug is silent rather than loud.

## 11. Risks

| Risk | Mitigation |
|---|---|
| FFT ocean is the largest single unknown and could consume the schedule | Build it behind the `{ready, dispose}` contract with the CSS fallback working *first*, so the site is shippable before the ocean is finished |
| 48 ping-pong passes per frame is heavy on integrated GPUs | N = 256 is a parameter; drop to 128 if frame budget is exceeded. Measure before tuning |
| Sonar scope could become a canvas trap for keyboard users | DOM buttons are the primary implementation, canvas is presentational. Enforced by a Playwright test |
| Maximalism drifting into noise | Single reserved accent; every other surface is graphite |
| Depth metaphor used for two different scales (page position, project rigour) | Deliberate and stated in the UI — the scope's rings carry the same labels as the nav |
