import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { PeacefulGarden } from './VREnvironments/PeacefulGarden';
import { CollegeCampus } from './VREnvironments/CollegeCampus';
import { ExamHall } from './VREnvironments/ExamHall';
import { HomeRoom } from './VREnvironments/HomeRoom';
import { VRErrorBoundary } from './VRErrorBoundary';
import { TherapeuticOverlay } from './TherapeuticOverlay';

interface VRSceneProps {
  environmentId: string;
  onSessionStart?: () => void;
  onSessionEnd?: () => void;
  onSessionData?: (data: SessionData) => void;
}

interface SessionData {
  environmentId: string;
  duration: number;
  peakAnxiety: number;
  averageAnxiety: number;
  anxietyHistory: number[];
  completed: boolean;
}

export const VRScene: React.FC<VRSceneProps> = ({ 
  environmentId, 
  onSessionStart,
  onSessionEnd,
  onSessionData
}) => {
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState(0);
  const [anxietyHistory, setAnxietyHistory] = useState<number[]>([]);
  const [currentAnxiety, setCurrentAnxiety] = useState(5);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioLoopIntervalRef = useRef<NodeJS.Timeout | null>(null);
  // Session management functions
  const handleSessionStart = () => {
    setSessionActive(true);
    setSessionStartTime(Date.now());
    setAnxietyHistory([]);
    setCurrentAnxiety(5);
    startAmbientAudio();
    if (onSessionStart) onSessionStart();
  };

  const handleSessionEnd = () => {
    setSessionActive(false);
    stopAmbientAudio();
    
    // Calculate session data
    const duration = Math.floor((Date.now() - sessionStartTime) / 1000);
    const peakAnxiety = Math.max(...anxietyHistory, currentAnxiety);
    const averageAnxiety = anxietyHistory.length > 0 
      ? anxietyHistory.reduce((sum, val) => sum + val, 0) / anxietyHistory.length 
      : currentAnxiety;

    const sessionData: SessionData = {
      environmentId,
      duration,
      peakAnxiety,
      averageAnxiety,
      anxietyHistory: [...anxietyHistory, currentAnxiety],
      completed: true
    };

    if (onSessionData) onSessionData(sessionData);
    if (onSessionEnd) onSessionEnd();
  };

  const handleAnxietyChange = (level: number) => {
    setCurrentAnxiety(level);
    setAnxietyHistory(prev => [...prev, level]);
  };

  // Ambient audio management
  const startAmbientAudio = () => {
    const audioFiles: Record<string, string> = {
      'peaceful-garden': '/audio/garden-ambience.mp3',
      'college-campus': '/audio/campus-ambience.mp3', // Fixed: was campus-ambienc.mp3
      'exam-hall': '/audio/exam-ambience.mp3',
      'home-room': '/audio/home-ambience.mp3'
    };

    const audioFile = audioFiles[environmentId];
    if (audioFile && !audioRef.current) {
      console.log(`🎵 Starting ambient audio: ${audioFile}`);
      
      audioRef.current = new Audio(audioFile);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
      audioRef.current.preload = 'auto';
      
      // Ensure seamless looping
      audioRef.current.addEventListener('ended', () => {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(console.warn);
        }
      });
      
      // Add event listeners for better debugging
      audioRef.current.addEventListener('loadstart', () => {
        console.log('🎵 Audio loading started');
      });
      
      audioRef.current.addEventListener('canplaythrough', () => {
        console.log('🎵 Audio ready to play');
      });
      
      audioRef.current.addEventListener('error', (e) => {
        console.error('🎵 Audio error:', e);
      });
      
      audioRef.current.addEventListener('play', () => {
        console.log('🎵 Audio started playing');
      });
      
      audioRef.current.addEventListener('timeupdate', () => {
        // Check if we're near the end and need to loop
        if (audioRef.current && audioRef.current.duration > 0) {
          const timeLeft = audioRef.current.duration - audioRef.current.currentTime;
          if (timeLeft < 0.5) { // Less than 0.5 seconds left
            console.log('🎵 Audio near end, preparing to loop');
          }
        }
      });
      
      // Play with user interaction requirement handling
      audioRef.current.play().catch((error) => {
        console.warn('🎵 Audio play failed (user interaction required):', error);
        // Try to play after user interaction
        document.addEventListener('click', () => {
          if (audioRef.current && audioRef.current.paused) {
            audioRef.current.play().catch(console.warn);
          }
        }, { once: true });
      });

      // Backup looping mechanism - check every 5 seconds if audio is still playing
      audioLoopIntervalRef.current = setInterval(() => {
        if (audioRef.current && audioRef.current.paused) {
          console.log('🎵 Audio paused, restarting...');
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(console.warn);
        }
      }, 5000);
    }
  };

  const stopAmbientAudio = () => {
    if (audioRef.current) {
      console.log('🎵 Stopping ambient audio');
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    
    // Clear the backup looping interval
    if (audioLoopIntervalRef.current) {
      clearInterval(audioLoopIntervalRef.current);
      audioLoopIntervalRef.current = null;
    }
  };

  // Volume control function
  const adjustAudioVolume = (volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, volume));
    }
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      stopAmbientAudio();
      if (audioLoopIntervalRef.current) {
        clearInterval(audioLoopIntervalRef.current);
      }
    };
  }, []);

  const renderEnvironment = () => {
    switch (environmentId) {
      case 'peaceful-garden':
        return <PeacefulGarden />;
      case 'college-campus':
        return <CollegeCampus />;
      case 'exam-hall':
        return <ExamHall />;
      case 'home-room':
        return <HomeRoom />;
      default:
        return <PeacefulGarden />;
    }
  };

  return (
    <div className="w-full h-[70vh] relative">
      {/* Start Session Button */}
      {!sessionActive && (
        <button 
          onClick={handleSessionStart}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 
                     bg-indigo-600 text-white font-bold rounded-xl shadow-lg 
                     hover:bg-indigo-700 transition-colors z-50"
        >
          Start Therapy Session
        </button>
      )}

      {/* Therapeutic Overlay */}
      {sessionActive && (
        <TherapeuticOverlay
          environmentId={environmentId}
          sessionStartTime={sessionStartTime}
          onAnxietyChange={handleAnxietyChange}
          onSessionEnd={handleSessionEnd}
          onAudioVolumeChange={adjustAudioVolume}
        />
      )}
      
      <Canvas
        camera={{ position: [0, 1.6, 5], fov: 75 }}
        shadows
        style={{ background: 'linear-gradient(to bottom, #1a1a2e, #16213e)' }}
      >
        <React.Suspense fallback={
          <mesh>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshStandardMaterial color="#666" />
          </mesh>
        }>
          <VRErrorBoundary>
            {renderEnvironment()}
          </VRErrorBoundary>
          
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxPolarAngle={Math.PI / 2}
            minDistance={2}
            maxDistance={15}
          />
          
          {/* Ambient light */}
          <ambientLight intensity={0.5} />
          
          {/* Directional light (sun) */}
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
          />

          {/* Stars background */}
          <Stars radius={100} depth={50} count={5000} factor={4} fade speed={1} />
        </React.Suspense>
      </Canvas>
    </div>
  );
}