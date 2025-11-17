import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const NeuralNetwork3D = () => {
  const pointsRef = useRef();
  const linesRef = useRef();

  // Generate random nodes
  const nodes = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 50; i++) {
      temp.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        ),
      });
    }
    return temp;
  }, []);

  // Create connections between nearby nodes
  const connections = useMemo(() => {
    const temp = [];
    const maxDistance = 2.5;
    
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const distance = nodes[i].position.distanceTo(nodes[j].position);
        if (distance < maxDistance) {
          temp.push({
            start: nodes[i].position,
            end: nodes[j].position,
          });
        }
      }
    }
    return temp;
  }, [nodes]);

  // Animate nodes
  useFrame(() => {
    nodes.forEach((node) => {
      // Update position
      node.position.add(node.velocity);

      // Bounce off boundaries
      if (Math.abs(node.position.x) > 5) node.velocity.x *= -1;
      if (Math.abs(node.position.y) > 5) node.velocity.y *= -1;
      if (Math.abs(node.position.z) > 5) node.velocity.z *= -1;
    });

    // Update points geometry
    if (pointsRef.current) {
      const positions = new Float32Array(nodes.length * 3);
      nodes.forEach((node, i) => {
        positions[i * 3] = node.position.x;
        positions[i * 3 + 1] = node.position.y;
        positions[i * 3 + 2] = node.position.z;
      });
      pointsRef.current.geometry.attributes.position.array = positions;
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Update lines
    if (linesRef.current) {
      const linePositions = [];
      const maxDistance = 2.5;
      
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const distance = nodes[i].position.distanceTo(nodes[j].position);
          if (distance < maxDistance) {
            linePositions.push(
              nodes[i].position.x, nodes[i].position.y, nodes[i].position.z,
              nodes[j].position.x, nodes[j].position.y, nodes[j].position.z
            );
          }
        }
      }
      
      linesRef.current.geometry.setPositions(linePositions);
      linesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Nodes */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={nodes.length}
            array={new Float32Array(nodes.flatMap(n => [n.position.x, n.position.y, n.position.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          color="#06b6d4"
          sizeAttenuation
          transparent
          opacity={0.8}
        />
      </points>

      {/* Connections */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={connections.length * 2}
            array={new Float32Array(connections.flatMap(c => [
              c.start.x, c.start.y, c.start.z,
              c.end.x, c.end.y, c.end.z
            ]))}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#06b6d4"
          transparent
          opacity={0.2}
        />
      </lineSegments>
    </group>
  );
};

export default NeuralNetwork3D;
