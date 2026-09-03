import type { Profile } from "./types";

export const profile: Profile = {
  name: "Ayush Bawaskar",
  heroLine: "I hold the data out before I believe the number.",
  role: "Applied ML · Blockchain · Systems",
  status: "Open to internships — applied ML, data, or backend",
  // Pulled out as the section's statement band, so it is not also in `about`.
  statement:
    "I build machine-learning systems, then try to find the number that proves they do not work.",
  location: "Ahmedabad, India",
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
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/ayush-bawaskar-254322340/",
    },
  ],
  interests: ["Cricket", "Strategy and FPS games", "Hackathons"],
  about: [
    "Most of what I have learned came from that second step: holding data out before fitting anything to it, splitting time series chronologically instead of at random, and tracking catalog coverage next to precision so a model cannot win by hiding behind whatever is already popular.",
    "That habit is why the reconciliation engine below reports a held-out precision of 0.9937 next to an in-sample 0.9905, rather than only the flattering one, and why its match rate is scoped to the side of the join that can actually be held out. It is why the load forecaster is split chronologically — shuffling that data lets lag features carry the future into training — and why its worst residuals, on the hottest 5% of hours, are on the card instead of hidden behind an average.",
    "The rest of the work spans a Solidity voting contract and an educational post-quantum messaging prototype. Every result on this page was produced by a script inside the repository it links to, and where a project has a limitation, the limitation is stated on the card rather than left for someone else to find.",
  ],
};

/** The label/value block in the about zone. Every row is checkable. */
export const dossier: { label: string; value: string }[] = [
  { label: "Name", value: "Ayush Bawaskar" },
  { label: "Focus", value: "Applied ML, evaluation design, backend" },
  { label: "Based in", value: "Ahmedabad, India" },
  {
    label: "Studying",
    value: "BTech CSE (AI-ML), New LJIET · Minor AI & DS, IIT Mandi",
  },
  { label: "Status", value: "Open to internships and graduate roles" },
  { label: "Repositories", value: "16 public, on github.com/Ayush3422" },
  { label: "Deepest work", value: "NOSTRO — settlement reconciliation, 9,200 m" },
  { label: "Off screen", value: "Cricket · strategy and FPS games · hackathons" },
];

/** Hero figures. Each one is restated with its source further down the page. */
export const headlineStats: {
  value: string;
  label: string;
  note?: string;
  signal?: boolean;
}[] = [
  { value: "0.9937", label: "Held-out precision", note: "NOSTRO, 9 of 30 cycles withheld", signal: true },
  { value: "0.81%", label: "Forecast MAPE", note: "vs 6.93% naive baseline" },
  { value: "5", label: "Contacts plotted", note: "ranked by rigour, not recency" },
  { value: "16", label: "Public repositories", note: "github.com/Ayush3422" },
];

/** How this site is built. Verifiable by reading it. */
export const colophon: { label: string; value: string }[] = [
  { label: "Framework", value: "Next.js 16, TypeScript, Tailwind v4, shadcn/ui" },
  { label: "Ocean", value: "Hand-written WebGL2 FFT — Phillips spectrum, 256² grid" },
  { label: "Passes", value: "48 butterfly ping-pongs per frame, plus normals and foam" },
  { label: "Verification", value: "Butterfly table checked against a reference DFT" },
  { label: "Degrades to", value: "A readable page with WebGL disabled" },
  { label: "Type", value: "IBM Plex Mono · Pixelify Sans · Instrument Serif" },
];

/**
 * Working rules, each one drawn from a decision visible in a repository on
 * this page rather than invented for the site.
 */
export const principles: { rule: string; because: string; source: string }[] = [
  {
    rule: "Hold data out before fitting anything to it.",
    because:
      "Nine of thirty settlement cycles were withheld from both the calibrator and the auto-post threshold, and scored only after fitting was done.",
    source: "NOSTRO",
  },
  {
    rule: "Split time series chronologically, never at random.",
    because:
      "Shuffling lets lag and rolling features carry the future into training. It is the most common and most expensive mistake in this kind of work.",
    source: "ENERGY_FORECASTING",
  },
  {
    rule: "Track coverage next to precision.",
    because:
      "A recommender can win on Precision@K by hiding behind whatever is already popular. Catalog coverage is what catches it.",
    source: "BookSense AI",
  },
  {
    rule: "Publish the number that does not flatter you.",
    because:
      "Held-out next to in-sample. Worst-case residuals next to the average. If the unflattering number is missing, the flattering one means nothing.",
    source: "All three",
  },
  {
    rule: "Generate results with a script, not by hand.",
    because:
      "Every figure in the evaluation is produced by scripts/build_evaluation.py, so it can be regenerated and checked rather than trusted.",
    source: "NOSTRO",
  },
];
