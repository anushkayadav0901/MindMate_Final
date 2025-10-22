import React from 'react';
import * as THREE from 'three';

export const ExamHall: React.FC = () => {
  return (
    <group>
      <mesh position={[0, 4, 0]}>
        <boxGeometry args={[20, 0.2, 20]} />
        <meshStandardMaterial color="#F5F5F5" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#E8E8E8" />
      </mesh>
      {[
        { pos: [0, 2, -10], rot: [0, 0, 0], size: [20, 4, 0.2] },
        { pos: [0, 2, 10], rot: [0, 0, 0], size: [20, 4, 0.2] },
        { pos: [-10, 2, 0], rot: [0, Math.PI / 2, 0], size: [20, 4, 0.2] },
        { pos: [10, 2, 0], rot: [0, Math.PI / 2, 0], size: [20, 4, 0.2] }
      ].map((wall, i) => (
        <mesh key={i} position={wall.pos as [number, number, number]} rotation={wall.rot as [number, number, number]}>
          <boxGeometry args={wall.size as [number, number, number]} />
          <meshStandardMaterial color="#FFFACD" />
        </mesh>
      ))}
      {[...Array(12)].map((_, i) => {
        const row = Math.floor(i / 4);
        const col = i % 4;
        return (
          <group key={i} position={[(col - 1.5) * 3, 0, (row - 1.5) * 3]}>
            <mesh position={[0, 0.4, 0]}>
              <boxGeometry args={[1.2, 0.1, 0.8]} />
              <meshStandardMaterial color="#8B4513" />
            </mesh>
            <mesh position={[0, 0.2, 0.5]}>
              <boxGeometry args={[0.6, 0.4, 0.6]} />
              <meshStandardMaterial color="#A0522D" />
            </mesh>
            <mesh position={[0, 0.46, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.8, 0.6]} />
              <meshStandardMaterial color="#FFFFFF" />
            </mesh>
          </group>
        );
      })}
      <mesh position={[0, 2, -9.8]} rotation={[0, 0, 0]}>
        <boxGeometry args={[8, 3, 0.1]} />
        <meshStandardMaterial color="#2F4F4F" />
      </mesh>
      <mesh position={[0, 3.5, -9.7]}>
        <cylinderGeometry args={[0.4, 0.4, 0.1, 32]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      <ambientLight intensity={0.9} />
      <directionalLight position={[0, 10, 0]} intensity={1.2} />
      <pointLight position={[0, 3.5, -8]} intensity={0.3} color="#FFFF00" />
    </group>
  );
};
