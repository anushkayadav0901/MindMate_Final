import { useState } from 'react';
import { Smile, Frown, Flame, Zap, Meh, AlertCircle, X } from 'lucide-react';
import { DetectedEmotion } from '../utils/emotionResponses';

interface ManualEmotionSelectorProps {
  readonly onEmotionSelected: (emotion: DetectedEmotion) => void;
  readonly onClose: () => void;
}

export default function ManualEmotionSelector({
  onEmotionSelected,
  onClose,
}: ManualEmotionSelectorProps) {
  const [selectedEmotion, setSelectedEmotion] = useState<DetectedEmotion | null>(null);

  const emotions = [
    { type: 'happy' as DetectedEmotion, icon: Smile, label: 'Happy', color: 'from-yellow-400 to-orange-400' },
    { type: 'sad' as DetectedEmotion, icon: Frown, label: 'Sad', color: 'from-blue-400 to-blue-600' },
    { type: 'angry' as DetectedEmotion, icon: Flame, label: 'Angry', color: 'from-red-400 to-red-600' },
    { type: 'surprised' as DetectedEmotion, icon: Zap, label: 'Surprised', color: 'from-purple-400 to-pink-400' },
    { type: 'neutral' as DetectedEmotion, icon: Meh, label: 'Neutral', color: 'from-gray-400 to-gray-600' },
    { type: 'fearful' as DetectedEmotion, icon: AlertCircle, label: 'Anxious', color: 'from-indigo-400 to-purple-600' },
  ];

  const handleSelect = (emotion: DetectedEmotion) => {
    setSelectedEmotion(emotion);
    setTimeout(() => {
      onEmotionSelected(emotion);
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 max-w-2xl mx-4 animate-fadeIn">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">How are you feeling? 😊</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 transition-all"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <p className="text-white/80 mb-6">
          Select your current emotion and I'll respond with personalized support!
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {emotions.map((emotion) => {
            const Icon = emotion.icon;
            const isSelected = selectedEmotion === emotion.type;

            return (
              <button
                key={emotion.type}
                onClick={() => handleSelect(emotion.type)}
                className={`p-6 rounded-2xl border-2 transition-all transform hover:scale-105 ${
                  isSelected
                    ? 'border-white bg-white/20 scale-105'
                    : 'border-white/20 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div
                  className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r ${emotion.color} flex items-center justify-center`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <p className="text-white font-medium">{emotion.label}</p>
              </button>
            );
          })}
        </div>

        <p className="text-white/50 text-sm mt-6 text-center">
          💡 Tip: Enable camera for automatic emotion detection
        </p>
      </div>
    </div>
  );
}
