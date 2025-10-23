import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { MoodData } from '../../../types/insights.types';
import { getDateRange, formatDate, moodToScore } from '../../../utils/moodStorage';

interface MoodHeatmapProps {
  data: MoodData;
}

export const MoodHeatmap: React.FC<MoodHeatmapProps> = ({ data }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getMoodColor = (moodScore: number) => {
    if (moodScore >= 8) return 'bg-green-500';
    if (moodScore >= 6) return 'bg-yellow-500';
    if (moodScore >= 4) return 'bg-orange-500';
    if (moodScore >= 2) return 'bg-red-500';
    return 'bg-gray-600';
  };

  const getMoodIntensity = (moodScore: number) => {
    if (moodScore >= 8) return 'opacity-100';
    if (moodScore >= 6) return 'opacity-80';
    if (moodScore >= 4) return 'opacity-60';
    if (moodScore >= 2) return 'opacity-40';
    return 'opacity-20';
  };

  const generateHeatmapData = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // Get all days in the month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const heatmapData: Array<{
      date: string;
      mood: number | null;
      day: number;
      isCurrentMonth: boolean;
    }> = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      heatmapData.push({
        date: '',
        mood: null,
        day: 0,
        isCurrentMonth: false
      });
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = formatDate(date);
      
      // Get mood data for this date
      const dayCheckIns = data.checkIns.filter(ci => ci.date === dateString);
      const dayLogs = data.quickLogs.filter(log => 
        formatDate(new Date(log.timestamp)) === dateString
      );

      const allMoods = [
        ...dayCheckIns.map(ci => moodToScore(ci.mood)),
        ...dayLogs.map(log => moodToScore(log.mood))
      ];

      const avgMood = allMoods.length > 0 
        ? allMoods.reduce((sum, mood) => sum + mood, 0) / allMoods.length
        : null;

      heatmapData.push({
        date: dateString,
        mood: avgMood,
        day,
        isCurrentMonth: true
      });
    }

    return heatmapData;
  };

  const heatmapData = generateHeatmapData();
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const getMoodTooltip = (dayData: any) => {
    if (!dayData.mood) return 'No data';
    return `${dayData.mood.toFixed(1)}/10 mood`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 rounded-2xl p-6 backdrop-blur-xl border border-white/10"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Calendar className="w-6 h-6 text-blue-400" />
          <h3 className="text-xl font-bold text-white">Mood Heatmap</h3>
        </div>
        
        {/* Month Navigation */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <span className="text-white font-semibold">{monthName}</span>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Day Labels */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-sm text-gray-400 font-medium py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Heatmap Grid */}
      <div className="grid grid-cols-7 gap-1">
        {heatmapData.map((dayData, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.01 }}
            className={`
              aspect-square rounded-lg border border-white/10 transition-all duration-200
              ${dayData.isCurrentMonth 
                ? dayData.mood 
                  ? `${getMoodColor(dayData.mood)} ${getMoodIntensity(dayData.mood)} hover:scale-110 cursor-pointer` 
                  : 'bg-gray-700 hover:bg-gray-600 cursor-pointer'
                : 'bg-transparent'
              }
            `}
            title={dayData.isCurrentMonth ? getMoodTooltip(dayData) : ''}
            whileHover={{ scale: 1.1 }}
          >
            {dayData.isCurrentMonth && (
              <div className="w-full h-full flex items-center justify-center text-xs font-medium text-white">
                {dayData.day}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">Less</span>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={`w-3 h-3 rounded ${
                  level === 1 ? 'bg-gray-600' :
                  level === 2 ? 'bg-red-500 opacity-40' :
                  level === 3 ? 'bg-orange-500 opacity-60' :
                  level === 4 ? 'bg-yellow-500 opacity-80' :
                  'bg-green-500 opacity-100'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-400">More</span>
        </div>
        
        <div className="text-sm text-gray-400">
          {heatmapData.filter(d => d.isCurrentMonth && d.mood).length} days with data
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        {(() => {
          const daysWithData = heatmapData.filter(d => d.isCurrentMonth && d.mood);
          const avgMood = daysWithData.length > 0 
            ? daysWithData.reduce((sum, d) => sum + (d.mood || 0), 0) / daysWithData.length
            : 0;
          
          const bestDay = daysWithData.length > 0 
            ? Math.max(...daysWithData.map(d => d.mood || 0))
            : 0;
          
          const worstDay = daysWithData.length > 0 
            ? Math.min(...daysWithData.map(d => d.mood || 0))
            : 0;

          return (
            <>
              <div className="text-center p-3 bg-white/5 rounded-xl">
                <div className="text-lg font-bold text-white">{avgMood.toFixed(1)}</div>
                <div className="text-xs text-gray-400">Avg Mood</div>
              </div>
              <div className="text-center p-3 bg-white/5 rounded-xl">
                <div className="text-lg font-bold text-white">{bestDay.toFixed(1)}</div>
                <div className="text-xs text-gray-400">Best Day</div>
              </div>
              <div className="text-center p-3 bg-white/5 rounded-xl">
                <div className="text-lg font-bold text-white">{worstDay.toFixed(1)}</div>
                <div className="text-xs text-gray-400">Lowest Day</div>
              </div>
            </>
          );
        })()}
      </div>
    </motion.div>
  );
};
