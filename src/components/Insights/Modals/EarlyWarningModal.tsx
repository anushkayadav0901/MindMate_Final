import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, MessageCircle, Heart, AlertTriangle } from 'lucide-react';
import { EarlyWarningData } from '../../../types/insights.types';

interface EarlyWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  warningData: EarlyWarningData;
}

export const EarlyWarningModal: React.FC<EarlyWarningModalProps> = ({ 
  isOpen, 
  onClose, 
  warningData 
}) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'from-red-500 to-pink-500';
      case 'medium': return 'from-orange-500 to-red-500';
      default: return 'from-yellow-500 to-orange-500';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return '🚨';
      case 'medium': return '⚠️';
      default: return '💛';
    }
  };

  const helplines = [
    {
      name: 'KIRAN Mental Health Helpline',
      number: '1800-599-0019',
      description: '24/7 free mental health support',
      icon: Phone
    },
    {
      name: 'Vandrevala Foundation',
      number: '+91 9999 666 555',
      description: 'Crisis intervention and counseling',
      icon: MessageCircle
    },
    {
      name: 'iCall Psychosocial Helpline',
      number: '+91 9152987821',
      description: 'Professional counseling services',
      icon: Heart
    }
  ];

  const selfCareActivities = [
    {
      title: 'Try VR Therapy',
      description: 'Visit the Peaceful Garden for immediate relief',
      action: 'Open VR Therapy'
    },
    {
      title: 'Breathing Exercise',
      description: 'Practice the 4-7-8 breathing technique',
      action: 'Start Breathing'
    },
    {
      title: 'MindGames',
      description: 'Play therapeutic games to reduce stress',
      action: 'Play Games'
    }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0, 0, 0, 0.8)' }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`bg-gradient-to-br ${getSeverityColor(warningData.severity)} rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{getSeverityIcon(warningData.severity)}</div>
              <div>
                <h2 className="text-2xl font-bold text-white">We're Here for You</h2>
                <p className="text-white/80">You don't have to face this alone</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Warning Reasons */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>What We've Noticed</span>
            </h3>
            <div className="space-y-2">
              {warningData.reasons.map((reason, index) => (
                <div key={index} className="p-3 bg-white/10 rounded-lg text-white/90">
                  • {reason}
                </div>
              ))}
            </div>
          </div>

          {/* Helplines */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Talk to Someone</h3>
            <div className="grid grid-cols-1 gap-4">
              {helplines.map((helpline, index) => {
                const Icon = helpline.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-white/10 rounded-xl border border-white/20 hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">{helpline.name}</h4>
                        <p className="text-white/80 text-sm">{helpline.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-white">{helpline.number}</div>
                        <button className="text-sm text-white/80 hover:text-white underline">
                          Call Now
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Self-Care Activities */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Self-Care Activities</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selfCareActivities.map((activity, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-white/10 rounded-xl border border-white/20 hover:bg-white/20 transition-all text-left"
                >
                  <h4 className="font-semibold text-white mb-2">{activity.title}</h4>
                  <p className="text-white/80 text-sm mb-3">{activity.description}</p>
                  <div className="text-blue-300 text-sm font-medium">{activity.action} →</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Encouragement */}
          <div className="p-6 bg-white/10 rounded-xl border border-white/20">
            <div className="text-center">
              <div className="text-4xl mb-3">💙</div>
              <h4 className="text-lg font-semibold text-white mb-2">
                You Are Not Alone
              </h4>
              <p className="text-white/80">
                Reaching out for help is a sign of strength, not weakness. 
                There are people who care about you and want to help.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 mt-8">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors font-semibold"
            >
              I'll Try Self-Care
            </button>
            <button
              onClick={() => {
                // This would open VR therapy
                onClose();
              }}
              className="flex-1 py-3 bg-white text-purple-500 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              Open VR Therapy
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
