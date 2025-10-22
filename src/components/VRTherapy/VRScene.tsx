import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { PeacefulGarden } from './VREnvironments/PeacefulGarden';
import { CollegeCampus } from './VREnvironments/CollegeCampus';
import { ExamHall } from './VREnvironments/ExamHall';
import { HomeRoom } from './VREnvironments/HomeRoom';
import { VRErrorBoundary } from './VRErrorBoundary';

interface VRSceneProps {
  environmentId: string;
  onSessionStart?: () => void;
  onSessionEnd?: () => void;
}

export const VRScene: React.FC<VRSceneProps> = ({ 
  environmentId, 
  onSessionStart,
  onSessionEnd 
}) => {
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
      {/* Debug Controls */}
      <button 
        onClick={onSessionStart}
        onDoubleClick={onSessionEnd}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 
                   bg-indigo-600 text-white font-bold rounded-xl shadow-lg 
                   hover:bg-indigo-700 transition-colors z-50"
      >
        Start Experience
      </button>
      
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