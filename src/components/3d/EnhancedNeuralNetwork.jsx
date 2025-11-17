import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const EnhancedNeuralNetwork = () => {
  const groupRef = useRef();
  const linesRef = useRef();

  // Generate network layers
  const network = useMemo(() => {
    const layers = [6, 10, 14, 10, 6]; // Symmetrical neural network structure
    const nodes = [];
    const spacing = 3;

    layers.forEach((count, layerIndex) => {
      const layerNodes = [];
      const xPos = (layerIndex - layers.length / 2) * spacing;

      for (let i = 0; i < count; i++) {
        const yPos = (i - count / 2) * 0.8;
        const zPos = 0; // Symmetrical - all nodes on same plane

        layerNodes.push({
          position: new THREE.Vector3(xPos, yPos, zPos),
          activation: Math.random(),
          pulseSpeed: 0.5 + Math.random() * 1.5,
          layer: layerIndex,
          index: i
        });
      }
      nodes.push(layerNodes);
    });

    // Create connections
    const connections = [];
    for (let i = 0; i < layers.length - 1; i++) {
      nodes[i].forEach((startNode, startIdx) => {
        nodes[i + 1].forEach((endNode, endIdx) => {
          // Connect to random subset of next layer
          if (Math.random() > 0.3) {
            connections.push({
              start: startNode,
              end: endNode,
              weight: Math.random(),
              active: Math.random() > 0.5
            });
          }
        });
      });
    }

    return { nodes: nodes.flat(), connections };
  }, []);

  // Animate network with subtle scroll awareness
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    // Get scroll position
    const scrollY = window.scrollY || 0;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = Math.min(scrollY / maxScroll, 1);

    // Pulse effect on activations (slightly influenced by scroll)
    network.nodes.forEach((node) => {
      node.activation = (Math.sin(time * node.pulseSpeed + scrollProgress * 0.5) + 1) / 2;
    });

    // Rotate entire network slowly (minimal scroll influence)
    if (groupRef.current) {
      groupRef.current.rotation.y = scrollProgress * 0.5 + Math.sin(time * 0.1) * 0.3;
      groupRef.current.rotation.x = Math.cos(time * 0.15) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Nodes - Bigger and Brighter */}
      {network.nodes.map((node, idx) => (
        <mesh key={idx} position={node.position}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial
            color={new THREE.Color().setHSL(0.5 + node.activation * 0.2, 1.0, 0.6 + node.activation * 0.4)}
            emissive={new THREE.Color().setHSL(0.5 + node.activation * 0.2, 1.0, 0.5 + node.activation * 0.5)}
            emissiveIntensity={node.activation * 3}
            transparent
            opacity={0.95}
            metalness={0.5}
            roughness={0.2}
          />
        </mesh>
      ))}

      {/* Connections - Brighter and more visible */}
      {network.connections.map((conn, idx) => {
        const points = [conn.start.position, conn.end.position];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        return (
          <line key={`conn-${idx}`} geometry={geometry}>
            <lineBasicMaterial
              color={conn.active ? 0x00ffff : 0x6366f1}
              transparent
              opacity={conn.active ? conn.weight * 0.8 : 0.4}
              blending={THREE.AdditiveBlending}
            />
          </line>
        );
      })}

      {/* Enhanced glow */}
      <pointLight position={[0, 0, 0]} intensity={1.5} color="#00ffff" distance={15} />
      <pointLight position={[3, 0, 0]} intensity={1.0} color="#ff00ff" distance={12} />
      <pointLight position={[-3, 0, 0]} intensity={1.0} color="#00ffff" distance={12} />
    </group>
  );
};

export default EnhancedNeuralNetwork;
