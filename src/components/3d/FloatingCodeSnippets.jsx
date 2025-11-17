import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const FloatingCodeSnippets = () => {
  const groupRef = useRef();

  // Code snippets with syntax highlighting colors
  const codeSnippets = useMemo(() => {
    const snippets = [
      { code: 'import React from "react"', color: '#00ff00', category: 'import' },
      { code: 'const [state, setState]', color: '#00ff41', category: 'hook' },
      { code: 'function Component() {', color: '#00ff88', category: 'function' },
      { code: 'return <div>', color: '#39ff14', category: 'jsx' },
      { code: 'useEffect(() => {', color: '#00ff66', category: 'hook' },
      { code: 'async await fetch()', color: '#00ffaa', category: 'async' },
      { code: 'map((item) => item)', color: '#00ff22', category: 'array' },
      { code: 'if (condition) {', color: '#44ff44', category: 'control' },
      { code: 'model.predict(data)', color: '#00ff77', category: 'ml' },
      { code: 'np.array([1, 2, 3])', color: '#22ff22', category: 'python' },
      { code: 'def train_model():', color: '#00ff55', category: 'python' },
      { code: 'torch.nn.Linear()', color: '#00ff99', category: 'ml' },
      { code: 'SELECT * FROM users', color: '#33ff33', category: 'sql' },
      { code: 'git commit -m "fix"', color: '#00ffcc', category: 'git' },
      { code: 'npm install package', color: '#00ff33', category: 'npm' },
      { code: 'const api = axios()', color: '#00ffbb', category: 'api' },
      { code: 'import pandas as pd', color: '#11ff11', category: 'python' },
      { code: 'class NeuralNet:', color: '#00ff44', category: 'ml' },
      { code: 'export default App', color: '#00ff00', category: 'export' },
      { code: '{ ...props }', color: '#55ff55', category: 'spread' },
    ];

    return snippets.map((snippet, i) => ({
      ...snippet,
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10
      ),
      rotation: new THREE.Euler(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      ),
      speed: 0.2 + Math.random() * 0.3,
      phase: Math.random() * Math.PI * 2,
      scale: 0.3 + Math.random() * 0.2,
    }));
  }, []);

  // Animate code snippets
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    if (groupRef.current) {
      // Subtle group rotation
      groupRef.current.rotation.y = Math.sin(time * 0.1) * 0.2;
      groupRef.current.rotation.x = Math.cos(time * 0.15) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {codeSnippets.map((snippet, idx) => (
        <FloatingText
          key={idx}
          text={snippet.code}
          position={snippet.position}
          rotation={snippet.rotation}
          color={snippet.color}
          speed={snippet.speed}
          phase={snippet.phase}
          scale={snippet.scale}
        />
      ))}
      
      {/* Ambient lighting */}
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#00ff00" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00ff88" />
    </group>
  );
};

// Individual floating text component
const FloatingText = ({ text, position, rotation, color, speed, phase, scale }) => {
  const textRef = useRef();

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    if (textRef.current) {
      // Float up and down
      textRef.current.position.y = position.y + Math.sin(time * speed + phase) * 1.5;
      
      // Gentle rotation
      textRef.current.rotation.y = rotation.y + time * 0.1;
      textRef.current.rotation.x = rotation.x + Math.sin(time * 0.2 + phase) * 0.1;
      
      // Pulse opacity
      textRef.current.material.opacity = 0.6 + Math.sin(time * 0.5 + phase) * 0.3;
    }
  });

  return (
    <Text
      ref={textRef}
      position={[position.x, position.y, position.z]}
      rotation={[rotation.x, rotation.y, rotation.z]}
      fontSize={scale}
      color={color}
      anchorX="center"
      anchorY="middle"
      font="/fonts/JetBrainsMono-Regular.woff"
      material-toneMapped={false}
    >
      {text}
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.8}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </Text>
  );
};

export default FloatingCodeSnippets;
