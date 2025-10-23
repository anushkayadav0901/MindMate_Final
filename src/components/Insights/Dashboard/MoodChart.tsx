import React from 'react';
import { motion } from 'framer-motion';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar
} from 'recharts';
import { MoodData } from '../../../types/insights.types';
import { getDateRange, formatDate, moodToScore } from '../../../utils/moodStorage';

interface MoodChartProps {
  data: MoodData;
  timeRange: 'today' | 'week' | 'month' | 'all';
  title: string;
}

export const MoodChart: React.FC<MoodChartProps> = ({ data, timeRange, title }) => {
  const getChartData = () => {
    let dates: string[];
    
    switch (timeRange) {
      case 'today':
        dates = [formatDate(new Date())];
        break;
      case 'week':
        dates = getDateRange(7);
        break;
      case 'month':
        dates = getDateRange(30);
        break;
      default:
        dates = getDateRange(90); // Show last 3 months for 'all'
    }

    return dates.map(date => {
      // Get check-ins for this date
      const dayCheckIns = data.checkIns.filter(ci => ci.date === date);
      const dayLogs = data.quickLogs.filter(log => 
        formatDate(new Date(log.timestamp)) === date
      );

      // Calculate average mood for the day
      const allMoods = [
        ...dayCheckIns.map(ci => moodToScore(ci.mood)),
        ...dayLogs.map(log => moodToScore(log.mood))
      ];

      const avgMood = allMoods.length > 0 
        ? allMoods.reduce((sum, mood) => sum + mood, 0) / allMoods.length
        : null;

      // Get sleep quality if available
      const morningCheckIn = dayCheckIns.find(ci => ci.type === 'morning');
      const sleepQuality = morningCheckIn?.sleep || null;

      // Get stress level if available
      const eveningCheckIn = dayCheckIns.find(ci => ci.type === 'evening');
      const stressLevel = eveningCheckIn?.endStress || null;

      return {
        date,
        mood: avgMood,
        sleep: sleepQuality,
        stress: stressLevel,
        dataPoints: allMoods.length,
        formattedDate: new Date(date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })
      };
    }).filter(d => d.mood !== null); // Only include days with data
  };

  const chartData = getChartData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-800 border border-white/20 rounded-lg p-3 shadow-lg">
          <p className="text-white font-semibold">{data.formattedDate}</p>
          <p className="text-blue-300">
            Mood: {data.mood?.toFixed(1)}/10
          </p>
          {data.sleep && (
            <p className="text-green-300">
              Sleep: {data.sleep}/10
            </p>
          )}
          {data.stress && (
            <p className="text-red-300">
              Stress: {data.stress}/10
            </p>
          )}
          <p className="text-gray-400 text-sm">
            {data.dataPoints} data points
          </p>
        </div>
      );
    }
    return null;
  };

  const getChartType = () => {
    if (timeRange === 'today') return 'line';
    if (timeRange === 'week') return 'area';
    return 'area';
  };

  const renderChart = () => {
    const chartType = getChartType();
    
    if (chartType === 'line') {
      return (
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="formattedDate" 
            stroke="#9CA3AF"
            fontSize={12}
          />
          <YAxis 
            domain={[0, 10]}
            stroke="#9CA3AF"
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="mood" 
            stroke="#3B82F6" 
            strokeWidth={3}
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
          />
        </LineChart>
      );
    }

    return (
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis 
          dataKey="formattedDate" 
          stroke="#9CA3AF"
          fontSize={12}
        />
        <YAxis 
          domain={[0, 10]}
          stroke="#9CA3AF"
          fontSize={12}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="mood"
          stroke="#3B82F6"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#moodGradient)"
        />
      </AreaChart>
    );
  };

  if (chartData.length === 0) {
    return (
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 rounded-2xl p-8 backdrop-blur-xl border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h4 className="text-lg font-semibold text-gray-300 mb-2">No Data Yet</h4>
          <p className="text-gray-400">
            Start logging your mood to see beautiful charts and insights!
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 rounded-2xl p-6 backdrop-blur-xl border border-white/10"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Mood</span>
          </div>
          {timeRange !== 'today' && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Sleep</span>
            </div>
          )}
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="text-center p-4 bg-white/5 rounded-xl">
          <div className="text-2xl font-bold text-white">
            {chartData.length > 0 ? (chartData.reduce((sum, d) => sum + (d.mood || 0), 0) / chartData.length).toFixed(1) : '0'}
          </div>
          <div className="text-sm text-gray-400">Avg Mood</div>
        </div>
        <div className="text-center p-4 bg-white/5 rounded-xl">
          <div className="text-2xl font-bold text-white">
            {chartData.length > 0 ? Math.max(...chartData.map(d => d.mood || 0)).toFixed(1) : '0'}
          </div>
          <div className="text-sm text-gray-400">Best Day</div>
        </div>
        <div className="text-center p-4 bg-white/5 rounded-xl">
          <div className="text-2xl font-bold text-white">
            {chartData.length > 0 ? Math.min(...chartData.map(d => d.mood || 0)).toFixed(1) : '0'}
          </div>
          <div className="text-sm text-gray-400">Lowest Day</div>
        </div>
      </div>
    </motion.div>
  );
};
