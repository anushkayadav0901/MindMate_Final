import React from 'react';
import * as THREE from 'three';

export const CollegeCampus: React.FC = () => {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[50, 32, 32]} />
        <meshBasicMaterial color="#4A90E2" side={THREE.BackSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#D3D3D3" />
      </mesh>
      {[...Array(4)].map((_, i) => (
        <mesh key={i} position={[(i % 2) * 10 - 5, 2, Math.floor(i / 2) * -10 - 5]}>
          <boxGeometry args={[4, 4, 4]} />
          <meshStandardMaterial color="#CD853F" />
        </mesh>
      ))}
      <group position={[0, 0, -8]}>
        <mesh position={[-3, 1.5, 0]}>
          <boxGeometry args={[0.3, 3, 12]} />
          <meshStandardMaterial color="#F5DEB3" />
        </mesh>
        <mesh position={[3, 1.5, 0]}>
          <boxGeometry args={[0.3, 3, 12]} />
          <meshStandardMaterial color="#F5DEB3" />
        </mesh>
        <mesh position={[0, 3, 0]}>
          <boxGeometry args={[6, 0.2, 12]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
      </group>
      {[...Array(5)].map((_, i) => (
        <group key={i} position={[(Math.random() - 0.5) * 10, 0.5, -5 - Math.random() * 10]}>
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 1.5]} />
            <meshStandardMaterial color={['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'][i % 4]} />
          </mesh>
          <mesh position={[0, 1.5, 0]}>
            <sphereGeometry args={[0.3]} />
            <meshStandardMaterial color="#FFDAB9" />
          </mesh>
        </group>
      ))}
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
      <spotLight position={[0, 5, -5]} angle={0.6} penumbra={1} intensity={0.5} />
    </group>
  );
};
