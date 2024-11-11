import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Timer, Play, Pause, RotateCcw, Trophy, 
  Target, Brain, Zap, ChevronRight, BarChart
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const ProgressPage = () => {
  const [activeTimer, setActiveTimer] = useState<'pomodoro' | 'break'>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('weekly');

  // Mock data - replace with real data
  const studyData = [
    { day: 'Mon', hours: 2.5, focus: 85, topics: 3 },
    { day: 'Tue', hours: 3.0, focus: 90, topics: 4 },
    { day: 'Wed', hours: 2.0, focus: 75, topics: 2 },
    { day: 'Thu', hours: 4.0, focus: 95, topics: 5 },
    { day: 'Fri', hours: 3.5, focus: 88, topics: 4 },
    { day: 'Sat', hours: 1.5, focus: 70, topics: 2 },
    { day: 'Sun', hours: 2.8, focus: 85, topics: 3 },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-2xl font-bold">Progress Tracking</h1>
          <p className="text-muted-foreground">Monitor your learning journey</p>
        </div>
        
        {/* Pomodoro Timer Card */}
        <motion.div 
          className="bg-gradient-to-br from-violet-900/90 to-violet-800/90 p-6 rounded-xl shadow-lg"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold font-mono">
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-violet-200">
                {activeTimer === 'pomodoro' ? 'Focus Time' : 'Break Time'}
              </div>
            </div>

            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsRunning(!isRunning)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20"
              >
                {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTimeLeft(25 * 60)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20"
              >
                <RotateCcw className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Progress Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-emerald-900/90 to-emerald-800/90 p-6 rounded-xl"
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm text-emerald-200">Weekly Progress</div>
              <div className="text-2xl font-bold mt-1">85%</div>
            </div>
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <Target className="w-5 h-5 text-emerald-300" />
            </div>
          </div>
          <div className="mt-4">
            <div className="h-2 bg-emerald-950 rounded-full">
              <motion.div 
                className="h-full bg-emerald-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '85%' }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-900/90 to-blue-800/90 p-6 rounded-xl"
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm text-blue-200">Focus Score</div>
              <div className="text-2xl font-bold mt-1">92/100</div>
            </div>
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Brain className="w-5 h-5 text-blue-300" />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-7 gap-1">
            {[95, 88, 90, 92, 94, 89, 92].map((score, i) => (
              <motion.div
                key={i}
                className="h-8 bg-blue-500/20 rounded-md relative overflow-hidden"
                initial={{ height: 0 }}
                animate={{ height: 32 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
              >
                <motion.div
                  className="absolute bottom-0 w-full bg-blue-400 rounded-md"
                  initial={{ height: 0 }}
                  animate={{ height: `${score}%` }}
                  transition={{ delay: 0.6 + (i * 0.1) }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-orange-900/90 to-orange-800/90 p-6 rounded-xl"
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm text-orange-200">Mastery Level</div>
              <div className="text-2xl font-bold mt-1">Advanced</div>
            </div>
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Zap className="w-5 h-5 text-orange-300" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-orange-200">Next Level:</span>
              <span className="text-orange-100 font-medium">Expert</span>
              <ChevronRight className="w-4 h-4 text-orange-300" />
            </div>
            <div className="mt-2 h-2 bg-orange-950 rounded-full">
              <motion.div 
                className="h-full bg-orange-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '75%' }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Study Analytics Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/5 p-6 rounded-xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Study Analytics</h2>
          <div className="flex gap-2">
            {['daily', 'weekly', 'monthly'].map((metric) => (
              <button
                key={metric}
                onClick={() => setSelectedMetric(metric)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  selectedMetric === metric
                    ? 'bg-violet-500 text-white'
                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                {metric.charAt(0).toUpperCase() + metric.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={studyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis 
                dataKey="day" 
                stroke="#ffffff50"
                tick={{ fill: '#ffffff80' }}
              />
              <YAxis 
                stroke="#ffffff50"
                tick={{ fill: '#ffffff80' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a1a',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="hours"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ fill: '#8b5cf6', strokeWidth: 2 }}
                activeDot={{ r: 8 }}
              />
              <Line 
                type="monotone" 
                dataKey="focus"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ fill: '#22c55e', strokeWidth: 2 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default ProgressPage;