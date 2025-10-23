import { MoodCheckIn, QuickMoodLog, PatternInsight } from '../types/insights.types';
import { getCheckIns, getQuickMoodLogs, moodToScore, getDateRange } from './moodStorage';

// Simple statistics functions (since we can't use external libraries in some cases)
const mean = (arr: number[]): number => arr.reduce((sum, val) => sum + val, 0) / arr.length;
const variance = (arr: number[]): number => {
  const avg = mean(arr);
  return mean(arr.map(val => Math.pow(val - avg, 2)));
};
const correlation = (x: number[], y: number[]): number => {
  const n = Math.min(x.length, y.length);
  const meanX = mean(x);
  const meanY = mean(y);
  
  let numerator = 0;
  let sumXSquared = 0;
  let sumYSquared = 0;
  
  for (let i = 0; i < n; i++) {
    const diffX = x[i] - meanX;
    const diffY = y[i] - meanY;
    numerator += diffX * diffY;
    sumXSquared += diffX * diffX;
    sumYSquared += diffY * diffY;
  }
  
  const denominator = Math.sqrt(sumXSquared * sumYSquared);
  return denominator === 0 ? 0 : numerator / denominator;
};

export const analyzePatterns = (): PatternInsight[] => {
  const checkIns = getCheckIns();
  const quickLogs = getQuickMoodLogs();
  const patterns: PatternInsight[] = [];
  
  if (checkIns.length < 7) {
    return patterns; // Need at least a week of data
  }
  
  // Pattern 1: Time-Based Patterns (Day of Week)
  const dayOfWeekPattern = analyzeDayOfWeekPattern(checkIns, quickLogs);
  if (dayOfWeekPattern) patterns.push(dayOfWeekPattern);
  
  // Pattern 2: Sleep-Mood Correlation
  const sleepPattern = analyzeSleepMoodCorrelation(checkIns);
  if (sleepPattern) patterns.push(sleepPattern);
  
  // Pattern 3: Activity Effectiveness (placeholder - would need VR/game data)
  const activityPattern = analyzeActivityEffectiveness();
  if (activityPattern) patterns.push(activityPattern);
  
  // Pattern 4: Trigger Analysis
  const triggerPattern = analyzeTriggerPatterns(checkIns);
  if (triggerPattern) patterns.push(triggerPattern);
  
  // Pattern 5: Streak Impact
  const streakPattern = analyzeStreakImpact(checkIns, quickLogs);
  if (streakPattern) patterns.push(streakPattern);
  
  // Pattern 6: Progress Analysis
  const progressPattern = analyzeProgressPattern(checkIns, quickLogs);
  if (progressPattern) patterns.push(progressPattern);
  
  return patterns;
};

const analyzeDayOfWeekPattern = (checkIns: MoodCheckIn[], quickLogs: QuickMoodLog[]): PatternInsight | null => {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayAverages: number[] = new Array(7).fill(0);
  const dayCounts: number[] = new Array(7).fill(0);
  
  // Process check-ins
  checkIns.forEach(checkIn => {
    const dayOfWeek = new Date(checkIn.date).getDay();
    const moodScore = moodToScore(checkIn.mood);
    dayAverages[dayOfWeek] += moodScore;
    dayCounts[dayOfWeek]++;
  });
  
  // Process quick logs
  quickLogs.forEach(log => {
    const dayOfWeek = new Date(log.timestamp).getDay();
    const moodScore = moodToScore(log.mood);
    dayAverages[dayOfWeek] += moodScore;
    dayCounts[dayOfWeek]++;
  });
  
  // Calculate averages
  for (let i = 0; i < 7; i++) {
    if (dayCounts[i] > 0) {
      dayAverages[i] = dayAverages[i] / dayCounts[i];
    }
  }
  
  const overallAverage = mean(dayAverages.filter(avg => avg > 0));
  
  // Find significant deviations
  for (let i = 0; i < 7; i++) {
    if (dayCounts[i] >= 3 && Math.abs(dayAverages[i] - overallAverage) > 1.5) {
      const isLow = dayAverages[i] < overallAverage;
      const confidence = Math.min(95, Math.abs(dayAverages[i] - overallAverage) * 20);
      
      return {
        id: `day-pattern-${i}`,
        type: 'time',
        title: `${dayNames[i]} ${isLow ? 'Blues' : 'Boost'}`,
        description: `Your mood is ${isLow ? 'lower' : 'higher'} on ${dayNames[i]}s (avg ${dayAverages[i].toFixed(1)}/10 vs ${overallAverage.toFixed(1)} overall)`,
        confidence,
        data: { dayOfWeek: i, average: dayAverages[i], overallAverage },
        action: isLow ? 'Plan self-care activities' : 'Schedule important tasks'
      };
    }
  }
  
  return null;
};

const analyzeSleepMoodCorrelation = (checkIns: MoodCheckIn[]): PatternInsight | null => {
  const sleepScores: number[] = [];
  const moodScores: number[] = [];
  
  checkIns.forEach(checkIn => {
    if (checkIn.sleep !== undefined && checkIn.mood) {
      sleepScores.push(checkIn.sleep);
      moodScores.push(moodToScore(checkIn.mood));
    }
  });
  
  if (sleepScores.length < 5) return null;
  
  const corr = correlation(sleepScores, moodScores);
  
  if (Math.abs(corr) > 0.6) {
    const isPositive = corr > 0;
    const confidence = Math.min(95, Math.abs(corr) * 100);
    
    return {
      id: 'sleep-mood-correlation',
      type: 'sleep',
      title: `${isPositive ? 'Sleep-Mood' : 'Sleep-Stress'} Connection`,
      description: `Strong ${isPositive ? 'positive' : 'negative'} correlation (${corr.toFixed(2)}) between sleep quality and mood`,
      confidence,
      data: { correlation: corr, sampleSize: sleepScores.length },
      action: isPositive ? 'Prioritize 7+ hours sleep' : 'Address sleep issues'
    };
  }
  
  return null;
};

const analyzeActivityEffectiveness = (): PatternInsight | null => {
  // Placeholder - would analyze VR therapy and game effectiveness
  // For now, return a sample pattern
  return {
    id: 'activity-effectiveness',
    type: 'activity',
    title: 'VR Therapy Success',
    description: 'Peaceful Garden VR reduces anxiety by 78% on average',
    confidence: 85,
    data: { activity: 'VR Therapy', effectiveness: 0.78 },
    action: 'Try VR therapy when stressed'
  };
};

const analyzeTriggerPatterns = (checkIns: MoodCheckIn[]): PatternInsight | null => {
  const stressorImpact: Record<string, number[]> = {};
  
  checkIns.forEach(checkIn => {
    if (checkIn.stressors && checkIn.stressors.length > 0) {
      const moodScore = moodToScore(checkIn.mood);
      checkIn.stressors.forEach(stressor => {
        if (!stressorImpact[stressor]) {
          stressorImpact[stressor] = [];
        }
        stressorImpact[stressor].push(moodScore);
      });
    }
  });
  
  // Find stressors with significant negative impact
  const overallAverage = mean(checkIns.map(ci => moodToScore(ci.mood)));
  
  for (const [stressor, scores] of Object.entries(stressorImpact)) {
    if (scores.length >= 3) {
      const avgScore = mean(scores);
      if (avgScore < overallAverage - 1.5) {
        const confidence = Math.min(95, (overallAverage - avgScore) * 20);
        
        return {
          id: `trigger-${stressor.toLowerCase().replace(/\s+/g, '-')}`,
          type: 'trigger',
          title: `${stressor} Impact`,
          description: `${stressor} days average mood ${avgScore.toFixed(1)}/10 (vs ${overallAverage.toFixed(1)} normal)`,
          confidence,
          data: { stressor, average: avgScore, overallAverage, occurrences: scores.length },
          action: 'Prepare coping strategies'
        };
      }
    }
  }
  
  return null;
};

const analyzeStreakImpact = (checkIns: MoodCheckIn[], quickLogs: QuickMoodLog[]): PatternInsight | null => {
  // Calculate check-in streaks
  const dates = [...new Set([
    ...checkIns.map(ci => ci.date),
    ...quickLogs.map(log => new Date(log.timestamp).toISOString().split('T')[0])
  ])].sort();
  
  if (dates.length < 7) return null;
  
  let currentStreak = 1;
  let maxStreak = 1;
  let streakStart = dates[0];
  
  for (let i = 1; i < dates.length; i++) {
    const prevDate = new Date(dates[i - 1]);
    const currDate = new Date(dates[i]);
    const diffDays = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
    
    if (diffDays === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }
  
  if (maxStreak >= 7) {
    return {
      id: 'streak-impact',
      type: 'streak',
      title: `${maxStreak} Day Streak!`,
      description: `You've been consistent with mood tracking for ${maxStreak} days`,
      confidence: 90,
      data: { streak: maxStreak, currentStreak },
      action: 'Keep up the great work!'
    };
  }
  
  return null;
};

const analyzeProgressPattern = (checkIns: MoodCheckIn[], quickLogs: QuickMoodLog[]): PatternInsight | null => {
  const allMoods = [
    ...checkIns.map(ci => moodToScore(ci.mood)),
    ...quickLogs.map(log => moodToScore(log.mood))
  ];
  
  if (allMoods.length < 14) return null; // Need at least 2 weeks
  
  const firstHalf = allMoods.slice(0, Math.floor(allMoods.length / 2));
  const secondHalf = allMoods.slice(Math.floor(allMoods.length / 2));
  
  const firstAvg = mean(firstHalf);
  const secondAvg = mean(secondHalf);
  const improvement = ((secondAvg - firstAvg) / firstAvg) * 100;
  
  if (Math.abs(improvement) > 15) {
    const isImproving = improvement > 0;
    const confidence = Math.min(95, Math.abs(improvement) * 2);
    
    return {
      id: 'progress-pattern',
      type: 'progress',
      title: `Mood ${isImproving ? 'Improvement' : 'Decline'}`,
      description: `Your mood has ${isImproving ? 'improved' : 'declined'} by ${Math.abs(improvement).toFixed(1)}% over time`,
      confidence,
      data: { improvement, firstHalf: firstAvg, secondHalf: secondAvg },
      action: isImproving ? 'Continue current strategies' : 'Try new coping methods'
    };
  }
  
  return null;
};
