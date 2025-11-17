import { useEffect, useRef } from 'react';

const AnimatedBackground = () => {
  const particlesRef = useRef(null);

  useEffect(() => {
    const container = particlesRef.current;
    if (!container) return;

    // Create particles
    const particleCount = 30;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Random size between 2px and 6px
      const size = Math.random() * 4 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Random position
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      
      // Random animation delay
      particle.style.animationDelay = `${Math.random() * 6}s`;
      particle.style.animationDuration = `${Math.random() * 4 + 4}s`;
      
      container.appendChild(particle);
      particles.push(particle);
    }

    // Cleanup
    return () => {
      particles.forEach(particle => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      });
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated gradient background */}
      <div className="absolute inset-0 animated-gradient opacity-90" />
      
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-30" />
      
      {/* Particles container */}
      <div ref={particlesRef} className="absolute inset-0" />
      
      {/* Radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-900" />
    </div>
  );
};

export default AnimatedBackground;
