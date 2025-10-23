export interface MoodCheckIn {
  id: string;
  date: string;
  type: 'morning' | 'evening';
  sleep?: number;
  sleepTags?: string[];
  energy?: 'low' | 'medium' | 'high';
  stressors?: string[];
  mood: string;
  dayRating?: number;
  gratitude?: string;
  challenges?: string;
  endStress?: number;
  timestamp: number;
}

export interface QuickMoodLog {
  id: string;
  mood: string;
  note?: string;
  timestamp: number;
}

export interface WellnessScore {
  date: string;
  overall: number;
  breakdown: {
    moodStability: number;
    copingUsage: number;
    sleepQuality: number;
    socialEngagement: number;
    selfCare: number;
  };
}

export interface PatternInsight {
  id: string;
  type: 'time' | 'sleep' | 'activity' | 'trigger' | 'streak' | 'progress';
  title: string;
  description: string;
  confidence: number;
  data: any;
  action?: string;
}

export interface PredictiveInsight {
  id: string;
  type: 'stress' | 'mood' | 'activity';
  prediction: string;
  confidence: number;
  reasoning: string;
  action?: string;
}

export interface EarlyWarningData {
  triggered: boolean;
  severity: 'low' | 'medium' | 'high';
  reasons: string[];
  lastTriggered?: number;
}

export interface MoodData {
  checkIns: MoodCheckIn[];
  quickLogs: QuickMoodLog[];
  wellnessScores: WellnessScore[];
  patterns: PatternInsight[];
  predictions: PredictiveInsight[];
  earlyWarning: EarlyWarningData;
}

export interface CheckInStep {
  id: string;
  title: string;
  component: React.ComponentType<any>;
  validation: (data: any) => boolean;
}

export interface CheckInData {
  sleep?: number;
  sleepTags?: string[];
  energy?: 'low' | 'medium' | 'high';
  stressors?: string[];
  mood?: string;
  dayRating?: number;
  gratitude?: string;
  challenges?: string;
  endStress?: number;
}
