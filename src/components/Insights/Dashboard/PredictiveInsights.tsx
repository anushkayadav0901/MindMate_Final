import React from 'react';
import { motion } from 'framer-motion';
import { 
  CrystalBall, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Target,
  AlertCircle,
  CheckCircle,
  ChevronRight
} from 'lucide-react';
import { PredictiveInsight } from '../../../types/insights.types';

interface PredictiveInsightsProps {
  predictions: PredictiveInsight[];
}

export const PredictiveInsights: React.FC<PredictiveInsightsProps> = ({ predictions }) => {
  if (predictions.length === 0) {
    return null;
  }

  const getPredictionIcon = (type: string) => {
    switch (type) {
      case 'stress': return AlertCircle;
      case 'mood': return TrendingDown;
      case 'activity': return Clock;
      default: return CrystalBall;
    }
  };

  const getPredictionColor = (type: string) => {
    switch (type) {
      case 'stress': return 'from-red-500 to-orange-500';
      case 'mood': return 'from-blue-500 to-purple-500';
      case 'activity': return 'from-green-500 to-teal-500';
      default: return 'from-purple-500 to-pink-500';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-400';
    if (confidence >= 60) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 80) return 'High';
    if (confidence >= 60) return 'Medium';
    return 'Low';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 rounded-2xl p-6 backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 rounded-xl bg-purple-500/20">
            <CrystalBall className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">🔮 AI Predictions</h3>
            <p className="text-purple-300 text-sm">Personalized insights based on your patterns</p>
          </div>
        </div>

        {/* Predictions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {predictions.map((prediction, index) => {
            const Icon = getPredictionIcon(prediction.type);
            const gradientClass = getPredictionColor(prediction.type);
            
            return (
              <motion.div
                key={prediction.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gradient-to-br ${gradientClass} rounded-xl p-4 border border-white/10 hover:scale-105 transition-all duration-300 cursor-pointer group`}
              >
                {/* Prediction Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Icon className="w-5 h-5 text-white/80" />
                    <span className="text-sm font-semibold text-white/90 capitalize">
                      {prediction.type}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-bold ${getConfidenceColor(prediction.confidence)}`}>
                      {prediction.confidence}%
                    </div>
                    <div className="text-xs text-white/60">
                      {getConfidenceLabel(prediction.confidence)}
                    </div>
                  </div>
                </div>

                {/* Prediction Content */}
                <div className="mb-3">
                  <p className="text-white font-medium text-sm leading-relaxed">
                    {prediction.prediction}
                  </p>
                </div>

                {/* Reasoning */}
                <div className="mb-3">
                  <p className="text-white/70 text-xs">
                    {prediction.reasoning}
                  </p>
                </div>

                {/* Action */}
                {prediction.action && (
                  <div className="flex items-center justify-between pt-3 border-t border-white/20">
                    <span className="text-white/80 text-xs font-medium">
                      {prediction.action}
                    </span>
                    <ChevronRight className="w-3 h-3 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-sm font-semibold text-white">How it works</span>
          </div>
          <p className="text-gray-300 text-sm">
            Our AI analyzes your mood patterns, sleep data, and activity history to provide personalized predictions. 
            The more data you provide, the more accurate our insights become.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mt-4">
          <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium">
            Prepare for Tomorrow
          </button>
          <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm font-medium">
            Set Reminder
          </button>
        </div>
      </div>
    </motion.div>
  );
};
