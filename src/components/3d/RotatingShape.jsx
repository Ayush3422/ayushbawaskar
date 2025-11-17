import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';

const RotatingShape = () => {
  const meshRef = useRef();

  // Rotate the mesh on every frame
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      {/* Icosahedron geometry */}
      <icosahedronGeometry args={[2, 1]} />
      {/* Distorted material with cyan color */}
      <MeshDistortMaterial
        color="#06b6d4"
        attach="material"
        distort={0.3}
        speed={1.5}
        roughness={0.4}
        metalness={0.8}
      />
    </mesh>
  );
};

export default RotatingShape;
