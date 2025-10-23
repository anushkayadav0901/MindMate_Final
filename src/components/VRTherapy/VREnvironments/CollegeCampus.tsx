import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const CollegeCampus: React.FC = () => {
  const studentsRef = useRef<THREE.Group>(null);
  const flagRef = useRef<THREE.Mesh>(null);
  const fountainRef = useRef<THREE.Group>(null);
  const revolvingDoorRef = useRef<THREE.Group>(null);
  const treesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Students walking animation
    if (studentsRef.current) {
      studentsRef.current.children.forEach((child, index) => {
        // Walking cycle
        child.position.x += Math.sin(time * 0.5 + index) * 0.01;
        child.position.z += Math.cos(time * 0.3 + index) * 0.01;
        
        // Idle animations
        child.children[1].rotation.x = Math.sin(time * 0.2 + index) * 0.05;
        child.children[2].position.y = 0.8 + Math.sin(time * 0.3 + index) * 0.02;
      });
    }

    // Flag waving
    if (flagRef.current) {
      flagRef.current.rotation.y = Math.sin(time * 0.5) * 0.1;
      flagRef.current.position.y = 8 + Math.sin(time * 0.3) * 0.1;
    }

    // Fountain water animation
    if (fountainRef.current) {
      fountainRef.current.children.forEach((child, index) => {
        if (index > 0) { // Skip the base
          child.position.y = 0.5 + Math.sin(time * 2 + index) * 0.3;
          child.scale.y = 1 + Math.sin(time * 3 + index) * 0.2;
        }
      });
    }

    // Revolving door rotation
    if (revolvingDoorRef.current) {
      revolvingDoorRef.current.rotation.y = time * 0.2;
    }

    // Trees swaying
    if (treesRef.current) {
      treesRef.current.children.forEach((child, index) => {
        child.rotation.z = Math.sin(time * 0.2 + index) * 0.05;
      });
    }
  });

  return (
    <group>
      {/* Sky */}
      <mesh>
        <sphereGeometry args={[50, 32, 32]} />
        <meshBasicMaterial color="#87CEEB" side={THREE.BackSide} />
      </mesh>

      {/* Ground - Grass */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#90EE90" />
      </mesh>

      {/* Brick Pathways */}
      {[...Array(8)].map((_, i) => (
        <mesh key={i} position={[i * 5 - 17.5, -0.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1, 40]} />
          <meshStandardMaterial color="#CD853F" />
        </mesh>
      ))}
      {[...Array(8)].map((_, i) => (
        <mesh key={i} position={[0, -0.4, i * 5 - 17.5]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[40, 1]} />
          <meshStandardMaterial color="#CD853F" />
        </mesh>
      ))}

      {/* Main Academic Building */}
      <group position={[0, 0, -12]}>
        {/* Building Base */}
        <mesh position={[0, 3, 0]}>
          <boxGeometry args={[12, 6, 8]} />
          <meshStandardMaterial color="#CD853F" />
        </mesh>
        {/* Windows */}
        {[...Array(3)].map((_, floor) =>
          [...Array(6)].map((_, window) => (
            <mesh key={`${floor}-${window}`} position={[
              -4 + window * 1.6,
              1 + floor * 2,
              4.1
            ]}>
              <boxGeometry args={[1, 1.5, 0.1]} />
              <meshStandardMaterial color="#4169E1" transparent opacity={0.7} />
            </mesh>
          ))
        )}
        {/* Entrance */}
        <mesh position={[0, 1, 4.1]}>
          <boxGeometry args={[3, 2, 0.1]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        {/* Steps */}
        {[...Array(5)].map((_, i) => (
          <mesh key={i} position={[0, -0.5 - i * 0.1, 4.5 + i * 0.1]}>
            <boxGeometry args={[4, 0.2, 0.2]} />
            <meshStandardMaterial color="#708090" />
          </mesh>
        ))}
        {/* Roof */}
        <mesh position={[0, 6.5, 0]}>
          <coneGeometry args={[8, 2, 4]} />
          <meshStandardMaterial color="#8B0000" />
        </mesh>
        {/* College Name Board */}
        <mesh position={[0, 5, 4.2]}>
          <boxGeometry args={[6, 1, 0.1]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
      </group>

      {/* Library Building */}
      <group position={[-8, 0, 8]}>
        {/* Library Base */}
        <mesh position={[0, 2.5, 0]}>
          <boxGeometry args={[8, 5, 6]} />
          <meshStandardMaterial color="#CD853F" />
        </mesh>
        {/* Glass Windows */}
        {[...Array(2)].map((_, floor) =>
          [...Array(4)].map((_, window) => (
            <mesh key={`${floor}-${window}`} position={[
              -3 + window * 2,
              0.5 + floor * 2.5,
              3.1
            ]}>
              <boxGeometry args={[1.5, 2, 0.1]} />
              <meshStandardMaterial color="#87CEEB" transparent opacity={0.6} />
            </mesh>
          ))
        )}
        {/* Clock Tower */}
        <mesh position={[0, 5, 0]}>
          <cylinderGeometry args={[1, 1, 4]} />
          <meshStandardMaterial color="#CD853F" />
        </mesh>
        {/* Clock Face */}
        <mesh position={[0, 7, 1.1]}>
          <cylinderGeometry args={[0.8, 0.8, 0.1]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        {/* Clock Hands */}
        <mesh position={[0, 7, 1.15]}>
          <boxGeometry args={[0.02, 0.4, 0.02]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[0, 7, 1.15]}>
          <boxGeometry args={[0.02, 0.6, 0.02]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        {/* Revolving Door */}
        <group ref={revolvingDoorRef} position={[0, 1, 3.1]}>
          {[...Array(4)].map((_, i) => (
            <mesh key={i} position={[
              Math.cos((i / 4) * Math.PI * 2) * 0.5,
              0,
              Math.sin((i / 4) * Math.PI * 2) * 0.5
            ]}>
              <boxGeometry args={[0.1, 2, 0.8]} />
              <meshStandardMaterial color="#87CEEB" transparent opacity={0.7} />
            </mesh>
          ))}
        </group>
      </group>

      {/* Student Figures */}
      <group ref={studentsRef}>
        {[...Array(12)].map((_, i) => (
          <group key={i} position={[
            (Math.random() - 0.5) * 30,
            0.8,
            (Math.random() - 0.5) * 30
          ]}>
            {/* Body */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.2, 0.2, 1]} />
              <meshStandardMaterial color={["#FF69B4", "#87CEEB", "#98FB98", "#FFB6C1", "#FFD700", "#FF6347"][i % 6]} />
            </mesh>
            {/* Head */}
            <mesh position={[0, 0.7, 0]}>
              <sphereGeometry args={[0.2]} />
              <meshStandardMaterial color="#FDBCB4" />
            </mesh>
            {/* Arms */}
            <mesh position={[-0.3, 0.2, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.6]} />
              <meshStandardMaterial color="#FDBCB4" />
            </mesh>
            <mesh position={[0.3, 0.2, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.6]} />
              <meshStandardMaterial color="#FDBCB4" />
            </mesh>
            {/* Legs */}
            <mesh position={[-0.1, -0.6, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 0.8]} />
              <meshStandardMaterial color="#4169E1" />
            </mesh>
            <mesh position={[0.1, -0.6, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 0.8]} />
              <meshStandardMaterial color="#4169E1" />
            </mesh>
            {/* Backpack */}
            <mesh position={[0, 0.3, -0.2]}>
              <boxGeometry args={[0.3, 0.4, 0.2]} />
              <meshStandardMaterial color="#8B4513" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Outdoor Benches */}
      {[...Array(8)].map((_, i) => (
        <group key={i} position={[
          Math.cos((i / 8) * Math.PI * 2) * 15,
          0,
          Math.sin((i / 8) * Math.PI * 2) * 15
        ]}>
          {/* Bench Frame */}
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[2, 0.1, 0.4]} />
            <meshStandardMaterial color="#708090" />
          </mesh>
          {/* Bench Back */}
          <mesh position={[0, 0.6, -0.1]}>
            <boxGeometry args={[2, 0.6, 0.1]} />
            <meshStandardMaterial color="#708090" />
          </mesh>
          {/* Bench Legs */}
          {[...Array(4)].map((_, j) => (
            <mesh key={j} position={[
              j < 2 ? -0.8 : 0.8,
              0.15,
              j % 2 === 0 ? -0.15 : 0.15
            ]}>
              <cylinderGeometry args={[0.05, 0.05, 0.3]} />
              <meshStandardMaterial color="#708090" />
            </mesh>
          ))}
        </group>
      ))}

      {/* Basketball Court */}
      <group position={[12, 0, 12]}>
        {/* Court */}
        <mesh position={[0, -0.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[8, 6]} />
          <meshStandardMaterial color="#FF8C00" />
        </mesh>
        {/* Court Lines */}
        <mesh position={[0, -0.39, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[8, 0.1]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[0, -0.39, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
          <planeGeometry args={[6, 0.1]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        {/* Hoop */}
        <mesh position={[0, 2, 3]}>
          <torusGeometry args={[0.4, 0.05, 8, 16]} />
          <meshStandardMaterial color="#FF0000" />
        </mesh>
        {/* Hoop Post */}
        <mesh position={[0, 1, 3]}>
          <cylinderGeometry args={[0.05, 0.05, 2]} />
          <meshStandardMaterial color="#708090" />
        </mesh>
        {/* Basketball */}
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.2]} />
          <meshStandardMaterial color="#FF8C00" />
        </mesh>
      </group>

      {/* Running Track */}
      <group position={[0, -0.3, 0]}>
        {[...Array(32)].map((_, i) => (
          <mesh key={i} position={[
            Math.cos((i / 32) * Math.PI * 2) * 18,
            0,
            Math.sin((i / 32) * Math.PI * 2) * 18
          ]} rotation={[0, (i / 32) * Math.PI * 2, 0]}>
            <boxGeometry args={[0.5, 0.1, 0.2]} />
            <meshStandardMaterial color="#FF0000" />
          </mesh>
        ))}
      </group>

      {/* Notice Boards */}
      {[...Array(4)].map((_, i) => (
        <group key={i} position={[
          Math.cos((i / 4) * Math.PI * 2) * 12,
          0,
          Math.sin((i / 4) * Math.PI * 2) * 12
        ]}>
          {/* Board Frame */}
          <mesh position={[0, 1.5, 0]}>
            <boxGeometry args={[0.1, 2, 1.5]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          {/* Board */}
          <mesh position={[0.05, 1.5, 0]}>
            <boxGeometry args={[0.02, 1.8, 1.3]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
          {/* Papers */}
          {[...Array(3)].map((_, j) => (
            <mesh key={j} position={[
              (Math.random() - 0.5) * 0.8,
              1.5 + (Math.random() - 0.5) * 0.8,
              0.05
            ]}>
              <boxGeometry args={[0.2, 0.3, 0.01]} />
              <meshStandardMaterial color="#FFFFFF" />
            </mesh>
          ))}
        </group>
      ))}

      {/* Bike Stands */}
      {[...Array(3)].map((_, i) => (
        <group key={i} position={[-15 + i * 15, 0, -15]}>
          {/* Bike Rack */}
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 1]} />
            <meshStandardMaterial color="#708090" />
          </mesh>
          <mesh position={[0, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.05, 0.05, 2]} />
            <meshStandardMaterial color="#708090" />
          </mesh>
          {/* Bikes */}
          {[...Array(6)].map((_, j) => (
            <group key={j} position={[(j % 2 - 0.5) * 0.8, 0, (Math.floor(j / 2) - 1) * 0.5]}>
              {/* Bike Frame */}
              <mesh position={[0, 0.3, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 0.6]} />
                <meshStandardMaterial color="#708090" />
              </mesh>
              {/* Wheels */}
              <mesh position={[-0.2, 0.1, 0]}>
                <torusGeometry args={[0.15, 0.02, 8, 16]} />
                <meshStandardMaterial color="#000000" />
              </mesh>
              <mesh position={[0.2, 0.1, 0]}>
                <torusGeometry args={[0.15, 0.02, 8, 16]} />
                <meshStandardMaterial color="#000000" />
              </mesh>
            </group>
          ))}
        </group>
      ))}

      {/* Flag Pole */}
      <group position={[0, 0, 0]}>
        {/* Pole */}
        <mesh position={[0, 4, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 8]} />
          <meshStandardMaterial color="#708090" />
        </mesh>
        {/* Flag */}
        <mesh ref={flagRef} position={[0, 8, 0]}>
          <planeGeometry args={[1.5, 1]} />
          <meshStandardMaterial color="#FF6B6B" />
        </mesh>
      </group>

      {/* Fountain */}
      <group ref={fountainRef} position={[0, 0, 0]}>
        {/* Fountain Base */}
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[2, 0.3, 8, 16]} />
          <meshStandardMaterial color="#708090" />
        </mesh>
        {/* Water Jets */}
        {[...Array(6)].map((_, i) => (
          <mesh key={i} position={[
            Math.cos((i / 6) * Math.PI * 2) * 1.5,
            0.5,
            Math.sin((i / 6) * Math.PI * 2) * 1.5
          ]}>
            <cylinderGeometry args={[0.05, 0.05, 1]} />
            <meshStandardMaterial color="#87CEEB" transparent opacity={0.7} />
          </mesh>
        ))}
      </group>

      {/* Trees */}
      <group ref={treesRef}>
        {[...Array(15)].map((_, i) => (
          <group key={i} position={[
            Math.cos((i / 15) * Math.PI * 2) * 20,
            0,
            Math.sin((i / 15) * Math.PI * 2) * 20
          ]}>
            {/* Tree Trunk */}
            <mesh position={[0, 2, 0]}>
              <cylinderGeometry args={[0.3, 0.4, 4]} />
              <meshStandardMaterial color="#8B4513" />
            </mesh>
            {/* Tree Crown */}
            <mesh position={[0, 4.5, 0]}>
              <sphereGeometry args={[1.5, 16, 16]} />
              <meshStandardMaterial color="#228B22" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Street Lamps */}
      {[...Array(8)].map((_, i) => (
        <group key={i} position={[
          Math.cos((i / 8) * Math.PI * 2) * 18,
          0,
          Math.sin((i / 8) * Math.PI * 2) * 18
        ]}>
          {/* Lamp Post */}
          <mesh position={[0, 2, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 4]} />
            <meshStandardMaterial color="#708090" />
          </mesh>
          {/* Lamp */}
          <mesh position={[0, 4, 0]}>
            <sphereGeometry args={[0.3]} />
            <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.3} />
          </mesh>
          <pointLight position={[0, 4, 0]} intensity={0.5} color="#FFD700" />
        </group>
      ))}

      {/* Lighting Setup */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 10]} intensity={1} castShadow />
      <pointLight position={[0, 5, -5]} intensity={0.3} color="#87CEEB" />
    </group>
  );
};