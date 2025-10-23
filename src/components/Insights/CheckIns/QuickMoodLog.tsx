import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { saveQuickMoodLog, getQuickMoodLogs } from '../../../utils/moodStorage';

interface QuickMoodLogProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const quickMoodOptions = [
  { emoji: '😊', label: 'Happy', value: 'happy' },
  { emoji: '😌', label: 'Calm', value: 'calm' },
  { emoji: '😐', label: 'Neutral', value: 'neutral' },
  { emoji: '😟', label: 'Worried', value: 'worried' },
  { emoji: '😰', label: 'Anxious', value: 'anxious' }
];

export const QuickMoodLog: React.FC<QuickMoodLogProps> = ({ isOpen, onClose, onComplete }) => {
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedMood) return;
    
    setIsSubmitting(true);
    
    // Save quick mood log
    const moodLog = {
      id: `quick-${Date.now()}`,
      mood: selectedMood,
      note: note.trim() || undefined,
      timestamp: Date.now()
    };
    
    saveQuickMoodLog(moodLog);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setSelectedMood('');
      setNote('');
      onComplete();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0, 0, 0, 0.6)' }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 max-w-md w-full border border-white/10"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Quick Mood Log</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Mood Selection */}
          <div className="mb-6">
            <p className="text-gray-300 mb-4">How are you feeling right now?</p>
            <div className="grid grid-cols-5 gap-3">
              {quickMoodOptions.map(({ emoji, label, value }) => (
                <motion.button
                  key={value}
                  onClick={() => setSelectedMood(value)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedMood === value
                      ? 'border-blue-400 bg-blue-500/20 scale-105'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-2xl mb-1">{emoji}</div>
                  <div className={`text-xs font-medium ${
                    selectedMood === value ? 'text-blue-300' : 'text-gray-300'
                  }`}>
                    {label}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Note Input */}
          <div className="mb-6">
            <p className="text-gray-300 mb-3">Add a note (optional)</p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full h-20 p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 resize-none focus:outline-none focus:border-white/40"
              maxLength={200}
            />
            <div className="text-right text-xs text-white/50 mt-1">
              {note.length}/200
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            onClick={handleSubmit}
            disabled={!selectedMood || isSubmitting}
            className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 ${
              selectedMood && !isSubmitting
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-white/20 text-white/50 cursor-not-allowed'
            }`}
            whileHover={selectedMood && !isSubmitting ? { scale: 1.02 } : {}}
            whileTap={selectedMood && !isSubmitting ? { scale: 0.98 } : {}}
          >
            {isSubmitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                <span>Logging...</span>
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                <span>Log Mood</span>
              </>
            )}
          </motion.button>

          {/* Success Animation */}
          <AnimatePresence>
            {isSubmitting && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center"
              >
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl mb-2"
                  >
                    ✅
                  </motion.div>
                  <motion.p
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-white font-semibold"
                  >
                    Mood logged!
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

// Floating Action Button Component
interface FloatingMoodButtonProps {
  onClick: () => void;
}

export const FloatingMoodButton: React.FC<FloatingMoodButtonProps> = ({ onClick }) => {
  const [recentMood, setRecentMood] = useState<string>('neutral');

  React.useEffect(() => {
    // Get most recent mood for button display
    const logs = getQuickMoodLogs();
    if (logs.length > 0) {
      setRecentMood(logs[logs.length - 1].mood);
    }
  }, []);

  const getMoodEmoji = (mood: string) => {
    const moodEmojis: Record<string, string> = {
      'happy': '😊',
      'calm': '😌',
      'neutral': '😐',
      'worried': '😟',
      'anxious': '😰',
      'sad': '😢',
      'frustrated': '😠',
      'tired': '😴'
    };
    return moodEmojis[mood] || '😐';
  };

  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-20 right-6 z-40 w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full shadow-lg flex items-center justify-center text-white text-2xl hover:shadow-xl transition-all"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      animate={{ 
        scale: [1, 1.05, 1],
        boxShadow: [
          '0 4px 20px rgba(59, 130, 246, 0.3)',
          '0 8px 30px rgba(59, 130, 246, 0.5)',
          '0 4px 20px rgba(59, 130, 246, 0.3)'
        ]
      }}
      transition={{ 
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {getMoodEmoji(recentMood)}
    </motion.button>
  );
};
