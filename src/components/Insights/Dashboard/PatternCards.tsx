import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Moon, 
  Activity, 
  AlertTriangle, 
  Award, 
  TrendingUp,
  ChevronRight,
  Clock,
  Target,
  Heart
} from 'lucide-react';
import { PatternInsight } from '../../../types/insights.types';

interface PatternCardsProps {
  patterns: PatternInsight[];
}

export const PatternCards: React.FC<PatternCardsProps> = ({ patterns }) => {
  const getPatternIcon = (type: string) => {
    switch (type) {
      case 'time': return Calendar;
      case 'sleep': return Moon;
      case 'activity': return Activity;
      case 'trigger': return AlertTriangle;
      case 'streak': return Award;
      case 'progress': return TrendingUp;
      default: return Target;
    }
  };

  const getPatternColor = (type: string) => {
    switch (type) {
      case 'time': return 'from-blue-500 to-cyan-500';
      case 'sleep': return 'from-purple-500 to-indigo-500';
      case 'activity': return 'from-green-500 to-emerald-500';
      case 'trigger': return 'from-red-500 to-pink-500';
      case 'streak': return 'from-yellow-500 to-orange-500';
      case 'progress': return 'from-teal-500 to-blue-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getPatternIconColor = (type: string) => {
    switch (type) {
      case 'time': return 'text-blue-400';
      case 'sleep': return 'text-purple-400';
      case 'activity': return 'text-green-400';
      case 'trigger': return 'text-red-400';
      case 'streak': return 'text-yellow-400';
      case 'progress': return 'text-teal-400';
      default: return 'text-gray-400';
    }
  };

  if (patterns.length === 0) {
    return (
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 rounded-2xl p-8 backdrop-blur-xl border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <Target className="w-6 h-6 text-purple-400" />
          <span>Pattern Insights</span>
        </h3>
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🔍</div>
          <h4 className="text-lg font-semibold text-gray-300 mb-2">Analyzing Patterns</h4>
          <p className="text-gray-400">
            Keep logging your mood for at least a week to discover personalized insights!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Target className="w-6 h-6 text-purple-400" />
        <h3 className="text-xl font-bold text-white">Pattern Insights</h3>
        <div className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm font-medium">
          {patterns.length} found
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patterns.map((pattern, index) => {
          const Icon = getPatternIcon(pattern.type);
          const gradientClass = getPatternColor(pattern.type);
          const iconColorClass = getPatternIconColor(pattern.type);
          
          return (
            <motion.div
              key={pattern.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-br ${gradientClass} rounded-2xl p-6 backdrop-blur-xl border border-white/10 hover:scale-105 transition-all duration-300 cursor-pointer group`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-white/10 ${iconColorClass}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <div className="text-sm text-white/80">Confidence</div>
                  <div className="text-lg font-bold text-white">{pattern.confidence}%</div>
                </div>
              </div>

              {/* Content */}
              <div className="mb-4">
                <h4 className="text-lg font-bold text-white mb-2">{pattern.title}</h4>
                <p className="text-white/80 text-sm leading-relaxed">{pattern.description}</p>
              </div>

              {/* Action */}
              {pattern.action && (
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-sm">{pattern.action}</span>
                  <ChevronRight className="w-4 h-4 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
              )}

              {/* Mini Visualization */}
              <div className="mt-4 pt-4 border-t border-white/20">
                {pattern.type === 'time' && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-white/60" />
                    <div className="flex-1 bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-white/60 h-2 rounded-full"
                        style={{ width: `${pattern.confidence}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {pattern.type === 'sleep' && (
                  <div className="flex items-center space-x-2">
                    <Moon className="w-4 h-4 text-white/60" />
                    <div className="text-sm text-white/70">
                      Correlation: {pattern.data?.correlation?.toFixed(2) || 'N/A'}
                    </div>
                  </div>
                )}

                {pattern.type === 'streak' && (
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-white/60" />
                    <div className="text-sm text-white/70">
                      {pattern.data?.streak || 0} days
                    </div>
                  </div>
                )}

                {pattern.type === 'progress' && (
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-white/60" />
                    <div className="text-sm text-white/70">
                      {pattern.data?.improvement > 0 ? '+' : ''}{pattern.data?.improvement?.toFixed(1) || 0}%
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Additional Insights */}
      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-400/20 rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Heart className="w-6 h-6 text-indigo-400" />
          <h4 className="text-lg font-semibold text-indigo-300">Personalized Recommendations</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white/5 rounded-xl">
            <div className="font-semibold text-white mb-2">🎯 Focus Areas</div>
            <div className="text-sm text-gray-300">
              Based on your patterns, consider focusing on sleep quality and stress management.
            </div>
          </div>
          <div className="p-4 bg-white/5 rounded-xl">
            <div className="font-semibold text-white mb-2">⏰ Optimal Times</div>
            <div className="text-sm text-gray-300">
              Your mood tends to be highest in the morning. Schedule important tasks then.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
