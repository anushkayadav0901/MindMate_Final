import React, { useState } from 'react';
import { VREnvironment } from './VREnvironments/types';

interface TherapyGuideProps {
  enabled: boolean;
  volume: number;
  onToggle: (enabled: boolean) => void;
  onVolumeChange: (volume: number) => void;
  environment: VREnvironment;
}

export const TherapyGuide: React.FC<TherapyGuideProps> = ({
  enabled,
  volume,
  onToggle,
  onVolumeChange,
  environment
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute bottom-6 right-6 flex flex-col items-end gap-2">
      {/* Settings Panel */}
      {isOpen && (
        <div className="mb-2 p-4 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
          <div className="flex flex-col gap-4 w-64">
            {/* Voice Guidance Toggle */}
            <div className="flex items-center justify-between">
              <label className="text-white text-sm font-medium">Voice Guidance</label>
              <button
                onClick={() => onToggle(!enabled)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  enabled ? 'bg-indigo-500' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                    enabled ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Volume Slider */}
            {enabled && (
              <div className="flex items-center gap-4">
                <label className="text-white text-sm font-medium">Volume</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                  className="flex-1"
                />
              </div>
            )}

            {/* Environment Info */}
            <div className="border-t border-white/10 pt-4">
              <h4 className="text-white text-sm font-medium mb-2">About this Environment</h4>
              <p className="text-white/70 text-sm">{environment.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Settings Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-3 rounded-lg transition-colors ${
          isOpen ? 'bg-indigo-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
        }`}
        title="Settings"
      >
        ⚙️
      </button>
    </div>
  );
  
};