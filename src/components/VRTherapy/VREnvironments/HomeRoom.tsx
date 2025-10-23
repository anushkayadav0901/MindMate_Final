import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const HomeRoom: React.FC = () => {
  const curtainsRef = useRef<THREE.Group>(null);
  const laptopRef = useRef<THREE.Mesh>(null);
  const lampRef = useRef<THREE.Mesh>(null);
  const plantsRef = useRef<THREE.Group>(null);
  const clockRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Curtains swaying
    if (curtainsRef.current) {
      curtainsRef.current.children.forEach((child, index) => {
        child.rotation.z = Math.sin(time * 0.3 + index) * 0.1;
      });
    }

    // Laptop screen glow
    if (laptopRef.current) {
      laptopRef.current.material.emissiveIntensity = 0.3 + Math.sin(time * 2) * 0.1;
    }

    // Desk lamp flickering
    if (lampRef.current) {
      lampRef.current.material.emissiveIntensity = 0.4 + Math.sin(time * 3) * 0.1;
    }

    // Plants gentle movement
    if (plantsRef.current) {
      plantsRef.current.children.forEach((child, index) => {
        child.rotation.z = Math.sin(time * 0.2 + index) * 0.05;
      });
    }

    // Wall clock
    if (clockRef.current) {
      clockRef.current.children.forEach((child, index) => {
        if (index === 0) { // Hour hand
          child.rotation.z = -time * 0.1;
        } else if (index === 1) { // Minute hand
          child.rotation.z = -time * 0.5;
        } else if (index === 2) { // Second hand
          child.rotation.z = -time * 6;
        }
      });
    }
  });

  return (
    <group>
      {/* Sky - Sunset */}
      <mesh>
        <sphereGeometry args={[50, 32, 32]} />
        <meshBasicMaterial color="#FFA07A" side={THREE.BackSide} />
      </mesh>

      {/* Floor - Wooden */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Floor Boards */}
      {[...Array(12)].map((_, i) => (
        <mesh key={i} position={[0, -0.49, i - 5.5]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[12, 0.8]} />
          <meshStandardMaterial color="#A0522D" />
        </mesh>
      ))}

      {/* Walls */}
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

      {/* Bed */}
      <group position={[-3, 0, -4]}>
        {/* Bed Frame */}
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[2, 0.1, 3]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        {/* Mattress */}
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[1.8, 0.2, 2.8]} />
          <meshStandardMaterial color="#4169E1" />
        </mesh>
        {/* Pillows */}
        <mesh position={[-0.5, 0.6, 1]}>
          <boxGeometry args={[0.4, 0.2, 0.6]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[0.5, 0.6, 1]}>
          <boxGeometry args={[0.4, 0.2, 0.6]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        {/* Blanket */}
        <mesh position={[0, 0.5, -0.5]} rotation={[0.1, 0, 0]}>
          <planeGeometry args={[1.6, 2]} />
          <meshStandardMaterial color="#FF69B4" />
        </mesh>
        {/* Bedside Table */}
        <mesh position={[1.5, 0.3, 0]}>
          <boxGeometry args={[0.6, 0.6, 0.6]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        {/* Bedside Lamp */}
        <mesh position={[1.5, 0.8, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.4]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[1.5, 1.1, 0]}>
          <coneGeometry args={[0.2, 0.3, 8]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <pointLight position={[1.5, 1, 0]} intensity={0.3} color="#FFD700" />
      </group>

      {/* Study Table */}
      <group position={[3, 0, -4]}>
        {/* Desk */}
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[2, 0.1, 1.2]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        {/* Desk Legs */}
        {[...Array(4)].map((_, i) => (
          <mesh key={i} position={[
            i < 2 ? -0.8 : 0.8,
            0.2,
            i % 2 === 0 ? -0.5 : 0.5
          ]}>
            <cylinderGeometry args={[0.05, 0.05, 0.4]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
        ))}
        {/* Laptop */}
        <mesh ref={laptopRef} position={[0, 0.5, 0]}>
          <boxGeometry args={[0.8, 0.05, 0.6]} />
          <meshStandardMaterial color="#C0C0C0" emissive="#87CEEB" emissiveIntensity={0.3} />
        </mesh>
        {/* Laptop Screen */}
        <mesh position={[0, 0.6, 0.1]}>
          <boxGeometry args={[0.7, 0.4, 0.02]} />
          <meshStandardMaterial color="#000000" emissive="#87CEEB" emissiveIntensity={0.5} />
        </mesh>
        {/* Books */}
        {[...Array(8)].map((_, i) => (
          <mesh key={i} position={[-0.8 + i * 0.2, 0.5, -0.3]}>
            <boxGeometry args={[0.15, 0.2, 0.1]} />
            <meshStandardMaterial color={["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98FB98", "#FFD700", "#FF69B4", "#87CEEB"][i]} />
          </mesh>
        ))}
        {/* Pencil Holder */}
        <mesh position={[0.6, 0.5, 0.3]}>
          <cylinderGeometry args={[0.1, 0.1, 0.2]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        {/* Pens */}
        {[...Array(5)].map((_, i) => (
          <mesh key={i} position={[
            0.6 + Math.cos((i / 5) * Math.PI * 2) * 0.05,
            0.6,
            0.3 + Math.sin((i / 5) * Math.PI * 2) * 0.05
          ]}>
            <cylinderGeometry args={[0.01, 0.01, 0.3]} />
            <meshStandardMaterial color={["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF"][i]} />
          </mesh>
        ))}
        {/* Desk Lamp */}
        <group position={[0.8, 0.5, 0]}>
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.6]} />
            <meshStandardMaterial color="#C0C0C0" />
          </mesh>
          <mesh ref={lampRef} position={[0, 0.7, 0]}>
            <coneGeometry args={[0.15, 0.2, 8]} />
            <meshStandardMaterial color="#FFFFFF" emissive="#FFD700" emissiveIntensity={0.4} />
          </mesh>
          <pointLight position={[0, 0.8, 0]} intensity={0.5} color="#FFD700" />
        </group>
      </group>

      {/* Office Chair */}
      <group position={[3, 0, -2]}>
        {/* Chair Base */}
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.2]} />
          <meshStandardMaterial color="#C0C0C0" />
        </mesh>
        {/* Chair Seat */}
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[0.6, 0.1, 0.6]} />
          <meshStandardMaterial color="#4169E1" />
        </mesh>
        {/* Chair Back */}
        <mesh position={[0, 0.7, -0.2]}>
          <boxGeometry args={[0.6, 0.6, 0.1]} />
          <meshStandardMaterial color="#4169E1" />
        </mesh>
        {/* Armrests */}
        <mesh position={[-0.3, 0.5, 0]}>
          <boxGeometry args={[0.1, 0.2, 0.4]} />
          <meshStandardMaterial color="#4169E1" />
        </mesh>
        <mesh position={[0.3, 0.5, 0]}>
          <boxGeometry args={[0.1, 0.2, 0.4]} />
          <meshStandardMaterial color="#4169E1" />
        </mesh>
      </group>

      {/* Bookshelf */}
      <group position={[-5.7, 0, 0]}>
        {[...Array(5)].map((_, shelf) => (
          <mesh key={shelf} position={[0, 0.3 + shelf * 0.6, 0]}>
            <boxGeometry args={[0.4, 0.05, 2]} />
            <meshStandardMaterial color="#654321" />
          </mesh>
        ))}
        {/* Books */}
        {[...Array(50)].map((_, i) => {
          const shelf = Math.floor(i / 10);
          const book = i % 10;
          return (
            <mesh key={i} position={[
              -0.15 + book * 0.03,
              0.3 + shelf * 0.6,
              -0.8 + (i % 2) * 0.1
            ]}>
              <boxGeometry args={[0.02, 0.5, 0.15]} />
              <meshStandardMaterial color={["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98FB98"][i % 5]} />
            </mesh>
          );
        })}
        {/* Decorative Items */}
        <mesh position={[0, 2.5, 0.5]}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial color="#FFD700" />
        </mesh>
        <mesh position={[0, 1.5, 0.5]}>
          <sphereGeometry args={[0.08]} />
          <meshStandardMaterial color="#32CD32" />
        </mesh>
      </group>

      {/* Wall Decorations */}
      {/* Posters */}
      {[
        { pos: [-4, 2.5, -5.9], color: "#FF6B6B" },
        { pos: [4, 2.5, -5.9], color: "#4ECDC4" },
        { pos: [-5.9, 2.5, 2], color: "#45B7D1" }
      ].map((poster, i) => (
        <group key={i} position={poster.pos as [number, number, number]}>
          {/* Frame */}
          <mesh>
            <boxGeometry args={[0.1, 1, 1.5]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          {/* Poster */}
          <mesh position={[0.05, 0, 0]}>
            <boxGeometry args={[0.02, 0.8, 1.3]} />
            <meshStandardMaterial color={poster.color} />
          </mesh>
        </group>
      ))}

      {/* Photo Frames */}
      {[...Array(6)].map((_, i) => (
        <group key={i} position={[
          -5.9,
          1.5 + Math.floor(i / 2) * 0.8,
          -2 + (i % 2) * 4
        ]}>
          {/* Frame */}
          <mesh>
            <boxGeometry args={[0.1, 0.3, 0.4]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          {/* Photo */}
          <mesh position={[0.05, 0, 0]}>
            <boxGeometry args={[0.02, 0.25, 0.35]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
        </group>
      ))}

      {/* Wall Clock */}
      <group ref={clockRef} position={[5.9, 2.5, 0]}>
        {/* Clock Face */}
        <mesh>
          <cylinderGeometry args={[0.4, 0.4, 0.1]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        {/* Clock Numbers */}
        {[...Array(12)].map((_, i) => (
          <mesh key={i} position={[
            Math.cos((i / 12) * Math.PI * 2) * 0.3,
            Math.sin((i / 12) * Math.PI * 2) * 0.3,
            0.05
          ]}>
            <boxGeometry args={[0.02, 0.02, 0.02]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
        ))}
        {/* Hour Hand */}
        <mesh position={[0, 0, 0.06]}>
          <boxGeometry args={[0.02, 0.15, 0.02]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        {/* Minute Hand */}
        <mesh position={[0, 0, 0.07]}>
          <boxGeometry args={[0.02, 0.2, 0.02]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        {/* Second Hand */}
        <mesh position={[0, 0, 0.08]}>
          <boxGeometry args={[0.01, 0.25, 0.01]} />
          <meshStandardMaterial color="#FF0000" />
        </mesh>
      </group>

      {/* Achievement Certificates */}
      <group position={[0, 2, -5.9]}>
        <mesh>
          <boxGeometry args={[2, 1.5, 0.1]} />
          <meshStandardMaterial color="#FFE4B5" />
        </mesh>
        <mesh position={[0, 0, 0.05]}>
          <boxGeometry args={[1.8, 1.3, 0.02]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
      </group>

      {/* Floor Rug */}
      <mesh position={[0, -0.45, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2, 32]} />
        <meshStandardMaterial color="#DC143C" />
      </mesh>

      {/* Plants */}
      <group ref={plantsRef}>
        {/* Window Plant */}
        <group position={[5.9, 1, 3]}>
          {/* Pot */}
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.4]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          {/* Plant */}
          <mesh position={[0, 0.6, 0]}>
            <coneGeometry args={[0.3, 0.8, 8]} />
            <meshStandardMaterial color="#32CD32" />
          </mesh>
        </group>
        {/* Hanging Plant */}
        <group position={[-4, 3, 2]}>
          {/* Hanging Pot */}
          <mesh position={[0, -0.2, 0]}>
            <sphereGeometry args={[0.15]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          {/* Plant */}
          <mesh position={[0, -0.1, 0]}>
            <coneGeometry args={[0.2, 0.6, 8]} />
            <meshStandardMaterial color="#32CD32" />
          </mesh>
        </group>
      </group>

      {/* Window */}
      <group position={[5.9, 2, 0]}>
        {/* Window Frame */}
        <mesh>
          <boxGeometry args={[0.1, 3, 4]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        {/* Glass Panes */}
        {[...Array(4)].map((_, i) => (
          <mesh key={i} position={[
            0.05,
            -0.5 + Math.floor(i / 2) * 1,
            -1 + (i % 2) * 2
          ]}>
            <boxGeometry args={[0.02, 1.2, 1.8]} />
            <meshStandardMaterial color="#87CEEB" transparent opacity={0.7} />
          </mesh>
        ))}
        {/* Curtains */}
        <group ref={curtainsRef}>
          <mesh position={[0.02, 1, 1]} rotation={[0, 0, Math.PI / 6]}>
            <planeGeometry args={[1, 2]} />
            <meshStandardMaterial color="#DDA0DD" />
          </mesh>
          <mesh position={[0.02, 1, -1]} rotation={[0, 0, -Math.PI / 6]}>
            <planeGeometry args={[1, 2]} />
            <meshStandardMaterial color="#DDA0DD" />
          </mesh>
        </group>
      </group>

      {/* Bean Bag Chair */}
      <group position={[-2, 0, 2]}>
        <mesh position={[0, 0.4, 0]}>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshStandardMaterial color="#FF69B4" />
        </mesh>
      </group>

      {/* Wall Shelves */}
      {[...Array(3)].map((_, i) => (
        <group key={i} position={[-5.9, 1.5 + i * 0.8, 4]}>
          {/* Shelf */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.05, 0.05, 1]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          {/* Decorative Items */}
          <mesh position={[0, 0.1, 0]}>
            <boxGeometry args={[0.1, 0.1, 0.1]} />
            <meshStandardMaterial color="#FFD700" />
          </mesh>
        </group>
      ))}

      {/* Laundry Basket */}
      <group position={[2, 0, 4]}>
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.6]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        {/* Clothes */}
        {[...Array(5)].map((_, i) => (
          <mesh key={i} position={[
            (Math.random() - 0.5) * 0.4,
            0.3 + Math.random() * 0.3,
            (Math.random() - 0.5) * 0.4
          ]}>
            <boxGeometry args={[0.1, 0.1, 0.1]} />
            <meshStandardMaterial color={["#FF69B4", "#87CEEB", "#98FB98", "#FFB6C1", "#FFD700"][i]} />
          </mesh>
        ))}
      </group>

      {/* Guitar */}
      <group position={[-4, 0, 4]}>
        {/* Guitar Body */}
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[0.3, 0.1, 0.8]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        {/* Guitar Neck */}
        <mesh position={[0, 0.5, 0.6]}>
          <boxGeometry args={[0.05, 0.05, 0.6]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        {/* Guitar Stand */}
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.2]} />
          <meshStandardMaterial color="#C0C0C0" />
        </mesh>
      </group>

      {/* Sports Equipment */}
      <group position={[4, 0, 4]}>
        {/* Cricket Bat */}
        <mesh position={[0, 0.8, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.05, 1.2, 0.1]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        {/* Football */}
        <mesh position={[0.5, 0.2, 0]}>
          <sphereGeometry args={[0.15]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        {/* Basketball */}
        <mesh position={[-0.5, 0.2, 0]}>
          <sphereGeometry args={[0.15]} />
          <meshStandardMaterial color="#FF8C00" />
        </mesh>
      </group>

      {/* Door */}
      <group position={[0, 1, 5.9]}>
        {/* Door Frame */}
        <mesh>
          <boxGeometry args={[0.1, 2, 1]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        {/* Door */}
        <mesh position={[0.05, 0, 0]}>
          <boxGeometry args={[0.02, 1.8, 0.8]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        {/* Door Handle */}
        <mesh position={[0.06, 0, 0.3]}>
          <cylinderGeometry args={[0.05, 0.05, 0.1]} />
          <meshStandardMaterial color="#C0C0C0" />
        </mesh>
        {/* Room Name Plate */}
        <mesh position={[0.06, 0.5, 0]}>
          <boxGeometry args={[0.01, 0.2, 0.3]} />
          <meshStandardMaterial color="#FFD700" />
        </mesh>
      </group>

      {/* Lighting Setup */}
      <ambientLight intensity={0.4} color="#FFE4B5" />
      <pointLight position={[0, 3, 0]} intensity={0.6} color="#FFA500" />
      <pointLight position={[3, 1, -4]} intensity={0.4} color="#FFD700" />
      <pointLight position={[-3, 1, -4]} intensity={0.3} color="#FFD700" />
      <directionalLight position={[5, 5, 5]} intensity={0.2} color="#FFA500" />
    </group>
  );
};