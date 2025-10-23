import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { WellnessScore as WellnessScoreType } from '../../../types/insights.types';

interface WellnessScoreProps {
  score: WellnessScoreType;
}

export const WellnessScore: React.FC<WellnessScoreProps> = ({ score }) => {
  const getScoreColor = (value: number) => {
    if (value >= 80) return '#10B981'; // green
    if (value >= 60) return '#F59E0B'; // yellow
    if (value >= 40) return '#F97316'; // orange
    return '#EF4444'; // red
  };

  const getScoreLabel = (value: number) => {
    if (value >= 80) return 'Excellent';
    if (value >= 60) return 'Good';
    if (value >= 40) return 'Fair';
    return 'Needs Attention';
  };

  const getTrendIcon = () => {
    // This would be calculated based on previous scores
    // For now, return a placeholder
    return <TrendingUp className="w-4 h-4 text-green-400" />;
  };

  const getTrendText = () => {
    // This would be calculated based on previous scores
    return 'Up 12 pts this week';
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 rounded-2xl p-8 backdrop-blur-xl border border-white/10">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Wellness Score</h2>
        <p className="text-gray-300">Your overall mental wellness today</p>
      </div>

      <div className="flex items-center justify-center mb-8">
        <div className="relative w-48 h-48">
          <CircularProgressbar
            value={score.overall}
            maxValue={100}
            text={`${score.overall}`}
            styles={buildStyles({
              pathColor: getScoreColor(score.overall),
              textColor: '#ffffff',
              trailColor: 'rgba(255, 255, 255, 0.1)',
              textSize: '24px',
              pathTransitionDuration: 0.5,
            })}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-sm text-gray-300 mb-1">Overall</div>
              <div className={`text-lg font-semibold ${getScoreColor(score.overall) === '#10B981' ? 'text-green-400' : 
                getScoreColor(score.overall) === '#F59E0B' ? 'text-yellow-400' : 
                getScoreColor(score.overall) === '#F97316' ? 'text-orange-400' : 'text-red-400'}`}>
                {getScoreLabel(score.overall)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trend Indicator */}
      <div className="flex items-center justify-center space-x-2 mb-8">
        {getTrendIcon()}
        <span className="text-green-400 font-medium">{getTrendText()}</span>
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { key: 'moodStability', label: 'Mood Stability', icon: '😌' },
          { key: 'copingUsage', label: 'Coping Usage', icon: '🧘' },
          { key: 'sleepQuality', label: 'Sleep Quality', icon: '😴' },
          { key: 'socialEngagement', label: 'Social', icon: '👥' },
          { key: 'selfCare', label: 'Self-Care', icon: '💆' }
        ].map(({ key, label, icon }) => {
          const value = score.breakdown[key as keyof typeof score.breakdown];
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center p-4 bg-white/5 rounded-xl border border-white/10"
            >
              <div className="text-2xl mb-2">{icon}</div>
              <div className="text-lg font-bold text-white mb-1">{value}</div>
              <div className="text-xs text-gray-400">{label}</div>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className={`h-2 rounded-full ${
                    value >= 80 ? 'bg-green-400' :
                    value >= 60 ? 'bg-yellow-400' :
                    value >= 40 ? 'bg-orange-400' : 'bg-red-400'
                  }`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Insights */}
      <div className="mt-8 p-4 bg-blue-500/10 border border-blue-400/20 rounded-xl">
        <h4 className="font-semibold text-blue-300 mb-2">💡 Insight</h4>
        <p className="text-sm text-gray-300">
          {score.overall >= 80 
            ? "You're doing excellent! Keep up your great wellness habits."
            : score.overall >= 60
            ? "You're doing well overall. Focus on areas that need improvement."
            : score.overall >= 40
            ? "There's room for improvement. Try focusing on one area at a time."
            : "Let's work together to improve your wellness. Consider trying VR therapy or breathing exercises."
          }
        </p>
      </div>
    </div>
  );
};
