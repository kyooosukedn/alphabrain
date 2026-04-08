import { useState } from 'react';
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
  Plus
} from "lucide-react";
import { MetricCard } from "./dashboard/MetricCard";
import { StudySessionCard } from "./dashboard/StudySessionCard";
import type { StudySession } from '@/types/dashboard';
import { useQuery } from '@tanstack/react-query';
import { sessionsApi, topicsApi, streakApi } from '@/services/api';
import { Session } from '@/types/session';
import { sessionToStudySession } from '@/utils/mappers';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showAlert, setShowAlert] = useState(true);
  const [selectedTab, setSelectedTab] = useState("current");
  const [viewPreference, setViewPreference] = useState<'calendar' | 'list'>('list');

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
        <Alert className="bg-primary/5 border-primary/20 animate-fadeIn">
          <AlertDescription className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="font-medium">{studyStreak} day streak!</p>
                <p className="text-sm text-muted-foreground">
                  Keep it up — consistency is everything.
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowAlert(false)} className="hover:bg-primary/10">
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
              Welcome back!
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Ready to continue your learning journey?
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => setViewPreference('list')}>
            <BookOpen className={`h-5 w-5 ${viewPreference === 'list' ? 'text-primary' : 'text-muted-foreground'}`} />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setViewPreference('calendar')}>
            <Calendar className={`h-5 w-5 ${viewPreference === 'calendar' ? 'text-primary' : 'text-muted-foreground'}`} />
          </Button>
          <Button onClick={handleStartStudying}>
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
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Plus className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-lg font-medium mb-2">No {selectedTab} sessions</p>
                  <p className="text-muted-foreground text-center mb-4">
                    {selectedTab === 'current' ? 'Start a session to track progress.' :
                     selectedTab === 'upcoming' ? 'Plan your next study session.' :
                     'Complete a session to see it here.'}
                  </p>
                  <Button onClick={() => navigate('/schedule')}>
                    Create New Session
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
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">No sessions yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Create sessions to see progress by category.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
