import React, { useState, useEffect, useRef } from 'react';
import { speakText } from '../../utils/vrTherapyUtils';

interface TherapeuticOverlayProps {
  environmentId: string;
  sessionStartTime: number;
  onAnxietyChange: (level: number) => void;
  onSessionEnd: () => void;
  onAudioVolumeChange?: (volume: number) => void;
}

interface GuidanceMessage {
  text: string;
  timing: number;
  type: 'instruction' | 'encouragement' | 'breathing' | 'grounding';
}

export const TherapeuticOverlay: React.FC<TherapeuticOverlayProps> = ({
  environmentId,
  sessionStartTime,
  onAnxietyChange,
  onSessionEnd,
  onAudioVolumeChange
}) => {
  const [anxietyLevel, setAnxietyLevel] = useState(5);
  const [currentMessage, setCurrentMessage] = useState<GuidanceMessage | null>(null);
  const [showBreathingExercise, setShowBreathingExercise] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathingCount, setBreathingCount] = useState(0);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [showCrisisIntervention, setShowCrisisIntervention] = useState(false);
  const [audioVolume, setAudioVolume] = useState(0.3);
  const [showAudioControls, setShowAudioControls] = useState(false);
  
  const messageIndexRef = useRef(0);
  const breathingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Guidance messages for each environment
  const guidanceMessages: Record<string, GuidanceMessage[]> = {
    'peaceful-garden': [
      { text: 'Welcome to your peaceful garden. Take a deep breath and look around.', timing: 0, type: 'instruction' },
      { text: 'Notice the gentle colors and shapes around you. Feel yourself becoming calmer.', timing: 30, type: 'encouragement' },
      { text: 'Focus on the colors. Let the calmness flow through you. Release tension.', timing: 60, type: 'grounding' },
      { text: 'Breathe in for 4 counts... hold... and breathe out for 4 counts.', timing: 90, type: 'breathing' },
      { text: 'You are safe here. This is your sanctuary. You can return here anytime.', timing: 120, type: 'encouragement' }
    ],
    'college-campus': [
      { text: 'You are standing in a college campus. This is a safe practice space.', timing: 0, type: 'instruction' },
      { text: 'Imagine walking confidently through the corridors. You belong here.', timing: 30, type: 'encouragement' },
      { text: 'Practice greeting someone. Say "Hello, how are you?" in your mind.', timing: 60, type: 'instruction' },
      { text: 'Visualize a successful interaction. You are capable and confident.', timing: 90, type: 'encouragement' },
      { text: 'Great job! With each practice, social situations become easier.', timing: 120, type: 'encouragement' }
    ],
    'exam-hall': [
      { text: 'You are in an exam hall. Notice any anxiety rising - that is normal.', timing: 0, type: 'grounding' },
      { text: 'Notice the desks. This is just a space, not a threat. Take 3 deep breaths.', timing: 30, type: 'instruction' },
      { text: 'Take slow breaths. You have prepared. You are capable.', timing: 60, type: 'breathing' },
      { text: 'Anxiety is just energy. Channel it into focus and determination.', timing: 90, type: 'encouragement' },
      { text: 'You have successfully faced your fear. Each exposure makes you stronger.', timing: 120, type: 'encouragement' }
    ],
    'home-room': [
      { text: 'Welcome home. This is your safe space to relax and recharge.', timing: 0, type: 'instruction' },
      { text: 'Feel the comfort surrounding you. You are protected here.', timing: 30, type: 'grounding' },
      { text: 'This is your safe space. Feel the comfort. You are protected here.', timing: 60, type: 'encouragement' },
      { text: 'Let all tension melt away. Your mind and body deserve rest.', timing: 90, type: 'encouragement' }
    ]
  };

  // Update session duration
  useEffect(() => {
    durationIntervalRef.current = setInterval(() => {
      setSessionDuration(Math.floor((Date.now() - sessionStartTime) / 1000));
    }, 1000);

    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, [sessionStartTime]);

  // Show guidance messages
  useEffect(() => {
    const messages = guidanceMessages[environmentId] || [];
    if (messages.length === 0) return;

    const checkForNextMessage = () => {
      const currentIndex = messageIndexRef.current;
      if (currentIndex < messages.length) {
        const message = messages[currentIndex];
        if (sessionDuration >= message.timing) {
          setCurrentMessage(message);
          speakText(message.text);
          messageIndexRef.current++;
          
          // Auto-hide message after 8 seconds
          setTimeout(() => {
            setCurrentMessage(null);
          }, 8000);
        }
      }
    };

    const messageInterval = setInterval(checkForNextMessage, 1000);
    return () => clearInterval(messageInterval);
  }, [environmentId, sessionDuration]);

  // Handle anxiety level changes
  const handleAnxietyChange = (level: number) => {
    setAnxietyLevel(level);
    onAnxietyChange(level);

    // Trigger breathing exercise for high anxiety
    if (level >= 7 && !showBreathingExercise) {
      setShowBreathingExercise(true);
      startBreathingExercise();
    } else if (level < 7 && showBreathingExercise) {
      setShowBreathingExercise(false);
      stopBreathingExercise();
    }

    // Crisis intervention for extreme anxiety
    if (level >= 9) {
      setShowCrisisIntervention(true);
    } else {
      setShowCrisisIntervention(false);
    }
  };

  // Breathing exercise functions
  const startBreathingExercise = () => {
    let count = 0;
    setBreathingPhase('inhale');
    setBreathingCount(0);

    breathingIntervalRef.current = setInterval(() => {
      count++;
      setBreathingCount(count);

      if (count <= 4) {
        setBreathingPhase('inhale');
      } else if (count <= 8) {
        setBreathingPhase('hold');
      } else if (count <= 14) {
        setBreathingPhase('exhale');
      } else {
        count = 0;
        setBreathingCount(0);
        setBreathingPhase('inhale');
      }
    }, 1000);
  };

  const stopBreathingExercise = () => {
    if (breathingIntervalRef.current) {
      clearInterval(breathingIntervalRef.current);
      breathingIntervalRef.current = null;
    }
  };

  // Crisis intervention
  const handleCrisisExit = () => {
    setShowCrisisIntervention(false);
    onSessionEnd();
  };

  const handleAudioVolumeChange = (volume: number) => {
    setAudioVolume(volume);
    if (onAudioVolumeChange) {
      onAudioVolumeChange(volume);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (breathingIntervalRef.current) {
        clearInterval(breathingIntervalRef.current);
      }
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getAnxietyColor = (level: number) => {
    if (level <= 3) return 'text-green-400';
    if (level <= 6) return 'text-yellow-400';
    if (level <= 8) return 'text-orange-400';
    return 'text-red-400';
  };

  const getAnxietyLabel = (level: number) => {
    if (level <= 2) return 'Very Calm';
    if (level <= 4) return 'Calm';
    if (level <= 6) return 'Moderate';
    if (level <= 8) return 'Anxious';
    return 'Very Anxious';
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-50">
      {/* Crisis Intervention Overlay */}
      {showCrisisIntervention && (
        <div className="absolute inset-0 bg-red-900/90 flex items-center justify-center pointer-events-auto">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
            <div className="text-6xl mb-4">🆘</div>
            <h2 className="text-2xl font-bold text-red-600 mb-4">You're Safe</h2>
            <p className="text-gray-700 mb-6">
              This is just a simulation. You are in control. Take deep breaths and remember you can exit anytime.
            </p>
            <div className="space-y-3">
              <button
                onClick={handleCrisisExit}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Exit to Safe Space
              </button>
              <p className="text-sm text-gray-600">
                Crisis Helpline: KIRAN 1800-599-0019
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Therapeutic UI */}
      <div className="pointer-events-auto">
        {/* Top Status Bar */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2">
            <div className="text-white text-sm">
              <span className="font-semibold">Session:</span> {formatDuration(sessionDuration)}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Audio Control Button */}
            <button
              onClick={() => setShowAudioControls(!showAudioControls)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-semibold transition-colors"
              title="Audio Controls"
            >
              🎵
            </button>
            
            <button
              onClick={onSessionEnd}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              End Session
            </button>
          </div>
        </div>

        {/* Audio Controls Panel */}
        {showAudioControls && (
          <div className="absolute top-16 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-4">
            <div className="text-white text-sm mb-2">Audio Volume</div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={audioVolume}
              onChange={(e) => handleAudioVolumeChange(parseFloat(e.target.value))}
              className="w-32 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-white text-xs mt-1">
              {Math.round(audioVolume * 100)}%
            </div>
          </div>
        )}

        {/* Anxiety Level Slider */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-lg p-4">
          <div className="text-center mb-2">
            <div className={`text-lg font-semibold ${getAnxietyColor(anxietyLevel)}`}>
              {getAnxietyLabel(anxietyLevel)} ({anxietyLevel}/10)
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            value={anxietyLevel}
            onChange={(e) => handleAnxietyChange(parseInt(e.target.value))}
            className="w-48 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #10b981 0%, #f59e0b 50%, #ef4444 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Calm</span>
            <span>Anxious</span>
          </div>
        </div>

        {/* Current Guidance Message */}
        {currentMessage && (
          <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2">
            <div className="bg-black/70 backdrop-blur-sm rounded-xl p-6 max-w-md mx-4">
              <div className="flex items-center mb-2">
                <div className="text-2xl mr-3">
                  {currentMessage.type === 'breathing' && '🫁'}
                  {currentMessage.type === 'encouragement' && '💪'}
                  {currentMessage.type === 'instruction' && '📝'}
                  {currentMessage.type === 'grounding' && '🌱'}
                </div>
                <div className="text-sm text-gray-300 uppercase tracking-wide">
                  {currentMessage.type}
                </div>
              </div>
              <p className="text-white text-lg leading-relaxed">
                {currentMessage.text}
              </p>
            </div>
          </div>
        )}

        {/* Breathing Exercise */}
        {showBreathingExercise && (
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
            <div className="bg-blue-900/80 backdrop-blur-sm rounded-2xl p-6 text-center">
              <h3 className="text-white text-xl font-semibold mb-4">Breathing Exercise</h3>
              <div className="relative w-32 h-32 mx-auto mb-4">
                <div
                  className={`absolute inset-0 rounded-full border-4 transition-all duration-1000 ${
                    breathingPhase === 'inhale' ? 'border-blue-400 scale-110' :
                    breathingPhase === 'hold' ? 'border-yellow-400 scale-125' :
                    'border-green-400 scale-100'
                  }`}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-lg font-semibold">
                    {breathingPhase === 'inhale' && 'Breathe In'}
                    {breathingPhase === 'hold' && 'Hold'}
                    {breathingPhase === 'exhale' && 'Breathe Out'}
                  </span>
                </div>
              </div>
              <p className="text-blue-200 text-sm">
                Follow the circle: Inhale (4s) → Hold (4s) → Exhale (6s)
              </p>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3">
          <div className="text-white text-sm">
            <div className="font-semibold mb-1">Controls:</div>
            <div>• Drag to look around</div>
            <div>• Scroll to zoom</div>
            <div>• Adjust anxiety level above</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
      `}</style>
    </div>
  );
};
