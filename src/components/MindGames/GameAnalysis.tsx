import React, { useState, useEffect } from 'react';
import { GameSession } from '../../pages/MindGamesPage';

interface GameAnalysisProps {
  sessions: GameSession[];
}

export const GameAnalysis: React.FC<GameAnalysisProps> = ({ sessions }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'all'>('week');
  const [selectedGame, setSelectedGame] = useState<string>('all');

  const getFilteredSessions = () => {
    let filtered = sessions;
    
    // Filter by timeframe
    const now = new Date();
    if (selectedTimeframe === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(s => new Date(s.timestamp) >= weekAgo);
    } else if (selectedTimeframe === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(s => new Date(s.timestamp) >= monthAgo);
    }
    
    // Filter by game type
    if (selectedGame !== 'all') {
      filtered = filtered.filter(s => s.gameType === selectedGame);
    }
    
    return filtered;
  };

  const filteredSessions = getFilteredSessions();

  const getGameStats = () => {
    if (filteredSessions.length === 0) {
      return {
        totalSessions: 0,
        avgAnxietyReduction: 0,
        avgScore: 0,
        totalPlayTime: 0,
        mostPlayedGame: 'None',
        improvementTrend: 'No data'
      };
    }

    const totalSessions = filteredSessions.length;
    const avgAnxietyReduction = filteredSessions.reduce((sum, s) => sum + (s.anxietyBefore - s.anxietyAfter), 0) / totalSessions;
    const avgScore = filteredSessions.reduce((sum, s) => sum + s.score, 0) / totalSessions;
    const totalPlayTime = filteredSessions.reduce((sum, s) => sum + s.duration, 0);

    // Most played game
    const gameCounts = filteredSessions.reduce((acc, s) => {
      acc[s.gameType] = (acc[s.gameType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const mostPlayedGame = Object.keys(gameCounts).reduce((a, b) => gameCounts[a] > gameCounts[b] ? a : b, 'None');

    // Improvement trend
    const recentSessions = filteredSessions.slice(-5);
    const olderSessions = filteredSessions.slice(0, 5);
    const recentAvg = recentSessions.reduce((sum, s) => sum + s.score, 0) / recentSessions.length;
    const olderAvg = olderSessions.reduce((sum, s) => sum + s.score, 0) / olderSessions.length;
    const improvementTrend = recentAvg > olderAvg ? 'Improving' : recentAvg < olderAvg ? 'Declining' : 'Stable';

    return {
      totalSessions,
      avgAnxietyReduction: Math.round(avgAnxietyReduction * 10) / 10,
      avgScore: Math.round(avgScore),
      totalPlayTime,
      mostPlayedGame,
      improvementTrend
    };
  };

  const getPersonalizedInsights = () => {
    if (filteredSessions.length === 0) return [];

    const insights = [];
    const stats = getGameStats();

    // Anxiety reduction insight
    if (stats.avgAnxietyReduction >= 2) {
      insights.push({
        type: 'positive',
        icon: '🎉',
        title: 'Excellent Anxiety Management',
        description: `You're reducing anxiety by an average of ${stats.avgAnxietyReduction} points per session!`
      });
    } else if (stats.avgAnxietyReduction >= 1) {
      insights.push({
        type: 'positive',
        icon: '👍',
        title: 'Good Progress',
        description: `You're making steady progress with ${stats.avgAnxietyReduction} points of anxiety reduction.`
      });
    }

    // Consistency insight
    if (stats.totalSessions >= 7) {
      insights.push({
        type: 'positive',
        icon: '🔥',
        title: 'Consistent Practice',
        description: 'Your regular practice is building strong mental health habits!'
      });
    }

    // Game preference insight
    const gameNames = {
      'breathing': 'Breathing Rhythm',
      'worry-bubble': 'Worry Bubble Pop',
      'emotion-matching': 'Emotion Pattern Matching',
      'mindful-maze': 'Mindful Maze'
    };
    
    if (stats.mostPlayedGame !== 'None') {
      insights.push({
        type: 'info',
        icon: '🎯',
        title: 'Preferred Game',
        description: `You play ${gameNames[stats.mostPlayedGame as keyof typeof gameNames]} most - this might be your most effective coping strategy.`
      });
    }

    // Improvement trend insight
    if (stats.improvementTrend === 'Improving') {
      insights.push({
        type: 'positive',
        icon: '📈',
        title: 'Getting Better',
        description: 'Your scores are improving over time - keep up the great work!'
      });
    } else if (stats.improvementTrend === 'Declining') {
      insights.push({
        type: 'warning',
        icon: '⚠️',
        title: 'Consider More Practice',
        description: 'Your recent scores are lower. Try playing more frequently to maintain your skills.'
      });
    }

    return insights;
  };

  const getRecommendations = () => {
    if (filteredSessions.length === 0) return [];

    const recommendations = [];
    const stats = getGameStats();

    // Based on anxiety levels
    const recentAnxiety = filteredSessions.slice(-3).reduce((sum, s) => sum + s.anxietyBefore, 0) / Math.min(3, filteredSessions.length);
    
    if (recentAnxiety >= 7) {
      recommendations.push({
        game: 'Breathing Rhythm',
        reason: 'High anxiety detected - breathing exercises are most effective for immediate relief',
        icon: '🫁'
      });
      recommendations.push({
        game: 'Worry Bubble Pop',
        reason: 'Cognitive restructuring helps with high anxiety and negative thoughts',
        icon: '🫧'
      });
    } else if (recentAnxiety >= 5) {
      recommendations.push({
        game: 'Emotion Pattern Matching',
        reason: 'Building emotional intelligence helps manage moderate anxiety',
        icon: '🎭'
      });
    } else {
      recommendations.push({
        game: 'Mindful Maze',
        reason: 'Maintain calm with mindfulness practice',
        icon: '🧘'
      });
    }

    // Based on performance patterns
    const stressIndicators = filteredSessions.flatMap(s => s.metrics.stressIndicators);
    const hesitationCount = filteredSessions.reduce((sum, s) => sum + s.metrics.hesitationCount, 0);

    if (hesitationCount > filteredSessions.length * 2) {
      recommendations.push({
        game: 'Worry Bubble Pop',
        reason: 'High hesitation suggests decision anxiety - practice quick positive responses',
        icon: '🫧'
      });
    }

    if (stressIndicators.some(indicator => indicator.includes('rushing'))) {
      recommendations.push({
        game: 'Mindful Maze',
        reason: 'Rushing detected - practice slowing down and mindfulness',
        icon: '🧘'
      });
    }

    return recommendations;
  };

  const stats = getGameStats();
  const insights = getPersonalizedInsights();
  const recommendations = getRecommendations();

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        📊 Your MindGames Analysis
      </h1>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Time Period:</label>
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value as 'week' | 'month' | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="all">All Time</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Game Type:</label>
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Games</option>
              <option value="breathing">Breathing Rhythm</option>
              <option value="worry-bubble">Worry Bubble Pop</option>
              <option value="emotion-matching">Emotion Pattern Matching</option>
              <option value="mindful-maze">Mindful Maze</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-lg text-center">
          <div className="text-3xl font-bold text-blue-600">{stats.totalSessions}</div>
          <div className="text-gray-600">Sessions Played</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg text-center">
          <div className="text-3xl font-bold text-green-600">{stats.avgAnxietyReduction}</div>
          <div className="text-gray-600">Avg Anxiety Reduction</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg text-center">
          <div className="text-3xl font-bold text-purple-600">{stats.avgScore}%</div>
          <div className="text-gray-600">Average Score</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg text-center">
          <div className="text-3xl font-bold text-orange-600">{stats.totalPlayTime}</div>
          <div className="text-gray-600">Total Play Time (min)</div>
        </div>
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">🧠 AI Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  insight.type === 'positive' ? 'bg-green-50 border border-green-200' :
                  insight.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                  'bg-blue-50 border border-blue-200'
                }`}
              >
                <div className="flex items-start">
                  <span className="text-2xl mr-3">{insight.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">{insight.title}</h3>
                    <p className="text-sm text-gray-600">{insight.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">💡 Personalized Recommendations</h2>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="flex items-start p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <span className="text-2xl mr-4">{rec.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-800">{rec.game}</h3>
                  <p className="text-sm text-gray-600">{rec.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Sessions */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">📈 Recent Sessions</h2>
        {filteredSessions.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No sessions found for the selected criteria.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Game</th>
                  <th className="text-left py-2">Score</th>
                  <th className="text-left py-2">Anxiety Before</th>
                  <th className="text-left py-2">Anxiety After</th>
                  <th className="text-left py-2">Duration</th>
                </tr>
              </thead>
              <tbody>
                {filteredSessions.slice(-10).map((session, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-2 text-sm">{new Date(session.timestamp).toLocaleDateString()}</td>
                    <td className="py-2 text-sm capitalize">{session.gameType.replace('-', ' ')}</td>
                    <td className="py-2 text-sm">{session.score}%</td>
                    <td className="py-2 text-sm">{session.anxietyBefore}</td>
                    <td className="py-2 text-sm">{session.anxietyAfter}</td>
                    <td className="py-2 text-sm">{session.duration} min</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
