import { useState, useEffect, useRef } from 'react';
import AdvancedAvatar3D from '../components/AdvancedAvatar3D';
import FacialEmotionDetector from '../components/FacialEmotionDetector';
import ManualEmotionSelector from '../components/ManualEmotionSelector';
import EmotionChatBubble from '../components/EmotionChatBubble';
import AvatarCustomization from '../components/AvatarCustomization';
import ProgressDashboard from '../components/ProgressDashboard';
import AchievementNotification from '../components/AchievementNotification';
import { speechService } from '../utils/speech';
import { voiceRecognition } from '../utils/voiceRecognition';
import { avatarPersonality } from '../utils/avatarPersonality';
import { getEmotionResponse, DetectedEmotion } from '../utils/emotionResponses';
import { MicroExpression } from '../utils/microExpressions';
import { Mic, MicOff, MessageSquare, Settings, TrendingUp, Smile } from 'lucide-react';

interface EmotionAwareHomePageProps {
  readonly onNavigate: (page: 'home' | 'learn' | 'relax' | 'chat') => void;
  readonly onMoodDetected?: (mood: string) => void;
  readonly addWellnessPoints?: (points: number) => void;
}

export default function EmotionAwareHomePage({
  onNavigate,
  onMoodDetected,
  addWellnessPoints,
}: EmotionAwareHomePageProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [avatarExpression, setAvatarExpression] = useState<MicroExpression>('happy');
  const [avatarMessage, setAvatarMessage] = useState('');
  const [showCustomization, setShowCustomization] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [showManualSelector, setShowManualSelector] = useState(false);
  const [newAchievements, setNewAchievements] = useState(avatarPersonality.getNewAchievements());
  const [currentAchievementIndex, setCurrentAchievementIndex] = useState(0);
  const [isCameraActive, setIsCameraActive] = useState(false);
  
  // Emotion bubble state
  const [showEmotionBubble, setShowEmotionBubble] = useState(false);
  const [emotionBubbleMessage, setEmotionBubbleMessage] = useState('');
  const [currentEmotion, setCurrentEmotion] = useState<DetectedEmotion>('neutral');
  const [emotionActionText, setEmotionActionText] = useState<string>();
  const [emotionAction, setEmotionAction] = useState<(() => void) | undefined>();
  
  const lastEmotionRef = useRef<DetectedEmotion>('neutral');
  const emotionCountRef = useRef(0);

  const profile = avatarPersonality.getUserProfile();

  // Initial greeting
  useEffect(() => {
    const greeting = avatarPersonality.getPersonalizedGreeting();
    setAvatarMessage(greeting);
    setAvatarExpression('encouraging');

    const timer = setTimeout(() => {
      speechService.speak(greeting, { rate: 0.9 }, setIsSpeaking);
    }, 1500);

    return () => {
      clearTimeout(timer);
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

  // Map detected emotion to avatar expression
  const emotionToExpression = (emotion: DetectedEmotion): MicroExpression => {
    switch (emotion) {
      case 'happy':
        return 'happy';
      case 'sad':
        return 'empathetic';
      case 'angry':
        return 'concerned';
      case 'surprised':
        return 'surprised';
      case 'fearful':
        return 'empathetic';
      case 'disgusted':
        return 'concerned';
      case 'neutral':
      default:
        return 'calm';
    }
  };

  // Handle emotion detection from camera
  const handleEmotionDetected = (emotion: DetectedEmotion, confidence: number) => {
    console.log(`😊 Detected: ${emotion} (${Math.round(confidence * 100)}%)`);

    // Only respond if emotion changed or after 3 detections of same emotion
    if (emotion !== lastEmotionRef.current) {
      emotionCountRef.current = 1;
      lastEmotionRef.current = emotion;
    } else {
      emotionCountRef.current += 1;
    }

    // Respond after 2 consecutive detections of same emotion
    if (emotionCountRef.current >= 2) {
      emotionCountRef.current = 0;
      respondToEmotion(emotion);
    }

    // Always mirror expression
    setAvatarExpression(emotionToExpression(emotion));
    setCurrentEmotion(emotion);
  };

  // Respond to detected emotion
  const respondToEmotion = async (emotion: DetectedEmotion) => {
    const response = getEmotionResponse(
      emotion,
      profile.preferredLanguage,
      profile.name,
      true // include time greeting
    );

    // Update avatar
    setAvatarExpression(emotionToExpression(emotion));
    setAvatarMessage(response.message);

    // Show chat bubble
    setEmotionBubbleMessage(response.message);
    setShowEmotionBubble(true);

    // Set suggested action
    if (response.suggestedAction) {
      const actionMap = {
        relax: { text: 'Try Breathing Exercise', action: () => onNavigate('relax') },
        learn: { text: 'Start Learning', action: () => onNavigate('learn') },
        chat: { text: 'Let\'s Chat', action: () => onNavigate('chat') },
        breathe: { text: 'Breathe with Me', action: () => onNavigate('relax') },
      };

      const actionConfig = actionMap[response.suggestedAction];
      setEmotionActionText(actionConfig.text);
      setEmotionAction(() => actionConfig.action);
    } else {
      setEmotionActionText(undefined);
      setEmotionAction(undefined);
    }

    // Speak response
    await speechService.speak(response.message, { rate: response.speechRate }, setIsSpeaking);

    // Award wellness points
    if (addWellnessPoints) {
      addWellnessPoints(response.wellnessPoints);
    }

    // Track mood
    onMoodDetected?.(emotion);

    // Save to memory
    avatarPersonality.addConversationMemory(
      `emotion_${emotion}`,
      emotion,
      `Detected ${emotion} emotion`
    );
  };

  // Voice input handler
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

  // Text input handler
  const handleTextInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      avatarPersonality.recordClick();
      handleUserResponse(userInput);
    }
  };

  // Process user response
  const handleUserResponse = async (response: string) => {
    const lowerResponse = response.toLowerCase();

    setAvatarExpression('thinking');
    avatarPersonality.recordPause();

    // Detect intent and navigate
    if (lowerResponse.includes('stress') || lowerResponse.includes('anxious') || lowerResponse.includes('relax')) {
      onMoodDetected?.('stressed');
      setAvatarExpression('empathetic');
      await speechService.speak("Let's take a calming breath together.", { rate: 0.85 }, setIsSpeaking);
      setTimeout(() => onNavigate('relax'), 1000);
    } else if (lowerResponse.includes('learn') || lowerResponse.includes('study')) {
      onMoodDetected?.('calm');
      setAvatarExpression('motivated');
      await speechService.speak("Let's start learning!", { rate: 0.9 }, setIsSpeaking);
      setTimeout(() => onNavigate('learn'), 1000);
    } else if (lowerResponse.includes('chat') || lowerResponse.includes('talk')) {
      setAvatarExpression('listening');
      await speechService.speak("I'm here to listen.", { rate: 0.9 }, setIsSpeaking);
      setTimeout(() => onNavigate('chat'), 1000);
    } else {
      const contextualResponse = avatarPersonality.getContextualResponse(response);
      setAvatarExpression('encouraging');
      await speechService.speak(contextualResponse, { rate: 0.9 }, setIsSpeaking);
    }

    setUserInput('');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-4">
      {/* Facial Emotion Detector */}
      <FacialEmotionDetector
        onEmotionDetected={handleEmotionDetected}
        onCameraStatusChange={setIsCameraActive}
      />

      {/* Emotion Chat Bubble */}
      {showEmotionBubble && (
        <EmotionChatBubble
          message={emotionBubbleMessage}
          emotion={currentEmotion}
          onClose={() => setShowEmotionBubble(false)}
          onActionClick={emotionAction}
          actionText={emotionActionText}
          duration={10000}
        />
      )}

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
          onUpdate={() => {
            const message = "Great! I'll remember your preferences!";
            setAvatarExpression('happy');
            speechService.speak(message, { rate: 0.9 }, setIsSpeaking);
          }}
        />
      )}

      {/* Progress Dashboard Modal */}
      {showProgress && <ProgressDashboard onClose={() => setShowProgress(false)} />}

      {/* Manual Emotion Selector Modal */}
      {showManualSelector && (
        <ManualEmotionSelector
          onEmotionSelected={(emotion) => {
            respondToEmotion(emotion);
            setShowManualSelector(false);
          }}
          onClose={() => setShowManualSelector(false)}
        />
      )}

      {/* Top Action Buttons */}
      <div className="absolute top-24 right-6 flex gap-2">
        <button
          onClick={() => setShowManualSelector(true)}
          className="p-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 transition-all"
          title="Tell me how you feel"
        >
          <Smile className="w-5 h-5 text-white" />
        </button>
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

      {/* Camera status indicator */}
      {isCameraActive && (
        <div className="absolute top-24 left-6 px-4 py-2 rounded-xl bg-green-500/20 border border-green-400/30 backdrop-blur-lg">
          <p className="text-green-300 text-sm font-medium flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Emotion detection active
          </p>
        </div>
      )}

      {/* Advanced Avatar */}
      <AdvancedAvatar3D
        isSpeaking={isSpeaking}
        expression={avatarExpression}
        message={avatarMessage}
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
            {isListening ? <MicOff className="w-6 h-6 text-red-300" /> : <Mic className="w-6 h-6 text-white" />}
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
