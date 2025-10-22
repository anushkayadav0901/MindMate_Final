import { useState, useEffect } from 'react';
import AdvancedAvatar3D from '../components/AdvancedAvatar3D';
import AvatarCustomization from '../components/AvatarCustomization';
import ProgressDashboard from '../components/ProgressDashboard';
import AchievementNotification from '../components/AchievementNotification';
import { speechService } from '../utils/speech';
import { voiceRecognition } from '../utils/voiceRecognition';
import { avatarPersonality } from '../utils/avatarPersonality';
import { getTimeBasedGreeting, getCulturalResponse, getFestivalGreeting } from '../utils/culturalAdaptation';
import { MicroExpression } from '../utils/microExpressions';
import { Mic, MicOff, MessageSquare, Settings, TrendingUp } from 'lucide-react';

interface EnhancedHomePageProps {
  readonly onNavigate: (page: 'home' | 'learn' | 'relax' | 'chat') => void;
  readonly onMoodDetected?: (mood: string) => void;
}

export default function EnhancedHomePage({ onNavigate, onMoodDetected }: EnhancedHomePageProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [greeting, setGreeting] = useState('');
  const [avatarExpression, setAvatarExpression] = useState<MicroExpression>('happy');
  const [showCustomization, setShowCustomization] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [newAchievements, setNewAchievements] = useState(avatarPersonality.getNewAchievements());
  const [currentAchievementIndex, setCurrentAchievementIndex] = useState(0);

  const profile = avatarPersonality.getUserProfile();
  const progress = avatarPersonality.getUserProgress();

  useEffect(() => {
    // Generate personalized greeting
    const language = profile.preferredLanguage;
    const timeGreeting = getTimeBasedGreeting(language);
    const festivalGreeting = getFestivalGreeting(language);
    
    let greetingMessage = festivalGreeting || avatarPersonality.getPersonalizedGreeting();
    
    // Add contextual greeting based on progress
    if (progress.totalStudySessions === 0) {
      greetingMessage = `${timeGreeting}! I'm MindMate, your AI learning companion. Let's start your journey together! 🌟`;
      setAvatarExpression('excited');
    } else if (progress.consecutiveDays >= 3) {
      greetingMessage = `${timeGreeting}, ${profile.name || 'friend'}! ${progress.consecutiveDays} day streak! 🔥 You're unstoppable!`;
      setAvatarExpression('celebrating');
    } else if (avatarPersonality.shouldSuggestBreak()) {
      greetingMessage = `${timeGreeting}, ${profile.name || 'friend'}! You've been studying hard. How about a relaxing break? 🧘`;
      setAvatarExpression('empathetic');
    } else {
      setAvatarExpression('encouraging');
    }

    setGreeting(greetingMessage);

    // Speak greeting after a delay
    const timer = setTimeout(() => {
      speechService.speak(greetingMessage, { rate: 0.9 }, setIsSpeaking);
    }, 1000);

    // Check for frustration patterns
    const frustrationCheck = setInterval(() => {
      if (avatarPersonality.detectFrustration()) {
        const message = getCulturalResponse('stress', language);
        setAvatarExpression('concerned');
        setGreeting(message);
        speechService.speak(message, { rate: 0.85 }, setIsSpeaking);
      }
    }, 30000); // Check every 30 seconds

    return () => {
      clearTimeout(timer);
      clearInterval(frustrationCheck);
      speechService.stop();
    };
  }, []);

  // Check for new achievements
  useEffect(() => {
    const checkAchievements = setInterval(() => {
      const achievements = avatarPersonality.getNewAchievements();
      if (achievements.length > newAchievements.length) {
        setNewAchievements(achievements);
        setCurrentAchievementIndex(0);
      }
    }, 5000);

    return () => clearInterval(checkAchievements);
  }, [newAchievements.length]);

  const handleVoiceInput = () => {
    if (isListening) {
      voiceRecognition.stopListening();
      setIsListening(false);
      setAvatarExpression('neutral');
    } else {
      setIsListening(true);
      setAvatarExpression('listening');
      avatarPersonality.recordClick();
      
      voiceRecognition.startListening(
        (transcript) => {
          setUserInput(transcript);
          setIsListening(false);
          handleUserResponse(transcript);
        },
        (error) => {
          console.error('Voice recognition error:', error);
          setIsListening(false);
          setAvatarExpression('confused');
        }
      );
    }
  };

  const handleTextInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      avatarPersonality.recordClick();
      handleUserResponse(userInput);
    }
  };

  const handleUserResponse = async (response: string) => {
    const lowerResponse = response.toLowerCase();
    const language = profile.preferredLanguage;

    setAvatarExpression('thinking');
    avatarPersonality.recordPause();

    // Detect stress/anxiety
    if (
      lowerResponse.includes('stress') ||
      lowerResponse.includes('anxious') ||
      lowerResponse.includes('worried') ||
      lowerResponse.includes('overwhelm') ||
      lowerResponse.includes('relax')
    ) {
      onMoodDetected?.('stressed');
      avatarPersonality.addConversationMemory('stress', 'stressed', response);
      avatarPersonality.addStressTrigger(lowerResponse);
      
      const message = getCulturalResponse('stress', language);
      setAvatarExpression('empathetic');
      await speechService.speak(message, { rate: 0.85 }, setIsSpeaking);
      
      setTimeout(() => {
        avatarPersonality.recordBreak();
        onNavigate('relax');
      }, 1000);
    } 
    // Detect learning intent
    else if (
      lowerResponse.includes('learn') ||
      lowerResponse.includes('study') ||
      lowerResponse.includes('read') ||
      lowerResponse.includes('pdf')
    ) {
      onMoodDetected?.('calm');
      avatarPersonality.addConversationMemory('learning', 'motivated', response);
      
      const message = getCulturalResponse('study', language);
      setAvatarExpression('motivated');
      await speechService.speak(message, { rate: 0.9 }, setIsSpeaking);
      
      setTimeout(() => onNavigate('learn'), 1000);
    } 
    // Detect positive mood
    else if (
      lowerResponse.includes('good') ||
      lowerResponse.includes('great') ||
      lowerResponse.includes('happy') ||
      lowerResponse.includes('fine')
    ) {
      onMoodDetected?.('happy');
      avatarPersonality.addConversationMemory('greeting', 'happy', response);
      setAvatarExpression('happy');
      
      const message = `That's wonderful! Would you like to learn something new or just relax?`;
      await speechService.speak(message, { rate: 0.9 }, setIsSpeaking);
    } 
    // Detect chat intent
    else if (
      lowerResponse.includes('chat') ||
      lowerResponse.includes('talk')
    ) {
      avatarPersonality.addConversationMemory('chat', 'neutral', response);
      setAvatarExpression('listening');
      
      const message = "I'm here to listen. Let's have a chat.";
      await speechService.speak(message, { rate: 0.9 }, setIsSpeaking);
      
      setTimeout(() => onNavigate('chat'), 1000);
    } 
    // Default response with context
    else {
      const contextualResponse = avatarPersonality.getContextualResponse(response);
      setAvatarExpression('encouraging');
      await speechService.speak(contextualResponse, { rate: 0.9 }, setIsSpeaking);
    }

    setUserInput('');
  };

  const handleCustomizationUpdate = () => {
    // Refresh profile data
    const updatedProfile = avatarPersonality.getUserProfile();
    const message = `Great! I'll remember that you prefer ${updatedProfile.learningStyle} learning style. Let's personalize your experience!`;
    setAvatarExpression('happy');
    speechService.speak(message, { rate: 0.9 }, setIsSpeaking);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-4">
      {/* Achievement Notifications */}
      {newAchievements.length > 0 && currentAchievementIndex < newAchievements.length && (
        <AchievementNotification
          achievement={newAchievements[currentAchievementIndex]}
          onClose={() => setCurrentAchievementIndex(currentAchievementIndex + 1)}
        />
      )}

      {/* Avatar Customization Modal */}
      {showCustomization && (
        <AvatarCustomization
          onClose={() => setShowCustomization(false)}
          onUpdate={handleCustomizationUpdate}
        />
      )}

      {/* Progress Dashboard Modal */}
      {showProgress && <ProgressDashboard onClose={() => setShowProgress(false)} />}

      {/* Top Action Buttons */}
      <div className="absolute top-24 right-6 flex gap-2">
        <button
          onClick={() => setShowProgress(true)}
          className="p-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 transition-all"
          title="View Progress"
        >
          <TrendingUp className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={() => setShowCustomization(true)}
          className="p-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 transition-all"
          title="Customize Avatar"
        >
          <Settings className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Advanced Avatar */}
      <AdvancedAvatar3D
        isSpeaking={isSpeaking}
        expression={avatarExpression}
        message={greeting}
        showAchievement={newAchievements.length > 0 && currentAchievementIndex < newAchievements.length}
        achievementText={
          newAchievements.length > 0 && currentAchievementIndex < newAchievements.length
            ? newAchievements[currentAchievementIndex].title
            : undefined
        }
      />

      {/* Input Section */}
      <div className="mt-12 w-full max-w-lg space-y-4">
        <form onSubmit={handleTextInput} className="flex gap-3">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type how you're feeling..."
            className="flex-1 px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
          />
          <button
            type="button"
            onClick={handleVoiceInput}
            className={`px-6 py-4 rounded-2xl backdrop-blur-lg border transition-all ${
              isListening
                ? 'bg-red-500/30 border-red-400/50 animate-pulse'
                : 'bg-white/10 border-white/20 hover:bg-white/20'
            }`}
            title={isListening ? 'Stop listening' : 'Start voice input'}
          >
            {isListening ? (
              <MicOff className="w-6 h-6 text-red-300" />
            ) : (
              <Mic className="w-6 h-6 text-white" />
            )}
          </button>
          <button
            type="submit"
            className="px-6 py-4 rounded-2xl bg-gradient-to-r from-teal-400 to-green-400 text-white font-medium hover:shadow-lg hover:scale-105 transition-all"
          >
            <MessageSquare className="w-6 h-6" />
          </button>
        </form>

        {/* Quick Action Buttons */}
        <div className="flex gap-4 justify-center mt-8">
          <button
            onClick={() => {
              setAvatarExpression('calm');
              onNavigate('relax');
            }}
            className="px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 text-white hover:bg-white/20 transition-all hover:scale-105"
          >
            Relax
          </button>
          <button
            onClick={() => {
              setAvatarExpression('motivated');
              onNavigate('learn');
            }}
            className="px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 text-white hover:bg-white/20 transition-all hover:scale-105"
          >
            Learn
          </button>
        </div>
      </div>

      {voiceRecognition.isSupported() === false && (
        <p className="mt-6 text-white/50 text-sm">Voice input not supported in this browser</p>
      )}
    </div>
  );
}
