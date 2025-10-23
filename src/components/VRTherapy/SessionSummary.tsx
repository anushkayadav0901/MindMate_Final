import React from 'react';

interface SessionData {
  environmentId: string;
  duration: number;
  peakAnxiety: number;
  averageAnxiety: number;
  anxietyHistory: number[];
  completed: boolean;
}

interface SessionSummaryProps {
  sessionData: SessionData;
  onClose: () => void;
  onStartNewSession: () => void;
}

export const SessionSummary: React.FC<SessionSummaryProps> = ({
  sessionData,
  onClose,
  onStartNewSession
}) => {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getEnvironmentName = (id: string) => {
    const names: Record<string, string> = {
      'peaceful-garden': 'Peaceful Garden',
      'college-campus': 'College Campus',
      'exam-hall': 'Exam Hall',
      'home-room': 'Home Room'
    };
    return names[id] || id;
  };

  const getAnxietyLabel = (level: number) => {
    if (level <= 2) return 'Very Calm';
    if (level <= 4) return 'Calm';
    if (level <= 6) return 'Moderate';
    if (level <= 8) return 'Anxious';
    return 'Very Anxious';
  };

  const getAnxietyColor = (level: number) => {
    if (level <= 3) return 'text-green-500';
    if (level <= 6) return 'text-yellow-500';
    if (level <= 8) return 'text-orange-500';
    return 'text-red-500';
  };

  const calculateImprovement = () => {
    if (sessionData.anxietyHistory.length < 2) return 0;
    const startAnxiety = sessionData.anxietyHistory[0];
    const endAnxiety = sessionData.anxietyHistory[sessionData.anxietyHistory.length - 1];
    return Math.round(((startAnxiety - endAnxiety) / startAnxiety) * 100);
  };

  const getAchievements = () => {
    const achievements = [];
    
    if (sessionData.duration >= 300) { // 5 minutes
      achievements.push('🏆 Marathon Session - Spent 5+ minutes in therapy');
    }
    
    if (sessionData.peakAnxiety <= 3) {
      achievements.push('😌 Calm Master - Maintained very low anxiety');
    }
    
    if (sessionData.averageAnxiety <= 4) {
      achievements.push('🧘 Zen Warrior - Overall calm experience');
    }
    
    if (sessionData.duration >= 180 && sessionData.peakAnxiety >= 7) {
      achievements.push('💪 Courage Builder - Faced high anxiety for 3+ minutes');
    }

    return achievements;
  };

  const getRecommendations = () => {
    const recommendations = [];
    
    if (sessionData.averageAnxiety > 7) {
      recommendations.push('Try the Peaceful Garden environment for relaxation');
    }
    
    if (sessionData.duration < 120) {
      recommendations.push('Consider longer sessions (2+ minutes) for better therapeutic benefits');
    }
    
    if (sessionData.peakAnxiety >= 8) {
      recommendations.push('Practice breathing exercises before challenging environments');
    }
    
    if (sessionData.averageAnxiety <= 4) {
      recommendations.push('Great job! Try a more challenging environment next time');
    }

    return recommendations;
  };

  const improvement = calculateImprovement();
  const achievements = getAchievements();
  const recommendations = getRecommendations();

  // Save session to localStorage
  React.useEffect(() => {
    const sessions = JSON.parse(localStorage.getItem('vrTherapySessions') || '[]');
    sessions.push({
      ...sessionData,
      timestamp: new Date().toISOString(),
      improvement,
      achievements
    });
    localStorage.setItem('vrTherapySessions', JSON.stringify(sessions));
  }, [sessionData, improvement, achievements]);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Session Complete!</h2>
              <p className="text-indigo-100">Great work on completing your therapy session</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Session Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-indigo-600">{formatDuration(sessionData.duration)}</div>
              <div className="text-sm text-gray-600">Duration</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className={`text-2xl font-bold ${getAnxietyColor(sessionData.peakAnxiety)}`}>
                {sessionData.peakAnxiety}/10
              </div>
              <div className="text-sm text-gray-600">Peak Anxiety</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className={`text-2xl font-bold ${getAnxietyColor(Math.round(sessionData.averageAnxiety))}`}>
                {Math.round(sessionData.averageAnxiety)}/10
              </div>
              <div className="text-sm text-gray-600">Average Anxiety</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className={`text-2xl font-bold ${improvement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {improvement >= 0 ? '+' : ''}{improvement}%
              </div>
              <div className="text-sm text-gray-600">Improvement</div>
            </div>
          </div>

          {/* Environment Info */}
          <div className="bg-indigo-50 rounded-lg p-4">
            <h3 className="font-semibold text-indigo-800 mb-2">Environment</h3>
            <p className="text-indigo-700">{getEnvironmentName(sessionData.environmentId)}</p>
          </div>

          {/* Anxiety Trend */}
          {sessionData.anxietyHistory.length > 1 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Anxiety Trend</h3>
              <div className="flex items-end space-x-1 h-20">
                {sessionData.anxietyHistory.map((anxiety, index) => (
                  <div
                    key={index}
                    className="flex-1 bg-indigo-200 rounded-t"
                    style={{
                      height: `${(anxiety / 10) * 100}%`,
                      backgroundColor: anxiety <= 3 ? '#10b981' : anxiety <= 6 ? '#f59e0b' : '#ef4444'
                    }}
                    title={`${anxiety}/10`}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-600 mt-2">
                <span>Start</span>
                <span>End</span>
              </div>
            </div>
          )}

          {/* Achievements */}
          {achievements.length > 0 && (
            <div className="bg-yellow-50 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-3">🏆 Achievements Unlocked!</h3>
              <ul className="space-y-2">
                {achievements.map((achievement, index) => (
                  <li key={index} className="text-yellow-700 flex items-center">
                    <span className="mr-2">{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-3">💡 Personalized Recommendations</h3>
              <ul className="space-y-2">
                {recommendations.map((recommendation, index) => (
                  <li key={index} className="text-blue-700 flex items-start">
                    <span className="mr-2">•</span>
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              onClick={onStartNewSession}
              className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Start New Session
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Return to Home
            </button>
          </div>

          {/* Progress Note */}
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <p className="text-green-800 font-medium">
              🌟 Every session is progress! You're building resilience and coping skills.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
