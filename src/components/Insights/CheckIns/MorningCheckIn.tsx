import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sun, Moon, Zap, Heart, ArrowRight, Check } from 'lucide-react';
import { CheckInData } from '../../../types/insights.types';
import { saveCheckIn, hasCheckInToday } from '../../../utils/moodStorage';
import confetti from 'canvas-confetti';

interface MorningCheckInProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const sleepTags = ['Restless', 'Nightmares', 'Woke often', 'Slept well'];
const stressorTags = [
  { text: '📚 Exam', icon: '📚' },
  { text: '🎤 Presentation', icon: '🎤' },
  { text: '👥 Social Event', icon: '👥' },
  { text: '⏰ Deadline', icon: '⏰' },
  { text: '👨‍👩‍👧 Family', icon: '👨‍👩‍👧' },
  { text: '💬 Conflict', icon: '💬' },
  { text: '🏥 Health', icon: '🏥' },
  { text: '💼 Interview', icon: '💼' }
];
const moodOptions = [
  { emoji: '😊', label: 'Happy', value: 'happy' },
  { emoji: '😌', label: 'Calm', value: 'calm' },
  { emoji: '😐', label: 'Neutral', value: 'neutral' },
  { emoji: '😟', label: 'Worried', value: 'worried' },
  { emoji: '😢', label: 'Sad', value: 'sad' },
  { emoji: '😠', label: 'Frustrated', value: 'frustrated' },
  { emoji: '😰', label: 'Anxious', value: 'anxious' },
  { emoji: '😴', label: 'Tired', value: 'tired' }
];

export const MorningCheckIn: React.FC<MorningCheckInProps> = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [checkInData, setCheckInData] = useState<CheckInData>({});
  const [isCompleting, setIsCompleting] = useState(false);

  const steps = [
    { id: 'sleep', title: 'Sleep Quality', icon: Moon },
    { id: 'energy', title: 'Energy Level', icon: Zap },
    { id: 'stressors', title: 'Expected Stressors', icon: Heart },
    { id: 'mood', title: 'Current Mood', icon: Sun }
  ];

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setCheckInData({});
    }
  }, [isOpen]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    
    // Save check-in data
    const checkIn = {
      id: `checkin-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      type: 'morning' as const,
      timestamp: Date.now(),
      ...checkInData
    };
    
    saveCheckIn(checkIn);
    
    // Confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    setTimeout(() => {
      setIsCompleting(false);
      onComplete();
    }, 2000);
  };

  const getSleepEmoji = (score: number) => {
    if (score <= 3) return '😫';
    if (score <= 6) return '😐';
    if (score <= 8) return '🙂';
    return '😊';
  };

  const getSleepColor = (score: number) => {
    if (score <= 3) return 'text-red-400';
    if (score <= 6) return 'text-yellow-400';
    if (score <= 8) return 'text-green-400';
    return 'text-green-500';
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-6">How was your sleep last night?</h3>
            <div className="mb-8">
              <div className="text-6xl mb-4">{getSleepEmoji(checkInData.sleep || 5)}</div>
              <div className={`text-3xl font-bold mb-4 ${getSleepColor(checkInData.sleep || 5)}`}>
                {checkInData.sleep || 5}/10
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={checkInData.sleep || 5}
                onChange={(e) => setCheckInData(prev => ({ ...prev, sleep: parseInt(e.target.value) }))}
                className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {sleepTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    const currentTags = checkInData.sleepTags || [];
                    const newTags = currentTags.includes(tag)
                      ? currentTags.filter(t => t !== tag)
                      : [...currentTags, tag];
                    setCheckInData(prev => ({ ...prev, sleepTags: newTags }));
                  }}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    checkInData.sleepTags?.includes(tag)
                      ? 'border-blue-400 bg-blue-500/20 text-blue-300'
                      : 'border-white/20 text-gray-300 hover:border-white/40'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-8">What's your energy level?</h3>
            <div className="grid grid-cols-3 gap-6">
              {[
                { level: 'low', icon: '🔋', percentage: '25%', color: 'red' },
                { level: 'medium', icon: '🔋', percentage: '50%', color: 'yellow' },
                { level: 'high', icon: '🔋', percentage: '100%', color: 'green' }
              ].map(({ level, icon, percentage, color }) => (
                <motion.button
                  key={level}
                  onClick={() => setCheckInData(prev => ({ ...prev, energy: level as any }))}
                  className={`p-6 rounded-2xl border-2 transition-all ${
                    checkInData.energy === level
                      ? `border-${color}-400 bg-${color}-500/20 scale-105`
                      : 'border-white/20 hover:border-white/40'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-4xl mb-3">{icon}</div>
                  <div className={`text-lg font-semibold capitalize ${
                    checkInData.energy === level ? `text-${color}-300` : 'text-gray-300'
                  }`}>
                    {level}
                  </div>
                  <div className={`text-sm ${
                    checkInData.energy === level ? `text-${color}-400` : 'text-gray-400'
                  }`}>
                    {percentage}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-8">Any challenges expected today?</h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {stressorTags.map(({ text, icon }) => (
                <button
                  key={text}
                  onClick={() => {
                    const currentStressors = checkInData.stressors || [];
                    const newStressors = currentStressors.includes(text)
                      ? currentStressors.filter(s => s !== text)
                      : [...currentStressors, text];
                    setCheckInData(prev => ({ ...prev, stressors: newStressors }));
                  }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    checkInData.stressors?.includes(text)
                      ? 'border-purple-400 bg-purple-500/20 text-purple-300'
                      : 'border-white/20 text-gray-300 hover:border-white/40'
                  }`}
                >
                  <div className="text-2xl mb-2">{icon}</div>
                  <div className="text-sm">{text.replace(/^[^\s]+ /, '')}</div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setCheckInData(prev => ({ ...prev, stressors: [] }))}
              className="px-6 py-3 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 transition-colors"
            >
              None Today
            </button>
          </div>
        );

      case 3:
        return (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-8">How are you feeling?</h3>
            <div className="grid grid-cols-4 gap-4">
              {moodOptions.map(({ emoji, label, value }) => (
                <motion.button
                  key={value}
                  onClick={() => setCheckInData(prev => ({ ...prev, mood: value }))}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    checkInData.mood === value
                      ? 'border-blue-400 bg-blue-500/20 scale-105'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-4xl mb-2">{emoji}</div>
                  <div className={`text-sm font-medium ${
                    checkInData.mood === value ? 'text-blue-300' : 'text-gray-300'
                  }`}>
                    {label}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return checkInData.sleep !== undefined;
      case 1: return checkInData.energy !== undefined;
      case 2: return true; // Stressors are optional
      case 3: return checkInData.mood !== undefined;
      default: return false;
    }
  };

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
          className="bg-gradient-to-br from-orange-500 to-blue-500 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Sun className="w-8 h-8 text-white" />
              <h2 className="text-2xl font-bold text-white">Morning Check-In</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center space-x-3 mb-8">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  index <= currentStep ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>

          {/* Step Content */}
          <motion.div
            key={currentStep}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>
            
            <motion.button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`px-8 py-3 rounded-lg font-semibold transition-all flex items-center space-x-2 ${
                canProceed()
                  ? 'bg-white text-orange-500 hover:bg-gray-100'
                  : 'bg-white/20 text-white/50 cursor-not-allowed'
              }`}
              whileHover={canProceed() ? { scale: 1.05 } : {}}
              whileTap={canProceed() ? { scale: 0.95 } : {}}
            >
              {currentStep === steps.length - 1 ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Complete</span>
                </>
              ) : (
                <>
                  <span>Next</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </div>

          {/* Completion Animation */}
          <AnimatePresence>
            {isCompleting && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gradient-to-br from-green-500 to-blue-500 rounded-3xl flex items-center justify-center"
              >
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-6xl mb-4"
                  >
                    🌅
                  </motion.div>
                  <motion.h3
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-2xl font-bold text-white mb-2"
                  >
                    Morning check-in complete!
                  </motion.h3>
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-white/80"
                  >
                    +10 wellness points earned
                  </motion.p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
