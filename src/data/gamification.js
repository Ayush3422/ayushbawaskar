import { Trophy, Target, Zap, Award, Star, TrendingUp } from 'lucide-react';

// Skill categories with XP tracking
export const skillsData = {
  // Frontend Development
  frontend: {
    category: 'Frontend Development',
    icon: 'Code',
    color: 'from-cyan-400 to-blue-500',
    bgColor: 'bg-cyan-500/10',
    skills: [
      { name: 'React', level: 70, xp: 7000, maxXp: 10000, projects: 4, badges: [] },
      { name: 'JavaScript', level: 75, xp: 7500, maxXp: 10000, projects: 5, badges: [] },
      { name: 'Tailwind CSS', level: 75, xp: 7500, maxXp: 10000, projects: 5, badges: [] },
      { name: 'HTML/CSS', level: 80, xp: 8000, maxXp: 10000, projects: 6, badges: [] },
    ]
  },

  // Backend Development
  backend: {
    category: 'Backend Development',
    icon: 'Server',
    color: 'from-green-400 to-emerald-500',
    bgColor: 'bg-green-500/10',
    skills: [
      { name: 'Node.js', level: 60, xp: 6000, maxXp: 10000, projects: 2, badges: [] },
      { name: 'Python', level: 70, xp: 7000, maxXp: 10000, projects: 4, badges: [] },
      { name: 'Express', level: 55, xp: 5500, maxXp: 10000, projects: 2, badges: [] },
      { name: 'MongoDB', level: 50, xp: 5000, maxXp: 10000, projects: 1, badges: [] },
    ]
  },

  // Machine Learning & AI
  mlai: {
    category: 'Machine Learning & AI',
    icon: 'Brain',
    color: 'from-purple-400 to-pink-500',
    bgColor: 'bg-purple-500/10',
    skills: [
      { name: 'TensorFlow', level: 65, xp: 6500, maxXp: 10000, projects: 2, badges: [] },
      { name: 'Scikit-learn', level: 60, xp: 6000, maxXp: 10000, projects: 2, badges: [] },
      { name: 'NumPy', level: 70, xp: 7000, maxXp: 10000, projects: 3, badges: [] },
      { name: 'Pandas', level: 65, xp: 6500, maxXp: 10000, projects: 2, badges: [] },
    ]
  },

  // Blockchain & Web3
  blockchain: {
    category: 'Blockchain & Web3',
    icon: 'Link',
    color: 'from-orange-400 to-red-500',
    bgColor: 'bg-orange-500/10',
    skills: [
      { name: 'Solidity', level: 60, xp: 6000, maxXp: 10000, projects: 2, badges: [] },
      { name: 'Web3.js', level: 55, xp: 5500, maxXp: 10000, projects: 2, badges: [] },
      { name: 'Ethers.js', level: 55, xp: 5500, maxXp: 10000, projects: 2, badges: [] },
      { name: 'Smart Contracts', level: 50, xp: 5000, maxXp: 10000, projects: 1, badges: [] },
    ]
  },

  // DevOps & Tools
  devops: {
    category: 'DevOps & Tools',
    icon: 'Settings',
    color: 'from-yellow-400 to-orange-500',
    bgColor: 'bg-yellow-500/10',
    skills: [
      { name: 'Git/GitHub', level: 75, xp: 7500, maxXp: 10000, projects: 7, badges: [] },
      { name: 'VS Code', level: 80, xp: 8000, maxXp: 10000, projects: 7, badges: [] },
      { name: 'npm/yarn', level: 70, xp: 7000, maxXp: 10000, projects: 5, badges: [] },
    ]
  }
};

// Overall stats
export const overallStats = {
  totalXP: 12500,
  level: 8,
  nextLevelXP: 15000,
  projectsCompleted: 7,
  hackathonsWon: 1,
  badges: 3,
  contributions: 45,
  streakDays: 15
};

// Achievement badges
export const achievements = [
  {
    id: 1,
    title: 'First Project',
    description: 'Completed your first project',
    icon: Star,
    color: 'from-cyan-400 to-blue-500',
    earned: true,
    earnedDate: '2024-06-10',
    xpReward: 100
  },
  {
    id: 2,
    title: 'Portfolio Builder',
    description: 'Created a personal portfolio website',
    icon: Award,
    color: 'from-purple-400 to-pink-500',
    earned: true,
    earnedDate: '2024-09-15',
    xpReward: 200
  },
  {
    id: 3,
    title: 'Code Enthusiast',
    description: 'Maintained a 40-day coding streak',
    icon: TrendingUp,
    color: 'from-green-400 to-emerald-500',
    earned: true,
    earnedDate: '2024-10-01',
    xpReward: 150
  },
  {
    id: 4,
    title: 'Quick Learner',
    description: 'Learned 3 new technologies',
    icon: Zap,
    color: 'from-yellow-400 to-orange-500',
    earned: false,
    earnedDate: null,
    xpReward: 250
  },
  {
    id: 5,
    title: 'Project Master',
    description: 'Complete 10 projects',
    icon: Trophy,
    color: 'from-pink-400 to-fuchsia-500',
    earned: false,
    earnedDate: null,
    xpReward: 500
  },
  {
    id: 6,
    title: 'Hackathon Participant',
    description: 'Participate in your first hackathon',
    icon: Target,
    color: 'from-indigo-400 to-purple-500',
    earned: true,
    earnedDate: null,
    xpReward: 300
  }
];

// Recent XP gains
export const recentXPGains = [
  { date: '2024-11-15', activity: 'Built Portfolio Website with React', xp: 300, category: 'Frontend' },
  { date: '2024-11-10', activity: 'Completed AI bus tracker ', xp: 250, category: 'ML/AI' },
  { date: '2024-11-05', activity: 'Created Blockchain DApp', xp: 200, category: 'Blockchain' },
  { date: '2024-10-28', activity: 'Built Chatbot with NLP', xp: 200, category: 'ML/AI' },
  { date: '2024-10-20', activity: 'Completed first React project', xp: 150, category: 'Frontend' },
];
