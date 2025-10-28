import { useState, useEffect } from 'react';
import EmotionAwareHomePage from './pages/EmotionAwareHomePage';
import LearnPage from './pages/LearnPage';
import RelaxPage from './pages/RelaxPage';
import ChatPage from './pages/ChatPage';
import { VRTherapyPage } from './components/VRTherapy/VRTherapyPage';
import { MindGamesPage } from './pages/MindGamesPage';
import { InsightsPage } from './pages/InsightsPage';
import { Home, BookOpen, Wind, MessageCircle, Award, Glasses, Gamepad2, BarChart3 } from 'lucide-react';
import { supabase } from './lib/supabase';
import InteractiveMeditationScene from './components/InteractiveMeditationScene';
import ThemeToggle from './components/ThemeToggle';
import { useTheme } from './context/ThemeContext';


type PageType = 'home' | 'learn' | 'relax' | 'chat' | 'vr-therapy' | 'mind-games' | 'insights';

interface User {
  id: string;
  email?: string;
  user_metadata?: {
    name?: string;
  };
}

function App() {
  const { theme } = useTheme();
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [wellnessPoints, setWellnessPoints] = useState(0);
  const [user, setUser] = useState<User | null>(null);

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

  const handleMoodDetected = async (mood: string) => {
    addWellnessPoints(5);

    if (user) {
      await supabase.from('mood_logs').insert({
        user_id: user.id,
        mood,
        activity: currentPage,
      });
    }
  };

  const handleNavigation = (page: PageType) => {
    setCurrentPage(page);
    if (page !== 'home') {
      addWellnessPoints(10);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <EmotionAwareHomePage
            onNavigate={handleNavigation}
            onMoodDetected={handleMoodDetected}
            addWellnessPoints={addWellnessPoints}
          />
        );
      case 'learn':
        return <LearnPage />;
      case 'relax':
        return <RelaxPage />;
      case 'chat':
        return <ChatPage />;
      case 'vr-therapy':
        return <VRTherapyPage onSessionComplete={() => addWellnessPoints(25)} />;
      case 'mind-games':
        return <MindGamesPage />;
      case 'insights':
        return <InsightsPage />;
      default:
        return (
          <EmotionAwareHomePage
            onNavigate={handleNavigation}
            onMoodDetected={handleMoodDetected}
            addWellnessPoints={addWellnessPoints}
          />
        );
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className={`fixed inset-0 -z-10 transition-colors duration-300 ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-[#667eea]'
      }`} />
      
      {/* Theme Toggle Button */}
      <ThemeToggle />
      
      {/* Interactive Meditation Scene - only on home page */}
      {currentPage === 'home' && <InteractiveMeditationScene />}

      <div className={`fixed top-6 right-6 z-30 flex items-center gap-3 px-6 py-3 rounded-2xl backdrop-blur-lg border transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-gray-800/50 border-gray-700/50' 
          : 'bg-white/10 border-white/20'
      }`}>
        <Award className="w-6 h-6 text-yellow-300" />
        <div className={theme === 'dark' ? 'text-white' : 'text-white'}>
          <p className="text-sm font-light">Wellness Points</p>
          <p className="text-2xl font-medium">{wellnessPoints}</p>
        </div>
      </div>

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
        <div className={`flex gap-2 p-3 rounded-3xl backdrop-blur-lg border shadow-2xl transition-colors duration-300 ${
          theme === 'dark'
            ? 'bg-gray-800/50 border-gray-700/50'
            : 'bg-white/10 border-white/20'
        }`}>
          <button
            onClick={() => handleNavigation('home')}
            className={`p-4 rounded-2xl transition-all ${
              currentPage === 'home'
                ? theme === 'dark' 
                  ? 'bg-white/20 text-white scale-110'
                  : 'bg-white/30 text-white scale-110'
                : theme === 'dark'
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
            title="Home"
          >
            <Home className="w-6 h-6" />
          </button>
          <button
            onClick={() => handleNavigation('learn')}
            className={`p-4 rounded-2xl transition-all ${
              currentPage === 'learn'
                ? 'bg-white/30 text-white scale-110'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
            title="Learn"
          >
            <BookOpen className="w-6 h-6" />
          </button>
          <button
            onClick={() => handleNavigation('relax')}
            className={`p-4 rounded-2xl transition-all ${
              currentPage === 'relax'
                ? 'bg-white/30 text-white scale-110'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
            title="Relax"
          >
            <Wind className="w-6 h-6" />
          </button>
          <button
            onClick={() => handleNavigation('chat')}
            className={`p-4 rounded-2xl transition-all ${
              currentPage === 'chat'
                ? 'bg-white/30 text-white scale-110'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
            title="Chat"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
          <button
            onClick={() => handleNavigation('vr-therapy')}
            className={`p-4 rounded-2xl transition-all ${
              currentPage === 'vr-therapy'
                ? 'bg-white/30 text-white scale-110'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
            title="VR Therapy"
          >
            <Glasses className="w-6 h-6" />
          </button>
          <button
            onClick={() => handleNavigation('mind-games')}
            className={`p-4 rounded-2xl transition-all ${
              currentPage === 'mind-games'
                ? 'bg-white/30 text-white scale-110'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
            title="MindGames"
          >
            <Gamepad2 className="w-6 h-6" />
          </button>
          <button
            onClick={() => handleNavigation('insights')}
            className={`p-4 rounded-2xl transition-all ${
              currentPage === 'insights'
                ? 'bg-white/30 text-white scale-110'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
            title="Insights"
          >
            <BarChart3 className="w-6 h-6" />
          </button>
        </div>
      </nav>

      <main className="relative z-10">{renderPage()}</main>

    </div>
  );
}

export default App;
