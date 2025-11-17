# 🚀 AI/ML Portfolio Website

A cutting-edge, interactive portfolio showcasing AI/ML projects with advanced 3D backgrounds, premium glassmorphism effects, and an intelligent chatbot assistant.

![Portfolio Preview](https://img.shields.io/badge/Status-Live-success)
![React](https://img.shields.io/badge/React-18.2-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3.3-cyan)
![Three.js](https://img.shields.io/badge/Three.js-0.180-black)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🎨 Premium Visual Design
- **Advanced 3D Backgrounds** - Animated neural networks, data flow particles, and wave grids
- **Enhanced Glassmorphism** - Interactive cards with shimmer, glow, and depth effects
- **Animated Gradients** - Flowing color transitions and rotating borders
- **3D Mouse Tracking** - Cards that tilt and respond to mouse movement
- **Floating Orbs** - Atmospheric depth with animated gradient spheres
- **Dark/Light Theme** - Full theme toggle with smooth transitions
- **Fully Responsive** - Optimized for all devices

### 🎭 Advanced Visual Effects
- **Pulsing Animations** - Icons and elements pulse with smooth easing
- **Shimmer Effects** - Light sweep animations on hover
- **Depth Layers** - 3D perspective with multiple visual layers
- **Custom Shaders** - GLSL shaders for wave-animated grids
- **Particle Systems** - 100+ particles flowing with gradient colors
- **Neural Network Viz** - Real-time animated neural network with 50+ nodes

### 🤖 AI Chatbot Assistant
- **Smart Pattern Matching** - Answers questions about projects, skills, achievements, and learning
- **17+ Categories** - Expanded knowledge base including new sections
- **Instant Responses** - No API delays or costs
- **Beautiful UI** - Floating chat with enhanced glassmorphism
- **Quick Replies** - Suggested questions for easy navigation
- **Upgrade Ready** - Easy migration to OpenAI/HuggingFace APIs

### 📄 Comprehensive Sections
1. **Hero** - 3D neural network background with interactive glassmorphism card
2. **About** - Floating gradient orbs with animated text
3. **Skills** - Animated progress bars with dynamic skill matrix
4. **Projects** - Detailed project cards with live demos and notebooks
5. **Achievements** - Glowing badges with pulsing icons (6 achievements)
6. **Learning Log** - Expandable blog posts with category filters (8 posts)
7. **Contact** - Professional contact form

### 🛠️ Tech Stack
- **React 18.2** - Modern frontend framework
- **Vite 4.4** - Lightning-fast build tool
- **Tailwind CSS 3.3** - Utility-first styling with custom animations
- **Framer Motion** - Advanced animation library
- **React Router 6** - Client-side routing
- **Three.js + R3F** - 3D graphics and particle systems
- **@react-three/drei** - Three.js helpers
- **Lucide React** - 500+ beautiful icons

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/ai-ml-portfolio.git
cd ai-ml-portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see your portfolio!

### Build for Production

```bash
# Create optimized build
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
ai-ml-portfolio/
├── public/
│   ├── favicon.ico
│   └── projects/              # Project screenshots/GIFs
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Chatbot.jsx        # 🤖 AI Chatbot
│   │   ├── ProjectCard.jsx
│   │   └── 3d/                # Three.js components
│   ├── sections/
│   │   ├── Hero.jsx
│   │   ├── About.jsx
│   │   ├── Skills.jsx
│   │   ├── Projects.jsx
│   │   ├── Contact.jsx
│   │   └── ProjectDetail.jsx  # Detailed project pages
│   ├── data/
│   │   ├── projects.js        # Project data
│   │   ├── skills.js
│   │   └── chatbotAnswers.js  # 🧠 Chatbot knowledge base
│   ├── App.jsx
│   └── main.jsx
├── .env.example               # Environment variables template
└── package.json
```

## 🎯 Customization

### 1. Update Your Information

**Projects** - Edit `src/data/projects.js`:
```javascript
export const projects = [
  {
    title: "Your Project",
    description: "Your description",
    tags: ["Tech", "Stack"],
    // ... more details
  }
];
```

**Skills** - Edit `src/data/skills.js`:
```javascript
export const skills = {
  "Your Category": [
    { name: "Skill Name", level: 90 }
  ]
};
```

**Chatbot** - Edit `src/data/chatbotAnswers.js`:
```javascript
export const knowledgeBase = {
  yourTopic: {
    patterns: ['keyword1', 'keyword2'],
    responses: ["Your answer here"]
  }
};
```

### 2. Add Project Images

Place images in `public/projects/`:
- `project-name-screenshot.png`
- `project-demo.gif`
- `architecture-diagram.png`

See `IMAGE_GUIDE.md` for detailed instructions.

### 3. Customize Colors

Edit `tailwind.config.js` or use Tailwind's color utilities:
```javascript
// Change accent color from cyan to purple
className="from-purple-500 to-pink-500"
```

## 🤖 Chatbot Setup

### Current: Pattern Matching (No API)
The chatbot works out of the box with intelligent pattern matching!

**Try it:**
- "What projects do you have?"
- "Tell me about your skills"
- "How can I contact you?"

### Upgrade: AI-Powered (Optional)

For advanced AI responses using OpenAI, HuggingFace, or Cohere:

1. Copy `.env.example` to `.env`
2. Add your API key
3. Follow `CHATBOT_GUIDE.md` for complete setup

**See full guide:** [CHATBOT_GUIDE.md](CHATBOT_GUIDE.md)

## 📚 Documentation

- [CHATBOT_README.md](CHATBOT_README.md) - Chatbot features and usage
- [CHATBOT_GUIDE.md](CHATBOT_GUIDE.md) - API upgrade instructions
- [IMAGE_GUIDE.md](IMAGE_GUIDE.md) - Adding images and GIFs
- [GLASSMORPHISM_GUIDE.md](GLASSMORPHISM_GUIDE.md) - Design system
- [3D_GUIDE.md](3D_GUIDE.md) - 3D graphics setup
- [SYNTAX_HIGHLIGHTING_GUIDE.md](SYNTAX_HIGHLIGHTING_GUIDE.md) - Code styling
- [PROJECT_DETAILS_GUIDE.md](PROJECT_DETAILS_GUIDE.md) - Project pages

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Install Netlify CLI  
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

### GitHub Pages

```bash
# Build
npm run build

# Deploy to gh-pages branch
npm run deploy
```

Add to `package.json`:
```json
"scripts": {
  "deploy": "gh-pages -d dist"
}
```

## 🎨 Key Features Explained

### Glassmorphism Design
Custom CSS classes for frosted glass effects:
- `.glass-card` - Standard glass effect
- `.glass-card-hover` - With hover enhancement
- `.glass-strong` - Stronger blur
- `.glass-subtle` - Minimal effect

### Responsive Design
- Mobile-first approach
- Tailwind breakpoints: `sm:`, `md:`, `lg:`, `xl:`
- Hamburger menu on mobile
- Optimized touch targets

### Smooth Scrolling
- Navbar links scroll to sections
- Hash-based navigation
- Smooth scroll behavior

### Animations
- Fade-in on scroll (Framer Motion)
- Hover effects
- Page transitions
- Loading states

## 🔒 Security

- ✅ `.env` files in `.gitignore`
- ✅ API keys never committed
- ✅ Serverless function support
- ✅ Environment variable template

## 📊 Performance

- ⚡ Vite for fast builds
- 📦 Code splitting with React Router
- 🎨 Tailwind CSS purging
- 🖼️ Image optimization ready
- 📱 Mobile-optimized

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📝 License

MIT License - feel free to use for your own portfolio!

## 🙏 Acknowledgments

- **React Team** - Amazing framework
- **Tailwind Labs** - Beautiful CSS framework
- **Framer** - Smooth animations
- **Three.js** - 3D graphics
- **Lucide** - Icon library

## 📧 Contact

Questions? The chatbot can help! Or reach out through the contact form on the live site.

---

**Built with ❤️ and lots of ☕**

**Happy coding!** 🚀

