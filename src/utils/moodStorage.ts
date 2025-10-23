import { MoodCheckIn, QuickMoodLog, WellnessScore, PatternInsight, PredictiveInsight, EarlyWarningData, MoodData } from '../types/insights.types';

// Storage Keys
const STORAGE_KEYS = {
  CHECK_INS: 'moodCheckIns',
  QUICK_LOGS: 'quickMoodLogs',
  WELLNESS_SCORES: 'wellnessHistory',
  PATTERNS: 'userPatterns',
  PREDICTIONS: 'predictions',
  EARLY_WARNING: 'earlyWarning',
  LAST_ANALYSIS: 'lastAnalysis'
};

// Mood Check-In Storage
export const saveCheckIn = (checkIn: MoodCheckIn): void => {
  const existing = getCheckIns();
  const updated = [...existing, checkIn];
  localStorage.setItem(STORAGE_KEYS.CHECK_INS, JSON.stringify(updated));
};

export const getCheckIns = (): MoodCheckIn[] => {
  const data = localStorage.getItem(STORAGE_KEYS.CHECK_INS);
  return data ? JSON.parse(data) : [];
};

export const getCheckInsByDate = (date: string): MoodCheckIn[] => {
  return getCheckIns().filter(checkIn => checkIn.date === date);
};

export const hasCheckInToday = (type: 'morning' | 'evening'): boolean => {
  const today = new Date().toISOString().split('T')[0];
  return getCheckIns().some(checkIn => 
    checkIn.date === today && checkIn.type === type
  );
};

// Quick Mood Log Storage
export const saveQuickMoodLog = (log: QuickMoodLog): void => {
  const existing = getQuickMoodLogs();
  const updated = [...existing, log];
  localStorage.setItem(STORAGE_KEYS.QUICK_LOGS, JSON.stringify(updated));
};

export const getQuickMoodLogs = (): QuickMoodLog[] => {
  const data = localStorage.getItem(STORAGE_KEYS.QUICK_LOGS);
  return data ? JSON.parse(data) : [];
};

// Wellness Score Storage
export const saveWellnessScore = (score: WellnessScore): void => {
  const existing = getWellnessScores();
  const updated = [...existing, score];
  localStorage.setItem(STORAGE_KEYS.WELLNESS_SCORES, JSON.stringify(updated));
};

export const getWellnessScores = (): WellnessScore[] => {
  const data = localStorage.getItem(STORAGE_KEYS.WELLNESS_SCORES);
  return data ? JSON.parse(data) : [];
};

// Pattern Storage
export const savePatterns = (patterns: PatternInsight[]): void => {
  localStorage.setItem(STORAGE_KEYS.PATTERNS, JSON.stringify(patterns));
  localStorage.setItem(STORAGE_KEYS.LAST_ANALYSIS, Date.now().toString());
};

export const getPatterns = (): PatternInsight[] => {
  const data = localStorage.getItem(STORAGE_KEYS.PATTERNS);
  return data ? JSON.parse(data) : [];
};

export const getLastAnalysisTime = (): number => {
  const time = localStorage.getItem(STORAGE_KEYS.LAST_ANALYSIS);
  return time ? parseInt(time) : 0;
};

// Prediction Storage
export const savePredictions = (predictions: PredictiveInsight[]): void => {
  localStorage.setItem(STORAGE_KEYS.PREDICTIONS, JSON.stringify(predictions));
};

export const getPredictions = (): PredictiveInsight[] => {
  const data = localStorage.getItem(STORAGE_KEYS.PREDICTIONS);
  return data ? JSON.parse(data) : [];
};

// Early Warning Storage
export const saveEarlyWarning = (warning: EarlyWarningData): void => {
  localStorage.setItem(STORAGE_KEYS.EARLY_WARNING, JSON.stringify(warning));
};

export const getEarlyWarning = (): EarlyWarningData => {
  const data = localStorage.getItem(STORAGE_KEYS.EARLY_WARNING);
  return data ? JSON.parse(data) : { triggered: false, severity: 'low', reasons: [] };
};

// Utility Functions
export const getMoodData = (): MoodData => {
  return {
    checkIns: getCheckIns(),
    quickLogs: getQuickMoodLogs(),
    wellnessScores: getWellnessScores(),
    patterns: getPatterns(),
    predictions: getPredictions(),
    earlyWarning: getEarlyWarning()
  };
};

export const clearAllData = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};

// Date Utilities
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const getDateRange = (days: number): string[] => {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(formatDate(date));
  }
  
  return dates;
};

export const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  return 'evening';
};

// Mood Score Conversion
export const moodToScore = (mood: string): number => {
  const moodScores: Record<string, number> = {
    'happy': 9,
    'calm': 8,
    'neutral': 5,
    'worried': 4,
    'sad': 3,
    'frustrated': 3,
    'anxious': 2,
    'tired': 4
  };
  return moodScores[mood] || 5;
};

export const scoreToMood = (score: number): string => {
  if (score >= 8) return 'happy';
  if (score >= 6) return 'calm';
  if (score >= 4) return 'neutral';
  if (score >= 2) return 'worried';
  return 'sad';
};

// Wellness Score Calculation
export const calculateWellnessScore = (checkIns: MoodCheckIn[], quickLogs: QuickMoodLog[]): WellnessScore => {
  const today = formatDate(new Date());
  
  // Get last 7 days of data
  const last7Days = getDateRange(7);
  const recentCheckIns = checkIns.filter(ci => last7Days.includes(ci.date));
  const recentLogs = quickLogs.filter(ql => 
    last7Days.includes(formatDate(new Date(ql.timestamp)))
  );
  
  // Calculate mood stability (lower variance = higher score)
  const allMoods = [
    ...recentCheckIns.map(ci => moodToScore(ci.mood)),
    ...recentLogs.map(log => moodToScore(log.mood))
  ];
  
  const avgMood = allMoods.reduce((sum, mood) => sum + mood, 0) / allMoods.length;
  const variance = allMoods.reduce((sum, mood) => sum + Math.pow(mood - avgMood, 2), 0) / allMoods.length;
  const moodStability = Math.max(0, 20 - variance * 2);
  
  // Calculate other scores based on check-in frequency and quality
  const checkInFrequency = recentCheckIns.length / 7; // Should be 2 per day ideally
  const copingUsage = Math.min(20, checkInFrequency * 10);
  
  const avgSleep = recentCheckIns
    .filter(ci => ci.sleep !== undefined)
    .reduce((sum, ci) => sum + (ci.sleep || 0), 0) / recentCheckIns.length;
  const sleepQuality = Math.min(20, (avgSleep / 10) * 20);
  
  const socialEngagement = 15; // Placeholder - would need social activity data
  const selfCare = 15; // Placeholder - would need self-care activity data
  
  const overall = Math.round(moodStability + copingUsage + sleepQuality + socialEngagement + selfCare);
  
  return {
    date: today,
    overall,
    breakdown: {
      moodStability: Math.round(moodStability),
      copingUsage: Math.round(copingUsage),
      sleepQuality: Math.round(sleepQuality),
      socialEngagement,
      selfCare
    }
  };
};
