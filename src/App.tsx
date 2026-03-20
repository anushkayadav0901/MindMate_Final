import { useState, useEffect, Suspense, lazy } from 'react';
import HomePage from './pages/HomePage';
import RelaxPage from './pages/RelaxPage';
import { MindGamesPage } from './pages/MindGamesPage';
import { InsightsPage } from './pages/InsightsPage';
import CameraExercisePage from './pages/CameraExercisePage';
import { Home, Wind, Award, Glasses, Gamepad2, BarChart3, Activity } from 'lucide-react';
import { supabase } from './lib/supabase';
import ThemeToggle from './components/ThemeToggle';
import AnimatedBackground from './components/AnimatedBackground';
import { useHandTracking } from './hooks/useHandTracking';
import { useRef } from 'react';
import { useTheme } from './context/ThemeContext';

// Lazy load VR Therapy as it contains heavy 3D assets
const VRTherapyPage = lazy(() => import('./components/VRTherapy/VRTherapyPage').then(module => ({ default: module.VRTherapyPage })));

type PageType = 'home' | 'relax' | 'vr-therapy' | 'mind-games' | 'insights' | 'camera-exercise';

interface User {
  id: string;
  email?: string;
  user_metadata?: {
    name?: string;
  };
}

export default function App() {
  const { theme } = useTheme();
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [wellnessPoints, setWellnessPoints] = useState(0);
  const [user, setUser] = useState<User | null>(null);

  // Global gesture tracking
  const globalVideoRef = useRef<HTMLVideoElement>(null);
  const [gestureMode, setGestureMode] = useState(false);
  const { gesture, isReady: isHandReady } = useHandTracking({
    videoElement: globalVideoRef,
    enabled: gestureMode
  });

  useEffect(() => {
    if (!gestureMode || gesture === 'none') return;
    
    // Smooth gesture navigation logic
    if (gesture === 'open_palm') {
      if (currentPage !== 'camera-exercise') handleNavigation('camera-exercise');
    } else if (gesture === 'closed_fist') {
      if (currentPage !== 'home') handleNavigation('home');
    }
  }, [gesture, gestureMode, currentPage]);

  useEffect(() => {
    const points = localStorage.getItem('wellnessPoints');
    if (points) {
      setWellnessPoints(parseInt(points, 10));
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const addWellnessPoints = (points: number) => {
    const newTotal = wellnessPoints + points;
    setWellnessPoints(newTotal);
    localStorage.setItem('wellnessPoints', newTotal.toString());

    if (user) {
      supabase
        .from('users')
        .update({ wellness_points: newTotal })
        .eq('id', user.id)
        .then(({ error }) => {
          if (error) console.error('Error updating wellness points:', error);
        });
    }
  };

  const handleNavigation = (page: PageType) => {
    if (page !== currentPage) {
      setCurrentPage(page);
      if (page !== 'home') {
        addWellnessPoints(10);
      }
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'relax':
        return <RelaxPage />;
      case 'vr-therapy':
        return (
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
              <div className="animate-pulse text-white/50 text-xl font-light">Loading VR Environment...</div>
            </div>
          }>
            <VRTherapyPage onSessionComplete={() => addWellnessPoints(25)} />
          </Suspense>
        );
      case 'mind-games':
        return <MindGamesPage />;
      case 'insights':
        return <InsightsPage />;
      case 'camera-exercise':
        return <CameraExercisePage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden font-sans">
      <div className={`fixed inset-0 -z-10 transition-colors duration-700 ${
        theme === 'dark' ? 'bg-[#110f22]' : 'bg-gradient-to-br from-[#c4e0e5] via-[#a3bded] to-[#e0c3fc]'
      }`} />
      
      <div className="absolute top-6 left-6 z-50 flex items-center gap-3">
        <ThemeToggle />
        <button 
          onClick={() => setGestureMode(!gestureMode)}
          className={`px-4 py-2.5 rounded-2xl backdrop-blur-xl border shadow-sm transition-all text-sm font-medium flex items-center gap-2 ${
            gestureMode 
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-600 dark:text-emerald-400 shadow-emerald-500/20' 
              : 'bg-white/30 border-white/40 text-slate-700 dark:text-white/70 dark:bg-slate-800/40 hover:bg-white/50'
          }`}
        >
          {gestureMode ? '✋ Gestures ON' : '🤚 Gestures OFF'}
        </button>
        {gestureMode && !isHandReady && (
          <span className="text-xs font-bold animate-pulse text-emerald-500">Connecting Camera...</span>
        )}
      </div>

      {gestureMode && (
        <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-3 pointer-events-none">
          <div className="bg-slate-900/80 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-2xl">
            <h4 className="text-white text-sm font-medium mb-3">Gesture Controls Active</h4>
            <div className="flex flex-col gap-2 text-sm text-slate-300">
              <span className="flex items-center gap-2 font-light">🖐️ <strong className="font-semibold">Open Palm</strong> → Movement</span>
              <span className="flex items-center gap-2 font-light">✊ <strong className="font-semibold">Closed Fist</strong> → Home</span>
            </div>
          </div>
          <video 
             ref={globalVideoRef} 
             className="w-48 h-32 object-cover rounded-2xl border-2 border-white/20 shadow-2xl opacity-80 transform -scale-x-100" 
             autoPlay muted playsInline 
          />
        </div>
      )}

      {currentPage === 'home' && <AnimatedBackground />}

      <div className={`fixed top-6 right-6 z-30 flex items-center gap-3 px-5 py-2.5 rounded-2xl backdrop-blur-xl border transition-colors duration-500 ${
        theme === 'dark' 
          ? 'bg-slate-800/60 border-slate-700/50' 
          : 'bg-white/30 border-white/40 drop-shadow-sm'
      }`}>
        <Award className="w-5 h-5 text-amber-400 drop-shadow-md" />
        <div className={theme === 'dark' ? 'text-white' : 'text-slate-800'}>
          <p className="text-[10px] font-medium uppercase tracking-wider opacity-70">Wellness Points</p>
          <p className="text-xl font-bold leading-none mt-0.5">{wellnessPoints}</p>
        </div>
      </div>

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
        <div className={`flex gap-3 p-2.5 rounded-full backdrop-blur-2xl border shadow-xl transition-colors duration-500 ${
          theme === 'dark'
            ? 'bg-slate-800/80 border-slate-700/50'
            : 'bg-white/40 border-white/50'
        }`}>
          {[
            { id: 'home', icon: Home, label: 'Home' },
            { id: 'vr-therapy', icon: Glasses, label: 'VR Therapy' },
            { id: 'mind-games', icon: Gamepad2, label: 'Mind Games' },
            { id: 'camera-exercise', icon: Activity, label: 'Movement' },
            { id: 'relax', icon: Wind, label: 'Relax' },
            { id: 'insights', icon: BarChart3, label: 'Insights' }
          ].map(({ id, icon: Icon, label }) => {
            const isActive = currentPage === id;
            return (
              <button
                key={id}
                onClick={() => handleNavigation(id as PageType)}
                className={`p-3.5 rounded-full transition-all duration-300 group relative flex items-center justify-center ${
                  isActive
                    ? theme === 'dark' 
                      ? 'bg-white/20 text-white shadow-inner scale-105'
                      : 'bg-white/50 text-indigo-900 shadow-sm scale-110'
                    : theme === 'dark'
                      ? 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                      : 'text-slate-600 hover:text-indigo-900 hover:bg-white/30'
                }`}
                aria-label={label}
              >
                <Icon className={`w-5 h-5 ${isActive && theme !== 'dark' ? 'drop-shadow-sm' : ''}`} />
                {isActive && (
                  <span className="absolute -top-10 scale-100 transition-all px-3 py-1 bg-slate-800 text-white text-[10px] uppercase font-bold tracking-wider rounded-lg shadow-lg pointer-events-none opacity-0 group-hover:opacity-100">
                    {label}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      <main className="relative z-10 pt-20 pb-32 h-screen overflow-y-auto overflow-x-hidden selection:bg-indigo-300 selection:text-white">
        {renderPage()}
      </main>

    </div>
  );
}
