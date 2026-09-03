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

/**
 * The inventory, grouped, with the project that put each item to work.
 *
 * `evidence` is a project slug, or "abyss" for this site. An item with no
 * evidence is one used somewhere that is not on this page — coursework, or a
 * repository that did not make the roster — and the UI says so rather than
 * quietly implying a repository exists.
 */
export interface InventoryItem {
  name: string;
  evidence?: string;
}

export const skillGroups: { category: string; items: InventoryItem[] }[] = [
  {
    category: "Languages",
    items: [
      { name: "Python", evidence: "nostro" },
      { name: "TypeScript", evidence: "abyss" },
      { name: "JavaScript", evidence: "quantumchat" },
      { name: "Solidity", evidence: "vortifi" },
      { name: "C" },
    ],
  },
  {
    category: "Applied ML",
    items: [
      { name: "XGBoost", evidence: "energy-forecasting" },
      { name: "scikit-learn", evidence: "booksense" },
      { name: "implicit / ALS", evidence: "booksense" },
      { name: "TF-IDF", evidence: "booksense" },
      { name: "SHAP", evidence: "energy-forecasting" },
      { name: "pandas", evidence: "nostro" },
      { name: "NumPy", evidence: "nostro" },
    ],
  },
  {
    category: "Evaluation",
    items: [
      { name: "Held-out splits", evidence: "nostro" },
      { name: "Chronological splits", evidence: "energy-forecasting" },
      { name: "Precision@K · NDCG", evidence: "booksense" },
      { name: "Catalog coverage", evidence: "booksense" },
      { name: "Cold-start simulation", evidence: "booksense" },
      { name: "Scripted, reproducible reports", evidence: "nostro" },
    ],
  },
  {
    category: "Web",
    items: [
      { name: "React", evidence: "vortifi" },
      { name: "Next.js", evidence: "abyss" },
      { name: "Tailwind CSS", evidence: "abyss" },
      { name: "Vite" },
      { name: "Node.js", evidence: "quantumchat" },
      { name: "Express", evidence: "quantumchat" },
      { name: "WebSockets", evidence: "quantumchat" },
      { name: "WebGL2 / GLSL", evidence: "abyss" },
    ],
  },
  {
    category: "Blockchain",
    items: [
      { name: "Solidity", evidence: "vortifi" },
      { name: "Hardhat", evidence: "vortifi" },
      { name: "Hardhat Ignition", evidence: "vortifi" },
      { name: "ethers.js", evidence: "vortifi" },
      { name: "Ethereum", evidence: "vortifi" },
    ],
  },
  {
    category: "Cryptography",
    items: [
      { name: "AES-256-GCM", evidence: "quantumchat" },
      { name: "Kyber KEM (simulated)", evidence: "quantumchat" },
      { name: "Key exchange", evidence: "quantumchat" },
    ],
  },
  {
    category: "Tools",
    items: [
      { name: "Git" },
      { name: "VS Code" },
      { name: "Google Colab" },
      { name: "Vercel", evidence: "abyss" },
    ],
  },
];
