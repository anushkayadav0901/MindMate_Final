import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const ExamHall: React.FC = () => {
  const clockRef = useRef<THREE.Mesh>(null);
  const supervisorRef = useRef<THREE.Group>(null);
  const studentsRef = useRef<THREE.Group>(null);
  const timerRef = useRef<THREE.Mesh>(null);
  const lightsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Clock hands rotation
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

    // Supervisor walking animation
    if (supervisorRef.current) {
      supervisorRef.current.position.x = Math.sin(time * 0.3) * 8;
      supervisorRef.current.rotation.y = Math.sin(time * 0.3) * 0.1;
    }

    // Students subtle movements
    if (studentsRef.current) {
      studentsRef.current.children.forEach((child, index) => {
        // Head movements
        child.children[1].rotation.x = Math.sin(time * 0.2 + index) * 0.1;
        child.children[1].rotation.y = Math.sin(time * 0.15 + index) * 0.05;
        
        // Writing animation
        if (index % 3 === 0) {
          child.children[2].position.y = 0.8 + Math.sin(time * 2 + index) * 0.05;
        }
      });
    }

    // Timer pulsing when < 10 minutes
    if (timerRef.current) {
      const scale = 1 + Math.sin(time * 3) * 0.1;
      timerRef.current.scale.setScalar(scale);
    }

    // Light flickering
    if (lightsRef.current) {
      lightsRef.current.children.forEach((child, index) => {
        const intensity = 0.8 + Math.sin(time * 5 + index) * 0.1;
        if (child instanceof THREE.PointLight) {
          child.intensity = intensity;
        }
      });
    }
  });

  return (
    <group>
      {/* Floor - Tiled */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#F5F5F5" />
      </mesh>
      
      {/* Floor Tiles Pattern */}
      {[...Array(10)].map((_, i) => 
        [...Array(10)].map((_, j) => (
          <mesh key={`${i}-${j}`} position={[i - 4.5, -0.49, j - 4.5]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1.8, 1.8]} />
            <meshStandardMaterial color={i % 2 === j % 2 ? "#F0F0F0" : "#E8E8E8"} />
          </mesh>
        ))
      )}

      {/* Ceiling */}
      <mesh position={[0, 4, 0]}>
        <boxGeometry args={[20, 0.2, 20]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>

      {/* Walls */}
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

      {/* Windows on Side Walls */}
      {[...Array(6)].map((_, i) => (
        <group key={i} position={[-9.9, 2, -6 + i * 2]}>
          {/* Window Frame */}
          <mesh>
            <boxGeometry args={[0.1, 2, 1.5]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          {/* Glass */}
          <mesh position={[0.05, 0, 0]}>
            <boxGeometry args={[0.02, 1.8, 1.3]} />
            <meshStandardMaterial color="#87CEEB" transparent opacity={0.7} />
          </mesh>
          {/* Curtains */}
          <mesh position={[0.02, 0.5, 0]} rotation={[0, 0, Math.PI / 6]}>
            <planeGeometry args={[0.8, 1]} />
            <meshStandardMaterial color="#DDA0DD" />
          </mesh>
        </group>
      ))}

      {/* Blackboard */}
      <group position={[0, 2, -9.8]}>
        {/* Blackboard */}
        <mesh>
          <boxGeometry args={[8, 3, 0.1]} />
          <meshStandardMaterial color="#2F4F4F" />
        </mesh>
        {/* Chalk Tray */}
        <mesh position={[0, -1.6, 0.05]}>
          <boxGeometry args={[8.2, 0.2, 0.2]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        {/* Chalk */}
        {[...Array(5)].map((_, i) => (
          <mesh key={i} position={[-3 + i * 1.5, -1.5, 0.1]}>
            <cylinderGeometry args={[0.05, 0.05, 0.3]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
        ))}
      </group>

      {/* Teacher's Desk */}
      <group position={[0, 0, -8]}>
        {/* Desk */}
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[2, 0.1, 1]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        {/* Desk Legs */}
        {[...Array(4)].map((_, i) => (
          <mesh key={i} position={[
            i < 2 ? -0.8 : 0.8,
            0.2,
            i % 2 === 0 ? -0.4 : 0.4
          ]}>
            <cylinderGeometry args={[0.05, 0.05, 0.4]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
        ))}
        {/* Chair */}
        <mesh position={[0, 0.5, 0.8]}>
          <boxGeometry args={[0.6, 0.1, 0.6]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[0, 1, 0.5]}>
          <boxGeometry args={[0.6, 0.8, 0.1]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        {/* Papers on Desk */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[0.8, 0.01, 0.6]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        {/* Bell */}
        <mesh position={[0.5, 0.6, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.2]} />
          <meshStandardMaterial color="#FFD700" />
        </mesh>
        <mesh position={[0.5, 0.8, 0]}>
          <sphereGeometry args={[0.15]} />
          <meshStandardMaterial color="#FFD700" />
        </mesh>
      </group>

      {/* Wall Clock */}
      <group ref={clockRef} position={[8, 3, -9.9]}>
        {/* Clock Face */}
        <mesh>
          <cylinderGeometry args={[0.5, 0.5, 0.1, 32]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        {/* Clock Numbers */}
        {[...Array(12)].map((_, i) => (
          <mesh key={i} position={[
            Math.cos((i / 12) * Math.PI * 2) * 0.4,
            Math.sin((i / 12) * Math.PI * 2) * 0.4,
            0.05
          ]}>
            <boxGeometry args={[0.05, 0.05, 0.02]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
        ))}
        {/* Hour Hand */}
        <mesh position={[0, 0, 0.06]}>
          <boxGeometry args={[0.02, 0.2, 0.02]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        {/* Minute Hand */}
        <mesh position={[0, 0, 0.07]}>
          <boxGeometry args={[0.02, 0.3, 0.02]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        {/* Second Hand */}
        <mesh position={[0, 0, 0.08]}>
          <boxGeometry args={[0.01, 0.35, 0.01]} />
          <meshStandardMaterial color="#FF0000" />
        </mesh>
      </group>

      {/* Digital Timer */}
      <group ref={timerRef} position={[0, 3.5, -9.7]}>
        <mesh>
          <boxGeometry args={[2, 0.8, 0.1]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[0, 0, 0.05]}>
          <boxGeometry args={[1.8, 0.6, 0.05]} />
          <meshStandardMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* Motivational Posters */}
      {[
        { pos: [-6, 2.5, -9.9], text: "Stay Calm" },
        { pos: [6, 2.5, -9.9], text: "You Can Do It" },
        { pos: [-9.9, 2.5, 0], text: "Believe in Yourself" }
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
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
        </group>
      ))}

      {/* Exit Signs */}
      {[
        { pos: [-9.9, 3.5, -5], color: "#00FF00" },
        { pos: [9.9, 3.5, 5], color: "#00FF00" }
      ].map((sign, i) => (
        <mesh key={i} position={sign.pos as [number, number, number]}>
          <boxGeometry args={[0.1, 0.3, 0.8]} />
          <meshStandardMaterial color={sign.color} emissive={sign.color} emissiveIntensity={0.3} />
        </mesh>
      ))}

      {/* Exam Desks and Students */}
      <group ref={studentsRef}>
        {[...Array(25)].map((_, i) => {
          const row = Math.floor(i / 5);
          const col = i % 5;
          const x = (col - 2) * 3;
          const z = (row - 2) * 3;
          
          return (
            <group key={i} position={[x, 0, z]}>
              {/* Desk */}
              <mesh position={[0, 0.4, 0]}>
                <boxGeometry args={[1.2, 0.1, 0.8]} />
                <meshStandardMaterial color="#8B4513" />
              </mesh>
              {/* Desk Legs */}
              {[...Array(4)].map((_, j) => (
                <mesh key={j} position={[
                  j < 2 ? -0.5 : 0.5,
                  0.2,
                  j % 2 === 0 ? -0.3 : 0.3
                ]}>
                  <cylinderGeometry args={[0.03, 0.03, 0.4]} />
                  <meshStandardMaterial color="#8B4513" />
                </mesh>
              ))}
              
              {/* Chair */}
              <mesh position={[0, 0.3, 0.6]}>
                <boxGeometry args={[0.5, 0.1, 0.5]} />
                <meshStandardMaterial color="#4169E1" />
              </mesh>
              <mesh position={[0, 0.7, 0.35]}>
                <boxGeometry args={[0.5, 0.6, 0.1]} />
                <meshStandardMaterial color="#4169E1" />
              </mesh>
              
              {/* Student Figure */}
              <group position={[0, 0.8, 0.6]}>
                {/* Body */}
                <mesh position={[0, 0, 0]}>
                  <cylinderGeometry args={[0.2, 0.2, 1]} />
                  <meshStandardMaterial color={["#FF69B4", "#87CEEB", "#98FB98", "#FFB6C1"][i % 4]} />
                </mesh>
                {/* Head */}
                <mesh ref={studentsRef} position={[0, 0.7, 0]}>
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
              </group>
              
              {/* Exam Materials on Desk */}
              <mesh position={[0, 0.5, 0]}>
                <boxGeometry args={[0.8, 0.01, 0.6]} />
                <meshStandardMaterial color="#FFFFFF" />
              </mesh>
              <mesh position={[-0.3, 0.5, 0.2]}>
                <cylinderGeometry args={[0.02, 0.02, 0.3]} />
                <meshStandardMaterial color="#0000FF" />
              </mesh>
              <mesh position={[0.3, 0.5, 0.2]}>
                <boxGeometry args={[0.1, 0.05, 0.1]} />
                <meshStandardMaterial color="#FF69B4" />
              </mesh>
              <mesh position={[0, 0.5, -0.2]}>
                <cylinderGeometry args={[0.05, 0.05, 0.2]} />
                <meshStandardMaterial color="#87CEEB" />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Supervisor */}
      <group ref={supervisorRef} position={[0, 0, -6]}>
        {/* Body */}
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 1.2]} />
          <meshStandardMaterial color="#2F4F4F" />
        </mesh>
        {/* Head */}
        <mesh position={[0, 1.6, 0]}>
          <sphereGeometry args={[0.2]} />
          <meshStandardMaterial color="#FDBCB4" />
        </mesh>
        {/* Arms */}
        <mesh position={[-0.25, 1.2, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.6]} />
          <meshStandardMaterial color="#FDBCB4" />
        </mesh>
        <mesh position={[0.25, 1.2, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.6]} />
          <meshStandardMaterial color="#FDBCB4" />
        </mesh>
        {/* Legs */}
        <mesh position={[-0.08, -0.2, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.8]} />
          <meshStandardMaterial color="#2F4F4F" />
        </mesh>
        <mesh position={[0.08, -0.2, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.8]} />
          <meshStandardMaterial color="#2F4F4F" />
        </mesh>
        {/* Clipboard */}
        <mesh position={[0.3, 1, 0]}>
          <boxGeometry args={[0.1, 0.15, 0.02]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
      </group>

      {/* Ceiling Lights */}
      <group ref={lightsRef}>
        {[...Array(10)].map((_, i) => (
          <group key={i} position={[
            (i % 5 - 2) * 4,
            3.8,
            Math.floor(i / 5) * 8 - 4
          ]}>
            {/* Light Fixture */}
            <mesh>
              <cylinderGeometry args={[0.3, 0.3, 0.1]} />
              <meshStandardMaterial color="#FFFFFF" />
            </mesh>
            {/* Light Source */}
            <pointLight position={[0, -0.2, 0]} intensity={0.8} color="#FFFFFF" />
          </group>
        ))}
      </group>

      {/* Lighting Setup */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[0, 10, 0]} intensity={0.8} castShadow />
      <pointLight position={[0, 3.5, -8]} intensity={0.3} color="#FFFF00" />
    </group>
  );
};