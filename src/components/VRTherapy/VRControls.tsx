import React from 'react';

interface VRControlsProps {
  sessionActive: boolean;
  onPause: () => void;
  onResume: () => void;
  onEnd: () => void;
  elapsedTime: number;
}

export const VRControls: React.FC<VRControlsProps> = ({
  sessionActive,
  onPause,
  onResume,
  onEnd,
  elapsedTime
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 flex items-center justify-between">
      <div className="text-2xl font-bold text-indigo-600">
        {formatTime(elapsedTime)}
      </div>
      <div className="flex gap-3">
        {sessionActive ? (
          <>
            <button
              onClick={onPause}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 
                       transition-colors font-semibold"
            >
              ⏸️ Pause
            </button>
            <button
              onClick={onEnd}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 
                       transition-colors font-semibold"
            >
              ⏹️ End Session
            </button>
          </>
        ) : (
          <button
            onClick={onResume}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 
                     transition-colors font-semibold"
          >
            ▶️ Resume
          </button>
        )}
      </div>
    </div>
  );
};