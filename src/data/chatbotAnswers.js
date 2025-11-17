// Simple knowledge base for the chatbot
// Upgrade to API-powered later if needed

export const knowledgeBase = {
  // Greetings
  greetings: {
    patterns: ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon'],
    responses: [
      "Hi! 👋 I'm here to help you learn about this portfolio. What would you like to know?",
      "Hello! Feel free to ask me about the projects, skills, or experience showcased here!",
      "Hey there! Ask me anything about this portfolio and I'll do my best to help!"
    ]
  },

  // About/Introduction
  about: {
    patterns: ['who are you', 'about you', 'tell me about yourself', 'introduction', 'who is this'],
    responses: [
      "I'm the portfolio assistant! This site showcases AI/ML projects, including an image classifier, chatbot, blockchain DApp, and data visualization dashboard. What interests you most?"
    ]
  },

  // Projects - General
  projects: {
    patterns: ['projects', 'what projects', 'show projects', 'your work', 'portfolio'],
    responses: [
      "There are 4 main projects:\n\n1. 🤖 AI Image Classifier - 95% accuracy CNN\n2. 💬 Smart Chatbot - NLP with transformers\n3. ⛓️ Blockchain DApp - Solidity smart contracts\n4. 📊 Data Viz Dashboard - Interactive D3.js charts\n\nWhich one interests you?"
    ]
  },

  // AI Image Classifier
  imageClassifier: {
    patterns: ['image classifier', 'cnn', 'computer vision', 'image recognition', 'tensorflow'],
    responses: [
      "The AI Image Classifier uses TensorFlow and transfer learning (MobileNetV2) to achieve 95% accuracy! It classifies images across 10 categories with data augmentation and fine-tuning. Built with Python, Keras, and deployed on Google Colab. Click 'View Details' to see the code!"
    ]
  },

  // Chatbot Project
  chatbotProject: {
    patterns: ['chatbot project', 'nlp', 'transformers', 'bert', 'smart chatbot'],
    responses: [
      "The Smart Chatbot uses BERT for intent classification with 90% accuracy and handles customer queries in real-time! Built with PyTorch, Transformers, Flask, and MongoDB. It achieved 70% automation rate and 40% cost reduction. Pretty cool, right?"
    ]
  },

  // Blockchain DApp
  blockchain: {
    patterns: ['blockchain', 'dapp', 'solidity', 'ethereum', 'smart contract', 'web3'],
    responses: [
      "The Blockchain DApp is a decentralized voting application using Solidity smart contracts! Features MetaMask integration, 30% gas optimization, and passed security audit. Built with React, Web3.js, and Hardhat for testing."
    ]
  },

  // Data Visualization
  dataViz: {
    patterns: ['dashboard', 'visualization', 'd3', 'data viz', 'charts', 'analytics'],
    responses: [
      "The Data Visualization Dashboard handles 1M+ data points with real-time updates! Built with React and D3.js for interactive charts, plus WebSocket for live data streaming. Response time under 100ms. Used by 200+ daily users!"
    ]
  },

  // Skills
  skills: {
    patterns: ['skills', 'technologies', 'tech stack', 'what can you do', 'languages'],
    responses: [
      "Key skills include:\n\n🐍 Python (TensorFlow, PyTorch, Pandas)\n⚛️ React & JavaScript (D3.js, Node.js)\n⛓️ Blockchain (Solidity, Web3.js)\n🗄️ Databases (MongoDB, PostgreSQL)\n☁️ Cloud (Google Colab, AWS)\n\nWhat would you like to know more about?"
    ]
  },

  // Experience
  experience: {
    patterns: ['experience', 'background', 'work', 'career'],
    responses: [
      "This portfolio showcases hands-on experience in AI/ML, full-stack development, and blockchain. Highlights include 95% accuracy models, 90% customer satisfaction chatbots, and production-ready dashboards. Check out the project details for metrics!"
    ]
  },

  // Contact
  contact: {
    patterns: ['contact', 'email', 'reach', 'hire', 'connect', 'get in touch', 'linkedin', 'github profile', 'colab'],
    responses: [
      "Let's connect! 🚀\n\n📧 Email: your.email@example.com\n💼 LinkedIn: linkedin.com/in/yourprofile\n💻 GitHub: github.com/yourusername\n🔬 Google Colab: Check out my ML notebooks\n\nScroll to the Contact section to send a message or click the social links. I'm open for hiring, collaborations, and project discussions!"
    ]
  },

  // Hiring
  hire: {
    patterns: ['hire', 'hire me', 'hiring', 'job', 'opportunity', 'available', 'freelance'],
    responses: [
      "I'm actively looking for opportunities! 💼\n\n✅ Open for full-time positions\n✅ Available for freelance projects\n✅ Interested in collaborations\n\nCheck out my resume in the Contact section or reach out directly at your.email@example.com. Let's build something amazing together!"
    ]
  },

  // Collaboration
  collaborate: {
    patterns: ['collaborate', 'collaboration', 'work together', 'partner', 'team up'],
    responses: [
      "I'd love to collaborate! 🤝\n\nI'm particularly interested in:\n• AI/ML research projects\n• Open-source contributions\n• Blockchain innovations\n• Full-stack applications\n\nHead to the Contact section and click 'Start Collaboration' or connect with me on LinkedIn/GitHub!"
    ]
  },

  // GitHub/Demo
  code: {
    patterns: ['github', 'code', 'source', 'repository', 'demo', 'live'],
    responses: [
      "Each project has GitHub links and live demos! Click 'View Details' on any project card to access the code, notebooks (Colab/Kaggle), and try the live demos. The code includes detailed implementations!"
    ]
  },

  // Technologies - Specific
  python: {
    patterns: ['python', 'tensorflow', 'pytorch', 'keras', 'numpy', 'pandas'],
    responses: [
      "Python is used extensively! TensorFlow & Keras for the image classifier, PyTorch & Transformers for the chatbot, Pandas for data processing in the dashboard. Also familiar with NumPy, Scikit-learn, and Matplotlib!"
    ]
  },

  react: {
    patterns: ['react', 'frontend', 'javascript', 'jsx', 'ui'],
    responses: [
      "React powers multiple projects! The blockchain DApp and data dashboard both use React with modern hooks. This portfolio itself is built with React, Vite, Tailwind CSS, and Framer Motion for animations!"
    ]
  },

  // Machine Learning
  ml: {
    patterns: ['machine learning', 'deep learning', 'neural network', 'ai', 'model'],
    responses: [
      "Machine Learning is a core strength! Experience includes CNNs for image classification, BERT transformers for NLP, transfer learning, data augmentation, and model optimization. Achieved 95%+ accuracy on production models!"
    ]
  },

  // Achievements
  achievements: {
    patterns: ['achievements', 'awards', 'recognition', 'hackathon', 'certification', 'accomplishments'],
    responses: [
      "Here are some key achievements:\n\n🏆 Hackathon Winner - First place in College AI/ML Hackathon 2023\n🎓 Academic Excellence - Dean's List (Top 5%)\n💻 Open Source - Contributed to 10+ ML projects\n📝 Research - Published paper on Deep Learning\n👥 Community Leader - Founded AI/ML Study Group (100+ members)\n🎯 Google ML Engineer Certified\n\nCheck out the Achievements section for more details!"
    ]
  },

  // Learning Log
  learningLog: {
    patterns: ['learning', 'blog', 'articles', 'learning log', 'insights', 'what did you learn'],
    responses: [
      "The Learning Log documents my journey with experiments and insights! Recent topics include:\n\n• Neural network pruning optimization\n• Real-time analytics with Apache Kafka\n• Transformer attention mechanisms\n• Smart contracts with Solidity\n• YOLOv8 object detection\n• React performance optimization\n\nCheck the Learning Log section to read more!"
    ]
  },

  // Help
  help: {
    patterns: ['help', 'what can you do', 'options', 'commands'],
    responses: [
      "I can answer questions about:\n\n• 🚀 Projects & technical details\n• 💻 Skills & technologies\n• 🏆 Achievements & awards\n• 📚 Learning Log & insights\n• 📊 Results & impact\n• 📧 Contact information\n• 🔗 GitHub & demos\n\nJust ask naturally, like 'Tell me about the chatbot project' or 'What are your achievements?'"
    ]
  },

  // Thanks
  thanks: {
    patterns: ['thanks', 'thank you', 'appreciate', 'helpful'],
    responses: [
      "You're welcome! Happy to help! 😊",
      "Glad I could help! Feel free to ask anything else!",
      "Anytime! Let me know if you need more info!"
    ]
  },

  // Default fallback
  default: {
    responses: [
      "I'm not sure about that, but I can tell you about the projects, skills, or how to get in touch! What would you like to know?",
      "Hmm, I don't have specific info on that. Try asking about projects, technologies, or contact details!",
      "I'm still learning! You can ask me about the AI projects, blockchain work, or technical skills showcased here."
    ]
  }
};

// Simple pattern matching function
export const findBestMatch = (userInput) => {
  const input = userInput.toLowerCase().trim();
  
  // Check each category
  for (const [category, data] of Object.entries(knowledgeBase)) {
    if (category === 'default') continue;
    
    // Check if any pattern matches
    const matches = data.patterns?.some(pattern => 
      input.includes(pattern.toLowerCase())
    );
    
    if (matches) {
      // Return random response from category
      const responses = data.responses;
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }
  
  // Default fallback
  const defaultResponses = knowledgeBase.default.responses;
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
};

// Quick replies for suggested questions
export const quickReplies = [
  "What projects do you have?",
  "Tell me about your skills",
  "Show me your achievements",
  "What have you learned recently?",
  "How can I contact you?"
];

