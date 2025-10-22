import { useState } from 'react';
import { Palette, Volume2, User, Sparkles, X } from 'lucide-react';
import { avatarPersonality, PersonalityTrait, LearningStyle } from '../utils/avatarPersonality';

interface AvatarCustomizationProps {
  readonly onClose: () => void;
  readonly onUpdate: () => void;
}

export default function AvatarCustomization({ onClose, onUpdate }: AvatarCustomizationProps) {
  const profile = avatarPersonality.getUserProfile();
  const [name, setName] = useState(profile.name);
  const [learningStyle, setLearningStyle] = useState<LearningStyle>(profile.learningStyle);
  const [personality, setPersonality] = useState<PersonalityTrait>(profile.avatarPersonality);
  const [language, setLanguage] = useState(profile.preferredLanguage);

  const handleSave = () => {
    const updatedProfile = {
      ...profile,
      name,
      learningStyle,
      avatarPersonality: personality,
      preferredLanguage: language,
    };
    avatarPersonality.saveUserProfile(updatedProfile);
    onUpdate();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-yellow-300" />
            <h2 className="text-2xl font-light text-white">Customize Your Avatar</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 transition-all"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Name Section */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-white mb-2">
            <User className="w-5 h-5" />
            <span className="font-medium">Your Name</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <p className="text-white/60 text-sm mt-2">
            Your avatar will use your name in conversations
          </p>
        </div>

        {/* Learning Style Section */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-white mb-3">
            <Palette className="w-5 h-5" />
            <span className="font-medium">Learning Style</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setLearningStyle('visual')}
              className={`p-4 rounded-xl border-2 transition-all ${
                learningStyle === 'visual'
                  ? 'border-teal-400 bg-teal-400/20'
                  : 'border-white/20 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="text-white font-medium mb-1">👁️ Visual</div>
              <div className="text-white/60 text-sm">Learn through images & diagrams</div>
            </button>

            <button
              onClick={() => setLearningStyle('auditory')}
              className={`p-4 rounded-xl border-2 transition-all ${
                learningStyle === 'auditory'
                  ? 'border-teal-400 bg-teal-400/20'
                  : 'border-white/20 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="text-white font-medium mb-1">🎧 Auditory</div>
              <div className="text-white/60 text-sm">Learn through listening</div>
            </button>

            <button
              onClick={() => setLearningStyle('kinesthetic')}
              className={`p-4 rounded-xl border-2 transition-all ${
                learningStyle === 'kinesthetic'
                  ? 'border-teal-400 bg-teal-400/20'
                  : 'border-white/20 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="text-white font-medium mb-1">✋ Kinesthetic</div>
              <div className="text-white/60 text-sm">Learn through doing</div>
            </button>

            <button
              onClick={() => setLearningStyle('mixed')}
              className={`p-4 rounded-xl border-2 transition-all ${
                learningStyle === 'mixed'
                  ? 'border-teal-400 bg-teal-400/20'
                  : 'border-white/20 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="text-white font-medium mb-1">🌈 Mixed</div>
              <div className="text-white/60 text-sm">Combination of all styles</div>
            </button>
          </div>
        </div>

        {/* Personality Section */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-white mb-3">
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">Avatar Personality</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setPersonality('encouraging')}
              className={`p-4 rounded-xl border-2 transition-all ${
                personality === 'encouraging'
                  ? 'border-teal-400 bg-teal-400/20'
                  : 'border-white/20 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="text-white font-medium mb-1">💪 Encouraging</div>
              <div className="text-white/60 text-sm">Motivating & supportive</div>
            </button>

            <button
              onClick={() => setPersonality('calm')}
              className={`p-4 rounded-xl border-2 transition-all ${
                personality === 'calm'
                  ? 'border-teal-400 bg-teal-400/20'
                  : 'border-white/20 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="text-white font-medium mb-1">🧘 Calm</div>
              <div className="text-white/60 text-sm">Peaceful & soothing</div>
            </button>

            <button
              onClick={() => setPersonality('energetic')}
              className={`p-4 rounded-xl border-2 transition-all ${
                personality === 'energetic'
                  ? 'border-teal-400 bg-teal-400/20'
                  : 'border-white/20 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="text-white font-medium mb-1">⚡ Energetic</div>
              <div className="text-white/60 text-sm">Upbeat & enthusiastic</div>
            </button>

            <button
              onClick={() => setPersonality('thoughtful')}
              className={`p-4 rounded-xl border-2 transition-all ${
                personality === 'thoughtful'
                  ? 'border-teal-400 bg-teal-400/20'
                  : 'border-white/20 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="text-white font-medium mb-1">🤔 Thoughtful</div>
              <div className="text-white/60 text-sm">Reflective & wise</div>
            </button>

            <button
              onClick={() => setPersonality('playful')}
              className={`p-4 rounded-xl border-2 transition-all col-span-2 ${
                personality === 'playful'
                  ? 'border-teal-400 bg-teal-400/20'
                  : 'border-white/20 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="text-white font-medium mb-1">🎮 Playful</div>
              <div className="text-white/60 text-sm">Fun & lighthearted</div>
            </button>
          </div>
        </div>

        {/* Language Section */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-white mb-3">
            <Volume2 className="w-5 h-5" />
            <span className="font-medium">Preferred Language</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setLanguage('en')}
              className={`p-4 rounded-xl border-2 transition-all ${
                language === 'en'
                  ? 'border-teal-400 bg-teal-400/20'
                  : 'border-white/20 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="text-white font-medium">English</div>
            </button>

            <button
              onClick={() => setLanguage('hi')}
              className={`p-4 rounded-xl border-2 transition-all ${
                language === 'hi'
                  ? 'border-teal-400 bg-teal-400/20'
                  : 'border-white/20 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="text-white font-medium">हिंदी</div>
            </button>

            <button
              onClick={() => setLanguage('hinglish')}
              className={`p-4 rounded-xl border-2 transition-all ${
                language === 'hinglish'
                  ? 'border-teal-400 bg-teal-400/20'
                  : 'border-white/20 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="text-white font-medium">Hinglish</div>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-400 to-green-400 text-white font-medium hover:shadow-lg hover:scale-105 transition-all"
          >
            Save Changes
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
