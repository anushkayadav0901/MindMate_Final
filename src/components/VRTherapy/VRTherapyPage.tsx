import React, { useState } from 'react';
import { VRScene } from './VRScene';
import { VREnvironmentSelector } from './VREnvironmentSelector';
import { SessionSummary } from './SessionSummary';
import { VREnvironment } from './VREnvironments/types';
import { environments } from '../../utils/vrTherapyUtils';

interface SessionData {
  environmentId: string;
  duration: number;
  peakAnxiety: number;
  averageAnxiety: number;
  anxietyHistory: number[];
  completed: boolean;
}

interface VRTherapyPageProps {
  onSessionComplete?: () => void;
}

export const VRTherapyPage: React.FC<VRTherapyPageProps> = ({ onSessionComplete }) => {
  const [selectedEnvironment, setSelectedEnvironment] = useState<VREnvironment | null>(null);
  const [sessionActive, setSessionActive] = useState(false);
  const [showSessionSummary, setShowSessionSummary] = useState(false);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);

  const handleStartSession = () => {
    if (selectedEnvironment) {
      setSessionActive(true);
    }
  };

  const handleEndSession = () => {
    setSessionActive(false);
  };

  const handleSessionData = (data: SessionData) => {
    setSessionData(data);
    setShowSessionSummary(true);
  };

  const handleCloseSummary = () => {
    setShowSessionSummary(false);
    setSessionData(null);
    setSelectedEnvironment(null);
    if (onSessionComplete) {
      onSessionComplete();
    }
  };

  const handleStartNewSession = () => {
    setShowSessionSummary(false);
    setSessionData(null);
    setSessionActive(false);
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
                  onSessionData={handleSessionData}
                />
              </div>
            </>
          ) : (
            <VREnvironmentSelector onSelect={setSelectedEnvironment} />
          )}

          {/* Instructions */}
          <div className="bg-gray-800/50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">How to Use VR Therapy</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>Select a therapeutic environment that matches your current needs</li>
              <li>Click "Start Therapy Session" to begin your guided experience</li>
              <li>Use the anxiety slider to track your emotional state in real-time</li>
              <li>Follow the guided instructions that appear during your session</li>
              <li>Practice breathing exercises when anxiety levels rise (7+ on the scale)</li>
              <li>Use mouse controls to explore the environment:</li>
              <li className="ml-6">- Left click + drag to rotate the view</li>
              <li className="ml-6">- Right click + drag to pan</li>
              <li className="ml-6">- Scroll to zoom in/out</li>
              <li>End your session anytime to see your progress and achievements</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Session Summary Modal */}
      {showSessionSummary && sessionData && (
        <SessionSummary
          sessionData={sessionData}
          onClose={handleCloseSummary}
          onStartNewSession={handleStartNewSession}
        />
      )}
    </div>
  );
};
