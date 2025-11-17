import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const MatrixRain = () => {
  const groupRef = useRef();

  // Generate matrix rain columns
  const rainColumns = useMemo(() => {
    const columns = [];
    const columnCount = 50;
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    for (let i = 0; i < columnCount; i++) {
      const x = (i - columnCount / 2) * 0.6;
      const drops = [];
      
      // Each column has multiple drops creating the trail
      const dropCount = 8 + Math.floor(Math.random() * 7);
      for (let j = 0; j < dropCount; j++) {
        drops.push({
          character: characters[Math.floor(Math.random() * characters.length)],
          y: Math.random() * 30 - 15,
          speed: 0.08 + Math.random() * 0.12,
          opacity: Math.random(),
          isHead: j === 0,
        });
      }
      
      columns.push({
        x,
        z: (Math.random() - 0.5) * 3,
        drops,
        speed: 0.08 + Math.random() * 0.12,
        characters,
      });
    }
    
    return columns;
  }, []);

  // Animate the falling characters
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    rainColumns.forEach((column) => {
      column.drops.forEach((drop, idx) => {
        drop.y -= column.speed;
        
        // Reset to top when it falls below screen
        if (drop.y < -15) {
          drop.y = 15;
          drop.character = column.characters[Math.floor(Math.random() * column.characters.length)];
        }
        
        // Update opacity for trail effect
        if (drop.isHead) {
          drop.opacity = 1.0;
        } else {
          drop.opacity = 0.2 + (idx / column.drops.length) * 0.5;
        }
      });
    });

    // Gentle rotation
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(time * 0.1) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {rainColumns.map((column, colIdx) => (
        <group key={`col-${colIdx}`} position={[column.x, 0, column.z]}>
          {column.drops.map((drop, dropIdx) => (
            <MatrixCharacter
              key={`char-${colIdx}-${dropIdx}`}
              character={drop.character}
              position={[0, drop.y, 0]}
              opacity={drop.opacity}
              isHead={drop.isHead}
            />
          ))}
        </group>
      ))}
      
      {/* Green ambient lighting */}
      <ambientLight intensity={0.5} color="#00ff00" />
      <pointLight position={[0, 10, 10]} intensity={1.5} color="#00ff00" distance={30} />
      <pointLight position={[0, -10, 10]} intensity={1.0} color="#00ff88" distance={25} />
    </group>
  );
};

// Individual falling character
const MatrixCharacter = ({ character, position, opacity, isHead }) => {
  const textRef = useRef();

  useFrame(() => {
    if (textRef.current) {
      // Randomly change character occasionally for glitch effect
      if (Math.random() < 0.01) {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+-=[]{}|;:,.<>?';
        textRef.current.text = chars[Math.floor(Math.random() * chars.length)];
      }
    }
  });

  return (
    <Text
      ref={textRef}
      position={position}
      fontSize={0.35}
      color={isHead ? '#ffffff' : '#00ff00'}
      anchorX="center"
      anchorY="middle"
    >
      {character}
      <meshBasicMaterial
        color={isHead ? '#ffffff' : '#00ff00'}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </Text>
  );
};

export default MatrixRain;
