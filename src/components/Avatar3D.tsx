import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

// Fix 1: Mark props as read-only
interface Avatar3DProps {
  readonly isSpeaking?: boolean;
  readonly mood?: 'happy' | 'calm' | 'neutral' | 'thinking';
  readonly message?: string;
}

export default function Avatar3D({ isSpeaking = false, mood = 'neutral', message }: Avatar3DProps) {
  const [pulseScale, setPulseScale] = useState(1);
  const [eyeBlink, setEyeBlink] = useState(false);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setEyeBlink(true);
      setTimeout(() => setEyeBlink(false), 150);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  // Fix 2: Separate methods instead of using boolean flags
  const startSpeakingAnimation = () => {
    const speakInterval = setInterval(() => {
      setPulseScale(1 + Math.random() * 0.15);
    }, 150);
    return speakInterval;
  };

  const stopSpeakingAnimation = () => {
    setPulseScale(1);
  };

  useEffect(() => {
    let speakInterval: NodeJS.Timeout;
    
    if (isSpeaking) {
      speakInterval = startSpeakingAnimation();
    } else {
      stopSpeakingAnimation();
    }

    return () => {
      if (speakInterval) {
        clearInterval(speakInterval);
      }
    };
  }, [isSpeaking]);

  const getMoodColors = () => {
    // Use a single solid color instead of gradients
    switch (mood) {
      case 'happy':
        return { main: '#FFD700', glow: '#FFD700' };
      case 'calm':
        return { main: '#87CEEB', glow: '#87CEEB' };
      case 'thinking':
        return { main: '#DDA0DD', glow: '#DDA0DD' };
      default:
        return { main: '#98D8C8', glow: '#98D8C8' };
    }
  };

  const colors = getMoodColors();

  // Fix 3: Extract mouth rendering to avoid boolean flag
  const renderMouth = () => {
    const mouthSize = isSpeaking ? 'w-12 h-8' : 'w-12 h-2';
    
    return (
      <div
        className={`absolute bottom-1/3 left-1/2 -translate-x-1/2 transition-all duration-200 ${mouthSize}`}
      >
        <div
          className="w-full h-full rounded-full bg-white/80"
          style={{
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.3)',
          }}
        />
      </div>
    );
  };

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className="relative">
        {isSpeaking && (
          <div className="absolute inset-0 animate-ping opacity-20">
            <div
              className="w-full h-full rounded-full"
              style={{
                background: `radial-gradient(circle, ${colors.glow}, transparent)`,
              }}
            />
          </div>
        )}

        <div
          className="relative w-48 h-48 rounded-full transition-all duration-200"
          style={{
            transform: `scale(${pulseScale})`,
            background: colors.main,
            boxShadow: `0 0 60px ${colors.glow}40`,
          }}
        >
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 flex gap-8">
            <div
              className={`w-5 h-5 rounded-full bg-white/90 shadow-lg transition-all duration-100 ${
                eyeBlink ? 'scale-y-10' : ''
              }`}
              style={{
                boxShadow: '0 0 10px rgba(255,255,255,0.8)',
              }}
            >
              <div className="w-2 h-2 rounded-full bg-gray-800 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div
              className={`w-5 h-5 rounded-full bg-white/90 shadow-lg transition-all duration-100 ${
                eyeBlink ? 'scale-y-10' : ''
              }`}
              style={{
                boxShadow: '0 0 10px rgba(255,255,255,0.8)',
              }}
            >
              <div className="w-2 h-2 rounded-full bg-gray-800 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>

          {renderMouth()}

          {mood === 'happy' && (
            <>
              <div className="absolute top-1/4 left-1/4 -translate-x-1/2">
                <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
              </div>
              <div className="absolute top-1/4 right-1/4 translate-x-1/2">
                <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse delay-100" />
              </div>
            </>
          )}
        </div>

        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-40 h-4 bg-black/20 rounded-full blur-xl" />
      </div>

      {message && (
        <div className="mt-8 px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 max-w-md">
          <p className="text-white text-center text-lg font-light leading-relaxed">{message}</p>
        </div>
      )}
    </div>
  );
}