import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const AnimatedGridPlane = () => {
  const gridRef = useRef();
  const materialRef = useRef();

  useFrame(({ clock }) => {
    if (materialRef.current) {
      // Get scroll progress
      const scrollY = window.scrollY || 0;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = Math.min(scrollY / maxScroll, 1);
      
      // Animate grid with subtle scroll influence
      materialRef.current.uniforms.time.value = clock.getElapsedTime() + scrollProgress * 2; // Reduced from 10 to 2
    }
  });

  // Custom shader for animated grid
  const vertexShader = `
    uniform float time;
    varying vec2 vUv;
    varying float vElevation;
    
    void main() {
      vUv = uv;
      
      // Wave effect
      vec3 pos = position;
      float wave = sin(pos.x * 2.0 + time) * cos(pos.y * 2.0 + time) * 0.3;
      pos.z += wave;
      vElevation = wave;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float time;
    varying vec2 vUv;
    varying float vElevation;
    
    void main() {
      // Gradient colors based on elevation
      vec3 color1 = vec3(0.0, 0.8, 1.0); // Cyan
      vec3 color2 = vec3(1.0, 0.0, 0.8); // Fuchsia
      
      float mixValue = (vElevation + 0.3) / 0.6;
      vec3 color = mix(color1, color2, mixValue);
      
      // Grid lines
      float grid = step(0.98, fract(vUv.x * 20.0)) + step(0.98, fract(vUv.y * 20.0));
      
      // Fade edges
      float alpha = (1.0 - length(vUv - 0.5) * 1.5) * 0.3;
      alpha *= (grid * 0.5 + 0.3);
      
      gl_FragColor = vec4(color, alpha);
    }
  `;

  const uniforms = {
    time: { value: 0 }
  };

  return (
    <mesh ref={gridRef} rotation={[-Math.PI / 3, 0, 0]} position={[0, -5, 0]}>
      <planeGeometry args={[20, 20, 40, 40]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

export default AnimatedGridPlane;
