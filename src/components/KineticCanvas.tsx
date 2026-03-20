import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useEmotionTracking } from '../hooks/useEmotionTracking';
import { usePointerTracking } from '../hooks/usePointerTracking';
import { Sparkles, Play, Pause, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PARTICLE_COUNT = 40000;

// Highly optimized custom shader material for particles
const ParticleMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uPointer: { value: new THREE.Vector2(0, 0) },
    uColorBase: { value: new THREE.Color("#4f46e5") },
    uColorAccent: { value: new THREE.Color("#38bdf8") }
  },
  vertexShader: `
    uniform float uTime;
    uniform vec2 uPointer;
    varying vec2 vUv;
    varying float vDist;

    void main() {
      vUv = uv;
      vec3 pos = position;

      // Distance to pointer influence
      float dist = distance(pos.xy, uPointer);
      vDist = dist;

      // Organic fluid motion
      pos.x += sin(uTime * 0.5 + pos.y * 2.0) * 0.2;
      pos.y += cos(uTime * 0.5 + pos.x * 2.0) * 0.2;
      pos.z += sin(uTime * 1.0 + pos.x * pos.y) * 0.3;

      // Ripple explosion away from pointer
      if (dist < 4.0) {
        float force = (4.0 - dist) / 4.0; // 0 to 1
        pos.xy += normalize(pos.xy - uPointer) * (force * 3.0);
        pos.z += force * 4.0;
        
        // Add a micro-swirl to the wipe
        pos.x += sin(uTime * 5.0) * force * 0.5;
        pos.y += cos(uTime * 5.0) * force * 0.5;
      }

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = (5.0 * (1.0 - dist * 0.05)) * (10.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform vec3 uColorBase;
    uniform vec3 uColorAccent;
    varying float vDist;

    void main() {
      // Soft circular particle
      vec2 center = gl_PointCoord - vec2(0.5);
      float distToCenter = length(center);
      if (distToCenter > 0.5) discard;

      // Color mix based on distance to interaction point
      float mixFactor = clamp(1.0 - (vDist / 4.0), 0.0, 1.0);
      vec3 finalColor = mix(uColorBase, uColorAccent, mixFactor);
      
      // Edge fade out
      float alpha = 1.0 - (distToCenter * 2.0);
      gl_FragColor = vec4(finalColor, alpha * 0.8);
    }
  `,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending
});

function FluidParticles({ pointerCoords, emotion }: { pointerCoords: {x:number, y:number}, emotion: string }) {
  const meshRef = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  // Map 0-1 mediapipe coords to R3F viewport coords
  const targetPointer = new THREE.Vector2(
    (pointerCoords.x - 0.5) * viewport.width,
    -(pointerCoords.y - 0.5) * viewport.height
  );

  // Generate random stable background cluster
  const positions = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const r = 8 * Math.sqrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      pos[i * 3] = r * Math.cos(theta); // x
      pos[i * 3 + 1] = r * Math.sin(theta); // y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4; // z
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Update Shader Uniforms safely
    const material = meshRef.current.material as THREE.ShaderMaterial;
    material.uniforms.uTime.value = state.clock.elapsedTime;
    
    // Lerp pointer for ultra smooth fluid tracing
    material.uniforms.uPointer.value.lerp(targetPointer, 0.1);

    // Dynamic Emotion colors
    if (emotion === 'happy') {
      material.uniforms.uColorBase.value.lerp(new THREE.Color("#fbbf24"), 0.02); // gold
      material.uniforms.uColorAccent.value.lerp(new THREE.Color("#f59e0b"), 0.02);
    } else if (emotion === 'sad') {
      material.uniforms.uColorBase.value.lerp(new THREE.Color("#312e81"), 0.02); // deep indigo
      material.uniforms.uColorAccent.value.lerp(new THREE.Color("#6366f1"), 0.02);
    } else {
      material.uniforms.uColorBase.value.lerp(new THREE.Color("#0ea5e9"), 0.02); // sky blue
      material.uniforms.uColorAccent.value.lerp(new THREE.Color("#38bdf8"), 0.02);
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={PARTICLE_COUNT} array={positions} itemSize={3} />
      </bufferGeometry>
      <primitive object={ParticleMaterial} attach="material" />
    </points>
  );
}

const THERAPY_TEXTS = [
  "Breathe deeply to anchor yourself...",
  "Let your physical movements clear your mind...",
  "Watch the tension drift and vanish...",
  "Your physical space is safe and fluid...",
  "Smile gently to warm the canvas..."
];

interface KineticCanvasProps {
  onBack?: () => void;
}

export const KineticCanvas: React.FC<KineticCanvasProps> = ({ onBack }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { emotion } = useEmotionTracking({
    videoElement: videoRef,
    enabled: isRunning
  });

  const pointerCoords = usePointerTracking({
    videoElement: videoRef,
    enabled: isRunning
  });

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTextIndex(prev => (prev + 1) % THERAPY_TEXTS.length);
    }, 6000); // cycle text every 6 seconds
    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] w-full relative overflow-hidden rounded-[2rem] bg-[#020617] shadow-2xl">
      <video ref={videoRef} className="hidden" autoPlay playsInline muted />
      
      {!isRunning ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="z-10 flex flex-col items-center text-center p-8 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 max-w-xl mx-4"
        >
          <div className="bg-fuchsia-500/20 p-4 rounded-full mb-6">
            <Sparkles className="w-12 h-12 text-fuchsia-300" />
          </div>
          <h2 className="text-3xl font-light text-white mb-4">Somatic Grounding</h2>
          
          <div className="bg-black/20 rounded-2xl p-6 text-left mb-8 w-full">
            <h3 className="text-fuchsia-400 font-medium mb-2 flex items-center gap-2">
              <Info className="w-4 h-4"/> Why this works
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Anxiety frequently traps us entirely in our head. "Somatic Grounding" connects your mind back to your physical body. By actively making large physical sweeping motions with your hands, your brain is forced to process spatial data, safely releasing pent-up emotional kinetic energy.
            </p>
            <h3 className="text-indigo-400 font-medium mb-2">Instructions</h3>
            <ul className="text-slate-300 text-sm space-y-2 list-disc pl-4">
              <li>Raise one hand to the camera to act as a magnet.</li>
              <li>Make sweeping motions to push the "mental fog" (particles) away.</li>
              <li>Slightly smile to inject warm, golden energy into the canvas.</li>
            </ul>
          </div>

          <button 
            onClick={() => setIsRunning(true)}
            className="flex items-center gap-3 px-8 py-4 bg-fuchsia-500 hover:bg-fuchsia-400 text-white rounded-full font-medium transition-all transform hover:scale-105 shadow-lg shadow-fuchsia-500/20"
          >
            <Play className="w-5 h-5" /> Begin Somatic Release
          </button>
          
          {onBack && (
            <button 
              onClick={onBack}
              className="mt-6 text-slate-400 hover:text-white transition-colors underline"
            >
              Go Back
            </button>
          )}
        </motion.div>
      ) : (
        <>
          {/* Detailed Guidance Panel */}
          <div className="absolute top-8 left-8 z-20 w-72 bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl hidden md:block">
            <h3 className="text-white font-medium mb-2 border-b border-white/10 pb-2">Therapy Guide</h3>
            <ol className="text-slate-300 text-sm space-y-3 list-decimal pl-4">
              <li>Wave your hand continuously.</li>
              <li>Imagine the dense dots are your stressful thoughts.</li>
              <li>Physically scatter them to the edges of the universe.</li>
              <li>Let your face relax to change the biome colors.</li>
            </ol>
            <div className="mt-4 p-3 bg-fuchsia-500/10 rounded-xl border border-fuchsia-500/20 flex flex-col gap-1 text-center">
              <span className="text-white/60 text-xs">Biome Status:</span>
              <span className="text-fuchsia-300 uppercase tracking-widest text-sm font-bold">{emotion}</span>
            </div>
          </div>

          <div className="absolute top-8 right-8 z-10 pointer-events-none">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-white text-sm font-medium">Tracking Active</p>
            </div>
          </div>
          <div className="absolute top-8 right-8 z-10 pointer-events-none">
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-xl text-slate-300 font-mono text-xs uppercase tracking-widest border border-white/5">
              <span>Biome : {emotion}</span>
            </div>
          </div>

          <div className="absolute top-1/4 w-full flex justify-center z-10 pointer-events-none px-4">
            <AnimatePresence mode="wait">
              <motion.p
                key={textIndex}
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                transition={{ duration: 1.5 }}
                className="text-white/50 text-2xl font-light tracking-widest text-center max-w-2xl"
              >
                {THERAPY_TEXTS[textIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="absolute inset-0 w-full h-full cursor-pointer">
            <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
              <FluidParticles pointerCoords={pointerCoords} emotion={emotion} />
            </Canvas>
          </div>

          <button 
            onClick={() => setIsRunning(false)}
            className="absolute bottom-8 right-8 z-20 bg-white/10 hover:bg-white/20 p-4 rounded-full text-white backdrop-blur-md transition-all border border-white/20 shadow-xl"
          >
            <Pause className="w-6 h-6" />
          </button>
        </>
      )}
    </div>
  );
};
