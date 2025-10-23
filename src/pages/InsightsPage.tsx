import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, BarChart3, Brain, ArrowRight, ArrowLeft } from 'lucide-react';

export const InsightsPage: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'landing' | 'analytics' | 'insights'>('landing');
  const [showMorningCheckIn, setShowMorningCheckIn] = useState(false);
  
  // Morning check-in form state
  const [sleepRating, setSleepRating] = useState(5);
  const [energyLevel, setEnergyLevel] = useState('');
  const [currentMood, setCurrentMood] = useState('');
  const [checkInStep, setCheckInStep] = useState(1);

  // Auto-show morning check-in if it's morning time
  useEffect(() => {
    const hour = new Date().getHours();
    const completedToday = localStorage.getItem('morningCheckIn_' + new Date().toDateString());
    
    if (hour >= 6 && hour < 11 && !completedToday) {
      setShowMorningCheckIn(true);
    }
  }, []);

  const handleFeatureClick = (feature: string) => {
    console.log('Button clicked:', feature); // Debug log
    
    switch (feature) {
      case 'morning':
        setShowMorningCheckIn(true);
        break;
      case 'analytics':
        setCurrentView('analytics');
        break;
      case 'insights':
        setCurrentView('insights');
        break;
      case 'get-started':
        setShowMorningCheckIn(true);
        break;
      case 'learn-more':
        alert('🧠 MindInsights AI\n\nThis feature provides:\n• Daily mood tracking\n• AI-powered pattern analysis\n• Personalized mental health insights\n• Crisis intervention support\n\nComing soon with full functionality!');
        break;
      default:
        setActiveFeature(feature);
        setTimeout(() => setActiveFeature(null), 2000);
    }
  };

  const handleCheckInComplete = () => {
    // Save to localStorage
    const existingData = JSON.parse(localStorage.getItem('moodCheckIns') || '[]');
    existingData.push({
      sleepRating,
      energyLevel,
      currentMood,
      date: new Date().toISOString(),
      type: 'morning',
      timestamp: Date.now()
    });
    localStorage.setItem('moodCheckIns', JSON.stringify(existingData));
    
    // Mark as completed today
    localStorage.setItem('morningCheckIn_' + new Date().toDateString(), 'true');
    
    // Reset form state
    setSleepRating(5);
    setEnergyLevel('');
    setCurrentMood('');
    setCheckInStep(1);
    
    // Close modal
    setShowMorningCheckIn(false);
    
    // Show success message
    setActiveFeature('checkin-complete');
    setTimeout(() => setActiveFeature(null), 3000);
  };

  const resetCheckInForm = () => {
    setSleepRating(5);
    setEnergyLevel('');
    setCurrentMood('');
    setCheckInStep(1);
    setShowMorningCheckIn(false);
  };

  // ANALYTICS VIEW
  if (currentView === 'analytics') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <button 
            onClick={() => setCurrentView('landing')}
            className="mb-6 flex items-center space-x-2 text-white hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to MindInsights</span>
          </button>
          
          <h1 className="text-4xl font-bold text-white mb-8">📊 Mood Analytics Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl border border-blue-400/30 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Weekly Mood Trend</h3>
              <div className="h-32 bg-white/10 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">Chart coming soon...</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Sleep Quality</h3>
              <div className="h-32 bg-white/10 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">Chart coming soon...</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-green-400/30 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Stress Levels</h3>
              <div className="h-32 bg-white/10 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">Chart coming soon...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // INSIGHTS VIEW
  if (currentView === 'insights') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <button 
            onClick={() => setCurrentView('landing')}
            className="mb-6 flex items-center space-x-2 text-white hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to MindInsights</span>
          </button>
          
          <h1 className="text-4xl font-bold text-white mb-8">🎯 AI Insights Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-xl border border-indigo-400/30 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Pattern Detection</h3>
              <p className="text-gray-300 mb-4">AI analyzes your mood patterns to identify trends and triggers.</p>
              <div className="bg-white/10 rounded-lg p-4">
                <span className="text-gray-400">No data yet - start tracking your mood!</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-pink-500/20 to-rose-500/20 backdrop-blur-xl border border-pink-400/30 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Predictive Insights</h3>
              <p className="text-gray-300 mb-4">Get personalized predictions about your mental wellness.</p>
              <div className="bg-white/10 rounded-lg p-4">
                <span className="text-gray-400">Insights will appear as you use the app more!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // LANDING VIEW (Default)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-4">🧠 MindInsights AI</h1>
          <p className="text-xl text-gray-300">Advanced mood analytics and AI-powered mental health insights</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl border border-blue-400/30 rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer"
            onClick={() => handleFeatureClick('morning')}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <CheckCircle className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Morning Check-In</h3>
            </div>
            <p className="text-gray-300 mb-4">Start your day with a mindful check-in</p>
            <motion.button 
              className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Start Check-In</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer"
            onClick={() => handleFeatureClick('analytics')}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <BarChart3 className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Mood Analytics</h3>
            </div>
            <p className="text-gray-300 mb-4">Track your mood patterns over time</p>
            <motion.button 
              className="w-full py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>View Analytics</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-green-400/30 rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer"
            onClick={() => handleFeatureClick('insights')}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <Brain className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white">AI Insights</h3>
            </div>
            <p className="text-gray-300 mb-4">Get personalized mental health insights</p>
            <motion.button 
              className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>View Insights</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-400/30 rounded-2xl p-8"
        >
          <h2 className="text-3xl font-bold text-white mb-4">🔮 AI-Powered Mental Health Analytics</h2>
          <p className="text-gray-300 mb-6 text-lg">
            Track your mood, discover patterns, and get personalized insights to improve your mental wellness.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <motion.button 
              className="px-8 py-4 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-semibold flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleFeatureClick('get-started')}
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button 
              className="px-8 py-4 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleFeatureClick('learn-more')}
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>

        {/* Success Messages */}
        {activeFeature && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-green-500 text-white px-8 py-4 rounded-2xl shadow-2xl"
          >
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6" />
              <span className="font-semibold">
                {activeFeature === 'checkin-complete' && 'Morning check-in completed! 🌅'}
                {activeFeature === 'morning' && 'Opening morning check-in...'}
                {activeFeature === 'analytics' && 'Opening analytics dashboard...'}
                {activeFeature === 'insights' && 'Opening AI insights...'}
                {activeFeature === 'get-started' && 'Welcome to MindInsights AI! 🚀'}
                {activeFeature === 'learn-more' && 'Learn more about our AI features! 📚'}
              </span>
            </div>
          </motion.div>
        )}

        {/* Interactive Morning Check-In Modal */}
        {showMorningCheckIn && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-full max-w-2xl bg-gradient-to-br from-orange-400 to-blue-400 rounded-3xl p-8 mx-4"
            >
              <button 
                onClick={resetCheckInForm}
                className="absolute top-4 right-4 text-white text-2xl hover:text-gray-200"
              >
                ✕
              </button>

              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-6">🌅 Morning Check-In</h2>
                
                <div className="space-y-6">
                  {/* Sleep Rating */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">How was your sleep?</h3>
                    <div className="flex justify-center space-x-1 mb-4">
                      {[1,2,3,4,5,6,7,8,9,10].map((star) => (
                        <button
                          key={star}
                          onClick={() => setSleepRating(star)}
                          className={`text-3xl transition-all duration-200 hover:scale-110 ${
                            star <= sleepRating ? 'text-yellow-300' : 'text-gray-400'
                          }`}
                        >
                          ⭐
                        </button>
                      ))}
                    </div>
                    <p className="text-white/80">Rating: {sleepRating}/10</p>
                  </div>

                  {/* Energy Level */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Energy Level</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {['Low', 'Medium', 'High'].map((level) => (
                        <button 
                          key={level}
                          onClick={() => setEnergyLevel(level.toLowerCase())}
                          className={`p-4 rounded-lg text-white transition-all duration-200 hover:scale-105 ${
                            energyLevel === level.toLowerCase() 
                              ? 'bg-white/40 ring-2 ring-white/60' 
                              : 'bg-white/20 hover:bg-white/30'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                    {energyLevel && <p className="text-white/80 mt-2">Selected: {energyLevel}</p>}
                  </div>

                  {/* Current Mood */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Current Mood</h3>
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { emoji: '😊', label: 'Happy' },
                        { emoji: '😌', label: 'Calm' },
                        { emoji: '😐', label: 'Neutral' },
                        { emoji: '😟', label: 'Worried' },
                        { emoji: '😢', label: 'Sad' },
                        { emoji: '😠', label: 'Angry' },
                        { emoji: '😰', label: 'Anxious' },
                        { emoji: '😴', label: 'Tired' }
                      ].map((mood) => (
                        <button 
                          key={mood.emoji}
                          onClick={() => setCurrentMood(mood.label.toLowerCase())}
                          className={`p-3 rounded-lg text-2xl transition-all duration-200 hover:scale-110 ${
                            currentMood === mood.label.toLowerCase() 
                              ? 'bg-white/40 ring-2 ring-white/60' 
                              : 'bg-white/20 hover:bg-white/30'
                          }`}
                          title={mood.label}
                        >
                          {mood.emoji}
                        </button>
                      ))}
                    </div>
                    {currentMood && <p className="text-white/80 mt-2">Selected: {currentMood}</p>}
                  </div>
                </div>

                <div className="mt-8 flex space-x-4 justify-center">
                  <button
                    onClick={resetCheckInForm}
                    className="px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                  >
                    Skip
                  </button>
                  <button
                    onClick={handleCheckInComplete}
                    disabled={!energyLevel || !currentMood}
                    className={`px-8 py-3 rounded-lg transition-colors font-semibold ${
                      energyLevel && currentMood
                        ? 'bg-white text-orange-500 hover:bg-gray-100'
                        : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    Complete Check-In
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};