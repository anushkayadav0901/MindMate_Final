import { useEffect, useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { DetectedEmotion, getEmotionColor } from '../utils/emotionResponses';

interface EmotionChatBubbleProps {
  readonly message: string;
  readonly emotion: DetectedEmotion;
  readonly onClose: () => void;
  readonly onActionClick?: () => void;
  readonly actionText?: string;
  readonly duration?: number; // milliseconds
}

export default function EmotionChatBubble({
  message,
  emotion,
  onClose,
  onActionClick,
  actionText,
  duration = 10000,
}: EmotionChatBubbleProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  const colors = getEmotionColor(emotion);

  useEffect(() => {
    // Fade in animation
    setTimeout(() => setIsVisible(true), 100);

    // Progress bar countdown
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - (100 / (duration / 100));
        if (newProgress <= 0) {
          clearInterval(progressInterval);
          return 0;
        }
        return newProgress;
      });
    }, 100);

    // Auto close after duration
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [duration, onClose]);

  return (
    <div
      className={`fixed bottom-32 left-1/2 -translate-x-1/2 z-40 max-w-2xl w-full px-4 transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      <div className="relative">
        {/* Main bubble */}
        <div
          className="relative rounded-3xl p-6 shadow-2xl backdrop-blur-lg border border-white/20 animate-bounce-gentle"
          style={{
            background: `linear-gradient(135deg, ${colors.from}40, ${colors.to}40)`,
          }}
        >
          {/* Close button */}
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="absolute top-3 right-3 p-2 rounded-xl hover:bg-white/10 transition-all"
          >
            <X className="w-4 h-4 text-white" />
          </button>

          {/* Emotion indicator */}
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-3 h-3 rounded-full animate-pulse"
              style={{
                background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
              }}
            />
            <p className="text-white/70 text-sm font-medium capitalize">{emotion}</p>
          </div>

          {/* Message */}
          <p className="text-white text-lg leading-relaxed mb-4 pr-8">{message}</p>

          {/* Action button */}
          {actionText && onActionClick && (
            <button
              onClick={onActionClick}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/20 hover:bg-white/30 border border-white/30 text-white font-medium transition-all hover:scale-105"
            >
              {actionText}
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 rounded-b-3xl overflow-hidden">
            <div
              className="h-full transition-all duration-100 ease-linear"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${colors.from}, ${colors.to})`,
              }}
            />
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-2 -left-2 w-4 h-4 rounded-full bg-white/20 animate-ping" />
        <div className="absolute -top-3 -right-3 w-3 h-3 rounded-full bg-white/30 animate-ping delay-100" />
        <div className="absolute -bottom-2 left-1/4 w-3 h-3 rounded-full bg-white/20 animate-ping delay-200" />
      </div>

      <style>{`
        @keyframes bounce-gentle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }

        .delay-100 {
          animation-delay: 100ms;
        }

        .delay-200 {
          animation-delay: 200ms;
        }
      `}</style>
    </div>
  );
}
