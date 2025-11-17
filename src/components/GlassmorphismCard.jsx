import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

/**
 * Enhanced Glassmorphism Card with animated gradients and depth effects
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to render inside the card
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.animated - Enable gradient animation
 * @param {boolean} props.glow - Enable glow effect
 * @param {string} props.glowColor - Glow color (cyan, fuchsia, purple, etc.)
 * @param {boolean} props.depth - Enable 3D depth effect
 * @param {Object} props.hoverEffect - Hover animation config
 */
const GlassmorphismCard = ({
  children,
  className = '',
  animated = true,
  glow = false,
  glowColor = 'cyan',
  depth = true,
  hoverEffect = true,
  ...props
}) => {
  const cardRef = useRef(null);

  useEffect(() => {
    if (!depth || !cardRef.current) return;

    const card = cardRef.current;

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    };

    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [depth]);

  const glowColors = {
    cyan: 'shadow-cyan-500/50',
    fuchsia: 'shadow-fuchsia-500/50',
    purple: 'shadow-purple-500/50',
    blue: 'shadow-blue-500/50',
    green: 'shadow-green-500/50',
    orange: 'shadow-orange-500/50',
  };

  const hoverEffectConfig = hoverEffect ? {
    scale: 1.02,
    y: -5,
    transition: { duration: 0.3 }
  } : {};

  return (
    <motion.div
      ref={cardRef}
      whileHover={hoverEffectConfig}
      className={`
        relative overflow-hidden
        bg-white/10 dark:bg-white/5
        backdrop-blur-xl
        border border-white/20 dark:border-white/10
        hover:border-white/40 dark:hover:border-white/20
        transition-all duration-300
        ${glow ? `shadow-2xl ${glowColors[glowColor] || glowColors.cyan}` : 'shadow-lg'}
        ${className}
      `}
      style={{
        transformStyle: 'preserve-3d',
        transition: 'transform 0.1s ease-out, box-shadow 0.3s ease',
      }}
      {...props}
    >
      {/* Animated gradient overlay */}
      {animated && (
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-fuchsia-500/10 to-purple-500/10 animate-gradient-shift" />
        </div>
      )}

      {/* Shimmer effect */}
      {animated && (
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-700">
          <div className="absolute -inset-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
        </div>
      )}

      {/* Glow orb effect */}
      {glow && (
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-cyan-500/30 to-fuchsia-500/30 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Subtle noise texture for realism */}
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
        }}
      />
    </motion.div>
  );
};

export default GlassmorphismCard;
