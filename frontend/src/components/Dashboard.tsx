import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  BookOpen,
  Clock,
  Target,
  Trophy,
  Calendar,
  ArrowRight,
  CheckCircle2,
  Loader,
  AlertCircle,
  Plus,
  Sparkles,
  Flame,
  TrendingUp
} from "lucide-react";
import { MetricCard } from "./dashboard/MetricCard";
import { StudySessionCard } from "./dashboard/StudySessionCard";
import type { StudySession } from '@/types/dashboard';
import { useQuery } from '@tanstack/react-query';
import { sessionsApi, topicsApi, streakApi, reviewApi } from '@/services/api';
import { Session } from '@/types/session';
import { sessionToStudySession } from '@/utils/mappers';
import { useToast } from '@/hooks/use-toast';
import { Brain } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showAlert, setShowAlert] = useState(true);
  const [selectedTab, setSelectedTab] = useState("current");
  const [viewPreference, setViewPreference] = useState<'calendar' | 'list'>('list');

  // Personalized greeting based on time of day
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  // Fetch topics
  const { data: topicsData } = useQuery({
    queryKey: ['topics'],
    queryFn: async () => {
      const response = await topicsApi.getTopics();
      return response.data;
    },
    retry: 1,
  });

  // Fetch sessions
  const {
    data: sessionsData,
    isLoading: isLoadingSessions,
    error: sessionsError,
    refetch: refetchSessions
  } = useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      const response = await sessionsApi.getSessions();
      return response.data;
    },
    retry: 1,
  });

  // Fetch streak data
  const { data: streakData } = useQuery({
    queryKey: ['streak'],
    queryFn: async () => {
      const response = await streakApi.getMyStreak();
      return response.data;
    },
    retry: false,
  });

  // Fetch review due count
  const { data: reviewDueData } = useQuery({
    queryKey: ['reviewDueCount'],
    queryFn: async () => {
      const response = await reviewApi.getDueCount();
      return response.data;
    },
    retry: false,
  });

  const dueReviewCount = reviewDueData?.count ?? 0;

  // Transform sessions for display
  const studySessions: StudySession[] = sessionsData
    ? sessionsData.map((session: Session) => sessionToStudySession(session))
    : [];

  // Filter sessions based on tab
  const filteredSessions = studySessions.filter(session => {
    if (selectedTab === 'current') return session.progress > 0 && session.progress < 100;
    if (selectedTab === 'upcoming') return session.progress === 0;
    if (selectedTab === 'completed') return session.progress === 100;
    return true;
  });

  // ─── Compute metrics from real data ───
  const studyStreak = streakData?.currentStreak ?? 0;

  // Total focus time: sum of session durations in hours
  const totalMinutes = sessionsData
    ? sessionsData.reduce((sum: number, s: Session) => {
        const start = new Date(s.startTime).getTime();
        const end = new Date(s.endTime).getTime();
        return sum + Math.max(0, (end - start) / 60000);
      }, 0)
    : 0;
  const focusTimeHours = Math.round(totalMinutes / 6) / 10; // 1 decimal

  // Topics covered: unique non-empty topicIds or categories
  const topicsCovered = sessionsData
    ? new Set(sessionsData.map((s: Session) => s.topicId || s.category).filter(Boolean)).size
    : (topicsData?.length ?? 0);

  // Goals achieved: % of completed sessions
  const totalSessions = sessionsData?.length ?? 0;
  const completedSessions = sessionsData?.filter((s: Session) => s.status === 'COMPLETED').length ?? 0;
  const goalsAchieved = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

  // ─── Study Progress breakdown by category ───
  const categoryProgress: { label: string; completed: number; total: number }[] = [];
  if (sessionsData && sessionsData.length > 0) {
    const byCategory: Record<string, { completed: number; total: number }> = {};
    for (const s of sessionsData as Session[]) {
      const cat = s.category || 'Other';
      if (!byCategory[cat]) byCategory[cat] = { completed: 0, total: 0 };
      byCategory[cat].total++;
      if (s.status === 'COMPLETED') byCategory[cat].completed++;
    }
    for (const [label, counts] of Object.entries(byCategory)) {
      categoryProgress.push({ label, ...counts });
    }
  }

  // ─── Handlers ───
  const handleStartStudying = () => {
    if (viewPreference === 'calendar') {
      navigate('/schedule');
    } else {
      const current = studySessions.filter(s => s.progress > 0 && s.progress < 100);
      if (current.length > 0) {
        navigate(`/progress?session=${current[0].id}`);
      } else {
        navigate('/schedule');
        toast({ title: "No active sessions", description: "Create a new study session to get started." });
      }
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Welcome Alert */}
      {showAlert && studyStreak > 0 && (
        <Alert className="bg-orange-500/5 border-orange-500/20 animate-fadeIn">
          <AlertDescription className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                <Flame className="h-5 w-5 text-orange-500" />
              </div>
              <div className="space-y-0.5">
                <p className="font-semibold text-orange-700 dark:text-orange-300">{studyStreak} day streak! Keep the fire burning.</p>
                <p className="text-sm text-muted-foreground">
                  {studyStreak >= 7 ? "You're on a roll! 🎉" : "Consistency is everything."}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowAlert(false)} className="hover:bg-orange-500/10">
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Hero Section - Command Center */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-orange-50 to-transparent dark:from-orange-950/20 p-6 rounded-xl border border-orange-100 dark:border-orange-900/30">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-orange-500" />
            <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Your Learning Command Center</p>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {greeting}! Ready to learn?
          </h1>
          <p className="text-muted-foreground max-w-lg">
            {studySessions.length > 0
              ? `You have ${filteredSessions.length} session${filteredSessions.length !== 1 ? 's' : ''} in progress. ${dueReviewCount > 0 ? `${dueReviewCount} review${dueReviewCount !== 1 ? 's' : ''} waiting.` : ''}`
              : "Start your learning journey by creating your first study session."
            }
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="icon" onClick={() => setViewPreference('list')} className={viewPreference === 'list' ? 'bg-orange-50 border-orange-200' : ''}>
            <BookOpen className={`h-5 w-5 ${viewPreference === 'list' ? 'text-orange-600' : 'text-muted-foreground'}`} />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setViewPreference('calendar')} className={viewPreference === 'calendar' ? 'bg-orange-50 border-orange-200' : ''}>
            <Calendar className={`h-5 w-5 ${viewPreference === 'calendar' ? 'text-orange-600' : 'text-muted-foreground'}`} />
          </Button>
          <Button onClick={handleStartStudying} className="bg-orange-500 hover:bg-orange-600">
            Start Studying <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Metrics — all derived from real data */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Study Streak"
          value={`${studyStreak} days`}
          icon={<Trophy className="h-4 w-4 text-yellow-500" />}
          description={streakData?.longestStreak
            ? <span className="text-slate-400">Best: {streakData.longestStreak} days</span>
            : undefined}
          tooltipText="Your consecutive days of study activity"
        />
        <MetricCard
          title="Focus Time"
          value={`${focusTimeHours} hrs`}
          icon={<Clock className="h-4 w-4 text-blue-500" />}
          description={streakData?.formattedTotalStudyTime
            ? <span className="text-slate-400">All time: {streakData.formattedTotalStudyTime}</span>
            : undefined}
          tooltipText="Total time from all sessions"
        />
        <MetricCard
          title="Topics Covered"
          value={topicsCovered.toString()}
          icon={<BookOpen className="h-4 w-4 text-purple-500" />}
          description={<span className="text-slate-400">{totalSessions} sessions total</span>}
          tooltipText="Distinct topics across your sessions"
        />
        <MetricCard
          title="Completion Rate"
          value={`${goalsAchieved}%`}
          icon={<Target className="h-4 w-4 text-red-500" />}
          description={<span className="text-slate-400">{completedSessions}/{totalSessions} sessions</span>}
          tooltipText="Percentage of sessions completed"
        />
      </div>

      {/* Due Reviews Banner */}
      {dueReviewCount > 0 && (
        <Card className="bg-orange-500/10 border-orange-500/30 cursor-pointer hover:bg-orange-500/15 transition-colors"
              onClick={() => navigate('/reviews')}>
          <CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                <Brain className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="font-medium text-orange-700 dark:text-orange-300">
                  {dueReviewCount} item{dueReviewCount !== 1 ? 's' : ''} ready for review
                </p>
                <p className="text-sm text-muted-foreground">
                  Spaced repetition strengthens memory
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="border-orange-500/30 text-orange-700 dark:text-orange-300 hover:bg-orange-500/20">
              Review Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Sessions + Progress Sidebar */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium">Study Sessions</CardTitle>
            <Tabs defaultValue="current" value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList>
                <TabsTrigger value="current">Current</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoadingSessions ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader className="h-8 w-8 text-primary animate-spin mb-4" />
                  <p className="text-muted-foreground">Loading your study sessions...</p>
                </div>
              ) : sessionsError ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <AlertCircle className="h-8 w-8 text-destructive mb-4" />
                  <p className="text-muted-foreground mb-2">Failed to load sessions.</p>
                  <Button variant="outline" size="sm" onClick={() => refetchSessions()}>
                    Retry
                  </Button>
                </div>
              ) : filteredSessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-950/40 dark:to-orange-950/20 flex items-center justify-center mb-6 border-2 border-orange-200 dark:border-orange-900/30">
                    {selectedTab === 'current' ? (
                      <TrendingUp className="h-10 w-10 text-orange-500" />
                    ) : selectedTab === 'upcoming' ? (
                      <Calendar className="h-10 w-10 text-orange-500" />
                    ) : (
                      <Trophy className="h-10 w-10 text-orange-500" />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {selectedTab === 'current' ? 'No active sessions yet' :
                     selectedTab === 'upcoming' ? 'No upcoming sessions planned' :
                     'No completed sessions yet'}
                  </h3>
                  <p className="text-muted-foreground text-center max-w-md mb-6">
                    {selectedTab === 'current'
                      ? 'Start a learning session to track your progress. Every minute counts toward your goals!'
                      : selectedTab === 'upcoming'
                      ? 'Planning ahead helps you stay consistent. Schedule your next deep work session.'
                      : 'Complete your first session to see your achievements here. You\'ve got this!'}
                  </p>
                  <Button onClick={() => navigate('/schedule')} className="bg-orange-500 hover:bg-orange-600">
                    <Plus className="mr-2 h-4 w-4" />
                    {selectedTab === 'upcoming' ? 'Schedule Session' : 'Start Learning'}
                  </Button>
                </div>
              ) : (
                filteredSessions.map((session) => (
                  <StudySessionCard
                    key={session.id}
                    session={session}
                    onContinue={() => navigate(`/progress?session=${session.id}`)}
                  />
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Study Progress — derived from sessions by category */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-medium">Study Progress</CardTitle>
            <CardDescription>Completion by category</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {categoryProgress.length > 0 ? (
              categoryProgress.map((cat) => {
                const pct = cat.total > 0 ? Math.round((cat.completed / cat.total) * 100) : 0;
                return (
                  <div key={cat.label} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{cat.label}</span>
                      <span className="text-sm text-muted-foreground">
                        {cat.completed}/{cat.total} ({pct}%)
                      </span>
                    </div>
                    <Progress value={pct} className="h-2" />
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <div className="inline-flex h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-950/40 items-center justify-center mb-3">
                  <Target className="h-6 w-6 text-orange-500" />
                </div>
                <p className="text-sm font-medium mb-1">Start tracking to see progress</p>
                <p className="text-xs text-muted-foreground">
                  Complete sessions to track your growth across topics.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
