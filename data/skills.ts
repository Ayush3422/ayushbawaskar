import type { Skill } from "./types";

/**
 * Depth is evidence, not self-assessment: each skill sits at the depth of the
 * deepest project that actually used it, and names that project. "abyss" is
 * this site, which is why it has no entry in projects.ts.
 *
 * There is deliberately no `level` field. Self-assigned percentages are
 * unverifiable and a reader is right to discount them.
 */
export const skills: Skill[] = [
  { name: "Python", depth: 9200, evidenceSlug: "nostro", evidenceLabel: "NOSTRO" },
  { name: "pandas / NumPy", depth: 9200, evidenceSlug: "nostro", evidenceLabel: "NOSTRO" },
  { name: "Evaluation design", depth: 9200, evidenceSlug: "nostro", evidenceLabel: "NOSTRO" },
  {
    name: "XGBoost",
    depth: 5400,
    evidenceSlug: "energy-forecasting",
    evidenceLabel: "ENERGY_FORECASTING",
  },
  {
    name: "Time-series validation",
    depth: 5400,
    evidenceSlug: "energy-forecasting",
    evidenceLabel: "ENERGY_FORECASTING",
  },
  {
    name: "SHAP / explainability",
    depth: 5400,
    evidenceSlug: "energy-forecasting",
    evidenceLabel: "ENERGY_FORECASTING",
  },
  { name: "scikit-learn", depth: 4600, evidenceSlug: "booksense", evidenceLabel: "BookSense AI" },
  {
    name: "ALS / matrix factorisation",
    depth: 4600,
    evidenceSlug: "booksense",
    evidenceLabel: "BookSense AI",
  },
  {
    name: "TF-IDF / content similarity",
    depth: 4600,
    evidenceSlug: "booksense",
    evidenceLabel: "BookSense AI",
  },
  { name: "React", depth: 1900, evidenceSlug: "vortifi", evidenceLabel: "VortiFi" },
  { name: "Solidity", depth: 1900, evidenceSlug: "vortifi", evidenceLabel: "VortiFi" },
  { name: "Hardhat / ethers.js", depth: 1900, evidenceSlug: "vortifi", evidenceLabel: "VortiFi" },
  {
    name: "Node.js / Express",
    depth: 1200,
    evidenceSlug: "quantumchat",
    evidenceLabel: "QuantumChat",
  },
  { name: "WebSockets", depth: 1200, evidenceSlug: "quantumchat", evidenceLabel: "QuantumChat" },
  {
    name: "Applied cryptography",
    depth: 1200,
    evidenceSlug: "quantumchat",
    evidenceLabel: "QuantumChat",
  },
  { name: "TypeScript", depth: 600, evidenceSlug: "abyss", evidenceLabel: "This site" },
  { name: "Next.js / Tailwind", depth: 600, evidenceSlug: "abyss", evidenceLabel: "This site" },
  { name: "WebGL2 / GLSL", depth: 600, evidenceSlug: "abyss", evidenceLabel: "This site" },
];
