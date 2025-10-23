import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const PeacefulGarden: React.FC = () => {
  const cherryBlossomsRef = useRef<THREE.Group>(null);
  const butterfliesRef = useRef<THREE.Group>(null);
  const fishRef = useRef<THREE.Group>(null);
  const bambooRef = useRef<THREE.Group>(null);
  const petalsRef = useRef<THREE.Group>(null);
  const waterRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Cherry blossoms gentle swaying
    if (cherryBlossomsRef.current) {
      cherryBlossomsRef.current.children.forEach((child, index) => {
        child.rotation.z = Math.sin(time * 0.3 + index) * 0.1;
        child.position.y = Math.sin(time * 0.2 + index) * 0.05;
      });
    }

    // Butterflies floating in figure-8 pattern
    if (butterfliesRef.current) {
      butterfliesRef.current.children.forEach((child, index) => {
        const offset = index * 2;
        child.position.x = Math.sin(time * 0.5 + offset) * 3;
        child.position.z = Math.sin(time * 0.3 + offset) * 2;
        child.position.y = 2 + Math.sin(time * 0.4 + offset) * 0.5;
        child.rotation.y = time * 0.5 + offset;
      });
    }

    // Fish swimming in circular paths
    if (fishRef.current) {
      fishRef.current.children.forEach((child, index) => {
        const radius = 2 + index * 0.3;
        const speed = 0.3 + index * 0.1;
        child.position.x = Math.cos(time * speed + index) * radius;
        child.position.z = Math.sin(time * speed + index) * radius;
        child.rotation.y = time * speed + index + Math.PI / 2;
      });
    }

    // Bamboo gentle swaying
    if (bambooRef.current) {
      bambooRef.current.children.forEach((child, index) => {
        child.rotation.z = Math.sin(time * 0.2 + index) * 0.05;
      });
    }

    // Falling petals
    if (petalsRef.current) {
      petalsRef.current.children.forEach((child, index) => {
        child.position.y -= 0.01;
        child.rotation.z += 0.02;
        if (child.position.y < -1) {
          child.position.y = 4 + Math.random() * 2;
        }
      });
    }

    // Water ripples - simplified animation
    if (waterRef.current) {
      // Simple rotation animation for water effect
      waterRef.current.rotation.z = time * 0.1;
    }
  });

  return (
    <group>
      {/* Sky Dome */}
      <mesh>
        <sphereGeometry args={[50, 32, 32]} />
        <meshBasicMaterial color="#87CEEB" side={THREE.BackSide} />
      </mesh>

      {/* Ground - Grass */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#90EE90" />
      </mesh>

      {/* Koi Pond */}
      <mesh ref={waterRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, 0]}>
        <circleGeometry args={[3, 32]} />
        <meshStandardMaterial 
          color="#4169E1" 
          transparent 
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Fish in Pond */}
      <group ref={fishRef}>
        {[...Array(6)].map((_, i) => (
          <group key={i} position={[0, -0.3, 0]}>
            <mesh>
              <sphereGeometry args={[0.15, 8, 8]} />
              <meshStandardMaterial color="#FF8C00" />
            </mesh>
            <mesh position={[0.1, 0, 0]}>
              <coneGeometry args={[0.05, 0.2, 4]} />
              <meshStandardMaterial color="#FF8C00" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Stone Bridge */}
      <group position={[0, -0.2, 0]}>
        {/* Bridge Base */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.8, 0.2, 6]} />
          <meshStandardMaterial color="#708090" />
        </mesh>
        {/* Bridge Handrails */}
        <mesh position={[-0.4, 0.3, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 6]} />
          <meshStandardMaterial color="#708090" />
        </mesh>
        <mesh position={[0.4, 0.3, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 6]} />
          <meshStandardMaterial color="#708090" />
        </mesh>
      </group>

      {/* Cherry Blossom Trees */}
      <group ref={cherryBlossomsRef}>
        {[...Array(4)].map((_, i) => (
          <group key={i} position={[
            Math.cos((i / 4) * Math.PI * 2) * 8,
            0,
            Math.sin((i / 4) * Math.PI * 2) * 8
          ]}>
            {/* Tree Trunk */}
            <mesh position={[0, 2, 0]}>
              <cylinderGeometry args={[0.3, 0.4, 4]} />
              <meshStandardMaterial color="#8B4513" />
            </mesh>
            {/* Tree Crown */}
            <mesh position={[0, 4.5, 0]}>
              <sphereGeometry args={[2, 16, 16]} />
              <meshStandardMaterial color="#FFB6C1" />
            </mesh>
            {/* Individual Cherry Blossoms */}
            {[...Array(20)].map((_, j) => (
              <mesh key={j} position={[
                (Math.random() - 0.5) * 3,
                4 + Math.random() * 2,
                (Math.random() - 0.5) * 3
              ]}>
                <sphereGeometry args={[0.1, 8, 8]} />
                <meshStandardMaterial color="#FF69B4" />
              </mesh>
            ))}
          </group>
        ))}
      </group>

      {/* Falling Petals */}
      <group ref={petalsRef}>
        {[...Array(30)].map((_, i) => (
          <mesh key={i} position={[
            (Math.random() - 0.5) * 20,
            4 + Math.random() * 2,
            (Math.random() - 0.5) * 20
          ]}>
            <boxGeometry args={[0.05, 0.05, 0.1]} />
            <meshStandardMaterial color="#FFB6C1" />
          </mesh>
        ))}
      </group>

      {/* Bamboo Grove */}
      <group ref={bambooRef} position={[-6, 0, 6]}>
        {[...Array(15)].map((_, i) => (
          <group key={i} position={[
            (Math.random() - 0.5) * 4,
            0,
            (Math.random() - 0.5) * 4
          ]}>
            {/* Bamboo Stem */}
            <mesh position={[0, 2.5, 0]}>
              <cylinderGeometry args={[0.1, 0.12, 5]} />
              <meshStandardMaterial color="#228B22" />
            </mesh>
            {/* Bamboo Leaves */}
            <mesh position={[0, 5, 0]} rotation={[0, Math.random() * Math.PI, 0]}>
              <coneGeometry args={[0.3, 1, 4]} />
              <meshStandardMaterial color="#32CD32" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Lotus Flowers in Pond */}
      <group position={[0, -0.3, 0]}>
        {[...Array(15)].map((_, i) => (
          <group key={i} position={[
            (Math.random() - 0.5) * 5,
            0,
            (Math.random() - 0.5) * 5
          ]}>
            {/* Lotus Petals */}
            <mesh position={[0, 0.1, 0]}>
              <sphereGeometry args={[0.3, 8, 8]} />
              <meshStandardMaterial color={i % 2 === 0 ? "#FFB6C1" : "#FFFFFF"} />
            </mesh>
            {/* Lotus Center */}
            <mesh position={[0, 0.2, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 0.2]} />
              <meshStandardMaterial color="#FFD700" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Sunflowers */}
      <group position={[5, 0, -5]}>
        {[...Array(10)].map((_, i) => (
          <group key={i} position={[
            (Math.random() - 0.5) * 3,
            0,
            (Math.random() - 0.5) * 3
          ]}>
            {/* Sunflower Stem */}
            <mesh position={[0, 1, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 2]} />
              <meshStandardMaterial color="#228B22" />
            </mesh>
            {/* Sunflower Head */}
            <mesh position={[0, 2.2, 0]}>
              <sphereGeometry args={[0.4, 8, 8]} />
              <meshStandardMaterial color="#FFD700" />
            </mesh>
            {/* Sunflower Center */}
            <mesh position={[0, 2.2, 0]}>
              <cylinderGeometry args={[0.2, 0.2, 0.1]} />
              <meshStandardMaterial color="#8B4513" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Wooden Bench */}
      <group position={[0, 0, -8]}>
        {/* Bench Seat */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[2, 0.1, 0.6]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        {/* Bench Backrest */}
        <mesh position={[0, 1, -0.2]}>
          <boxGeometry args={[2, 0.6, 0.1]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        {/* Bench Legs */}
        {[...Array(4)].map((_, i) => (
          <mesh key={i} position={[
            i < 2 ? -0.8 : 0.8,
            0.25,
            i % 2 === 0 ? -0.2 : 0.2
          ]}>
            <cylinderGeometry args={[0.05, 0.05, 0.5]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
        ))}
      </group>

      {/* Meditation Platform */}
      <group position={[6, 0, 0]}>
        {/* Circular Platform */}
        <mesh position={[0, -0.1, 0]}>
          <torusGeometry args={[1.5, 0.2, 8, 16]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        {/* Meditation Cushion */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.2]} />
          <meshStandardMaterial color="#DC143C" />
        </mesh>
        {/* Candles */}
        {[...Array(3)].map((_, i) => (
          <group key={i} position={[
            Math.cos((i / 3) * Math.PI * 2) * 1,
            0.1,
            Math.sin((i / 3) * Math.PI * 2) * 1
          ]}>
            {/* Candle */}
            <mesh position={[0, 0.2, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.4]} />
              <meshStandardMaterial color="#FFFFFF" />
            </mesh>
            {/* Flame */}
            <mesh position={[0, 0.5, 0]}>
              <coneGeometry args={[0.03, 0.2, 4]} />
              <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.5} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Stone Lanterns */}
      {[...Array(5)].map((_, i) => (
        <group key={i} position={[
          Math.cos((i / 5) * Math.PI * 2) * 12,
          0,
          Math.sin((i / 5) * Math.PI * 2) * 12
        ]}>
          {/* Lantern Base */}
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[0.4, 1, 0.4]} />
            <meshStandardMaterial color="#708090" />
          </mesh>
          {/* Lantern Pillar */}
          <mesh position={[0, 1.5, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 1]} />
            <meshStandardMaterial color="#708090" />
          </mesh>
          {/* Lantern Roof */}
          <mesh position={[0, 2.2, 0]}>
            <coneGeometry args={[0.3, 0.4, 8]} />
            <meshStandardMaterial color="#708090" />
          </mesh>
          {/* Glowing Light */}
          <mesh position={[0, 1.5, 0]}>
            <boxGeometry args={[0.2, 0.2, 0.2]} />
            <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.3} />
          </mesh>
        </group>
      ))}

      {/* Stepping Stones Path */}
      {[...Array(20)].map((_, i) => (
        <mesh key={i} position={[
          Math.sin(i * 0.3) * 2,
          -0.4,
          i * 0.5 - 5
        ]}>
          <cylinderGeometry args={[0.3, 0.3, 0.1]} />
          <meshStandardMaterial color="#708090" />
        </mesh>
      ))}

      {/* Zen Rock Garden */}
      <group position={[-8, 0, -8]}>
        {/* Raked Sand */}
        <mesh position={[0, -0.45, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[4, 4]} />
          <meshStandardMaterial color="#F5DEB3" />
        </mesh>
        {/* Zen Stones */}
        {[...Array(7)].map((_, i) => (
          <mesh key={i} position={[
            (Math.random() - 0.5) * 3,
            -0.3,
            (Math.random() - 0.5) * 3
          ]}>
            <boxGeometry args={[
              0.3 + Math.random() * 0.4,
              0.2 + Math.random() * 0.3,
              0.3 + Math.random() * 0.4
            ]} />
            <meshStandardMaterial color="#708090" />
          </mesh>
        ))}
      </group>

      {/* Floating Butterflies */}
      <group ref={butterfliesRef}>
        {[...Array(4)].map((_, i) => (
          <group key={i}>
            {/* Butterfly Body */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.3]} />
              <meshStandardMaterial color="#8B4513" />
            </mesh>
            {/* Butterfly Wings */}
            <mesh position={[-0.1, 0, 0]}>
              <boxGeometry args={[0.2, 0.1, 0.05]} />
              <meshStandardMaterial color={["#FF69B4", "#FFD700", "#87CEEB", "#98FB98"][i]} />
            </mesh>
            <mesh position={[0.1, 0, 0]}>
              <boxGeometry args={[0.2, 0.1, 0.05]} />
              <meshStandardMaterial color={["#FF69B4", "#FFD700", "#87CEEB", "#98FB98"][i]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Lighting Setup */}
      <ambientLight intensity={0.4} color="#FFD700" />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={0.8} 
        color="#FFD700"
        castShadow 
      />
      <pointLight position={[0, 3, 0]} intensity={0.3} color="#FFD700" />
      <pointLight position={[6, 2, 0]} intensity={0.2} color="#FFD700" />
      
      {/* Lantern Lights */}
      {[...Array(5)].map((_, i) => (
        <pointLight 
          key={i}
          position={[
            Math.cos((i / 5) * Math.PI * 2) * 12,
            1.5,
            Math.sin((i / 5) * Math.PI * 2) * 12
          ]} 
          intensity={0.4} 
          color="#FFD700" 
        />
      ))}
    </group>
  );
};