/**
 * Advanced Avatar Personality & Memory System
 * Tracks user preferences, learning style, and builds relationship over time
 */

export type LearningStyle = 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
export type PersonalityTrait = 'encouraging' | 'calm' | 'energetic' | 'thoughtful' | 'playful';

export interface UserProfile {
  name: string;
  learningStyle: LearningStyle;
  favoriteSubjects: string[];
  stressTriggers: string[];
  preferredLanguage: 'en' | 'hi' | 'hinglish';
  avatarPersonality: PersonalityTrait;
  joinedDate: string;
  lastActive: string;
}

export interface UserProgress {
  totalStudySessions: number;
  totalStudyMinutes: number;
  chaptersCompleted: number;
  breathingExercisesCompleted: number;
  consecutiveDays: number;
  achievements: Achievement[];
  weeklyGoal: number;
  weeklyProgress: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockedDate: string;
  icon: string;
}

export interface ConversationMemory {
  date: string;
  topic: string;
  userMood: string;
  context: string;
}

export interface InteractionPattern {
  averageSessionDuration: number;
  preferredStudyTime: string; // 'morning' | 'afternoon' | 'evening' | 'night'
  clickSpeed: number; // clicks per minute
  pauseFrequency: number; // pauses per session
  frustrationIndicators: number;
  lastBreakTime: string;
}

class AvatarPersonalitySystem {
  private storageKey = 'mindmate_user_profile';
  private progressKey = 'mindmate_user_progress';
  private memoryKey = 'mindmate_conversation_memory';
  private interactionKey = 'mindmate_interaction_pattern';

  // Get or create user profile
  getUserProfile(): UserProfile {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      return JSON.parse(stored);
    }

    // Default profile for new users
    const defaultProfile: UserProfile = {
      name: '',
      learningStyle: 'mixed',
      favoriteSubjects: [],
      stressTriggers: [],
      preferredLanguage: 'en',
      avatarPersonality: 'encouraging',
      joinedDate: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    };

    this.saveUserProfile(defaultProfile);
    return defaultProfile;
  }

  saveUserProfile(profile: UserProfile): void {
    profile.lastActive = new Date().toISOString();
    localStorage.setItem(this.storageKey, JSON.stringify(profile));
  }

  updateUserName(name: string): void {
    const profile = this.getUserProfile();
    profile.name = name;
    this.saveUserProfile(profile);
  }

  updateLearningStyle(style: LearningStyle): void {
    const profile = this.getUserProfile();
    profile.learningStyle = style;
    this.saveUserProfile(profile);
  }

  addFavoriteSubject(subject: string): void {
    const profile = this.getUserProfile();
    if (!profile.favoriteSubjects.includes(subject)) {
      profile.favoriteSubjects.push(subject);
      this.saveUserProfile(profile);
    }
  }

  addStressTrigger(trigger: string): void {
    const profile = this.getUserProfile();
    if (!profile.stressTriggers.includes(trigger)) {
      profile.stressTriggers.push(trigger);
      this.saveUserProfile(profile);
    }
  }

  // Progress tracking
  getUserProgress(): UserProgress {
    const stored = localStorage.getItem(this.progressKey);
    if (stored) {
      return JSON.parse(stored);
    }

    const defaultProgress: UserProgress = {
      totalStudySessions: 0,
      totalStudyMinutes: 0,
      chaptersCompleted: 0,
      breathingExercisesCompleted: 0,
      consecutiveDays: 0,
      achievements: [],
      weeklyGoal: 5, // 5 study sessions per week
      weeklyProgress: 0,
    };

    this.saveUserProgress(defaultProgress);
    return defaultProgress;
  }

  saveUserProgress(progress: UserProgress): void {
    localStorage.setItem(this.progressKey, JSON.stringify(progress));
  }

  incrementStudySession(durationMinutes: number): void {
    const progress = this.getUserProgress();
    progress.totalStudySessions += 1;
    progress.totalStudyMinutes += durationMinutes;
    progress.weeklyProgress += 1;
    this.checkAndAwardAchievements(progress);
    this.saveUserProgress(progress);
  }

  incrementChaptersCompleted(): void {
    const progress = this.getUserProgress();
    progress.chaptersCompleted += 1;
    this.checkAndAwardAchievements(progress);
    this.saveUserProgress(progress);
  }

  incrementBreathingExercises(): void {
    const progress = this.getUserProgress();
    progress.breathingExercisesCompleted += 1;
    this.checkAndAwardAchievements(progress);
    this.saveUserProgress(progress);
  }

  private checkAndAwardAchievements(progress: UserProgress): void {
    const achievements: Achievement[] = [];

    // First study session
    if (progress.totalStudySessions === 1 && !this.hasAchievement('first_session')) {
      achievements.push({
        id: 'first_session',
        title: 'First Steps! 🎉',
        description: 'Completed your first study session',
        unlockedDate: new Date().toISOString(),
        icon: '🎉',
      });
    }

    // 10 study sessions
    if (progress.totalStudySessions === 10 && !this.hasAchievement('dedicated_learner')) {
      achievements.push({
        id: 'dedicated_learner',
        title: 'Dedicated Learner 📚',
        description: 'Completed 10 study sessions',
        unlockedDate: new Date().toISOString(),
        icon: '📚',
      });
    }

    // 5 chapters
    if (progress.chaptersCompleted === 5 && !this.hasAchievement('chapter_master')) {
      achievements.push({
        id: 'chapter_master',
        title: 'Chapter Master 📖',
        description: 'Completed 5 chapters',
        unlockedDate: new Date().toISOString(),
        icon: '📖',
      });
    }

    // 10 breathing exercises
    if (progress.breathingExercisesCompleted === 10 && !this.hasAchievement('zen_master')) {
      achievements.push({
        id: 'zen_master',
        title: 'Zen Master 🧘',
        description: 'Completed 10 breathing exercises',
        unlockedDate: new Date().toISOString(),
        icon: '🧘',
      });
    }

    // Weekly goal achieved
    if (progress.weeklyProgress >= progress.weeklyGoal && !this.hasAchievement('weekly_warrior')) {
      achievements.push({
        id: 'weekly_warrior',
        title: 'Weekly Warrior 🏆',
        description: 'Achieved your weekly study goal',
        unlockedDate: new Date().toISOString(),
        icon: '🏆',
      });
    }

    if (achievements.length > 0) {
      progress.achievements.push(...achievements);
    }
  }

  private hasAchievement(achievementId: string): boolean {
    const progress = this.getUserProgress();
    return progress.achievements.some((a) => a.id === achievementId);
  }

  getNewAchievements(): Achievement[] {
    const progress = this.getUserProgress();
    const recentAchievements = progress.achievements.filter((a) => {
      const unlocked = new Date(a.unlockedDate);
      const now = new Date();
      const diffMinutes = (now.getTime() - unlocked.getTime()) / (1000 * 60);
      return diffMinutes < 5; // Achievements from last 5 minutes
    });
    return recentAchievements;
  }

  // Conversation memory
  addConversationMemory(topic: string, userMood: string, context: string): void {
    const memories = this.getConversationMemories();
    memories.push({
      date: new Date().toISOString(),
      topic,
      userMood,
      context,
    });

    // Keep only last 50 memories
    if (memories.length > 50) {
      memories.shift();
    }

    localStorage.setItem(this.memoryKey, JSON.stringify(memories));
  }

  getConversationMemories(): ConversationMemory[] {
    const stored = localStorage.getItem(this.memoryKey);
    return stored ? JSON.parse(stored) : [];
  }

  getRecentMemory(topic: string): ConversationMemory | null {
    const memories = this.getConversationMemories();
    const relevant = memories.filter((m) => m.topic.toLowerCase().includes(topic.toLowerCase()));
    return relevant.length > 0 ? relevant[relevant.length - 1] : null;
  }

  // Interaction pattern tracking
  getInteractionPattern(): InteractionPattern {
    const stored = localStorage.getItem(this.interactionKey);
    if (stored) {
      return JSON.parse(stored);
    }

    const defaultPattern: InteractionPattern = {
      averageSessionDuration: 0,
      preferredStudyTime: 'evening',
      clickSpeed: 0,
      pauseFrequency: 0,
      frustrationIndicators: 0,
      lastBreakTime: new Date().toISOString(),
    };

    this.saveInteractionPattern(defaultPattern);
    return defaultPattern;
  }

  saveInteractionPattern(pattern: InteractionPattern): void {
    localStorage.setItem(this.interactionKey, JSON.stringify(pattern));
  }

  recordClick(): void {
    const pattern = this.getInteractionPattern();
    pattern.clickSpeed += 1;
    this.saveInteractionPattern(pattern);
  }

  recordPause(): void {
    const pattern = this.getInteractionPattern();
    pattern.pauseFrequency += 1;
    this.saveInteractionPattern(pattern);
  }

  detectFrustration(): boolean {
    const pattern = this.getInteractionPattern();
    
    // High click speed + frequent pauses = frustration
    if (pattern.clickSpeed > 30 && pattern.pauseFrequency > 5) {
      pattern.frustrationIndicators += 1;
      this.saveInteractionPattern(pattern);
      return true;
    }

    return false;
  }

  shouldSuggestBreak(): boolean {
    const pattern = this.getInteractionPattern();
    const lastBreak = new Date(pattern.lastBreakTime);
    const now = new Date();
    const minutesSinceBreak = (now.getTime() - lastBreak.getTime()) / (1000 * 60);

    // Suggest break after 45 minutes
    return minutesSinceBreak >= 45;
  }

  recordBreak(): void {
    const pattern = this.getInteractionPattern();
    pattern.lastBreakTime = new Date().toISOString();
    pattern.clickSpeed = 0; // Reset click speed
    pattern.pauseFrequency = 0; // Reset pause frequency
    this.saveInteractionPattern(pattern);
  }

  // Generate personalized greeting
  getPersonalizedGreeting(): string {
    const profile = this.getUserProfile();
    const progress = this.getUserProgress();
    const hour = new Date().getHours();

    let timeGreeting = 'Hello';
    if (hour < 12) timeGreeting = 'Good morning';
    else if (hour < 17) timeGreeting = 'Good afternoon';
    else if (hour < 21) timeGreeting = 'Good evening';
    else timeGreeting = 'Good night';

    const name = profile.name || 'friend';

    if (progress.totalStudySessions === 0) {
      return `${timeGreeting}, ${name}! I'm excited to start this learning journey with you! 🌟`;
    }

    if (progress.consecutiveDays >= 3) {
      return `${timeGreeting}, ${name}! You're on a ${progress.consecutiveDays}-day streak! Keep it up! 🔥`;
    }

    return `${timeGreeting}, ${name}! Ready to continue your learning journey? 📚`;
  }

  // Generate contextual response based on user history
  getContextualResponse(context: string): string {
    const profile = this.getUserProfile();
    const progress = this.getUserProgress();
    const memory = this.getRecentMemory(context);

    if (memory && memory.userMood === 'stressed') {
      return `I remember you felt stressed about ${memory.topic} before. Let's take it slow this time. 💙`;
    }

    if (context.toLowerCase().includes('math') && profile.stressTriggers.includes('math')) {
      return `I know math can be challenging for you. Let's break it down into smaller steps together! 🧮`;
    }

    if (progress.chaptersCompleted >= 3) {
      return `You've already completed ${progress.chaptersCompleted} chapters! You're making amazing progress! 🎉`;
    }

    return `I'm here to support you every step of the way! 💪`;
  }
}

export const avatarPersonality = new AvatarPersonalitySystem();
