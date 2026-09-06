import type { Project } from "./types";

/**
 * Every figure below is copied from the project's own README. Nothing here is
 * estimated, rounded for effect, or inferred. If a number is not in the
 * repository, it does not go on the site.
 */
export const projects: Project[] = [
  {
    slug: "nostro",
    name: "NOSTRO",
    domain: "Applied ML / finance",
    bearing: 30,
    range: 9200,
    summary: "Three-way settlement reconciliation, evaluated on held-out cycles.",
    lede:
      "Three-way settlement reconciliation for Indian merchants — Razorpay settlement report against bank statement against ERP ledger — built for the Razorpay AI Buildathon, Track 4 (AI Finance Controller). Nine of thirty settlement cycles were withheld from both the calibrator and the auto-post threshold, and scored only after fitting was done.",
    metrics: [
      { label: "Precision", value: "0.9937", note: "held-out · 0.9905 in-sample" },
      { label: "Recall", value: "0.6894", note: "held-out · 0.6874 in-sample" },
      { label: "F1", value: "0.8140", note: "held-out · 0.8116 in-sample" },
      { label: "Match rate", value: "0.9413", note: "held-out, Razorpay-side" },
      {
        label: "Dataset",
        value: "5,982 rows",
        note: "2,443 Razorpay · 1,328 bank · 2,211 ERP",
      },
    ],
    stack: ["Python", "pandas", "NumPy"],
    repoUrl: "https://github.com/Ayush3422/NOSTRO",
    caveat:
      "Match rate is reported Razorpay-side on purpose. Bank and ERP rows carry no settlement-cycle id, so a holdout built on those sources would be scoped to rows a holdout match already touched — making the figure tautologically near 100% and not comparable to the in-sample number. Every value here was produced by scripts/build_evaluation.py, not typed by hand.",
  },
  {
    slug: "revisehub",
    name: "ReviseHub",
    domain: "Developer tools / static analysis",
    bearing: 145,
    range: 6200,
    summary: "Code review for public repositories that runs with no API key.",
    lede:
      "Code review for any public GitHub repository, built so the analysis and the language model are separate components. Most AI review tools stop working the moment the key fails; here a deterministic rules engine always runs — secrets, dependency CVEs from OSV.dev, efficiency, complexity, hygiene, repository health — and the AI layer is an optional second pass, labelled apart from the engine so a reader can tell which findings are reproducible and which are a suggestion.",
    metrics: [
      { label: "Tests", value: "68", note: "diff parser and every rule group" },
      {
        label: "False positives",
        value: "Tested",
        note: "rules checked for firing on the wrong thing",
      },
      { label: "Rule groups", value: "6", note: "deterministic, no API key" },
      { label: "Advisories", value: "OSV.dev", note: "real CVE ids and fixed versions" },
    ],
    stack: ["Next.js", "TypeScript", "Zod", "Recharts", "Gemini API"],
    repoUrl: "https://github.com/Ayush3422/REVISEHUB",
    caveat:
      "The limitations are in the project's own README rather than left to be discovered: public repositories only with no sign-in, nothing persisted between requests, AST analysis covering JavaScript and TypeScript only, dependency scanning limited to npm, and rate limiting that is per server instance rather than shared. The AI layer can be wrong, which is why its findings are labelled apart from the engine's.",
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
      {
        label: "Error reduction",
        value: "~88%",
        note: "tuned XGBoost vs load 24 h ago",
      },
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
      {
        label: "Precision@10",
        value: "0.258",
        note: "warm hybrid · 0.231 collaborative · 0.156 content",
      },
      { label: "NDCG@10", value: "0.306", note: "warm hybrid" },
      { label: "Recall@10", value: "0.178", note: "warm hybrid" },
      {
        label: "Cold-start coverage",
        value: "19.1%",
        note: "vs 8.0% collaborative",
      },
      {
        label: "Blend weight",
        value: "α = 0.6",
        note: "grid search on held-out Precision@10",
      },
    ],
    stack: ["Python", "implicit / ALS", "scikit-learn", "TF-IDF"],
    repoUrl: "https://github.com/Ayush3422/book-recommendation-system",
    caveat:
      "The cold-start result is the interesting one and it is not a clean win. Collaborative filtering looks competitive on raw precision with only three interactions, but its catalog coverage collapses to 8% because a user vector refit from almost no data falls back on globally popular items. The hybrid trades precision for 2.4x broader coverage. Cold start is simulated by truncating 300 real users to three interactions, since every goodbooks user already has at least nineteen.",
  },
  {
    slug: "pocso-shield",
    name: "POCSO Shield",
    domain: "Blockchain / smart contracts",
    bearing: 225,
    range: 2400,
    summary: "On-chain audit trail for anonymous child-safety reports.",
    lede:
      "A team build in the CRAFTATHON repository: an anonymous incident-reporting platform where every report hash and every authority action is mirrored on Ethereum, so the audit trail cannot be rewritten after the fact. Authority access is scoped by jurisdiction, and the contract enforces that scoping on-chain rather than leaving it to the interface. My part is the contract layer — POCSORegistry, its test suite, and the ethers integration the backend calls.",
    metrics: [
      { label: "Contract tests", value: "23", note: "Hardhat · test/POCSORegistry.test.ts" },
      {
        label: "Assert a revert",
        value: "12 of 23",
        note: "access control and input validation",
      },
      {
        label: "Contract",
        value: "POCSORegistry.sol",
        note: "Solidity ^0.8.20 · Ownable + ReentrancyGuard",
      },
      { label: "Network", value: "Ethereum Sepolia", note: "Infura RPC" },
    ],
    stack: ["Solidity", "Hardhat", "OpenZeppelin", "ethers.js", "TypeScript"],
    repoUrl: "https://github.com/Ayush3422/CRAFTATHON",
    caveat:
      "This is a team project and the repository is a fork of CODER7657/CRAFTATHON. Two of the seventeen commits are mine, and they are the two that build the contract, its tests and the ethers integration — the FastAPI backend, the AI classification pipeline and the Next.js portal are my teammate's work, and nothing on this card is a claim about them. The contract is exercised against a local Hardhat chain and deployed to a testnet; it has not been audited.",
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
  {
    slug: "smart-bus-tracker",
    name: "Smart Bus Tracker",
    domain: "Applied ML / transit",
    // In the applied-ML arc with the other two, and clear of QuantumChat: at
    // this range both blips sit almost on the origin, and at 330 their labels
    // overlapped. See the separation test in tests/unit/data.test.ts.
    bearing: 50,
    range: 800,
    summary: "Ridership prediction over a GTFS feed, with a flaw its own tests record.",
    lede:
      "Real-time bus tracking with a CatBoost ridership model over a GTFS feed, behind a Flask API and a React map. It is the shallowest contact here on purpose: the evidence for it is a single recorded test run, and that run contains a result the project has not yet explained.",
    metrics: [
      { label: "Backend tests", value: "6 of 6", note: "recorded run, 2025-09-17" },
      { label: "Model", value: "CatBoost", note: "11 features" },
      { label: "Feed", value: "654 buses", note: "29.8 mean passengers" },
      { label: "Response time", value: "2.12 s", note: "model performance scenario" },
    ],
    stack: ["Python", "CatBoost", "Flask", "React", "GTFS"],
    repoUrl: "https://github.com/Ayush3422/smart_bus_tracker",
    caveat:
      "The recorded run returns the same prediction for all three routes it tests — 13.25 mean and 123.17 peak for RT001, RT002 and RT003 alike — and logs a consistency range of zero. Route identity is not moving the model, so those per-route numbers should not be read as per-route forecasts until that is chased down. It is also two commits of work from a single day, and unlike every other contact here it is not deployed anywhere.",
  },
];

/**
 * How many contacts are plotted. Exported because four separate places used to
 * state it as a literal — the hero, the dive plan, the ranking note and the
 * sign-off — and adding a sixth project left all four saying five.
 */
export const projectCount = projects.length;

/**
 * The same number as a word, capitalised — both places it appears in prose
 * begin a sentence. Falls back to the numeral past ten, which is a count this
 * page is unlikely to reach and would read badly as a word if it did.
 */
export const projectCountWord =
  ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"][
    projectCount
  ] ?? String(projectCount);
