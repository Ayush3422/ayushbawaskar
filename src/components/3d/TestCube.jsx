import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

const TestCube = () => {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta;
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  console.log('🎲 TestCube rendering...');

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial 
        color="#00ffff" 
        emissive="#00ffff"
        emissiveIntensity={2}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
};

export default TestCube;
