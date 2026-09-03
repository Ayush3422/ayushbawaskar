import type { TimelineEntry } from "./types";

/**
 * The old portfolio claimed a 2025 hackathon win with no event named. It is
 * omitted here rather than restated, and goes back in as soon as Ayush supplies
 * the event and the result. See spec section 6.4.
 */
export const timeline: TimelineEntry[] = [
  {
    when: "Aug 2024",
    title: "Began BTech CSE (AI-ML)",
    detail: "New LJ Institute of Engineering & Technology, Ahmedabad.",
  },
  {
    when: "Aug 2025",
    title: "First shipped repositories",
    detail:
      "VortiFi and QuantumChat — a Solidity voting DApp and an educational post-quantum messaging prototype.",
  },
  {
    when: "2025 — 2026",
    title: "Minor in AI & Data Science",
    detail: "IIT Mandi, alongside the BTech.",
  },
  {
    when: "Jul — Aug 2026",
    title: "Applied ML portfolio",
    detail:
      "ENERGY_FORECASTING and BookSense AI — grid load forecasting and a hybrid recommender, both evaluated against real baselines rather than reported in isolation.",
  },
  {
    when: "Sep 2026",
    title: "NOSTRO",
    detail:
      "Three-way settlement reconciliation for the Razorpay AI Buildathon, Track 4.",
  },
];
