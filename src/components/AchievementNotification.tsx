import { useEffect, useState } from 'react';
import { Trophy, X, Star } from 'lucide-react';
import { Achievement } from '../utils/avatarPersonality';

interface AchievementNotificationProps {
  readonly achievement: Achievement;
  readonly onClose: () => void;
}

export default function AchievementNotification({ achievement, onClose }: AchievementNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade in animation
    setTimeout(() => setIsVisible(true), 100);

    // Auto close after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-24 right-6 z-50 transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className="relative">
        {/* Celebration particles */}
        <div className="absolute -inset-4 flex items-center justify-center pointer-events-none">
          <Star className="absolute -top-2 -left-2 w-4 h-4 text-yellow-300 animate-ping" />
          <Star className="absolute -top-2 -right-2 w-4 h-4 text-yellow-300 animate-ping delay-100" />
          <Star className="absolute -bottom-2 -left-2 w-4 h-4 text-yellow-300 animate-ping delay-200" />
          <Star className="absolute -bottom-2 -right-2 w-4 h-4 text-yellow-300 animate-ping delay-300" />
        </div>

        {/* Main notification card */}
        <div className="relative bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-6 shadow-2xl min-w-[320px] animate-bounce-once">
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="absolute top-2 right-2 p-1 rounded-lg hover:bg-white/20 transition-all"
          >
            <X className="w-4 h-4 text-white" />
          </button>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl animate-pulse">
                {achievement.icon}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Trophy className="w-5 h-5 text-white" />
                <h3 className="text-white font-bold text-lg">Achievement Unlocked!</h3>
              </div>
              <h4 className="text-white font-semibold text-xl mb-1">{achievement.title}</h4>
              <p className="text-white/90 text-sm">{achievement.description}</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce-once {
          0%, 100% {
            transform: translateY(0);
          }
          25% {
            transform: translateY(-10px);
          }
          50% {
            transform: translateY(0);
          }
          75% {
            transform: translateY(-5px);
          }
        }

        .animate-bounce-once {
          animation: bounce-once 0.6s ease-out;
        }

        .delay-100 {
          animation-delay: 100ms;
        }

        .delay-200 {
          animation-delay: 200ms;
        }

        .delay-300 {
          animation-delay: 300ms;
        }
      `}</style>
    </div>
  );
}
