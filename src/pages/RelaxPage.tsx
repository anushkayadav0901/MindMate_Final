import { useState } from 'react';
import BreathingExercise from '../components/BreathingExercise';
import InfinityBreath from '../components/InfinityBreath';
import { fetchMotivationalQuote, type Quote } from '../utils/quotes';
import { Sparkles, Wind, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function RelaxPage() {
  const { theme } = useTheme();
  const [mode, setMode] = useState<'choose' | 'breathing' | 'infinity' | 'quote'>('choose');
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);

  const handleBreathingComplete = () => {
    setMode('quote');
    loadQuote();
  };

  const loadQuote = async () => {
    setLoading(true);
    const newQuote = await fetchMotivationalQuote();
    setQuote(newQuote);
    setLoading(false);
  };

  const startBreathing = () => setMode('breathing');
  const startInfinity = () => setMode('infinity');
  const startQuotes = () => {
    setMode('quote');
    loadQuote();
  };

  const renderQuoteContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-400 border-t-transparent" />
          <p className={theme === 'dark' ? 'text-white/70' : 'text-slate-600'}>Finding inspiration...</p>
        </div>
      );
    }

    if (quote) {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="space-y-8 w-full max-w-2xl mx-auto"
        >
          <div className={`p-10 rounded-3xl backdrop-blur-xl border shadow-xl ${
            theme === 'dark' ? 'bg-slate-800/40 border-white/10' : 'bg-white/40 border-white/50'
          }`}>
            <Sparkles className="w-10 h-10 text-yellow-400 mx-auto mb-8 drop-shadow-md" />
            <blockquote className={`text-3xl font-light text-center leading-relaxed mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-slate-800'
            }`}>
              "{quote.text}"
            </blockquote>
            <p className={`text-center text-lg font-medium opacity-80 ${
              theme === 'dark' ? 'text-white/70' : 'text-slate-600'
            }`}>- {quote.author}</p>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={loadQuote}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-400 text-white font-medium hover:shadow-lg hover:scale-105 transition-all text-lg shadow-teal-500/20"
            >
              Another Quote
            </button>
            <button
              onClick={() => setMode('choose')}
              className={`px-8 py-4 rounded-2xl backdrop-blur-lg border transition-all text-lg font-medium hover:scale-105 ${
                theme === 'dark' ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' : 'bg-white/40 border-slate-200 text-slate-700 hover:bg-white/60'
              }`}
            >
              Back
            </button>
          </div>
        </motion.div>
      );
    }
    return null;
  };

  const renderChooseMode = () => (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className={`text-4xl md:text-5xl font-light mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
          Choose Your <span className="font-medium bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">Peace</span>
        </h1>
        <p className={`text-lg font-light ${theme === 'dark' ? 'text-white/70' : 'text-slate-600'}`}>
          Take a moment for yourself. How would you like to relax?
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        <motion.button
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={startBreathing}
          className={`group p-10 rounded-3xl backdrop-blur-xl border border-white/20 transition-all hover:shadow-2xl text-left flex flex-col items-center justify-center ${
            theme === 'dark' ? 'bg-white/10 hover:bg-white/20' : 'bg-white/40 hover:bg-white/60 shadow-lg'
          }`}
        >
          <Wind className="w-16 h-16 text-sky-400 mx-auto mb-6 group-hover:scale-110 transition-transform drop-shadow-sm" />
          <h3 className={`text-2xl font-medium mb-3 text-center ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Breathing Exercise</h3>
          <p className={`text-center ${theme === 'dark' ? 'text-white/70' : 'text-slate-600'}`}>Follow the gentle rhythm for 30 seconds</p>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={startInfinity}
          className={`group p-10 rounded-3xl backdrop-blur-xl border border-white/20 transition-all hover:shadow-2xl text-left flex flex-col items-center justify-center ${
            theme === 'dark' ? 'bg-white/10 hover:bg-white/20' : 'bg-white/40 hover:bg-white/60 shadow-lg'
          }`}
        >
          <Activity className="w-16 h-16 text-teal-400 mx-auto mb-6 group-hover:scale-110 transition-transform drop-shadow-sm" />
          <h3 className={`text-2xl font-medium mb-3 text-center ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>The Infinity Breath</h3>
          <p className={`text-center ${theme === 'dark' ? 'text-white/70' : 'text-slate-600'}`}>Interactive, tactile pacing guided by your hands</p>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={startQuotes}
          className={`group p-10 rounded-3xl backdrop-blur-xl border border-white/20 transition-all hover:shadow-2xl text-left flex flex-col items-center justify-center md:col-span-2 lg:col-span-1 ${
            theme === 'dark' ? 'bg-white/10 hover:bg-white/20' : 'bg-white/40 hover:bg-white/60 shadow-lg'
          }`}
        >
          <Sparkles className="w-16 h-16 text-amber-400 mx-auto mb-6 group-hover:scale-110 transition-transform drop-shadow-sm" />
          <h3 className={`text-2xl font-medium mb-3 text-center ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Motivational Quotes</h3>
          <p className={`text-center ${theme === 'dark' ? 'text-white/70' : 'text-slate-600'}`}>Find inspiration and uplifting wisdom</p>
        </motion.button>
      </div>
    </div>
  );

  const renderBreathingMode = () => (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] px-4">
      <BreathingExercise duration={30} onComplete={handleBreathingComplete} />
    </div>
  );

  return (
    <div className="w-full">
      {mode === 'choose' && renderChooseMode()}
      {mode === 'breathing' && renderBreathingMode()}
      {mode === 'infinity' && (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] px-4 py-8">
          <InfinityBreath />
          <button
            onClick={() => setMode('choose')}
            className={`mt-8 px-8 py-3 rounded-2xl backdrop-blur-lg border transition-all font-medium hover:scale-105 ${
              theme === 'dark' ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' : 'bg-white/40 border-slate-200 text-slate-700 hover:bg-white/60'
            }`}
          >
            Go Back
          </button>
        </div>
      )}
      {mode === 'quote' && (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] px-4">
          {renderQuoteContent()}
        </div>
      )}
    </div>
  );
}