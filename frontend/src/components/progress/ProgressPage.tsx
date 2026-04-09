import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Timer, Play, Pause, RotateCcw, Trophy,
  Target, Brain, Zap, ChevronRight, Loader2,
} from 'lucide-react';
import {
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { sessionsApi, streakApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import type { Session } from '@/types/session';

// ─── Helpers ───

/** Group sessions into the last 7 days and sum study minutes per day */
function buildWeeklyChart(sessions: Session[]) {
  const now = new Date();
  const days: { day: string; minutes: number }[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dateStr = d.toISOString().slice(0, 10); // YYYY-MM-DD

    const minutesForDay = sessions
      .filter((s) => s.startTime.slice(0, 10) === dateStr)
      .reduce((sum, s) => {
        const start = new Date(s.startTime).getTime();
        const end = new Date(s.endTime).getTime();
        return sum + Math.max(0, (end - start) / 60000);
      }, 0);

    days.push({ day: label, minutes: Math.round(minutesForDay) });
  }
  return days;
}

function masteryLabel(pct: number): { label: string; next: string } {
  if (pct >= 90) return { label: 'Expert', next: 'Master' };
  if (pct >= 70) return { label: 'Advanced', next: 'Expert' };
  if (pct >= 40) return { label: 'Intermediate', next: 'Advanced' };
  return { label: 'Beginner', next: 'Intermediate' };
}

// ─── Component ───

const ProgressPage = () => {
  const [activeTimer, setActiveTimer] = useState<'pomodoro' | 'break'>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const sessionId = new URLSearchParams(location.search).get('session');

  // ─── Fetch data ───
  const {
    data: sessions,
    isLoading,
  } = useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      const res = await sessionsApi.getSessions();
      return res.data;
    },
    retry: 1,
  });

  const { data: streakData } = useQuery({
    queryKey: ['streak'],
    queryFn: async () => {
      const res = await streakApi.getMyStreak();
      return res.data;
    },
    retry: false,
  });

  // If a session ID is in the URL, auto-start it
  useEffect(() => {
    if (sessionId && sessions && sessions.length > 0) {
      const target = sessions.find((s) => s.id === sessionId);
      if (!target) {
        toast({ title: 'Session not found', variant: 'destructive' });
        navigate('/');
      } else if (target.status === 'PLANNED') {
        sessionsApi.updateSessionStatus(target.id, 'IN_PROGRESS').catch(() => {});
      }
    }
  }, [sessionId, sessions, navigate, toast]);

  // ─── Timer ───
  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    if (timeLeft > 0) return;
    if (activeTimer === 'pomodoro') {
      setActiveTimer('break');
      setTimeLeft(5 * 60);
    } else {
      setActiveTimer('pomodoro');
      setTimeLeft(25 * 60);
    }
  }, [timeLeft, activeTimer]);

  // ─── Derived metrics ───
  const totalSessions = sessions?.length ?? 0;
  const completedSessions = sessions?.filter((s) => s.status === 'COMPLETED').length ?? 0;
  const weeklyCompletionPct = totalSessions > 0
    ? Math.round((completedSessions / totalSessions) * 100)
    : 0;

  // Daily study minutes for the last 7 days (bar chart)
  const weeklyChart = useMemo(
    () => buildWeeklyChart(sessions ?? []),
    [sessions]
  );

  // Streak-derived bars for "Focus Score" (weekly study minutes from backend)
  const weeklyMinutes = streakData?.weeklyStudyMinutes ?? [];
  const maxMin = Math.max(...weeklyMinutes, 1);
  const focusScore = weeklyMinutes.length > 0
    ? Math.round(weeklyMinutes.reduce((a, b) => a + b, 0) / weeklyMinutes.length)
    : 0;

  // Mastery derived from completion rate
  const mastery = masteryLabel(weeklyCompletionPct);

  // Current session info
  const currentSession = sessionId
    ? sessions?.find((s) => s.id === sessionId) ?? null
    : null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header + Pomodoro */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">Progress Tracking</h1>
          <p className="text-slate-400">
            {currentSession
              ? `Studying: ${currentSession.title}`
              : 'Monitor your learning journey'}
          </p>
        </div>

        {/* Pomodoro Timer */}
        <motion.div
          className="bg-gradient-to-br from-violet-900/90 to-violet-800/90 p-6 rounded-xl shadow-lg"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold font-mono text-white">
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
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
              >
                {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setTimeLeft(25 * 60); setIsRunning(false); }}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
              >
                <RotateCcw className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Weekly Progress */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-emerald-900/90 to-emerald-800/90 p-6 rounded-xl"
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm text-emerald-200">Completion Rate</div>
              <div className="text-2xl font-bold mt-1 text-white">{weeklyCompletionPct}%</div>
            </div>
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <Target className="w-5 h-5 text-emerald-300" />
            </div>
          </div>
          <div className="mt-2 text-xs text-emerald-300">
            {completedSessions}/{totalSessions} sessions completed
          </div>
          <div className="mt-3">
            <div className="h-2 bg-emerald-950 rounded-full">
              <motion.div
                className="h-full bg-emerald-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${weeklyCompletionPct}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Focus Score (weekly study minutes from streak API) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-900/90 to-blue-800/90 p-6 rounded-xl"
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm text-blue-200">Avg Weekly Minutes</div>
              <div className="text-2xl font-bold mt-1 text-white">{focusScore} min</div>
            </div>
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Brain className="w-5 h-5 text-blue-300" />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-7 gap-1">
            {(weeklyMinutes.length > 0 ? weeklyMinutes : [0, 0, 0, 0, 0, 0, 0]).map(
              (mins, i) => (
                <motion.div
                  key={i}
                  className="h-8 bg-blue-500/20 rounded-md relative overflow-hidden"
                >
                  <motion.div
                    className="absolute bottom-0 w-full bg-blue-400 rounded-md"
                    initial={{ height: 0 }}
                    animate={{ height: `${(mins / maxMin) * 100}%` }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                  />
                </motion.div>
              )
            )}
          </div>
        </motion.div>

        {/* Mastery Level */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-orange-900/90 to-orange-800/90 p-6 rounded-xl"
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm text-orange-200">Mastery Level</div>
              <div className="text-2xl font-bold mt-1 text-white">{mastery.label}</div>
            </div>
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Zap className="w-5 h-5 text-orange-300" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-orange-200">Next Level:</span>
              <span className="text-orange-100 font-medium">{mastery.next}</span>
              <ChevronRight className="w-4 h-4 text-orange-300" />
            </div>
            <div className="mt-2 h-2 bg-orange-950 rounded-full">
              <motion.div
                className="h-full bg-orange-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${weeklyCompletionPct}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Study Analytics Chart — real data */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-slate-900 border border-slate-800 p-6 rounded-xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-white">Last 7 Days — Study Minutes</h2>
          {streakData && (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Trophy className="w-4 h-4 text-yellow-500" />
              {streakData.currentStreak} day streak
            </div>
          )}
        </div>

        <div className="h-72">
          {weeklyChart.every((d) => d.minutes === 0) ? (
            <div className="flex items-center justify-center h-full text-slate-500">
              No study sessions recorded in the last 7 days. Start one above!
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="day" stroke="#ffffff50" tick={{ fill: '#ffffff80' }} />
                <YAxis stroke="#ffffff50" tick={{ fill: '#ffffff80' }} unit=" min" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    padding: '12px',
                    color: '#e2e8f0',
                  }}
                  formatter={(value: number) => [`${value} min`, 'Study Time']}
                />
                <Bar dataKey="minutes" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ProgressPage;
