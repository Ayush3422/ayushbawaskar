import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';
import NeuralNetwork3D from './NeuralNetwork3D';

const NeuralScene3D = () => {
  return (
    <div className="absolute inset-0 hidden lg:block pointer-events-none opacity-60">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={0.5} color="#06b6d4" />
          <pointLight position={[-10, -10, -10]} intensity={0.3} color="#0ea5e9" />
          
          {/* Stars background */}
          <Stars
            radius={100}
            depth={50}
            count={3000}
            factor={4}
            saturation={0}
            fade
            speed={0.5}
          />
          
          {/* Neural Network */}
          <NeuralNetwork3D />
          
          {/* Slow auto-rotation */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default NeuralScene3D;
