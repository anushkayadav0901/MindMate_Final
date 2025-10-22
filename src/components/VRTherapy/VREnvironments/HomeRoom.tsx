import React from 'react';
import * as THREE from 'three';

export const HomeRoom: React.FC = () => {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[50, 32, 32]} />
        <meshBasicMaterial color="#FFA07A" side={THREE.BackSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      {[
        { pos: [0, 2, -6], size: [12, 4, 0.2] },
        { pos: [-6, 2, 0], size: [0.2, 4, 12] },
        { pos: [6, 2, 0], size: [0.2, 4, 12] }
      ].map((wall, i) => (
        <mesh key={i} position={wall.pos as [number, number, number]}>
          <boxGeometry args={wall.size as [number, number, number]} />
          <meshStandardMaterial color="#F5E6D3" />
        </mesh>
      ))}
      <group position={[-3, 0.5, -4]}>
        <mesh>
          <boxGeometry args={[2, 0.5, 3]} />
          <meshStandardMaterial color="#4169E1" />
        </mesh>
        <mesh position={[0, 0.4, -1]}>
          <boxGeometry args={[1, 0.3, 0.6]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
      </group>
      <group position={[3, 0, -4]}>
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[1.5, 0.1, 1]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[0, 0.3, 0.8]}>
          <cylinderGeometry args={[0.3, 0.3, 0.6]} />
          <meshStandardMaterial color="#A52A2A" />
        </mesh>
      </group>
      <group position={[-5.7, 1, 0]}>
        {[...Array(4)].map((_, i) => (
          <mesh key={i} position={[0, i * 0.6, 0]}>
            <boxGeometry args={[0.4, 0.5, 2]} />
            <meshStandardMaterial color="#654321" />
          </mesh>
        ))}
      </group>
      <mesh position={[0, 2, -5.9]}>
        <boxGeometry args={[2, 2, 0.1]} />
        <meshStandardMaterial color="#FFE4B5" emissive="#FFA500" emissiveIntensity={0.5} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.45, 0]}>
        <circleGeometry args={[2, 32]} />
        <meshStandardMaterial color="#DC143C" />
      </mesh>
      <ambientLight intensity={0.5} color="#FFE4B5" />
      <pointLight position={[0, 3, 0]} intensity={0.6} color="#FFA500" />
      <directionalLight position={[5, 5, 5]} intensity={0.3} />
    </group>
  );
};
