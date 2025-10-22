import { useEffect, useState, useRef } from 'react';
import { Sparkles, Star, Heart, Zap } from 'lucide-react';
import {
  MicroExpression,
  expressionConfigs,
  getExpressionForContext,
  interpolateExpression,
  ExpressionConfig,
} from '../utils/microExpressions';

interface AdvancedAvatar3DProps {
  readonly isSpeaking?: boolean;
  readonly expression?: MicroExpression;
  readonly context?: string;
  readonly userMood?: string;
  readonly message?: string;
  readonly showAchievement?: boolean;
  readonly achievementText?: string;
}

export default function AdvancedAvatar3D({
  isSpeaking = false,
  expression,
  context = '',
  userMood,
  message,
  showAchievement = false,
  achievementText,
}: AdvancedAvatar3DProps) {
  // Determine expression based on context or explicit prop
  const currentExpression = expression || getExpressionForContext(context, userMood);
  const config = expressionConfigs[currentExpression];

  const [eyeBlink, setEyeBlink] = useState(false);
  const [pulseScale, setPulseScale] = useState(1);
  const [previousConfig, setPreviousConfig] = useState<ExpressionConfig>(config);
  const [interpolatedConfig, setInterpolatedConfig] = useState<ExpressionConfig>(config);
  const animationFrameRef = useRef<number>();

  // Blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setEyeBlink(true);
      setTimeout(() => setEyeBlink(false), 150);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  // Speaking animation
  useEffect(() => {
    let speakInterval: NodeJS.Timeout;

    if (isSpeaking) {
      speakInterval = setInterval(() => {
        setPulseScale(1 + Math.random() * 0.15);
      }, 150);
    } else {
      setPulseScale(1);
    }

    return () => {
      if (speakInterval) clearInterval(speakInterval);
    };
  }, [isSpeaking]);

  // Smooth expression transition
  useEffect(() => {
    setPreviousConfig(interpolatedConfig);

    const startTime = Date.now();
    const duration = 800; // 800ms transition

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-in-out function
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      setInterpolatedConfig(interpolateExpression(previousConfig, config, eased));

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [currentExpression, previousConfig, config]);

  // Get mouth shape based on curve type
  const getMouthShape = () => {
    const { mouthWidth, mouthHeight, mouthCurve } = interpolatedConfig;

    switch (mouthCurve) {
      case 'smile':
        return (
          <div
            className="absolute bottom-1/3 left-1/2 -translate-x-1/2 transition-all duration-200"
            style={{ width: `${mouthWidth}px`, height: `${mouthHeight}px` }}
          >
            <div
              className="w-full h-full rounded-full bg-white/80"
              style={{
                boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.3)',
                borderRadius: '0 0 50% 50%',
              }}
            />
          </div>
        );

      case 'frown':
        return (
          <div
            className="absolute bottom-1/3 left-1/2 -translate-x-1/2 transition-all duration-200"
            style={{ width: `${mouthWidth}px`, height: `${mouthHeight}px` }}
          >
            <div
              className="w-full h-full rounded-full bg-white/80"
              style={{
                boxShadow: 'inset 0 -2px 8px rgba(0,0,0,0.3)',
                borderRadius: '50% 50% 0 0',
              }}
            />
          </div>
        );

      case 'open':
        return (
          <div
            className="absolute bottom-1/3 left-1/2 -translate-x-1/2 transition-all duration-200"
            style={{ width: `${mouthWidth}px`, height: `${mouthHeight}px` }}
          >
            <div
              className="w-full h-full rounded-full bg-gray-800"
              style={{
                boxShadow: 'inset 0 2px 12px rgba(0,0,0,0.5)',
              }}
            />
          </div>
        );

      case 'surprised':
        return (
          <div
            className="absolute bottom-1/3 left-1/2 -translate-x-1/2 transition-all duration-200"
            style={{ width: `${mouthWidth}px`, height: `${mouthHeight}px` }}
          >
            <div
              className="w-full h-full rounded-full bg-gray-800"
              style={{
                boxShadow: 'inset 0 2px 12px rgba(0,0,0,0.5)',
              }}
            />
          </div>
        );

      default: // neutral
        return (
          <div
            className="absolute bottom-1/3 left-1/2 -translate-x-1/2 transition-all duration-200"
            style={{ width: `${mouthWidth}px`, height: `${mouthHeight}px` }}
          >
            <div
              className="w-full h-full rounded-full bg-white/80"
              style={{
                boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.3)',
              }}
            />
          </div>
        );
    }
  };

  // Animation classes based on config
  const getAnimationClass = () => {
    switch (interpolatedConfig.animation) {
      case 'bounce':
        return 'animate-bounce';
      case 'pulse':
        return 'animate-pulse';
      case 'wave':
        return 'animate-wave';
      default:
        return '';
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Achievement notification */}
      {showAchievement && achievementText && (
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className="px-6 py-3 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-medium shadow-2xl flex items-center gap-2">
            <Star className="w-5 h-5" />
            {achievementText}
            <Star className="w-5 h-5" />
          </div>
        </div>
      )}

      <div className="relative">
        {/* Glow effect when speaking */}
        {isSpeaking && (
          <div className="absolute inset-0 animate-ping opacity-20">
            <div
              className="w-full h-full rounded-full"
              style={{
                background: `radial-gradient(circle, ${interpolatedConfig.colors.glow}, transparent)`,
              }}
            />
          </div>
        )}

        {/* Main avatar sphere */}
        <div
          className={`relative w-48 h-48 rounded-full transition-all duration-200 ${getAnimationClass()}`}
          style={{
            transform: `scale(${pulseScale}) rotate(${interpolatedConfig.headTilt}deg)`,
            background: `linear-gradient(135deg, ${interpolatedConfig.colors.from}, ${interpolatedConfig.colors.to})`,
            boxShadow: `0 0 ${60 * interpolatedConfig.glowIntensity}px ${interpolatedConfig.colors.glow}40, inset 0 0 40px rgba(255,255,255,0.2)`,
          }}
        >
          {/* Inner glow */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white/20 to-transparent" />

          {/* Eyes */}
          <div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 flex gap-8 transition-all duration-300"
            style={{
              transform: `translateX(-50%) translateY(${interpolatedConfig.eyeVerticalOffset}px) rotate(${interpolatedConfig.eyeRotation}deg)`,
            }}
          >
            {/* Left eye */}
            <div
              className={`rounded-full bg-white/90 shadow-lg transition-all duration-100`}
              style={{
                width: `${20 * interpolatedConfig.eyeScale}px`,
                height: `${20 * interpolatedConfig.eyeScale}px`,
                transform: eyeBlink ? 'scaleY(0.1)' : 'scaleY(1)',
                boxShadow: '0 0 10px rgba(255,255,255,0.8)',
              }}
            >
              <div className="w-2 h-2 rounded-full bg-gray-800 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>

            {/* Right eye */}
            <div
              className={`rounded-full bg-white/90 shadow-lg transition-all duration-100`}
              style={{
                width: `${20 * interpolatedConfig.eyeScale}px`,
                height: `${20 * interpolatedConfig.eyeScale}px`,
                transform: eyeBlink ? 'scaleY(0.1)' : 'scaleY(1)',
                boxShadow: '0 0 10px rgba(255,255,255,0.8)',
              }}
            >
              <div className="w-2 h-2 rounded-full bg-gray-800 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Eyebrows */}
          <div
            className="absolute top-1/4 left-1/2 -translate-x-1/2 flex gap-8 transition-all duration-300"
            style={{
              transform: `translateX(-50%) translateY(${interpolatedConfig.eyeBrowOffset}px)`,
            }}
          >
            <div className="w-6 h-1 rounded-full bg-white/60" />
            <div className="w-6 h-1 rounded-full bg-white/60" />
          </div>

          {/* Mouth */}
          {getMouthShape()}

          {/* Sparkles for happy/excited expressions */}
          {interpolatedConfig.sparkles && (
            <>
              <div className="absolute top-1/4 left-1/4 -translate-x-1/2 animate-pulse">
                <Sparkles className="w-4 h-4 text-yellow-300" />
              </div>
              <div className="absolute top-1/4 right-1/4 translate-x-1/2 animate-pulse delay-100">
                <Sparkles className="w-4 h-4 text-yellow-300" />
              </div>
              <div className="absolute bottom-1/4 left-1/3 -translate-x-1/2 animate-pulse delay-200">
                <Star className="w-3 h-3 text-yellow-200" />
              </div>
              <div className="absolute bottom-1/4 right-1/3 translate-x-1/2 animate-pulse delay-300">
                <Star className="w-3 h-3 text-yellow-200" />
              </div>
            </>
          )}

          {/* Special effects for specific expressions */}
          {currentExpression === 'celebrating' && (
            <>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 animate-bounce">
                <Zap className="w-6 h-6 text-yellow-300" />
              </div>
              <div className="absolute -bottom-4 left-1/4 animate-bounce delay-100">
                <Heart className="w-5 h-5 text-pink-300" />
              </div>
              <div className="absolute -bottom-4 right-1/4 animate-bounce delay-200">
                <Heart className="w-5 h-5 text-pink-300" />
              </div>
            </>
          )}
        </div>

        {/* Shadow */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-40 h-4 bg-black/20 rounded-full blur-xl" />
      </div>

      {/* Message bubble */}
      {message && (
        <div className="mt-8 px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 max-w-md animate-fadeIn">
          <p className="text-white text-center text-lg font-light leading-relaxed">{message}</p>
        </div>
      )}

      {/* Expression indicator (for debugging/development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 px-3 py-1 rounded-lg bg-black/50 text-white/70 text-xs">
          {currentExpression}
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes wave {
          0%, 100% {
            transform: rotate(-3deg);
          }
          50% {
            transform: rotate(3deg);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-wave {
          animation: wave 2s ease-in-out infinite;
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
