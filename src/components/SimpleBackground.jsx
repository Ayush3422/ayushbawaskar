import { motion } from 'framer-motion';

const SimpleBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated gradient background */}
      <div className="absolute inset-0 animated-gradient" />
      
      {/* Floating orbs */}
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl"
        style={{ top: '10%', left: '10%' }}
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-blue-500/10 blur-3xl"
        style={{ top: '50%', right: '10%' }}
        animate={{
          x: [0, -30, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-teal-500/10 blur-3xl"
        style={{ bottom: '10%', left: '40%' }}
        animate={{
          x: [0, 40, 0],
          y: [0, -40, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-20" />
      
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 via-transparent to-gray-900/80" />
    </div>
  );
};

export default SimpleBackground;
