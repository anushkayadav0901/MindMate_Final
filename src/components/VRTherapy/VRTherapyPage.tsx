import React, { useState } from 'react';
import { VRScene } from './VRScene';
import { VREnvironmentSelector } from './VREnvironmentSelector';
import { VREnvironment } from './VREnvironments/types';
import { environments } from '../../utils/vrTherapyUtils';

interface VRTherapyPageProps {
  onSessionComplete?: () => void;
}

export const VRTherapyPage: React.FC<VRTherapyPageProps> = ({ onSessionComplete }) => {
  const [selectedEnvironment, setSelectedEnvironment] = useState<VREnvironment | null>(null);
  const [sessionActive, setSessionActive] = useState(false);

  const handleStartSession = () => {
    if (selectedEnvironment) {
      setSessionActive(true);
    }
  };

  const handleEndSession = () => {
    setSessionActive(false);
    if (onSessionComplete) {
      onSessionComplete();
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">VR Therapy Session</h1>
        
        <div className="space-y-8">
          {selectedEnvironment ? (
            <>
              <button
                onClick={() => setSelectedEnvironment(null)}
                className="mb-4 px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 
                         rounded-lg transition-colors"
              >
                ← Back to environments
              </button>
              
              <div className="relative bg-gray-800 rounded-2xl overflow-hidden">
                <VRScene 
                  environmentId={selectedEnvironment.id}
                  onSessionStart={handleStartSession}
                  onSessionEnd={handleEndSession}
                />
              </div>
            </>
          ) : (
            <VREnvironmentSelector onSelect={setSelectedEnvironment} />
          )}

          {/* Instructions */}
          <div className="bg-gray-800/50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">How to Use</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>Select an environment from the options above</li>
              <li>Click "Start Experience" to begin</li>
              <li>Use your mouse to look around:</li>
              <li className="ml-6">- Left click + drag to rotate the view</li>
              <li className="ml-6">- Right click + drag to pan</li>
              <li className="ml-6">- Scroll to zoom in/out</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
