import React, { useState, useEffect, useRef } from 'react';
import { GameSession, GameType } from '../../pages/MindGamesPage';
import { ArrowLeft } from 'lucide-react';

interface BreathingRhythmGameProps {
  onComplete: (session: GameSession) => void;
  onBack: () => void;
}

export const BreathingRhythmGame: React.FC<BreathingRhythmGameProps> = ({ onComplete, onBack }) => {
  const [gameState, setGameState] = useState<'waiting' | 'inhale' | 'exhale' | 'complete'>('waiting');
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [anxietyBefore, setAnxietyBefore] = useState(5);
  const [anxietyAfter, setAnxietyAfter] = useState(5);
  const [startTime, setStartTime] = useState<number>(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [stressIndicators, setStressIndicators] = useState<string[]>([]);
  const [breathCycle, setBreathCycle] = useState(0);
  const [circleScale, setCircleScale] = useState(1);
  const [showInstructions, setShowInstructions] = useState(true);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const breathStartTime = useRef<number>(0);
  const clickTimes = useRef<number[]>([]);

  const maxRounds = 10;
  const inhaleDuration = 4000; // 4 seconds
  const exhaleDuration = 6000; // 6 seconds

  useEffect(() => {
    if (showInstructions) return;
    
    setStartTime(Date.now());
    startBreathingCycle();
  }, [showInstructions]);

  const startBreathingCycle = () => {
    breathStartTime.current = Date.now();
    setGameState('inhale');
    setBreathCycle(prev => prev + 1);
    
    // Inhale phase
    setTimeout(() => {
      setGameState('exhale');
    }, inhaleDuration);
  };

  const handleCircleClick = () => {
    if (gameState !== 'exhale') {
      setStressIndicators(prev => [...prev, 'Clicked too early - rushing']);
      return;
    }

    const clickTime = Date.now();
    const cycleTime = clickTime - breathStartTime.current;
    const expectedTime = inhaleDuration + exhaleDuration;
    const accuracy = Math.abs(cycleTime - expectedTime);
    
    clickTimes.current.push(cycleTime);
    
    // Calculate score based on timing accuracy
    let points = 0;
    if (accuracy < 500) points = 100;
    else if (accuracy < 1000) points = 80;
    else if (accuracy < 1500) points = 60;
    else if (accuracy < 2000) points = 40;
    else points = 20;

    setScore(prev => prev + points);
    setReactionTimes(prev => [...prev, cycleTime]);

    // Check for stress indicators
    if (accuracy > 2000) {
      setStressIndicators(prev => [...prev, 'Poor timing accuracy - possible stress']);
    }

    if (round < maxRounds) {
      setRound(prev => prev + 1);
      setTimeout(() => startBreathingCycle(), 1000);
    } else {
      setGameState('complete');
      calculateFinalResults();
    }
  };

  const calculateFinalResults = () => {
    const avgReactionTime = reactionTimes.reduce((sum, time) => sum + time, 0) / reactionTimes.length;
    const accuracy = Math.round((score / (maxRounds * 100)) * 100);
    
    // Calculate anxiety reduction based on performance
    let anxietyReduction = 0;
    if (accuracy >= 80) anxietyReduction = 3;
    else if (accuracy >= 60) anxietyReduction = 2;
    else if (accuracy >= 40) anxietyReduction = 1;
    
    setAnxietyAfter(Math.max(1, anxietyBefore - anxietyReduction));

    const session: GameSession = {
      gameType: 'breathing' as GameType,
      duration: Math.round((Date.now() - startTime) / 1000 / 60), // minutes
      score: accuracy,
      anxietyBefore,
      anxietyAfter: anxietyBefore - anxietyReduction,
      timestamp: new Date().toISOString(),
      metrics: {
        reactionTime: reactionTimes,
        accuracy,
        hesitationCount: stressIndicators.length,
        stressIndicators
      }
    };

    setTimeout(() => onComplete(session), 2000);
  };

  const animateCircle = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const now = Date.now();
    const cycleTime = now - breathStartTime.current;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background gradient
    const gradient = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width/2);
    gradient.addColorStop(0, '#E0F2FE');
    gradient.addColorStop(1, '#B3E5FC');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate circle properties based on breathing phase
    let scale = 1;
    let color = '#3B82F6';
    
    if (gameState === 'inhale') {
      scale = 1 + (cycleTime / inhaleDuration) * 0.5; // Expand during inhale
      color = '#3B82F6'; // Blue for inhale
    } else if (gameState === 'exhale') {
      const exhaleProgress = (cycleTime - inhaleDuration) / exhaleDuration;
      scale = 1.5 - (exhaleProgress * 0.5); // Contract during exhale
      color = '#10B981'; // Green for exhale
    }

    setCircleScale(scale);

    // Draw breathing circle
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 50 * scale;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.7;
    ctx.fill();
    ctx.globalAlpha = 1;

    // Draw circle border
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw instructions
    ctx.fillStyle = '#374151';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    
    if (gameState === 'inhale') {
      ctx.fillText('Breathe In...', centerX, centerY - 100);
    } else if (gameState === 'exhale') {
      ctx.fillText('Breathe Out & Click', centerX, centerY - 100);
    }

    // Draw score and round info
    ctx.font = '18px Arial';
    ctx.fillText(`Round: ${round}/${maxRounds}`, centerX, centerY + 150);
    ctx.fillText(`Score: ${score}`, centerX, centerY + 180);

    animationRef.current = requestAnimationFrame(animateCircle);
  };

  useEffect(() => {
    if (!showInstructions) {
      animateCircle();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState, showInstructions]);

  if (showInstructions) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-6">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-4 left-4 z-50 px-4 py-2 bg-white/10 backdrop-blur-lg text-white rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/20"
        >
          <ArrowLeft className="w-4 h-4 inline mr-2" />
          Back to Games
        </button>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-2xl shadow-xl border border-white/20">
          <h2 className="text-3xl font-bold text-center mb-6 text-white">
            🫁 Breathing Rhythm Game
          </h2>
          
          <div className="space-y-6">
            <div className="bg-blue-500/20 p-6 rounded-lg border border-blue-400/30">
              <h3 className="text-xl font-semibold mb-3 text-blue-200">How to Play:</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>Watch the circle expand as you breathe in (4 seconds)</li>
                <li>Click the circle as you breathe out (6 seconds)</li>
                <li>Perfect timing gives you 100 points</li>
                <li>Complete 10 rounds to finish</li>
              </ol>
            </div>

            <div className="bg-green-500/20 p-6 rounded-lg border border-green-400/30">
              <h3 className="text-xl font-semibold mb-3 text-green-200">Therapeutic Benefit:</h3>
              <p className="text-gray-300">
                This game teaches you the 4-6 breathing pattern, scientifically proven to reduce anxiety. 
                The gamification makes breathing exercises engaging and helps you practice controlled breathing.
              </p>
            </div>

            <div className="flex items-center justify-center space-x-4">
              <label className="text-gray-300 font-semibold">Rate your anxiety level (1-10):</label>
              <input
                type="range"
                min="1"
                max="10"
                value={anxietyBefore}
                onChange={(e) => setAnxietyBefore(parseInt(e.target.value))}
                className="w-32"
              />
              <span className="text-lg font-bold text-blue-300">{anxietyBefore}</span>
            </div>

            <button
              onClick={() => setShowInstructions(false)}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
            >
              Start Breathing Exercise
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'complete') {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-2xl shadow-xl text-center border border-white/20">
          <h2 className="text-3xl font-bold mb-6 text-green-400">🎉 Breathing Exercise Complete!</h2>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-500/20 p-4 rounded-lg border border-blue-400/30">
              <div className="text-2xl font-bold text-blue-300">{Math.round((score / (maxRounds * 100)) * 100)}%</div>
              <div className="text-gray-300">Accuracy</div>
            </div>
            <div className="bg-green-500/20 p-4 rounded-lg border border-green-400/30">
              <div className="text-2xl font-bold text-green-300">{anxietyBefore - anxietyAfter}</div>
              <div className="text-gray-300">Anxiety Reduction</div>
            </div>
          </div>

          <div className="bg-gray-800/50 p-4 rounded-lg mb-6 border border-gray-600/30">
            <h3 className="font-semibold mb-2 text-white">AI Analysis:</h3>
            {stressIndicators.length === 0 ? (
              <p className="text-green-400">✅ Excellent breathing control! You maintained perfect rhythm throughout.</p>
            ) : (
              <div className="text-left">
                <p className="text-orange-400 mb-2">⚠️ Stress indicators detected:</p>
                <ul className="list-disc list-inside text-sm text-gray-300">
                  {stressIndicators.map((indicator, index) => (
                    <li key={index}>{indicator}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <p className="text-gray-300 mb-4">
            Great job! You've practiced controlled breathing which helps reduce anxiety and stress.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="absolute top-4 left-4 z-50 px-4 py-2 bg-white/10 backdrop-blur-lg text-white rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/20"
      >
        <ArrowLeft className="w-4 h-4 inline mr-2" />
        Back to Games
      </button>

      <div className="text-center">
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          onClick={handleCircleClick}
          className="border-2 border-white/20 rounded-xl shadow-lg cursor-pointer"
        />
        
        <div className="mt-6 text-gray-300">
          <p>Click the circle when it's fully contracted during exhale</p>
          <p className="text-sm mt-2">Round {round} of {maxRounds}</p>
        </div>
      </div>
    </div>
  );
};
