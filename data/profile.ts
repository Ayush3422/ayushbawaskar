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
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/ayush-bawaskar-254322340/",
    },
  ],
  interests: ["Cricket", "Strategy and FPS games", "Hackathons"],
  about: [
    "I build machine-learning systems and then try to find the number that proves they do not work. Most of what I have learned came from that second step: holding data out before fitting anything to it, splitting time series chronologically instead of at random, and tracking catalog coverage next to precision so a model cannot win by hiding behind whatever is already popular.",
    "The work below spans applied ML, a Solidity voting contract, and an educational post-quantum messaging prototype. Every result on this page was produced by a script in the repository it links to, and where a project has a limitation, the limitation is on the card.",
  ],
};
