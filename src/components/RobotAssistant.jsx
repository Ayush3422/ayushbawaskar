import { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import { motion, AnimatePresence } from 'framer-motion';
import robotAnimation from '../assets/robot-assistant.json';

// Robot personality variations - different messages
const robotMessages = [
  { text: "Hey! I'm Zoho, Ayush's Assistant! 👋", emoji: "👋" },
  { text: "Welcome! I'm Zoho, your AI guide! 🤖", emoji: "🤖" },
  { text: "Hi! Zoho here, ready to help! 🚀", emoji: "🚀" },
  { text: "I'm Zoho! Let me show you around! 💡", emoji: "💡" },
  { text: "Zoho at your service! Let's explore! ⚡", emoji: "⚡" },
  { text: "Hey! Zoho here with amazing projects! 🎯", emoji: "🎯" },
  { text: "I'm Zoho! Scroll down to see more! 👇", emoji: "👇" },
  { text: "Zoho says: ML is awesome! 🧠", emoji: "🧠" },
];

const RobotAssistant = ({ onOpenChat }) => {
  const [showRobot, setShowRobot] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(robotMessages[0]);

  useEffect(() => {
    // Pick a random message when component mounts
    const randomMessage = robotMessages[Math.floor(Math.random() * robotMessages.length)];
    setCurrentMessage(randomMessage);
    // Show robot after 2 seconds when page loads
    const robotTimer = setTimeout(() => {
      setShowRobot(true);
    }, 2000);

    // Show message after robot appears
    const messageTimer = setTimeout(() => {
      setShowMessage(true);
    }, 3000);

    // Hide message after 6 seconds (robot stays)
    const hideMessageTimer = setTimeout(() => {
      setShowMessage(false);
    }, 8000);

    return () => {
      clearTimeout(robotTimer);
      clearTimeout(messageTimer);
      clearTimeout(hideMessageTimer);
    };
  }, []);

  const handleRobotClick = () => {
    // Open chatbot when robot is clicked
    if (onOpenChat) {
      onOpenChat();
    }
    
    // Also toggle message or pick a new random one
    if (!showMessage) {
      const randomMessage = robotMessages[Math.floor(Math.random() * robotMessages.length)];
      setCurrentMessage(randomMessage);
    }
    setShowMessage(!showMessage);
  };

  return (
    <AnimatePresence>
      {showRobot && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="fixed bottom-6 right-6 z-50 cursor-pointer"
          onClick={handleRobotClick}
        >
          {/* Robot Animation Container */}
          <div className="relative w-24 h-24 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 backdrop-blur-xl rounded-full p-3 border border-white/20 shadow-2xl hover:scale-110 transition-transform duration-300 hover:shadow-cyan-500/50">
            <Lottie 
              animationData={robotAnimation} 
              loop={true}
              style={{ width: '100%', height: '100%' }}
            />
            
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur-xl opacity-30 -z-10 animate-pulse"></div>
          </div>

          {/* Speech Bubble */}
          <AnimatePresence>
            {showMessage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="absolute bottom-28 right-0 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-medium whitespace-nowrap border border-white/20"
              >
                <div className="flex items-center gap-2">
                  <motion.span 
                    className="inline-block text-xl"
                    animate={{ 
                      rotate: [0, 14, -8, 14, -4, 10, 0],
                      scale: [1, 1.2, 1, 1.2, 1]
                    }}
                    transition={{ 
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 2
                    }}
                  >
                    {currentMessage.emoji}
                  </motion.span>
                  <span>{currentMessage.text}</span>
                </div>
                {/* Speech bubble arrow */}
                <div className="absolute -bottom-2 right-6 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-blue-600"></div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating particles around robot */}
          <div className="absolute inset-0 -z-10 pointer-events-none">
            <motion.div 
              className="absolute top-2 right-2 w-1.5 h-1.5 bg-cyan-400 rounded-full"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="absolute bottom-3 left-1 w-1.5 h-1.5 bg-purple-400 rounded-full"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            />
            <motion.div 
              className="absolute top-8 left-3 w-1.5 h-1.5 bg-green-400 rounded-full"
              animate={{ 
                y: [0, -10, 0],
                opacity: [1, 0.5, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
          </div>

          {/* Tooltip on hover */}
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-xs opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            I'm Zoho! Click to chat! 💬
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RobotAssistant;
