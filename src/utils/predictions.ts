import { MoodCheckIn, QuickMoodLog, PredictiveInsight } from '../types/insights.types';
import { getCheckIns, getQuickMoodLogs, moodToScore, getDateRange } from './moodStorage';

// Simple linear regression for predictions
const linearRegression = (x: number[], y: number[]): { slope: number; intercept: number } => {
  const n = x.length;
  const sumX = x.reduce((sum, val) => sum + val, 0);
  const sumY = y.reduce((sum, val) => sum + val, 0);
  const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
  const sumXX = x.reduce((sum, val) => sum + val * val, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  return { slope, intercept };
};

const mean = (arr: number[]): number => arr.reduce((sum, val) => sum + val, 0) / arr.length;

export const generatePredictions = (): PredictiveInsight[] => {
  const checkIns = getCheckIns();
  const quickLogs = getQuickMoodLogs();
  const predictions: PredictiveInsight[] = [];
  
  if (checkIns.length < 7) {
    return predictions; // Need at least a week of data
  }
  
  // Prediction 1: Tomorrow's Stress Level
  const stressPrediction = predictTomorrowStress(checkIns);
  if (stressPrediction) predictions.push(stressPrediction);
  
  // Prediction 2: Mood Dip Warning
  const moodDipWarning = predictMoodDip(checkIns, quickLogs);
  if (moodDipWarning) predictions.push(moodDipWarning);
  
  // Prediction 3: Optimal Activity Time
  const optimalTime = predictOptimalActivityTime(checkIns, quickLogs);
  if (optimalTime) predictions.push(optimalTime);
  
  return predictions;
};

const predictTomorrowStress = (checkIns: MoodCheckIn[]): PredictiveInsight | null => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDay = tomorrow.getDay();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // Analyze historical stress patterns by day of week
  const dayStressLevels: Record<number, number[]> = {};
  
  checkIns.forEach(checkIn => {
    const dayOfWeek = new Date(checkIn.date).getDay();
    const stressLevel = checkIn.endStress || (10 - moodToScore(checkIn.mood));
    
    if (!dayStressLevels[dayOfWeek]) {
      dayStressLevels[dayOfWeek] = [];
    }
    dayStressLevels[dayOfWeek].push(stressLevel);
  });
  
  // Calculate average stress for tomorrow's day of week
  const historicalStress = dayStressLevels[tomorrowDay] || [];
  if (historicalStress.length < 3) return null;
  
  const avgStress = mean(historicalStress);
  const confidence = Math.min(95, historicalStress.length * 15);
  
  // Adjust based on recent trend
  const recentCheckIns = checkIns.slice(-7);
  const recentStress = recentCheckIns.map(ci => ci.endStress || (10 - moodToScore(ci.mood)));
  const recentAvg = mean(recentStress);
  
  // Apply trend adjustment
  const trendAdjustment = (recentAvg - avgStress) * 0.3;
  const predictedStress = Math.max(0, Math.min(10, avgStress + trendAdjustment));
  
  return {
    id: 'tomorrow-stress',
    type: 'stress',
    prediction: `Tomorrow (${dayNames[tomorrowDay]}) predicted stress: ${predictedStress.toFixed(1)}/10`,
    confidence,
    reasoning: `Based on ${historicalStress.length} previous ${dayNames[tomorrowDay]}s and recent trend`,
    action: predictedStress > 6 ? 'Plan stress management activities' : 'Enjoy your day!'
  };
};

const predictMoodDip = (checkIns: MoodCheckIn[], quickLogs: QuickMoodLog[]): PredictiveInsight | null => {
  const today = new Date();
  const lastCheckIn = checkIns[checkIns.length - 1];
  
  if (!lastCheckIn) return null;
  
  const daysSinceCheckIn = Math.floor((today.getTime() - lastCheckIn.timestamp) / (1000 * 60 * 60 * 24));
  
  // Check if user has been skipping check-ins
  if (daysSinceCheckIn >= 3) {
    const confidence = Math.min(95, daysSinceCheckIn * 25);
    
    return {
      id: 'mood-dip-warning',
      type: 'mood',
      prediction: `You haven't checked in for ${daysSinceCheckIn} days`,
      confidence,
      reasoning: 'Consistent tracking helps maintain mental wellness',
      action: 'Complete a quick mood check-in'
    };
  }
  
  // Check for declining mood trend
  const recentMoods = [
    ...checkIns.slice(-5).map(ci => moodToScore(ci.mood)),
    ...quickLogs.slice(-5).map(log => moodToScore(log.mood))
  ];
  
  if (recentMoods.length >= 5) {
    const x = recentMoods.map((_, i) => i);
    const y = recentMoods;
    const regression = linearRegression(x, y);
    
    // If slope is significantly negative
    if (regression.slope < -0.3) {
      const confidence = Math.min(95, Math.abs(regression.slope) * 100);
      
      return {
        id: 'mood-decline-warning',
        type: 'mood',
        prediction: 'Mood trend showing decline',
        confidence,
        reasoning: 'Recent mood scores have been decreasing',
        action: 'Try VR therapy or breathing exercises'
      };
    }
  }
  
  return null;
};

const predictOptimalActivityTime = (checkIns: MoodCheckIn[], quickLogs: QuickMoodLog[]): PredictiveInsight | null => {
  // Analyze mood patterns by time of day
  const hourlyMoods: Record<number, number[]> = {};
  
  [...checkIns, ...quickLogs].forEach(item => {
    const hour = new Date(item.timestamp).getHours();
    const moodScore = moodToScore(item.mood);
    
    if (!hourlyMoods[hour]) {
      hourlyMoods[hour] = [];
    }
    hourlyMoods[hour].push(moodScore);
  });
  
  // Find hour with highest average mood
  let bestHour = 9; // Default to morning
  let bestScore = 0;
  
  for (const [hour, scores] of Object.entries(hourlyMoods)) {
    if (scores.length >= 3) {
      const avgScore = mean(scores);
      if (avgScore > bestScore) {
        bestScore = avgScore;
        bestHour = parseInt(hour);
      }
    }
  }
  
  if (bestScore > 0) {
    const timeOfDay = bestHour < 12 ? 'morning' : bestHour < 18 ? 'afternoon' : 'evening';
    const confidence = Math.min(95, bestScore * 10);
    
    return {
      id: 'optimal-activity-time',
      type: 'activity',
      prediction: `Best mood time: ${timeOfDay} (${bestHour}:00)`,
      confidence,
      reasoning: `Your mood averages ${bestScore.toFixed(1)}/10 at this time`,
      action: 'Schedule important activities then'
    };
  }
  
  return null;
};

// Early Warning System
export const checkEarlyWarning = (): { triggered: boolean; severity: 'low' | 'medium' | 'high'; reasons: string[] } => {
  const checkIns = getCheckIns();
  const quickLogs = getQuickMoodLogs();
  const reasons: string[] = [];
  let severity: 'low' | 'medium' | 'high' = 'low';
  
  // Check for low mood streak
  const recentMoods = [
    ...checkIns.slice(-7).map(ci => moodToScore(ci.mood)),
    ...quickLogs.slice(-7).map(log => moodToScore(log.mood))
  ];
  
  if (recentMoods.length >= 5) {
    const avgRecentMood = mean(recentMoods);
    if (avgRecentMood < 4) {
      reasons.push(`Low mood for ${recentMoods.length} days (avg ${avgRecentMood.toFixed(1)}/10)`);
      severity = avgRecentMood < 3 ? 'high' : 'medium';
    }
  }
  
  // Check for declining trend
  if (recentMoods.length >= 7) {
    const firstHalf = recentMoods.slice(0, Math.floor(recentMoods.length / 2));
    const secondHalf = recentMoods.slice(Math.floor(recentMoods.length / 2));
    const firstAvg = mean(firstHalf);
    const secondAvg = mean(secondHalf);
    const decline = firstAvg - secondAvg;
    
    if (decline > 2) {
      reasons.push(`Mood declining by ${decline.toFixed(1)} points`);
      if (severity === 'low') severity = 'medium';
    }
  }
  
  // Check for check-in avoidance
  const today = new Date();
  const lastCheckIn = checkIns[checkIns.length - 1];
  if (lastCheckIn) {
    const daysSinceCheckIn = Math.floor((today.getTime() - lastCheckIn.timestamp) / (1000 * 60 * 60 * 24));
    if (daysSinceCheckIn >= 5) {
      reasons.push(`No check-ins for ${daysSinceCheckIn} days`);
      if (severity === 'low') severity = 'medium';
    }
  }
  
  // Check for negative sentiment in notes
  const recentNotes = [
    ...checkIns.filter(ci => ci.challenges).map(ci => ci.challenges!),
    ...quickLogs.filter(log => log.note).map(log => log.note!)
  ];
  
  const negativeKeywords = ['hopeless', 'worthless', 'suicide', 'end it all', 'give up', 'can\'t go on'];
  const hasNegativeSentiment = recentNotes.some(note => 
    negativeKeywords.some(keyword => note.toLowerCase().includes(keyword))
  );
  
  if (hasNegativeSentiment) {
    reasons.push('Concerning language detected in recent notes');
    severity = 'high';
  }
  
  return {
    triggered: reasons.length > 0,
    severity,
    reasons
  };
};
