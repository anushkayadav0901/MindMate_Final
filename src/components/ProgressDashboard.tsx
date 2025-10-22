import { useState } from 'react';
import { TrendingUp, BookOpen, Wind, Calendar, Target, Award, X } from 'lucide-react';
import { avatarPersonality } from '../utils/avatarPersonality';

interface ProgressDashboardProps {
  readonly onClose: () => void;
}

export default function ProgressDashboard({ onClose }: ProgressDashboardProps) {
  const progress = avatarPersonality.getUserProgress();
  const profile = avatarPersonality.getUserProfile();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'achievements'>('overview');

  const weeklyProgressPercentage = (progress.weeklyProgress / progress.weeklyGoal) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-teal-300" />
            <h2 className="text-2xl font-light text-white">Your Progress</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 transition-all"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setSelectedTab('overview')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              selectedTab === 'overview'
                ? 'bg-teal-500 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setSelectedTab('achievements')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              selectedTab === 'achievements'
                ? 'bg-teal-500 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Achievements ({progress.achievements.length})
          </button>
        </div>

        {/* Content */}
        {selectedTab === 'overview' ? (
          <div className="space-y-6">
            {/* Welcome message */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-teal-400/20 to-green-400/20 border border-teal-400/30">
              <h3 className="text-white text-xl font-medium mb-2">
                Welcome back, {profile.name || 'friend'}! 👋
              </h3>
              <p className="text-white/80">
                You've been on an amazing learning journey. Keep up the great work!
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Total Study Sessions */}
              <div className="p-4 rounded-xl bg-white/10 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-5 h-5 text-teal-300" />
                  <span className="text-white/70 text-sm">Study Sessions</span>
                </div>
                <div className="text-3xl font-bold text-white">{progress.totalStudySessions}</div>
              </div>

              {/* Total Study Time */}
              <div className="p-4 rounded-xl bg-white/10 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-purple-300" />
                  <span className="text-white/70 text-sm">Study Time</span>
                </div>
                <div className="text-3xl font-bold text-white">
                  {Math.floor(progress.totalStudyMinutes / 60)}h
                </div>
                <div className="text-white/60 text-xs">{progress.totalStudyMinutes % 60}m</div>
              </div>

              {/* Chapters Completed */}
              <div className="p-4 rounded-xl bg-white/10 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-green-300" />
                  <span className="text-white/70 text-sm">Chapters</span>
                </div>
                <div className="text-3xl font-bold text-white">{progress.chaptersCompleted}</div>
              </div>

              {/* Breathing Exercises */}
              <div className="p-4 rounded-xl bg-white/10 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <Wind className="w-5 h-5 text-blue-300" />
                  <span className="text-white/70 text-sm">Breathing</span>
                </div>
                <div className="text-3xl font-bold text-white">
                  {progress.breathingExercisesCompleted}
                </div>
              </div>
            </div>

            {/* Weekly Goal Progress */}
            <div className="p-6 rounded-2xl bg-white/10 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Target className="w-6 h-6 text-teal-300" />
                  <h3 className="text-white text-lg font-medium">Weekly Goal</h3>
                </div>
                <div className="text-white">
                  <span className="text-2xl font-bold">{progress.weeklyProgress}</span>
                  <span className="text-white/60"> / {progress.weeklyGoal}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-400 to-green-400 transition-all duration-500 rounded-full"
                  style={{ width: `${Math.min(weeklyProgressPercentage, 100)}%` }}
                />
              </div>

              <p className="text-white/70 text-sm mt-2">
                {weeklyProgressPercentage >= 100
                  ? '🎉 Goal achieved! Amazing work!'
                  : `${Math.round(weeklyProgressPercentage)}% complete - Keep going!`}
              </p>
            </div>

            {/* Streak */}
            {progress.consecutiveDays > 0 && (
              <div className="p-6 rounded-2xl bg-gradient-to-r from-orange-400/20 to-red-400/20 border border-orange-400/30">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">🔥</div>
                  <div>
                    <h3 className="text-white text-xl font-bold">
                      {progress.consecutiveDays} Day Streak!
                    </h3>
                    <p className="text-white/80">You're on fire! Keep the momentum going!</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {progress.achievements.length === 0 ? (
              <div className="text-center py-12">
                <Award className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <h3 className="text-white text-xl font-medium mb-2">No achievements yet</h3>
                <p className="text-white/60">
                  Keep learning and practicing to unlock achievements!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {progress.achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="p-6 rounded-2xl bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border border-yellow-400/30"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-white text-lg font-bold mb-1">
                          {achievement.title}
                        </h3>
                        <p className="text-white/80 text-sm mb-2">{achievement.description}</p>
                        <p className="text-white/60 text-xs">
                          Unlocked: {new Date(achievement.unlockedDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
