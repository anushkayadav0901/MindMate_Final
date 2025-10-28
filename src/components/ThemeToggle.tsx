import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`fixed top-6 left-6 z-50 p-3 rounded-2xl backdrop-blur-lg border transition-all duration-300 ${
        theme === 'dark'
          ? 'bg-white/10 border-white/20 hover:bg-white/20'
          : 'bg-purple-500/20 border-purple-400/30 hover:bg-purple-500/30'
      }`}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-yellow-300" />
      ) : (
        <Moon className="w-5 h-5 text-white" />
      )}
    </button>
  );
}

