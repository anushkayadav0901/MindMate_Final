/**
 * Micro-Expression Engine for Advanced Avatar Emotions
 * 15+ subtle facial expressions with smooth transitions
 */

export type MicroExpression =
  | 'neutral'
  | 'happy'
  | 'calm'
  | 'thinking'
  | 'curious' // Raised eyebrow
  | 'concerned' // Slight frown
  | 'encouraging' // Gentle smile
  | 'surprised' // Wide eyes
  | 'proud' // Warm smile with sparkle
  | 'listening' // Tilted head, attentive
  | 'excited' // Big smile, raised eyebrows
  | 'empathetic' // Soft eyes, slight smile
  | 'focused' // Narrowed eyes, serious
  | 'playful' // Wink, smirk
  | 'celebrating' // Big smile, sparkles
  | 'confused' // Tilted head, furrowed brow
  | 'tired' // Half-closed eyes
  | 'motivated' // Determined look, slight smile;

export interface ExpressionConfig {
  eyeScale: number; // 0.5 to 1.5
  eyeRotation: number; // -15 to 15 degrees
  eyeVerticalOffset: number; // -10 to 10 pixels
  eyeBrowOffset: number; // -5 to 5 pixels
  mouthWidth: number; // 30 to 80 pixels
  mouthHeight: number; // 2 to 40 pixels
  mouthCurve: 'smile' | 'neutral' | 'frown' | 'open' | 'surprised';
  headTilt: number; // -15 to 15 degrees
  glowIntensity: number; // 0 to 1
  sparkles: boolean;
  pulseSpeed: number; // 0.5 to 2
  colors: {
    from: string;
    to: string;
    glow: string;
  };
  animation: 'bounce' | 'pulse' | 'wave' | 'none';
}

export const expressionConfigs: Record<MicroExpression, ExpressionConfig> = {
  neutral: {
    eyeScale: 1,
    eyeRotation: 0,
    eyeVerticalOffset: 0,
    eyeBrowOffset: 0,
    mouthWidth: 48,
    mouthHeight: 8,
    mouthCurve: 'neutral',
    headTilt: 0,
    glowIntensity: 0.4,
    sparkles: false,
    pulseSpeed: 1,
    colors: { from: '#98D8C8', to: '#6BCF7F', glow: '#98D8C8' },
    animation: 'none',
  },

  happy: {
    eyeScale: 1.1,
    eyeRotation: 0,
    eyeVerticalOffset: -2,
    eyeBrowOffset: -3,
    mouthWidth: 56,
    mouthHeight: 20,
    mouthCurve: 'smile',
    headTilt: 0,
    glowIntensity: 0.7,
    sparkles: true,
    pulseSpeed: 1.2,
    colors: { from: '#FFD700', to: '#FFA500', glow: '#FFD700' },
    animation: 'bounce',
  },

  calm: {
    eyeScale: 0.9,
    eyeRotation: 0,
    eyeVerticalOffset: 2,
    eyeBrowOffset: 1,
    mouthWidth: 44,
    mouthHeight: 6,
    mouthCurve: 'smile',
    headTilt: 0,
    glowIntensity: 0.5,
    sparkles: false,
    pulseSpeed: 0.7,
    colors: { from: '#87CEEB', to: '#4682B4', glow: '#87CEEB' },
    animation: 'pulse',
  },

  thinking: {
    eyeScale: 0.95,
    eyeRotation: -5,
    eyeVerticalOffset: 0,
    eyeBrowOffset: -2,
    mouthWidth: 40,
    mouthHeight: 4,
    mouthCurve: 'neutral',
    headTilt: 8,
    glowIntensity: 0.6,
    sparkles: false,
    pulseSpeed: 0.9,
    colors: { from: '#DDA0DD', to: '#9370DB', glow: '#DDA0DD' },
    animation: 'none',
  },

  curious: {
    eyeScale: 1.15,
    eyeRotation: 0,
    eyeVerticalOffset: -3,
    eyeBrowOffset: -5, // Raised eyebrow
    mouthWidth: 42,
    mouthHeight: 10,
    mouthCurve: 'surprised',
    headTilt: -5,
    glowIntensity: 0.65,
    sparkles: false,
    pulseSpeed: 1.1,
    colors: { from: '#FFB6C1', to: '#FF69B4', glow: '#FFB6C1' },
    animation: 'wave',
  },

  concerned: {
    eyeScale: 0.95,
    eyeRotation: 3,
    eyeVerticalOffset: 1,
    eyeBrowOffset: 2, // Slight frown
    mouthWidth: 44,
    mouthHeight: 6,
    mouthCurve: 'frown',
    headTilt: 3,
    glowIntensity: 0.45,
    sparkles: false,
    pulseSpeed: 0.85,
    colors: { from: '#B0C4DE', to: '#778899', glow: '#B0C4DE' },
    animation: 'none',
  },

  encouraging: {
    eyeScale: 1.05,
    eyeRotation: 0,
    eyeVerticalOffset: -1,
    eyeBrowOffset: -2,
    mouthWidth: 52,
    mouthHeight: 16,
    mouthCurve: 'smile',
    headTilt: -2,
    glowIntensity: 0.7,
    sparkles: true,
    pulseSpeed: 1.15,
    colors: { from: '#98FB98', to: '#32CD32', glow: '#98FB98' },
    animation: 'pulse',
  },

  surprised: {
    eyeScale: 1.3, // Wide eyes
    eyeRotation: 0,
    eyeVerticalOffset: -5,
    eyeBrowOffset: -8,
    mouthWidth: 48,
    mouthHeight: 32,
    mouthCurve: 'open',
    headTilt: 0,
    glowIntensity: 0.8,
    sparkles: true,
    pulseSpeed: 1.5,
    colors: { from: '#FFE4B5', to: '#FFA07A', glow: '#FFE4B5' },
    animation: 'bounce',
  },

  proud: {
    eyeScale: 1.08,
    eyeRotation: 0,
    eyeVerticalOffset: -2,
    eyeBrowOffset: -3,
    mouthWidth: 58,
    mouthHeight: 22,
    mouthCurve: 'smile',
    headTilt: -3,
    glowIntensity: 0.85,
    sparkles: true,
    pulseSpeed: 1.2,
    colors: { from: '#FFD700', to: '#FF8C00', glow: '#FFD700' },
    animation: 'bounce',
  },

  listening: {
    eyeScale: 1,
    eyeRotation: 0,
    eyeVerticalOffset: 0,
    eyeBrowOffset: -1,
    mouthWidth: 42,
    mouthHeight: 6,
    mouthCurve: 'neutral',
    headTilt: 12, // Tilted head
    glowIntensity: 0.55,
    sparkles: false,
    pulseSpeed: 0.8,
    colors: { from: '#ADD8E6', to: '#5F9EA0', glow: '#ADD8E6' },
    animation: 'none',
  },

  excited: {
    eyeScale: 1.2,
    eyeRotation: 0,
    eyeVerticalOffset: -4,
    eyeBrowOffset: -6,
    mouthWidth: 60,
    mouthHeight: 28,
    mouthCurve: 'smile',
    headTilt: 0,
    glowIntensity: 0.9,
    sparkles: true,
    pulseSpeed: 1.6,
    colors: { from: '#FF6347', to: '#FF4500', glow: '#FF6347' },
    animation: 'bounce',
  },

  empathetic: {
    eyeScale: 0.95,
    eyeRotation: 0,
    eyeVerticalOffset: 1,
    eyeBrowOffset: 0,
    mouthWidth: 46,
    mouthHeight: 10,
    mouthCurve: 'smile',
    headTilt: 5,
    glowIntensity: 0.6,
    sparkles: false,
    pulseSpeed: 0.85,
    colors: { from: '#DDA0DD', to: '#BA55D3', glow: '#DDA0DD' },
    animation: 'pulse',
  },

  focused: {
    eyeScale: 0.85, // Narrowed eyes
    eyeRotation: 0,
    eyeVerticalOffset: 2,
    eyeBrowOffset: 1,
    mouthWidth: 38,
    mouthHeight: 4,
    mouthCurve: 'neutral',
    headTilt: 0,
    glowIntensity: 0.5,
    sparkles: false,
    pulseSpeed: 0.75,
    colors: { from: '#4682B4', to: '#2F4F4F', glow: '#4682B4' },
    animation: 'none',
  },

  playful: {
    eyeScale: 1.1,
    eyeRotation: -8,
    eyeVerticalOffset: -1,
    eyeBrowOffset: -4,
    mouthWidth: 54,
    mouthHeight: 18,
    mouthCurve: 'smile',
    headTilt: -8,
    glowIntensity: 0.75,
    sparkles: true,
    pulseSpeed: 1.3,
    colors: { from: '#FF69B4', to: '#FF1493', glow: '#FF69B4' },
    animation: 'wave',
  },

  celebrating: {
    eyeScale: 1.25,
    eyeRotation: 0,
    eyeVerticalOffset: -4,
    eyeBrowOffset: -7,
    mouthWidth: 64,
    mouthHeight: 30,
    mouthCurve: 'smile',
    headTilt: 0,
    glowIntensity: 1,
    sparkles: true,
    pulseSpeed: 1.8,
    colors: { from: '#FFD700', to: '#FFA500', glow: '#FFD700' },
    animation: 'bounce',
  },

  confused: {
    eyeScale: 1.05,
    eyeRotation: 5,
    eyeVerticalOffset: 0,
    eyeBrowOffset: 3, // Furrowed brow
    mouthWidth: 40,
    mouthHeight: 8,
    mouthCurve: 'neutral',
    headTilt: 15, // Tilted head
    glowIntensity: 0.5,
    sparkles: false,
    pulseSpeed: 0.9,
    colors: { from: '#D8BFD8', to: '#9370DB', glow: '#D8BFD8' },
    animation: 'none',
  },

  tired: {
    eyeScale: 0.7, // Half-closed eyes
    eyeRotation: 0,
    eyeVerticalOffset: 4,
    eyeBrowOffset: 3,
    mouthWidth: 42,
    mouthHeight: 6,
    mouthCurve: 'neutral',
    headTilt: 2,
    glowIntensity: 0.3,
    sparkles: false,
    pulseSpeed: 0.6,
    colors: { from: '#B0C4DE', to: '#708090', glow: '#B0C4DE' },
    animation: 'none',
  },

  motivated: {
    eyeScale: 1.1,
    eyeRotation: 0,
    eyeVerticalOffset: -2,
    eyeBrowOffset: -4,
    mouthWidth: 50,
    mouthHeight: 14,
    mouthCurve: 'smile',
    headTilt: -2,
    glowIntensity: 0.8,
    sparkles: true,
    pulseSpeed: 1.25,
    colors: { from: '#FF6347', to: '#DC143C', glow: '#FF6347' },
    animation: 'pulse',
  },
};

// Context-based expression selection
export function getExpressionForContext(context: string, userMood?: string): MicroExpression {
  const lowerContext = context.toLowerCase();

  // Achievement contexts
  if (lowerContext.includes('achievement') || lowerContext.includes('completed')) {
    return 'celebrating';
  }
  if (lowerContext.includes('progress') || lowerContext.includes('great job')) {
    return 'proud';
  }

  // Learning contexts
  if (lowerContext.includes('question') || lowerContext.includes('what') || lowerContext.includes('how')) {
    return 'curious';
  }
  if (lowerContext.includes('explain') || lowerContext.includes('understand')) {
    return 'focused';
  }
  if (lowerContext.includes('difficult') || lowerContext.includes('hard')) {
    return 'empathetic';
  }

  // Emotional contexts
  if (lowerContext.includes('stress') || lowerContext.includes('anxious')) {
    return 'concerned';
  }
  if (lowerContext.includes('tired') || lowerContext.includes('exhausted')) {
    return 'empathetic';
  }
  if (lowerContext.includes('excited') || lowerContext.includes('amazing')) {
    return 'excited';
  }

  // Activity contexts
  if (lowerContext.includes('break') || lowerContext.includes('relax')) {
    return 'calm';
  }
  if (lowerContext.includes('study') || lowerContext.includes('learn')) {
    return 'motivated';
  }
  if (lowerContext.includes('chat') || lowerContext.includes('talk')) {
    return 'listening';
  }

  // User mood based
  if (userMood === 'stressed') return 'empathetic';
  if (userMood === 'happy') return 'happy';
  if (userMood === 'calm') return 'calm';

  return 'encouraging';
}

// Smooth transition between expressions
export function interpolateExpression(
  from: ExpressionConfig,
  to: ExpressionConfig,
  progress: number // 0 to 1
): ExpressionConfig {
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  return {
    eyeScale: lerp(from.eyeScale, to.eyeScale, progress),
    eyeRotation: lerp(from.eyeRotation, to.eyeRotation, progress),
    eyeVerticalOffset: lerp(from.eyeVerticalOffset, to.eyeVerticalOffset, progress),
    eyeBrowOffset: lerp(from.eyeBrowOffset, to.eyeBrowOffset, progress),
    mouthWidth: lerp(from.mouthWidth, to.mouthWidth, progress),
    mouthHeight: lerp(from.mouthHeight, to.mouthHeight, progress),
    mouthCurve: progress < 0.5 ? from.mouthCurve : to.mouthCurve,
    headTilt: lerp(from.headTilt, to.headTilt, progress),
    glowIntensity: lerp(from.glowIntensity, to.glowIntensity, progress),
    sparkles: progress > 0.5 ? to.sparkles : from.sparkles,
    pulseSpeed: lerp(from.pulseSpeed, to.pulseSpeed, progress),
    colors: progress < 0.5 ? from.colors : to.colors,
    animation: progress < 0.5 ? from.animation : to.animation,
  };
}
