import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Suspense, useEffect, useState, useRef } from 'react';
import MatrixRain from './MatrixRain';
import DataFlowParticles from './DataFlowParticles';
import AnimatedGridPlane from './AnimatedGridPlane';
import ScrollSyncedStars from './ScrollSyncedStars';

// Simplified scroll controller - subtle effects only
const ScrollController = () => {
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useFrame(({ scene }) => {
    // Normalize scroll (0 to 1 based on page height)
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = Math.min(scrollY / maxScroll, 1);
    
    // Very subtle scene rotation only
    if (scene.rotation) {
      scene.rotation.y = scrollProgress * Math.PI * 0.5; // Reduced from 2 to 0.5
    }
  });
  
  return null;
};

const Advanced3DBackground = ({ variant = 'neural', syncWithScroll = true }) => {
  return (
    <div 
      className="absolute inset-0" 
      style={{ 
        pointerEvents: 'none',
        zIndex: 0 // Behind content but visible
      }}
    >      <Canvas
        camera={{ position: [0, 0, 8], fov: 75 }}
        className="bg-transparent"
        gl={{ 
          antialias: true, 
          alpha: true,
          clearColor: 0x000000,
          clearAlpha: 0
        }}
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
        onCreated={(state) => {
          state.gl.setClearColor(0x000000, 0);
        }}
      >
        <Suspense fallback={null}>
          {/* Scene setup - NO background color, just transparent */}
          
          {/* Enhanced Lighting for better visibility */}
          <ambientLight intensity={1.2} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} />
          <pointLight position={[-10, -10, -5]} intensity={0.8} color="#4f46e5" />
          <pointLight position={[0, 0, 0]} intensity={1.0} color="#ffffff" />
          
          {/* 3D Elements based on variant */}
          {variant === 'neural' && (
            <>
              <MatrixRain />
            </>
          )}

          {variant === 'dataflow' && (
            <>
              <DataFlowParticles />
              <AnimatedGridPlane />
            </>
          )}

          {variant === 'grid' && (
            <>
              <AnimatedGridPlane />
              <Stars radius={50} depth={30} count={1000} factor={2} />
            </>
          )}

          {variant === 'full' && (
            <>
              <MatrixRain />
              <DataFlowParticles />
              <AnimatedGridPlane />
            </>
          )}

          {/* Scroll synchronization or auto-rotation */}
          {syncWithScroll ? (
            <ScrollController />
          ) : (
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate
              autoRotateSpeed={0.5}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 2}
            />
          )}
        </Suspense>
      </Canvas>

      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900/20 pointer-events-none" />
    </div>
  );
};

export default Advanced3DBackground;
