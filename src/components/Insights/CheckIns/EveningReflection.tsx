import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Moon, Star, Heart, ArrowRight, Check } from 'lucide-react';
import { CheckInData } from '../../../types/insights.types';
import { saveCheckIn, hasCheckInToday, getCheckInsByDate } from '../../../utils/moodStorage';

interface EveningReflectionProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const EveningReflection: React.FC<EveningReflectionProps> = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [checkInData, setCheckInData] = useState<CheckInData>({});
  const [isCompleting, setIsCompleting] = useState(false);
  const [morningData, setMorningData] = useState<any>(null);

  const steps = [
    { id: 'rating', title: 'Day Rating', icon: Star },
    { id: 'gratitude', title: 'Gratitude', icon: Heart },
    { id: 'challenges', title: 'Challenges', icon: Moon },
    { id: 'stress', title: 'End Stress', icon: Heart }
  ];

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setCheckInData({});
      
      // Get morning data for comparison
      const today = new Date().toISOString().split('T')[0];
      const morningCheckIn = getCheckInsByDate(today).find(ci => ci.type === 'morning');
      setMorningData(morningCheckIn);
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
      type: 'evening' as const,
      timestamp: Date.now(),
      ...checkInData
    };
    
    saveCheckIn(checkIn);
    
    // Calm particles animation
    setTimeout(() => {
      setIsCompleting(false);
      onComplete();
    }, 2000);
  };

  const getDayRatingMessage = (rating: number) => {
    if (rating <= 3) return "Tough day. Tomorrow is fresh start.";
    if (rating <= 6) return "Could be better. Let's improve.";
    if (rating <= 8) return "Good day! You're doing well.";
    return "Amazing! Keep this energy!";
  };

  const getDayRatingColor = (rating: number) => {
    if (rating <= 3) return 'text-red-400';
    if (rating <= 6) return 'text-yellow-400';
    if (rating <= 8) return 'text-green-400';
    return 'text-green-500';
  };

  const calculateStressChange = () => {
    if (!morningData || !checkInData.endStress) return null;
    
    const morningStress = morningData.endStress || (10 - (morningData.sleep || 5));
    const eveningStress = checkInData.endStress;
    const change = morningStress - eveningStress;
    const percentage = Math.round((change / morningStress) * 100);
    
    return { change, percentage };
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-8">How was your day overall?</h3>
            <div className="mb-8">
              <div className="flex justify-center space-x-2 mb-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                  <motion.button
                    key={star}
                    onClick={() => setCheckInData(prev => ({ ...prev, dayRating: star }))}
                    className="text-4xl transition-all hover:scale-110"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {star <= (checkInData.dayRating || 0) ? '⭐' : '☆'}
                  </motion.button>
                ))}
              </div>
              <div className={`text-2xl font-bold mb-4 ${getDayRatingColor(checkInData.dayRating || 0)}`}>
                {checkInData.dayRating || 0}/10
              </div>
              <motion.p
                key={checkInData.dayRating}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg text-white/80"
              >
                {getDayRatingMessage(checkInData.dayRating || 0)}
              </motion.p>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-6">What went well today?</h3>
            <div className="mb-6">
              <textarea
                value={checkInData.gratitude || ''}
                onChange={(e) => setCheckInData(prev => ({ ...prev, gratitude: e.target.value }))}
                placeholder="Even small things matter..."
                className="w-full h-32 p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 resize-none focus:outline-none focus:border-white/40"
                maxLength={500}
              />
              <div className="text-right text-sm text-white/50 mt-2">
                {(checkInData.gratitude || '').length}/500
              </div>
            </div>
            <button
              onClick={() => setCheckInData(prev => ({ ...prev, gratitude: '' }))}
              className="px-6 py-3 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 transition-colors"
            >
              Skip
            </button>
          </div>
        );

      case 2:
        return (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-6">What was challenging?</h3>
            <div className="mb-6">
              <textarea
                value={checkInData.challenges || ''}
                onChange={(e) => setCheckInData(prev => ({ ...prev, challenges: e.target.value }))}
                placeholder="Reflection helps process..."
                className="w-full h-32 p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 resize-none focus:outline-none focus:border-white/40"
                maxLength={500}
              />
              <div className="text-right text-sm text-white/50 mt-2">
                {(checkInData.challenges || '').length}/500
              </div>
            </div>
            <button
              onClick={() => setCheckInData(prev => ({ ...prev, challenges: '' }))}
              className="px-6 py-3 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 transition-colors"
            >
              Skip
            </button>
          </div>
        );

      case 3:
        const stressChange = calculateStressChange();
        return (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-8">Stress level right now?</h3>
            <div className="mb-8">
              <div className="text-4xl mb-4">
                {checkInData.endStress === undefined ? '😐' : 
                 checkInData.endStress <= 3 ? '😌' :
                 checkInData.endStress <= 6 ? '😐' :
                 checkInData.endStress <= 8 ? '😰' : '😫'}
              </div>
              <div className={`text-3xl font-bold mb-4 ${
                checkInData.endStress === undefined ? 'text-gray-400' :
                checkInData.endStress <= 3 ? 'text-green-400' :
                checkInData.endStress <= 6 ? 'text-yellow-400' :
                checkInData.endStress <= 8 ? 'text-orange-400' : 'text-red-400'
              }`}>
                {checkInData.endStress || 0}/10
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={checkInData.endStress || 0}
                onChange={(e) => setCheckInData(prev => ({ ...prev, endStress: parseInt(e.target.value) }))}
                className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
            
            {stressChange && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg mb-6 ${
                  stressChange.change > 0 ? 'bg-green-500/20 border border-green-400' : 'bg-red-500/20 border border-red-400'
                }`}
              >
                <div className={`text-lg font-semibold ${
                  stressChange.change > 0 ? 'text-green-300' : 'text-red-300'
                }`}>
                  {stressChange.change > 0 ? '📉' : '📈'} Your stress {stressChange.change > 0 ? 'decreased' : 'increased'} {Math.abs(stressChange.percentage)}% today!
                </div>
              </motion.div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return checkInData.dayRating !== undefined;
      case 1: return true; // Gratitude is optional
      case 2: return true; // Challenges are optional
      case 3: return checkInData.endStress !== undefined;
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
          className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Moon className="w-8 h-8 text-white" />
              <h2 className="text-2xl font-bold text-white">Evening Reflection</h2>
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
                  ? 'bg-white text-purple-500 hover:bg-gray-100'
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
                className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center"
              >
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-6xl mb-4"
                  >
                    🌙
                  </motion.div>
                  <motion.h3
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-2xl font-bold text-white mb-2"
                  >
                    Rest well. See you tomorrow
                  </motion.h3>
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-white/80"
                  >
                    +15 wellness points earned
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
