import React, { useState, useEffect, useRef } from 'react';
import { GameSession, GameType } from '../../pages/MindGamesPage';
import { ArrowLeft } from 'lucide-react';

interface EmotionPatternMatchingProps {
  onComplete: (session: GameSession) => void;
  onBack: () => void;
}

interface EmotionCard {
  id: string;
  emotion: string;
  emoji: string;
  color: string;
}

interface CopingCard {
  id: string;
  strategy: string;
  description: string;
  color: string;
}

export const EmotionPatternMatching: React.FC<EmotionPatternMatchingProps> = ({ onComplete, onBack }) => {
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'complete'>('waiting');
  const [currentRound, setCurrentRound] = useState(1);
  const [score, setScore] = useState(0);
  const [anxietyBefore, setAnxietyBefore] = useState(5);
  const [anxietyAfter, setAnxietyAfter] = useState(5);
  const [startTime, setStartTime] = useState<number>(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [stressIndicators, setStressIndicators] = useState<string[]>([]);
  const [misidentifiedEmotions, setMisidentifiedEmotions] = useState<string[]>([]);
  const [showInstructions, setShowInstructions] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [selectedCoping, setSelectedCoping] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState<string | null>(null);
  
  const timerRef = useRef<number>();

  const emotions: EmotionCard[] = [
    { id: 'anxious', emotion: 'Anxious', emoji: '😰', color: '#F59E0B' },
    { id: 'sad', emotion: 'Sad', emoji: '😢', color: '#3B82F6' },
    { id: 'angry', emotion: 'Angry', emoji: '😠', color: '#EF4444' },
    { id: 'calm', emotion: 'Calm', emoji: '😌', color: '#10B981' },
    { id: 'excited', emotion: 'Excited', emoji: '🤩', color: '#8B5CF6' },
    { id: 'stressed', emotion: 'Stressed', emoji: '😫', color: '#F97316' }
  ];

  const copingStrategies: CopingCard[] = [
    { id: 'breathing', strategy: 'Deep Breathing', description: 'Calms nervous system and reduces anxiety', color: '#10B981' },
    { id: 'friend', strategy: 'Talk to Friend', description: 'Social support helps process emotions', color: '#3B82F6' },
    { id: 'walk', strategy: 'Take a Walk', description: 'Physical activity releases tension and endorphins', color: '#8B5CF6' },
    { id: 'music', strategy: 'Listen to Music', description: 'Music can regulate mood and emotions', color: '#EC4899' },
    { id: 'meditation', strategy: 'Meditation', description: 'Mindfulness helps observe emotions without judgment', color: '#06B6D4' },
    { id: 'journal', strategy: 'Write in Journal', description: 'Writing helps process and understand emotions', color: '#F59E0B' }
  ];

  const correctMatches: Record<string, string> = {
    'anxious': 'breathing',
    'sad': 'friend',
    'angry': 'walk',
    'calm': 'meditation',
    'excited': 'music',
    'stressed': 'journal'
  };

  const maxRounds = 6;

  useEffect(() => {
    if (showInstructions) return;
    
    setStartTime(Date.now());
    startRound();
  }, [showInstructions]);

  const startRound = () => {
    setTimeLeft(30);
    setSelectedEmotion(null);
    setSelectedCoping(null);
    setShowFeedback(null);
    
    timerRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTimeUp = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setStressIndicators(prev => [...prev, 'Time pressure caused stress']);
    
    if (currentRound < maxRounds) {
      setCurrentRound(prev => prev + 1);
      setTimeout(() => startRound(), 1000);
    } else {
      endGame();
    }
  };

  const handleEmotionSelect = (emotionId: string) => {
    if (selectedCoping) return; // Already made a selection
    
    setSelectedEmotion(emotionId);
    setReactionTimes(prev => [...prev, Date.now() - startTime]);
  };

  const handleCopingSelect = (copingId: string) => {
    if (!selectedEmotion) return;
    
    setSelectedCoping(copingId);
    
    const isCorrect = correctMatches[selectedEmotion] === copingId;
    const reactionTime = Date.now() - startTime;
    
    if (isCorrect) {
      setScore(prev => prev + 100);
      setShowFeedback('✅ Correct! Great emotional intelligence!');
    } else {
      setScore(prev => prev + 50);
      setMisidentifiedEmotions(prev => [...prev, selectedEmotion]);
      setShowFeedback('❌ Not quite right, but you\'re learning!');
    }
    
    setReactionTimes(prev => [...prev, reactionTime]);
    
    setTimeout(() => {
      if (currentRound < maxRounds) {
        setCurrentRound(prev => prev + 1);
        startRound();
      } else {
        endGame();
      }
    }, 2000);
  };

  const endGame = () => {
    setGameState('complete');
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    calculateFinalResults();
  };

  const calculateFinalResults = () => {
    const accuracy = Math.round((score / (maxRounds * 100)) * 100);
    
    // Calculate anxiety reduction based on performance
    let anxietyReduction = 0;
    if (accuracy >= 80) anxietyReduction = 3;
    else if (accuracy >= 60) anxietyReduction = 2;
    else if (accuracy >= 40) anxietyReduction = 1;
    
    setAnxietyAfter(Math.max(1, anxietyBefore - anxietyReduction));

    const session: GameSession = {
      gameType: 'emotion-matching' as GameType,
      duration: Math.round((Date.now() - startTime) / 1000 / 60), // minutes
      score: accuracy,
      anxietyBefore,
      anxietyAfter: anxietyBefore - anxietyReduction,
      timestamp: new Date().toISOString(),
      metrics: {
        reactionTime: reactionTimes,
        accuracy,
        hesitationCount: misidentifiedEmotions.length,
        stressIndicators
      }
    };

    setTimeout(() => onComplete(session), 3000);
  };

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
            🎭 Emotion Pattern Matching
          </h2>
          
          <div className="space-y-6">
            <div className="bg-green-500/20 p-6 rounded-lg border border-green-400/30">
              <h3 className="text-xl font-semibold mb-3 text-green-200">How to Play:</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>Select an emotion from the top row</li>
                <li>Match it with the best coping strategy below</li>
                <li>You have 30 seconds per round</li>
                <li>Complete 6 rounds to finish</li>
                <li>Learn why each strategy works</li>
              </ol>
            </div>

            <div className="bg-blue-500/20 p-6 rounded-lg border border-blue-400/30">
              <h3 className="text-xl font-semibold mb-3 text-blue-200">Therapeutic Benefit:</h3>
              <p className="text-gray-300">
                This game builds emotional intelligence by teaching you to recognize emotions and choose appropriate coping strategies. 
                It helps you develop a toolkit of healthy ways to manage different emotional states.
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
              <span className="text-lg font-bold text-green-300">{anxietyBefore}</span>
            </div>

            <button
              onClick={() => setShowInstructions(false)}
              className="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
            >
              Start Emotion Matching
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
          <h2 className="text-3xl font-bold mb-6 text-green-400">🎉 Emotion Matching Complete!</h2>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-green-500/20 p-4 rounded-lg border border-green-400/30">
              <div className="text-2xl font-bold text-green-300">{Math.round((score / (maxRounds * 100)) * 100)}%</div>
              <div className="text-gray-300">Accuracy</div>
            </div>
            <div className="bg-blue-500/20 p-4 rounded-lg border border-blue-400/30">
              <div className="text-2xl font-bold text-blue-300">{anxietyBefore - anxietyAfter}</div>
              <div className="text-gray-300">Anxiety Reduction</div>
            </div>
          </div>

          <div className="bg-gray-800/50 p-4 rounded-lg mb-6 border border-gray-600/30">
            <h3 className="font-semibold mb-2 text-white">AI Analysis:</h3>
            {misidentifiedEmotions.length === 0 ? (
              <p className="text-green-400">✅ Excellent emotional intelligence! You correctly identified all emotions and coping strategies.</p>
            ) : (
              <div className="text-left">
                <p className="text-orange-400 mb-2">📊 Learning Opportunities:</p>
                <ul className="list-disc list-inside text-sm text-gray-300">
                  <li>You struggled with: {misidentifiedEmotions.join(', ')}</li>
                  <li>Practice recognizing these emotions in daily life</li>
                  <li>Try the coping strategies you learned</li>
                </ul>
              </div>
            )}
          </div>

          <p className="text-gray-300 mb-4">
            Great job! You've built your emotional intelligence toolkit and learned effective coping strategies.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="absolute top-4 left-4 z-50 px-4 py-2 bg-white/10 backdrop-blur-lg text-white rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/20"
      >
        <ArrowLeft className="w-4 h-4 inline mr-2" />
        Back to Games
      </button>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Round {currentRound} of {maxRounds}</h2>
          <div className="text-3xl font-bold text-blue-400 mb-2">{timeLeft}s</div>
          <div className="text-lg text-gray-300">Score: {score}</div>
        </div>

        {/* Emotions Row */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-center mb-4 text-gray-300">Select an Emotion:</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {emotions.map((emotion) => (
              <button
                key={emotion.id}
                onClick={() => handleEmotionSelect(emotion.id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedEmotion === emotion.id
                    ? 'border-blue-400 bg-blue-500/20 scale-105'
                    : 'border-white/20 hover:border-white/40'
                }`}
                style={{ backgroundColor: selectedEmotion === emotion.id ? emotion.color + '20' : 'rgba(255, 255, 255, 0.05)' }}
              >
                <div className="text-4xl mb-2">{emotion.emoji}</div>
                <div className="text-sm font-semibold text-white">{emotion.emotion}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Coping Strategies Row */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-center mb-4 text-gray-300">Match with Coping Strategy:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {copingStrategies.map((strategy) => (
              <button
                key={strategy.id}
                onClick={() => handleCopingSelect(strategy.id)}
                disabled={!selectedEmotion}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedCoping === strategy.id
                    ? 'border-green-400 bg-green-500/20 scale-105'
                    : selectedEmotion
                    ? 'border-white/20 hover:border-white/40'
                    : 'border-white/10 opacity-50 cursor-not-allowed'
                }`}
                style={{ backgroundColor: selectedCoping === strategy.id ? strategy.color + '20' : 'rgba(255, 255, 255, 0.05)' }}
              >
                <div className="font-semibold text-white mb-2">{strategy.strategy}</div>
                <div className="text-sm text-gray-300">{strategy.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className="text-center">
            <div className="text-xl font-semibold text-white">{showFeedback}</div>
          </div>
        )}
      </div>
    </div>
  );
};
