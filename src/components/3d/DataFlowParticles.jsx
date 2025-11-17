import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const DataFlowParticles = () => {
  const particlesRef = useRef();
  const particleCount = 100;

  // Create particle system
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Random starting position
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;

      // Random velocity for flowing effect
      velocities.push(new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        Math.random() * 0.03 + 0.01, // Upward flow
        (Math.random() - 0.5) * 0.02
      ));

      // Gradient colors (cyan to fuchsia)
      const t = Math.random();
      colors[i * 3] = 0.0 + t * 1.0;     // R
      colors[i * 3 + 1] = 0.8 - t * 0.3; // G
      colors[i * 3 + 2] = 1.0 - t * 0.4; // B
    }

    return { positions, velocities, colors };
  }, []);

  // Animate particles with minimal scroll sync
  useFrame(() => {
    if (!particlesRef.current) return;

    const positions = particlesRef.current.geometry.attributes.position.array;
    
    // Get scroll progress
    const scrollY = window.scrollY || 0;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = Math.min(scrollY / maxScroll, 1);
    
    // Speed multiplier based on scroll (much more subtle)
    const scrollSpeed = 1 + scrollProgress * 0.3; // Reduced from 2 to 0.3

    for (let i = 0; i < particleCount; i++) {
      // Update position based on velocity
      positions[i * 3] += particles.velocities[i].x * scrollSpeed;
      positions[i * 3 + 1] += particles.velocities[i].y * scrollSpeed;
      positions[i * 3 + 2] += particles.velocities[i].z * scrollSpeed;

      // Reset particles that go out of bounds
      if (positions[i * 3 + 1] > 8) {
        positions[i * 3 + 1] = -8;
        positions[i * 3] = (Math.random() - 0.5) * 15;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
      }

      // Wrap around X and Z
      if (Math.abs(positions[i * 3]) > 8) positions[i * 3] *= -0.9;
      if (Math.abs(positions[i * 3 + 2]) > 8) positions[i * 3 + 2] *= -0.9;
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.3}
        vertexColors
        transparent
        opacity={0.95}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default DataFlowParticles;
