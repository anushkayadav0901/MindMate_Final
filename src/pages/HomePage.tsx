import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useEmotionTracking } from '../hooks/useEmotionTracking';
import { CompanionAvatar } from '../components/CompanionAvatar';
import { useRef } from 'react';

export default function HomePage() {
  const { theme } = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);

  const { emotion } = useEmotionTracking({
    videoElement: videoRef,
    enabled: true
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] w-full px-4 sm:px-6 md:px-8 py-10 relative">
      <video
        ref={videoRef}
        className="hidden"
        autoPlay
        playsInline
        muted
      />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center w-full max-w-4xl flex flex-col items-center justify-center relative z-10"
      >
        <div className="bg-white/30 dark:bg-slate-800/60 p-8 rounded-full mb-10 backdrop-blur-xl border border-white/40 shadow-2xl shadow-emerald-500/20">
            <Leaf className="w-20 h-20 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h1 className={`text-6xl sm:text-7xl md:text-8xl font-light mb-8 tracking-tight drop-shadow-sm ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
          Welcome to <br className="block sm:hidden" /><span className="font-semibold bg-gradient-to-r from-teal-500 to-indigo-600 dark:from-teal-300 dark:to-indigo-400 bg-clip-text text-transparent">MindMate</span>
        </h1>
        <p className={`text-xl sm:text-2xl font-light leading-relaxed max-w-2xl px-4 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
          Your interactive space for calm, focus, and mental clarity. Navigate using the menu below to begin your journey.
        </p>
      </motion.div>

      <CompanionAvatar emotion={emotion} />
    </div>
  );
}