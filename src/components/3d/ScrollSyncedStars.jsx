import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';

const ScrollSyncedStars = ({ ...props }) => {
  const starsRef = useRef();

  useFrame(() => {
    if (!starsRef.current) return;
    
    // Get scroll progress
    const scrollY = window.scrollY || 0;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = Math.min(scrollY / maxScroll, 1);
    
    // Very subtle rotation based on scroll (parallax effect)
    starsRef.current.rotation.y = scrollProgress * Math.PI * 0.3; // Reduced from 2 to 0.3
    starsRef.current.rotation.x = scrollProgress * Math.PI * 0.1; // Reduced from 1 to 0.1
  });

  return <Stars ref={starsRef} {...props} />;
};

export default ScrollSyncedStars;
