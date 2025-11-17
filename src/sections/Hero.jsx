import { motion } from 'framer-motion';
import { Download, Mail, ArrowRight } from 'lucide-react';
import GlassmorphismCard from '../components/GlassmorphismCard';
import AnimatedBackground2D from '../components/AnimatedBackground2D';
import ErrorBoundary from '../components/ErrorBoundary';
import { Suspense, lazy, useState, useEffect } from 'react';

// Lazy load 3D background
const Advanced3DBackground = lazy(() => import('../components/3d/Advanced3DBackground'));

const Hero = () => {
  const [use3D, setUse3D] = useState(true);
  const [webGLError, setWebGLError] = useState(false);
  
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Detect if WebGL is available
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        console.log('WebGL not available, using 2D background');
        setUse3D(false);
        setWebGLError(true);
      } else {
        console.log('WebGL available, loading 3D background');
      }
    } catch (e) {
      console.error('WebGL detection error:', e);
      setUse3D(false);
      setWebGLError(true);
    }
  }, []);

  const handleError = () => {
    console.warn('3D background error caught, switching to 2D');
    setUse3D(false);
  };

  return (
    <section id="home" className="min-h-[90vh] flex items-center justify-center relative overflow-hidden px-6">
      {/* Background with 3D/2D fallback and error boundary */}
      <ErrorBoundary 
        fallback={<AnimatedBackground2D variant="neural" />}
        onError={handleError}
      >
        {use3D ? (
          <Suspense fallback={<AnimatedBackground2D variant="neural" />}>
            <Advanced3DBackground variant="neural" />
          </Suspense>
        ) : (
          <AnimatedBackground2D variant="neural" />
        )}
      </ErrorBoundary>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl w-full relative z-10 text-center"
      >
        {/* Enhanced Glassmorphism Card with animations */}
        <GlassmorphismCard
          className="rounded-2xl p-8 md:p-12 space-y-6"
          animated={true}
          glow={true}
          glowColor="cyan"
          depth={true}
        >
          
          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-cyan-400 tracking-widest text-sm font-semibold"
          >
            AI/ML ENTHUSIAST • DEVELOPER
          </motion.p>
          
          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white"
          >
            Hi, I'm{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-fuchsia-500">
              Ayush Bawaskar
            </span>
          </motion.h1>
          
          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Minor AI&DS @IITMANDI | BTECH in CSE(AI-ML) at NEW LJIET 
            | LLM expert
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            {/* Download Resume Button */}
            <a
              href="/resume.pdf"
              download
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              <Download size={20} />
              Download Resume
            </a>
            
            {/* Contact Button */}
            <button
              onClick={scrollToContact}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-300 dark:border-white/30 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-900 dark:text-white font-semibold transition-all"
            >
              <Mail size={20} />
              Contact
            </button>
          </motion.div>
        </GlassmorphismCard>
      </motion.div>
    </section>
  );
};

export default Hero;

