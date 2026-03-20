import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Environment, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { useBreathTracking } from '../hooks/useBreathTracking';
import { Wind, Play, Pause, AlertCircle } from 'lucide-react';

interface BreathingOrbProps {
  handDistance: number;
  phase: 'inhale' | 'hold' | 'exhale';
  targetDistance: number;
  isPerfect: boolean;
}

function BreathingOrb({ handDistance, phase, targetDistance, isPerfect }: BreathingOrbProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;

    // Physical bounds for the visual orb based on hand tracking (mapped from 0.0 - 0.7 to 1.0 - 3.5 scale)
    const mappedScale = 1.0 + (handDistance * 3.5);
    
    // Smooth physical expansion based directly on hands
    meshRef.current.scale.lerp(new THREE.Vector3(mappedScale, mappedScale, mappedScale), 0.1);

    // Dynamic rotation and distortion based on phase
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;

    if (phase === 'hold') {
      materialRef.current.distort = THREE.MathUtils.lerp(materialRef.current.distort, 0.6, 0.05);
      materialRef.current.speed = 4;
    } else {
      materialRef.current.distort = THREE.MathUtils.lerp(materialRef.current.distort, 0.2, 0.05);
      materialRef.current.speed = 2;
    }
  });

  return (
    <group>
      <Sphere ref={meshRef} args={[1, 64, 64]}>
        <MeshDistortMaterial
          ref={materialRef}
          color={isPerfect ? '#34d399' : '#38bdf8'} // Green if matching, Blue otherwise
          envMapIntensity={1.5}
          clearcoat={0.8}
          clearcoatRoughness={0.1}
          metalness={0.2}
          roughness={0.1}
          radius={1}
        />
      </Sphere>
      {/* Target Guide Ring */}
      <mesh scale={1.0 + (targetDistance * 3.5)}>
        <ringGeometry args={[1.02, 1.05, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
      {isPerfect && <Sparkles count={100} scale={5} size={6} speed={0.4} opacity={0.5} color="#34d399" />}
    </group>
  );
}

export default function InfinityBreath() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [targetDistance, setTargetDistance] = useState(0.1);
  const timer = useRef(0);

  const { handDistance, handsVisible } = useBreathTracking({
    videoElement: videoRef,
    enabled: isRunning
  });

  // Breathing Cycle Logic (4s Inhale, 2s Hold, 4s Exhale)
  useEffect(() => {
    if (!isRunning) return;

    let intervalId: NodeJS.Timeout;
    
    intervalId = setInterval(() => {
      timer.current += 0.1;
      const next = timer.current;
        
        // Phase routing
        if (next < 4.0) {
          setPhase('inhale');
          setTargetDistance(0.1 + (0.6 * (next / 4.0))); // Expand target from 0.1 to 0.7
        } else if (next < 6.0) {
          setPhase('hold');
          setTargetDistance(0.7);
        } else if (next < 10.0) {
          setPhase('exhale');
          setTargetDistance(0.7 - (0.6 * ((next - 6.0) / 4.0))); // Compress target
        } else {
          timer.current = 0; // Reset cycle
        }
    }, 100);

    return () => clearInterval(intervalId);
  }, [isRunning]);

  // Is the user perfectly matching the guide ring?
  const isPerfect = handsVisible && Math.abs(handDistance - targetDistance) < 0.15;

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] w-full relative overflow-hidden rounded-[2rem] bg-slate-900 shadow-2xl">
      <video ref={videoRef} className="hidden" autoPlay playsInline muted />
      
      {!isRunning ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="z-10 flex flex-col items-center text-center p-8 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 max-w-lg mx-4"
        >
          <div className="bg-teal-500/20 p-4 rounded-full mb-6">
            <Wind className="w-12 h-12 text-teal-300" />
          </div>
          <h2 className="text-3xl font-light text-white mb-4">The Infinity Breath</h2>
          
          <div className="bg-black/20 rounded-2xl p-6 text-left mb-8 w-full">
            <h3 className="text-emerald-400 font-medium mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4"/> Why this works
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Severe anxiety traps you in cognitive loops. By forcing you to physically match your hand distance to the breathing rhythm, we engage your motor cortex, instantly breaking racing thoughts.
            </p>
            <h3 className="text-sky-400 font-medium mb-2">Instructions</h3>
            <ul className="text-slate-300 text-sm space-y-2 list-disc pl-4">
              <li>Raise both hands to the camera.</li>
              <li>Pull your hands apart to expand the orb (Inhale).</li>
              <li>Bring them close together to compress it (Exhale).</li>
            </ul>
          </div>

          <button 
            onClick={() => setIsRunning(true)}
            className="flex items-center gap-3 px-8 py-4 bg-teal-500 hover:bg-teal-400 text-white rounded-full font-medium transition-all transform hover:scale-105"
          >
            <Play className="w-5 h-5" /> Begin Journey
          </button>
        </motion.div>
      ) : (
        <>
          {/* Detailed Guidance Panel */}
          <div className="absolute top-8 left-8 z-20 w-72 bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl hidden md:block">
            <h3 className="text-white font-medium mb-2 border-b border-white/10 pb-2">How to play</h3>
            <ol className="text-slate-300 text-sm space-y-3 list-decimal pl-4">
              <li>Keep both index fingers visible.</li>
              <li>Watch the faint white <span className="text-white font-bold">Target Ring</span>.</li>
              <li>Pull hands apart precisely to match the ring's size.</li>
              <li>When you match perfectly, the orb turns <span className="text-emerald-400 font-bold">Green ✨</span>.</li>
            </ol>
            <div className="mt-4 p-3 bg-teal-500/10 rounded-xl border border-teal-500/20">
              <p className="text-teal-200 text-xs text-center">Focus completely on the physical movement.</p>
            </div>
          </div>

          {/* Header State Text */}
          <div className="absolute top-10 w-full flex flex-col items-center z-10 pointer-events-none">
            <h2 className="text-5xl font-light text-white tracking-widest drop-shadow-lg uppercase mb-2">
              {phase === 'inhale' ? 'Inhale' : phase === 'hold' ? 'Hold' : 'Exhale'}
            </h2>
            <p className={`text-lg transition-colors duration-500 ${isPerfect ? 'text-emerald-400' : 'text-slate-400'}`}>
              {handsVisible ? (isPerfect ? "Perfect Sync ✨" : "Match the outer ring...") : "Waiting for both hands..."}
            </p>
          </div>

          {!handsVisible && (
            <div className="absolute top-32 bg-amber-500/80 backdrop-blur-sm text-white px-6 py-3 rounded-full flex items-center gap-3 z-20 animate-bounce shadow-xl">
              <AlertCircle className="w-5 h-5" /> Please show both index fingers to the camera
            </div>
          )}

          {/* 3D Infinity Orb */}
          <div className="absolute inset-0 w-full h-full cursor-pointer">
            <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1.5} />
              <pointLight position={[-10, -10, -5]} intensity={1} color="#38bdf8" />
              <BreathingOrb handDistance={Math.max(0.1, handDistance)} phase={phase} targetDistance={targetDistance} isPerfect={isPerfect} />
              <Environment preset="city" />
            </Canvas>
          </div>

          <button 
            onClick={() => setIsRunning(false)}
            className="absolute bottom-8 right-8 z-20 bg-white/10 hover:bg-white/20 p-4 rounded-full text-white backdrop-blur-md transition-all border border-white/20"
          >
            <Pause className="w-6 h-6" />
          </button>
        </>
      )}
    </div>
  );
}
