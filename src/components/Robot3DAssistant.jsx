import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useGLTF, useAnimations } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

// Simple 3D Robot built with Three.js primitives (no external model needed)
const SimpleRobot3D = () => {
  const robotRef = useRef();
  const armRef = useRef();

  useFrame((state) => {
    // Gentle floating animation
    if (robotRef.current) {
      robotRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      robotRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
    
    // Waving arm animation
    if (armRef.current) {
      armRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 3) * 0.5 - 0.3;
    }
  });

  return (
    <group ref={robotRef}>
      {/* Robot Body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1.2, 0.8]} />
        <meshStandardMaterial color="#4a5568" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Chest Panel */}
      <mesh position={[0, 0.1, 0.41]}>
        <boxGeometry args={[0.6, 0.5, 0.05]} />
        <meshStandardMaterial color="#2d3748" emissive="#06b6d4" emissiveIntensity={0.3} />
      </mesh>

      {/* LED Indicators */}
      <mesh position={[-0.15, 0.2, 0.42]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={2} />
      </mesh>
      <mesh position={[0.15, 0.2, 0.42]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={2} />
      </mesh>

      {/* Head */}
      <group position={[0, 0.9, 0]}>
        <mesh>
          <boxGeometry args={[0.8, 0.7, 0.7]} />
          <meshStandardMaterial color="#718096" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Eyes */}
        <mesh position={[-0.2, 0.1, 0.36]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={3} />
        </mesh>
        <mesh position={[0.2, 0.1, 0.36]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={3} />
        </mesh>

        {/* Antenna */}
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.3, 8]} />
          <meshStandardMaterial color="#2d3748" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.65, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2} />
        </mesh>
      </group>

      {/* Right Arm (Waving) */}
      <group ref={armRef} position={[0.65, 0.3, 0]}>
        <mesh position={[0, -0.25, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.5, 8]} />
          <meshStandardMaterial color="#4a5568" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.55, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#718096" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* Left Arm */}
      <group position={[-0.65, 0.3, 0]}>
        <mesh position={[0, -0.25, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.5, 8]} />
          <meshStandardMaterial color="#4a5568" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.55, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#718096" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* Legs */}
      <mesh position={[-0.25, -0.9, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.6, 8]} />
        <meshStandardMaterial color="#4a5568" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.25, -0.9, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.6, 8]} />
        <meshStandardMaterial color="#4a5568" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Feet */}
      <mesh position={[-0.25, -1.25, 0.1]}>
        <boxGeometry args={[0.2, 0.1, 0.35]} />
        <meshStandardMaterial color="#2d3748" metalness={0.8} />
      </mesh>
      <mesh position={[0.25, -1.25, 0.1]}>
        <boxGeometry args={[0.2, 0.1, 0.35]} />
        <meshStandardMaterial color="#2d3748" metalness={0.8} />
      </mesh>
    </group>
  );
};

// Optional: Advanced Robot using external GLTF model
const AdvancedRobot3D = ({ modelPath = '/models/robot-model.glb' }) => {
  const { scene, animations } = useGLTF(modelPath);
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    // Play wave animation if available
    if (actions.wave) {
      actions.wave.play();
    } else if (actions.idle) {
      actions.idle.play();
    }
  }, [actions]);

  return <primitive object={scene} scale={0.5} />;
};

// Main 3D Robot Assistant Component
const Robot3DAssistant = ({ useAdvancedModel = false, modelPath }) => {
  const [showRobot, setShowRobot] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const robotTimer = setTimeout(() => setShowRobot(true), 2000);
    const messageTimer = setTimeout(() => setShowMessage(true), 3000);
    const hideMessageTimer = setTimeout(() => setShowMessage(false), 8000);

    return () => {
      clearTimeout(robotTimer);
      clearTimeout(messageTimer);
      clearTimeout(hideMessageTimer);
    };
  }, []);

  const handleRobotClick = () => {
    setShowMessage(!showMessage);
  };

  return (
    <>
      {showRobot && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="fixed bottom-6 right-6 z-50 cursor-pointer"
          onClick={handleRobotClick}
        >
          {/* 3D Canvas Container */}
          <div className="relative w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 backdrop-blur-xl rounded-full p-3 border border-white/20 shadow-2xl hover:scale-110 transition-transform duration-300">
            <Canvas
              camera={{ position: [0, 0, 5], fov: 45 }}
              style={{ width: '100%', height: '100%' }}
            >
              {/* Lighting */}
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              <pointLight position={[-10, -10, -10]} intensity={0.5} color="#06b6d4" />
              <spotLight
                position={[0, 5, 0]}
                angle={0.3}
                penumbra={1}
                intensity={1}
                castShadow
                color="#a78bfa"
              />

              {/* Robot Model */}
              {useAdvancedModel && modelPath ? (
                <AdvancedRobot3D modelPath={modelPath} />
              ) : (
                <SimpleRobot3D />
              )}

              {/* Optional: Enable rotation control */}
              {/* <OrbitControls enableZoom={false} enablePan={false} /> */}
            </Canvas>

            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur-xl opacity-30 -z-10 animate-pulse"></div>
          </div>

          {/* Speech Bubble */}
          {showMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="absolute bottom-36 right-0 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-medium whitespace-nowrap border border-white/20"
            >
              <div className="flex items-center gap-2">
                <span className="animate-wave inline-block">👋</span>
                <span>Hey! I'm your 3D AI Assistant!</span>
              </div>
              <div className="absolute -bottom-2 right-6 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-blue-600"></div>
            </motion.div>
          )}

          {/* Tooltip */}
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-xs opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Click me! 🤖
          </div>
        </motion.div>
      )}
    </>
  );
};

// Preload GLTF model (optional, for advanced version)
// useGLTF.preload('/models/robot-model.glb');

export default Robot3DAssistant;
