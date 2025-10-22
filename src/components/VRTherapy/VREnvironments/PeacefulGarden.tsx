import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const PeacefulGarden: React.FC = () => {
  const flowersRef = useRef<THREE.Group>(null);
  const leavesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (flowersRef.current) {
      flowersRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
    if (leavesRef.current) {
      leavesRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group>
      <mesh>
        <sphereGeometry args={[50, 32, 32]} />
        <meshBasicMaterial color="#87CEEB" side={THREE.BackSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#90EE90" />
      </mesh>
      <group ref={flowersRef} position={[0, 0, -3]}>
        {[...Array(8)].map((_, i) => (
          <group key={i} position={[
            Math.cos((i / 8) * Math.PI * 2) * 2,
            0.5,
            Math.sin((i / 8) * Math.PI * 2) * 2
          ]}>
            <mesh position={[0, -0.3, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 1]} />
              <meshStandardMaterial color="#228B22" />
            </mesh>
            <mesh position={[0, 0.3, 0]}>
              <sphereGeometry args={[0.3, 8, 8]} />
              <meshStandardMaterial color={['#FF69B4', '#FFB6C1', '#FFC0CB', '#FF1493'][i % 4]} />
            </mesh>
          </group>
        ))}
      </group>
      <group ref={leavesRef}>
        {[...Array(12)].map((_, i) => (
          <mesh key={i} position={[(Math.random() - 0.5) * 15, 2 + Math.random() * 2, (Math.random() - 0.5) * 15]} rotation={[Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]}>
            <boxGeometry args={[0.5, 0.1, 0.8]} />
            <meshStandardMaterial color="#32CD32" />
          </mesh>
        ))}
      </group>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />
      <pointLight position={[0, 3, 0]} intensity={0.5} color="#FFD700" />
    </group>
  );
};
