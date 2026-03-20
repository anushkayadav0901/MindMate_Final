import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EmotionState } from '../hooks/useEmotionTracking';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

interface CompanionAvatarProps {
  emotion: EmotionState;
}

const SUPPORTIVE_MESSAGES = [
  "Hey, you got this 💙",
  "Take a deep breath 🌿",
  "It's okay to pause ✨",
  "You're doing great!",
  "Mind and body connection 💪"
];

// 3D Robot Character
function RobotAvatar({ emotion, isAnimating }: { emotion: EmotionState, isAnimating: boolean }) {
  const group = useRef<THREE.Group>(null);
  const leftEye = useRef<THREE.Mesh>(null);
  const rightEye = useRef<THREE.Mesh>(null);
  const mouth = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (group.current) {
      // Look at mouse playfully
      const targetX = (state.pointer.x * Math.PI) / 6;
      const targetY = (state.pointer.y * Math.PI) / 6;
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetX, 0.05);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -targetY, 0.05);
    }

    // Emotion shape warping
    let targetMouthScaleX = 1;
    let targetMouthScaleY = 1;
    let targetMouthY = -0.2;
    let targetEyeY = 0.2;

    if (emotion === 'happy') {
      targetMouthScaleX = 1.5;
      targetMouthScaleY = 0.2; // wide curve
      targetMouthY = -0.15;
      targetEyeY = 0.25;
    } else if (emotion === 'sad') {
      targetMouthScaleX = 0.6;
      targetMouthScaleY = 2; // tall/neutral drop
      targetMouthY = -0.25;
      targetEyeY = 0.15;
    }

    if (mouth.current) {
      mouth.current.scale.x = THREE.MathUtils.lerp(mouth.current.scale.x, targetMouthScaleX, 0.1);
      mouth.current.scale.y = THREE.MathUtils.lerp(mouth.current.scale.y, targetMouthScaleY, 0.1);
      mouth.current.position.y = THREE.MathUtils.lerp(mouth.current.position.y, targetMouthY, 0.1);
    }
    
    if (leftEye.current && rightEye.current) {
      leftEye.current.position.y = THREE.MathUtils.lerp(leftEye.current.position.y, targetEyeY + (isAnimating ? Math.sin(state.clock.elapsedTime * 10) * 0.05 : 0), 0.1);
      rightEye.current.position.y = THREE.MathUtils.lerp(rightEye.current.position.y, targetEyeY + (isAnimating ? Math.sin(state.clock.elapsedTime * 10) * 0.05 : 0), 0.1);
    }
  });

  const activeColor = emotion === 'happy' ? '#34d399' : emotion === 'sad' ? '#818cf8' : '#38bdf8';

  return (
    <group ref={group}>
      <Float speed={3} rotationIntensity={0.4} floatIntensity={1.2}>
        {/* Head Shell */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.5, 1.2, 1.4]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.1} metalness={0.4} />
        </mesh>
        
        {/* Screen/Faceplate */}
        <mesh position={[0, 0, 0.71]}>
          <planeGeometry args={[1.3, 0.9]} />
          <meshStandardMaterial color="#0f172a" roughness={0.6} />
        </mesh>

        {/* Left Eye */}
        <mesh ref={leftEye} position={[-0.3, 0.2, 0.72]}>
          <capsuleGeometry args={[0.08, 0.08, 4, 8]} />
          <meshStandardMaterial color={activeColor} emissive={activeColor} emissiveIntensity={2} />
        </mesh>

        {/* Right Eye */}
        <mesh ref={rightEye} position={[0.3, 0.2, 0.72]}>
          <capsuleGeometry args={[0.08, 0.08, 4, 8]} />
          <meshStandardMaterial color={activeColor} emissive={activeColor} emissiveIntensity={2} />
        </mesh>

        {/* Mouth */}
        <mesh ref={mouth} position={[0, -0.2, 0.72]}>
          <boxGeometry args={[0.4, 0.04, 0.02]} />
          <meshStandardMaterial color={activeColor} emissive={activeColor} emissiveIntensity={1} />
        </mesh>
        
        {/* Antenna */}
        <mesh position={[0, 0.7, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.4]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.95, 0]}>
          <sphereGeometry args={[0.12]} />
          <meshStandardMaterial 
            color={emotion === 'analyzing' ? '#fbbf24' : activeColor} 
            emissive={emotion === 'analyzing' ? '#fbbf24' : activeColor} 
            emissiveIntensity={emotion === 'analyzing' ? 2 : 1} 
          />
        </mesh>
      </Float>
    </group>
  );
}

export const CompanionAvatar: React.FC<CompanionAvatarProps> = ({ emotion }) => {
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const lastPopupTime = useRef<number>(0);

  useEffect(() => {
    if (emotion === 'sad') {
      const now = Date.now();
      if (now - lastPopupTime.current > 25000) {
        lastPopupTime.current = now;
        
        const msg = SUPPORTIVE_MESSAGES[Math.floor(Math.random() * SUPPORTIVE_MESSAGES.length)];
        setPopupMessage(msg);
        setIsAnimating(true);
        
        setTimeout(() => {
          setPopupMessage(null);
          setIsAnimating(false);
        }, 5000);
      }
    }
  }, [emotion]);

  return (
    <div className="fixed top-1/2 -translate-y-1/2 left-8 z-50 flex flex-col items-start gap-4 pointer-events-none">
      
      {/* 3D Canvas Box */}
      <div className="w-56 h-56 relative pointer-events-auto cursor-pointer group">
        <Canvas camera={{ position: [0, 0, 4], fov: 45 }} className="w-full h-full drop-shadow-2xl">
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
          <pointLight position={[-10, -10, -5]} intensity={0.5} />
          <RobotAvatar emotion={emotion} isAnimating={isAnimating} />
          <Environment preset="city" />
        </Canvas>
        
        {/* Status Bubble */}
        {emotion === 'analyzing' && (
           <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
             Analyzing...
           </div>
        )}
      </div>

      {/* Message Popup */}
      <AnimatePresence>
        {popupMessage && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, x: -20, transformOrigin: "left center" }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: -20 }}
            className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl rounded-tl-none px-6 py-4 shadow-2xl border border-slate-200/50 dark:border-white/10 ml-4 max-w-[200px]"
          >
            <p className="text-slate-800 dark:text-white text-sm font-medium tracking-wide leading-relaxed">
              {popupMessage}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};;
