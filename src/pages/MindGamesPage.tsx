import React, { useState, useEffect } from 'react';
import { BreathingRhythmGame } from '../components/MindGames/BreathingRhythmGame';
import { WorryBubblePop } from '../components/MindGames/WorryBubblePop';
import { EmotionPatternMatching } from '../components/MindGames/EmotionPatternMatching';
import { MindfulMaze } from '../components/MindGames/MindfulMaze';
import { GameAnalysis } from '../components/MindGames/GameAnalysis';
import { Wind, Cloud, Heart, Target, ArrowLeft, Award, Clock, TrendingUp } from 'lucide-react';

export type GameType = 'breathing' | 'worry-bubble' | 'emotion-matching' | 'mindful-maze';

export interface GameSession {
  gameType: GameType;
  duration: number;
  score: number;
  anxietyBefore: number;
  anxietyAfter: number;
  timestamp: string;
  metrics: {
    reactionTime: number[];
    accuracy: number;
    hesitationCount: number;
    stressIndicators: string[];
  };
}

export const MindGamesPage: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null);
  const [gameSessions, setGameSessions] = useState<GameSession[]>([]);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const games = [
    {
      id: 'breathing' as GameType,
      title: 'Breathing Rhythm',
      description: 'Master controlled breathing to reduce anxiety',
      icon: Wind,
      gradient: 'from-blue-500 to-blue-700',
      therapeuticBenefit: 'Anxiety Reduction',
      recommendedFor: 'High anxiety, panic attacks, exam stress'
    },
    {
      id: 'worry-bubble' as GameType,
      title: 'Worry Bubble Pop',
      description: 'Release negative thoughts with positive affirmations',
      icon: Cloud,
      gradient: 'from-purple-500 to-purple-700',
      therapeuticBenefit: 'Cognitive Restructuring',
      recommendedFor: 'Overthinking, negative thoughts, self-doubt'
    },
    {
      id: 'emotion-matching' as GameType,
      title: 'Emotion Pattern Matching',
      description: 'Build emotional intelligence and coping strategies',
      icon: Heart,
      gradient: 'from-green-500 to-green-700',
      therapeuticBenefit: 'Emotional Intelligence',
      recommendedFor: 'Emotional regulation, social anxiety, mood swings'
    },
    {
      id: 'mindful-maze' as GameType,
      title: 'Mindful Maze',
      description: 'Practice focus and mindfulness through gentle navigation',
      icon: Target,
      gradient: 'from-orange-500 to-orange-700',
      therapeuticBenefit: 'Focus Training',
      recommendedFor: 'ADHD, racing thoughts, focus issues'
    }
  ];

  // Load game sessions from localStorage
  useEffect(() => {
    const savedSessions = localStorage.getItem('mindGamesSessions');
    if (savedSessions) {
      setGameSessions(JSON.parse(savedSessions));
    }
  }, []);

  // Save game sessions to localStorage
  useEffect(() => {
    localStorage.setItem('mindGamesSessions', JSON.stringify(gameSessions));
  }, [gameSessions]);

  const handleGameComplete = (session: GameSession) => {
    setGameSessions(prev => [...prev, session]);
    setSelectedGame(null);
    setShowAnalysis(true);
  };

  const getRecommendedGames = () => {
    // Simple recommendation based on recent anxiety levels
    const recentSessions = gameSessions.slice(-5);
    const avgAnxiety = recentSessions.length > 0 
      ? recentSessions.reduce((sum, s) => sum + s.anxietyBefore, 0) / recentSessions.length
      : 5;

    if (avgAnxiety >= 7) return ['breathing', 'worry-bubble'];
    if (avgAnxiety >= 5) return ['emotion-matching', 'breathing'];
    return ['mindful-maze', 'emotion-matching'];
  };

  const getAnxietyReduction = () => {
    if (gameSessions.length === 0) return 0;
    const totalReduction = gameSessions.reduce((sum, session) => 
      sum + (session.anxietyBefore - session.anxietyAfter), 0);
    return Math.round(totalReduction / gameSessions.length);
  };

  const getTotalPlayTime = () => {
    return gameSessions.reduce((sum, session) => sum + session.duration, 0);
  };

  const renderGame = () => {
    switch (selectedGame) {
      case 'breathing':
        return <BreathingRhythmGame onComplete={handleGameComplete} onBack={() => setSelectedGame(null)} />;
      case 'worry-bubble':
        return <WorryBubblePop onComplete={handleGameComplete} onBack={() => setSelectedGame(null)} />;
      case 'emotion-matching':
        return <EmotionPatternMatching onComplete={handleGameComplete} onBack={() => setSelectedGame(null)} />;
      case 'mindful-maze':
        return <MindfulMaze onComplete={handleGameComplete} onBack={() => setSelectedGame(null)} />;
      default:
        return null;
    }
  };

  if (selectedGame) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        {renderGame()}
      </div>
    );
  }

  if (showAnalysis) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setShowAnalysis(false)}
            className="mb-6 px-4 py-2 bg-white/10 backdrop-blur-lg text-white rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/20"
          >
            <ArrowLeft className="w-4 h-4 inline mr-2" />
            Back to Games
          </button>
          <GameAnalysis sessions={gameSessions} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            MindGames Therapy
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Therapeutic mini-games designed by psychologists to reduce anxiety and build mental resilience
          </p>
          
          {/* Progress Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-center mb-3">
                <Award className="w-8 h-8 text-yellow-400 mr-3" />
                <div className="text-3xl font-bold text-white">{gameSessions.length}</div>
              </div>
              <div className="text-gray-300 text-center">Sessions Completed</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-center mb-3">
                <TrendingUp className="w-8 h-8 text-green-400 mr-3" />
                <div className="text-3xl font-bold text-white">{getAnxietyReduction()}%</div>
              </div>
              <div className="text-gray-300 text-center">Avg Anxiety Reduction</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-center mb-3">
                <Clock className="w-8 h-8 text-blue-400 mr-3" />
                <div className="text-3xl font-bold text-white">{getTotalPlayTime()}</div>
              </div>
              <div className="text-gray-300 text-center">Total Play Time (min)</div>
            </div>
          </div>
        </div>

        {/* Game Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {games.map((game) => {
            const isRecommended = getRecommendedGames().includes(game.id);
            const recentSessions = gameSessions.filter(s => s.gameType === game.id).slice(-3);
            const avgScore = recentSessions.length > 0 
              ? Math.round(recentSessions.reduce((sum, s) => sum + s.score, 0) / recentSessions.length)
              : 0;

            const IconComponent = game.icon;

            return (
              <div
                key={game.id}
                className={`bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 border border-white/20 ${
                  isRecommended ? 'ring-4 ring-yellow-400 ring-opacity-50' : ''
                }`}
                onClick={() => setSelectedGame(game.id)}
              >
                {isRecommended && (
                  <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold mb-4 inline-block">
                    ⭐ Recommended for You
                  </div>
                )}
                
                {/* Top Section - Icon */}
                <div className="text-center mb-6">
                  <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-r ${game.gradient} flex items-center justify-center mb-4`}>
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                </div>

                {/* Middle Section - Title and Description */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{game.title}</h3>
                  <p className="text-gray-300 mb-4">{game.description}</p>
                  
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r ${game.gradient} text-white`}>
                    {game.therapeuticBenefit}
                  </div>
                </div>

                {/* Bottom Section - Best For and Play Button */}
                <div className="space-y-4">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-sm font-semibold text-gray-300 mb-2">Best for:</div>
                    <div className="text-sm text-gray-400">{game.recommendedFor}</div>
                  </div>

                  {recentSessions.length > 0 && (
                    <div className="flex justify-between items-center text-sm text-gray-400">
                      <span>Recent Score: {avgScore}%</span>
                      <span>{recentSessions.length} recent sessions</span>
                    </div>
                  )}

                  <button
                    className={`w-full py-3 px-6 rounded-lg font-semibold text-white bg-gradient-to-r ${game.gradient} hover:opacity-90 transition-all duration-300 transform hover:scale-105`}
                  >
                    Play Now →
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* How It Works */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            How MindGames Therapy Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-white mb-2">Play</h3>
              <p className="text-sm text-gray-300">Engage with therapeutic mini-games designed by psychologists</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-purple-700 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-white mb-2">Track</h3>
              <p className="text-sm text-gray-300">AI analyzes your gameplay patterns to detect stress indicators</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-green-500 to-green-700 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-white mb-2">Learn</h3>
              <p className="text-sm text-gray-300">Build emotional intelligence and coping strategies</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-orange-500 to-orange-700 rounded-full flex items-center justify-center mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-white mb-2">Grow</h3>
              <p className="text-sm text-gray-300">See your mental resilience improve over time</p>
            </div>
          </div>
        </div>

        {/* Scientific Backing */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">🧬 Scientifically Backed</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Cognitive Behavioral Therapy</h3>
              <p className="text-sm opacity-90">Games incorporate CBT techniques for anxiety and depression</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Mindfulness Training</h3>
              <p className="text-sm opacity-90">Evidence-based mindfulness practices in engaging game format</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Gamification Benefits</h3>
              <p className="text-sm opacity-90">Research shows games increase engagement in mental health interventions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
