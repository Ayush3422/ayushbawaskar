export const projects = [
  {
    id: 1,
    slug: "quantumchat",
    title: "QuantumChat - Post-Quantum Secure Messaging",
    description: "Real-time messaging application demonstrating post-quantum cryptography with Kyber-1024 algorithm. Protected against quantum computer attacks with end-to-end encryption.",
    tags: ["JavaScript", "Node.js", "Quantum Cryptography", "WebSocket", "AES-256"],
    github: "https://github.com/Ayush3422/quantum_crypto",
    demo: "",
    image: "/projects/quantum-chat.svg",
    
    // Detailed project information
    problem: "Current RSA and ECC cryptography will be vulnerable to quantum computer attacks within 10-20 years. Need for quantum-resistant encryption to protect communications against future threats from cryptographically relevant quantum computers.",
    
    approach: "Implemented a simulated Kyber-1024 algorithm (NIST-standardized post-quantum cryptography) for quantum-resistant key exchange. Built real-time messaging with WebSocket support and AES-256-GCM encryption. Created educational interface showing security status and cryptographic processes in action.",
    
    dataset: "N/A - Real-time messaging application with WebSocket-based communication",
    
    methodology: [
      "Post-Quantum Key Exchange: Simulated Kyber-1024 (lattice-based cryptography)",
      "Message Encryption: AES-256-GCM with quantum-safe keys",
      "Key Management: Secure key generation and exchange protocols",
      "Real-time Communication: WebSocket for instant encrypted messaging",
      "Security Flow: Key generation → Exchange → Shared secret → Encrypted messaging",
      "Educational UI: Displays cryptographic processes and security status"
    ],
    
    tools: ["JavaScript", "Node.js", "Express", "WebSocket", "HTML5", "CSS3", "Kyber Algorithm"],
    
    results: {
      security: "Quantum-resistant encryption",
      keySize: "256 bits",
      algorithm: "Kyber-1024 + AES-256-GCM",
      realtime: "Instant message delivery",
      protection: "Resistant to Shor's algorithm",
      standard: "NIST PQC standardized"
    },
    
    lessons: [
      "Post-quantum cryptography is essential for future-proof security",
      "Lattice-based algorithms provide quantum resistance",
      "Real-time key exchange requires careful state management",
      "Educational interfaces help understand complex cryptography",
      "WebSocket enables efficient encrypted communication"
    ],
    
    nextSteps: [
      "Integrate actual NIST-standardized PQC libraries (liboqs)",
      "Implement hardware security module (HSM) support",
      "Add multi-user group chat with quantum-safe encryption",
      "Conduct professional security audit",
      "Deploy to production with proper key management"
    ],
    
    screenshots: [
      "/projects/quantum-chat-ui.gif",
      "/projects/quantum-encryption.png",
      "/projects/quantum-architecture.png"
    ],
    
    codeSnippet: `// Quantum-Safe Key Exchange with Kyber
class QuantumCrypto {
  constructor() {
    this.publicKey = null;
    this.privateKey = null;
    this.sharedSecret = null;
  }

  // Generate post-quantum key pair
  generateKeyPair() {
    const params = {
      n: 256,        // Polynomial degree
      q: 3329,       // Modulus
      k: 4,          // Security parameter
      eta: 2         // Noise distribution
    };
    
    // Simulated Kyber-1024 key generation
    this.privateKey = this.generatePrivateKey(params);
    this.publicKey = this.generatePublicKey(this.privateKey, params);
    
    return { publicKey: this.publicKey };
  }

  // Establish shared secret (quantum-resistant)
  deriveSharedSecret(peerPublicKey) {
    // Lattice-based key agreement
    this.sharedSecret = this.kyberEncapsulate(peerPublicKey);
    return this.hashSecret(this.sharedSecret);
  }
}`,
    
    language: "JavaScript",
    colab: "",
    kaggle: "",
    notebook: ""
  },
  {
    id: 2,
    slug: "vortifi",
    title: "VortiFi - Blockchain Voting DApp",
    description: "Decentralized voting application for Rotaract elections using Ethereum smart contracts with secure token-based authentication and transparent vote counting.",
    tags: ["Solidity", "React", "JavaScript", "Hardhat", "Ethers.js", "Web3"],
    github: "https://github.com/Ayush3422/VortiFi",
    demo: "",
    image: "/projects/vortifi.svg",
    
    problem: "Traditional voting systems lack transparency, are vulnerable to manipulation, and difficult to audit. Centralized election management creates trust issues and potential for fraud. Need for a secure, transparent, and immutable voting system for organizational elections.",
    
    approach: "Developed a blockchain-based voting platform using Solidity smart contracts for tamper-proof vote storage. Implemented token-based authentication where admins issue unique, single-use voting tokens to eligible voters. Built React frontend with ethers.js for seamless Web3 integration and real-time results monitoring.",
    
    dataset: "N/A - Blockchain DApp with on-chain voting records and candidate data",
    
    methodology: [
      "Smart Contract: Solidity (v0.8.19) with admin access controls",
      "Token System: Hashed single-use tokens for voter authentication",
      "Candidate Management: Add/remove candidates with position tracking",
      "Vote Recording: On-chain storage with voter ID and candidate mapping",
      "Deployment: Hardhat Ignition for contract deployment",
      "Frontend: React with ethers.js for blockchain interaction"
    ],
    
    tools: ["Solidity", "React", "JavaScript", "Hardhat", "Ethers.js", "CSS", "Infura", "MetaMask"],
    
    results: {
      security: "Immutable on-chain voting records",
      transparency: "Public vote counting and auditing",
      authentication: "Secure token-based voter verification",
      accessibility: "No wallet required for voting",
      adminControl: "Centralized candidate and token management",
      codebase: "67.1% JavaScript, 9% Solidity"
    },
    
    lessons: [
      "Token hashing ensures vote anonymity while preventing fraud",
      "Admin-only functions critical for election integrity",
      "Public vote results increase trust and transparency",
      "Separating voter authentication from wallet connection improves UX",
      "Smart contract testing essential before deployment"
    ],
    
    nextSteps: [
      "Deploy to Ethereum mainnet for production use",
      "Implement MetaMask integration for admin dashboard",
      "Add encrypted token distribution mechanism",
      "Create mobile app for easier voter access",
      "Add real-time vote notifications and analytics"
    ],
    
    screenshots: [
      "/projects/vortifi-voting.gif",
      "/projects/vortifi-admin.png",
      "/projects/vortifi-results.png"
    ],
    
    codeSnippet: `// Solidity Smart Contract - VortiFi Voting
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract RotaractVoting {
    address public admin;
    
    struct Candidate {
        uint256 id;
        string name;
        string position;
        uint256 voteCount;
        bool isActive;
    }
    
    struct Vote {
        string voterId;
        uint256 candidateId;
        uint256 timestamp;
    }
    
    mapping(uint256 => Candidate) public candidates;
    mapping(bytes32 => bool) public usedTokens;
    mapping(bytes32 => string) public tokenToVoterId;
    
    uint256 public candidateCount;
    Vote[] public votes;
    
    event CandidateAdded(uint256 id, string name, string position);
    event VoteCast(string voterId, uint256 candidateId);
    event TokenIssued(bytes32 tokenHash, string voterId);
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }
    
    constructor() {
        admin = msg.sender;
    }
    
    function addCandidate(string memory _name, string memory _position) 
        public onlyAdmin 
    {
        candidateCount++;
        candidates[candidateCount] = Candidate(
            candidateCount,
            _name,
            _position,
            0,
            true
        );
        emit CandidateAdded(candidateCount, _name, _position);
    }
    
    function addVoterToken(string memory _token, string memory _voterId) 
        public onlyAdmin 
    {
        bytes32 tokenHash = keccak256(abi.encodePacked(_token));
        require(!usedTokens[tokenHash], "Token already issued");
        
        tokenToVoterId[tokenHash] = _voterId;
        emit TokenIssued(tokenHash, _voterId);
    }
    
    function vote(string memory _token, uint256 _candidateId) public {
        bytes32 tokenHash = keccak256(abi.encodePacked(_token));
        
        require(bytes(tokenToVoterId[tokenHash]).length > 0, "Invalid token");
        require(!usedTokens[tokenHash], "Token already used");
        require(candidates[_candidateId].isActive, "Invalid candidate");
        
        usedTokens[tokenHash] = true;
        candidates[_candidateId].voteCount++;
        
        votes.push(Vote(
            tokenToVoterId[tokenHash],
            _candidateId,
            block.timestamp
        ));
        
        emit VoteCast(tokenToVoterId[tokenHash], _candidateId);
    }
    
    function getResults() public view returns (Candidate[] memory) {
        Candidate[] memory activeList = new Candidate[](candidateCount);
        uint256 count = 0;
        
        for (uint256 i = 1; i <= candidateCount; i++) {
            if (candidates[i].isActive) {
                activeList[count] = candidates[i];
                count++;
            }
        }
        return activeList;
    }
}`,
    
    language: "Solidity",
    colab: "",
    kaggle: "",
    notebook: ""
  },
  {
    id: 3,
    slug: "webathon",
    title: "WEBATHON - Multi-Design Showcase",
    description: "Comprehensive web development project with 8 unique design implementations. Showcasing modern HTML, CSS, TypeScript, and responsive design patterns across multiple themes.",
    tags: ["TypeScript", "HTML", "CSS", "JavaScript", "Responsive Design"],
    github: "https://github.com/Ayush3422/WEBATHON",
    demo: "",
    image: "/projects/webathon.svg",
    
    problem: "Web developers often struggle to demonstrate versatility across different design patterns and styles. Single-design portfolios fail to showcase the breadth of CSS skills, responsive techniques, and layout approaches needed for diverse client projects.",
    
    approach: "Created a webathon project featuring 8 distinct design implementations, each with unique layouts, color schemes, and interaction patterns. Built with TypeScript for type safety and modern JavaScript for interactivity. Implemented responsive breakpoints and accessibility features across all designs. Collaborated with 3 contributors for diverse design perspectives.",
    
    dataset: "N/A - Frontend showcase with 8 different design implementations",
    
    methodology: [
      "Multi-Design Architecture: 8 separate design folders with unique themes",
      "TypeScript Integration: Type-safe JavaScript for maintainable code",
      "Responsive Design: Mobile-first approach with flexible layouts",
      "CSS Techniques: Flexbox, Grid, animations, and modern CSS",
      "Collaboration: 3-person team with 42 commits of iterative development",
      "Version Control: Git workflow with feature branches"
    ],
    
    tools: ["TypeScript", "HTML5", "CSS3", "JavaScript", "Git", "Responsive Design"],
    
    results: {
      designs: "8 unique implementations",
      contributors: "3 team members",
      commits: "42 development commits",
      responsive: "Mobile to desktop breakpoints",
      codebase: "63.7% TypeScript, 29.5% HTML, 5.2% CSS",
      collaboration: "Successful team coordination"
    },
    
    lessons: [
      "Design versatility requires understanding different user needs",
      "TypeScript improves code quality in multi-file projects",
      "Consistent naming conventions are crucial for team projects",
      "Responsive design patterns must be tested across devices",
      "Git collaboration requires clear communication and branching strategy"
    ],
    
    nextSteps: [
      "Add interactive demos for each design",
      "Implement design switching mechanism",
      "Add dark mode support to all designs",
      "Create unified component library",
      "Add performance optimization and lazy loading"
    ],
    
    screenshots: [
      "/projects/webathon-designs.gif",
      "/projects/webathon-responsive.png",
      "/projects/webathon-layouts.png"
    ],
    
    codeSnippet: `// TypeScript Design Component with Type Safety
interface DesignConfig {
  theme: string;
  colors: ColorPalette;
  layout: LayoutType;
  responsive: boolean;
}

interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

type LayoutType = 'grid' | 'flex' | 'masonry' | 'card';

class DesignManager {
  private config: DesignConfig;
  private currentDesign: number = 1;
  
  constructor(config: DesignConfig) {
    this.config = config;
    this.initializeDesign();
  }
  
  switchDesign(designNumber: number): void {
    if (designNumber < 1 || designNumber > 8) {
      throw new Error('Design number must be between 1 and 8');
    }
    
    this.currentDesign = designNumber;
    this.loadDesign(\`design \${designNumber}\`);
  }
  
  private loadDesign(designPath: string): void {
    // Load design-specific styles and scripts
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = \`\${designPath}/style.css\`;
    document.head.appendChild(stylesheet);
  }
  
  applyResponsiveBreakpoints(): void {
    const breakpoints = {
      mobile: 320,
      tablet: 768,
      desktop: 1024,
      wide: 1440
    };
    
    // Apply responsive logic
    window.addEventListener('resize', () => {
      const width = window.innerWidth;
      // Responsive adjustments based on breakpoints
    });
  }
}

// Initialize with configuration
const design = new DesignManager({
  theme: 'modern',
  colors: {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    accent: '#10b981',
    background: '#ffffff'
  },
  layout: 'grid',
  responsive: true
});`,
    
    language: "TypeScript",
    colab: "",
    kaggle: "",
    notebook: ""
  },
  {
    id: 4,
    slug: "kisan-mitra",
    title: "Kisan Mitra - AI-Powered Farming Assistant",
    description: "Smart agriculture platform helping farmers with crop recommendations, disease detection, and market price predictions using machine learning and computer vision.",
    tags: ["Python", "TensorFlow", "React", "Flask", "Computer Vision", "ML"],
    github: "https://github.com/Ayush3422/kisan-mitra",
    demo: "",
    image: "/projects/kisan-mitra.svg",
    
    problem: "Farmers face challenges in crop selection, disease identification, and getting fair market prices. Lack of access to agricultural experts and real-time market data leads to crop failures and economic losses. Traditional farming methods don't leverage modern technology for better yields.",
    
    approach: "Developed an AI-powered platform with three core features: ML-based crop recommendation using soil and climate data, computer vision for plant disease detection from leaf images, and predictive analytics for market price forecasting. Built responsive web interface with React and Flask backend for real-time predictions.",
    
    dataset: "Crop recommendation: 2000+ samples with soil parameters (NPK, pH, rainfall, temperature). Disease detection: 10,000+ plant leaf images across 20 disease categories. Market prices: Historical data from agricultural markets for trend analysis.",
    
    methodology: [
      "Crop Recommendation: Random Forest classifier on soil & climate features",
      "Disease Detection: CNN model (MobileNetV2) for image classification",
      "Price Prediction: LSTM neural network for time-series forecasting",
      "Data Preprocessing: Feature scaling, image augmentation, outlier removal",
      "Model Training: Transfer learning for disease detection, ensemble methods",
      "Deployment: Flask REST API with React frontend for farmer access"
    ],
    
    tools: ["Python", "TensorFlow", "Scikit-learn", "React", "Flask", "NumPy", "Pandas", "OpenCV"],
    
    results: {
      cropAccuracy: "92% crop recommendation accuracy",
      diseaseDetection: "89% disease identification accuracy",
      priceMAE: "Mean Absolute Error < 5% for prices",
      responseTime: "< 2 seconds for predictions",
      languages: "Support for Hindi and English",
      farmers: "Designed for rural farmers with simple UI"
    },
    
    lessons: [
      "Domain knowledge crucial for feature engineering in agriculture",
      "Transfer learning significantly improved disease detection accuracy",
      "Simple UI/UX essential for rural user adoption",
      "Data quality more important than quantity for accurate predictions",
      "Multilingual support increases accessibility for farmers"
    ],
    
    nextSteps: [
      "Add voice interface for farmers with low literacy",
      "Integrate weather API for real-time climate data",
      "Add soil testing recommendations and fertilizer suggestions",
      "Deploy mobile app for offline functionality",
      "Partner with agricultural departments for data validation"
    ],
    
    screenshots: [
      "/projects/kisan-mitra-home.gif",
      "/projects/kisan-mitra-disease.png",
      "/projects/kisan-mitra-crop.png"
    ],
    
    codeSnippet: `# Crop Recommendation Model
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

# Load agricultural dataset
df = pd.read_csv('crop_data.csv')

# Features: N, P, K, temperature, humidity, pH, rainfall
X = df[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
y = df['label']  # Crop types

# Split and scale data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train Random Forest model
model = RandomForestClassifier(
    n_estimators=100,
    max_depth=15,
    random_state=42
)
model.fit(X_train_scaled, y_train)

# Evaluate
accuracy = model.score(X_test_scaled, y_test)
print(f"Crop Recommendation Accuracy: {accuracy * 100:.2f}%")

# Prediction function
def recommend_crop(soil_data):
    """
    soil_data: dict with N, P, K, temp, humidity, pH, rainfall
    """
    features = [[
        soil_data['N'], soil_data['P'], soil_data['K'],
        soil_data['temperature'], soil_data['humidity'],
        soil_data['ph'], soil_data['rainfall']
    ]]
    
    scaled_features = scaler.transform(features)
    prediction = model.predict(scaled_features)
    probabilities = model.predict_proba(scaled_features)
    
    return {
        'recommended_crop': prediction[0],
        'confidence': max(probabilities[0]) * 100
    }`,
    
    language: "Python",
    colab: "",
    kaggle: "",
    notebook: ""
  }
];

// Helper function to get project by slug
export const getProjectBySlug = (slug) => {
  return projects.find(project => project.slug === slug);
};
