import { Card } from "@/components/ui/card";
import { Calendar, Clock, Brain, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { sessionsApi } from "@/services/api";
import type { Session } from "@/types/session";
import { safeFormat } from "@/utils/dateUtils";

export function ScheduleStats() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch sessions for stats
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await sessionsApi.getSessions();
        setSessions(response.data);
      } catch (error) {
        console.error("Failed to fetch sessions for stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  // Calculate upcoming sessions (those that haven't started yet)
  const upcomingSessions = sessions.filter(
    session => session.startTime && new Date(session.startTime) > new Date() && session.status === 'PLANNED'
  );

  // Calculate study hours planned
  const studyHoursPlanned = sessions
    .filter(session => (session.status === 'PLANNED' || session.status === 'IN_PROGRESS') && session.startTime && session.endTime)
    .reduce(
      (acc, session) =>
        acc + (new Date(session.endTime!).getTime() - new Date(session.startTime!).getTime()) / (1000 * 60 * 60),
      0
    );

  // Get unique topics this week
  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  const endOfWeek = new Date(now);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  const topicsThisWeek = new Set(
    sessions
      .filter(
        session =>
          session.startTime &&
          new Date(session.startTime) >= startOfWeek &&
          new Date(session.startTime) <= endOfWeek &&
          session.topicId
      )
      .map(session => session.topicId)
  );

  // Get next session time
  const nextSession = upcomingSessions.length > 0
    ? upcomingSessions
        .sort((a, b) => new Date(a.startTime!).getTime() - new Date(b.startTime!).getTime())[0]
        .startTime
    : null;

  const formatNextSession = () => {
    if (!nextSession) return "No sessions";

    try {
      const nextDate = new Date(nextSession);
      if (isNaN(nextDate.getTime())) return "Invalid date";

      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      if (nextDate.toDateString() === today.toDateString()) {
        return "Today";
      } else if (nextDate.toDateString() === tomorrow.toDateString()) {
        return "Tomorrow";
      } else {
        return nextDate.toLocaleDateString(undefined, { weekday: 'long' });
      }
    } catch {
      return "Invalid date";
    }
  };

  const stats = [
    {
      label: "Upcoming Sessions",
      value: upcomingSessions.length.toString(),
      icon: Calendar,
      color: "from-violet-500 to-purple-600",
    },
    {
      label: "Study Hours Planned",
      value: `${studyHoursPlanned.toFixed(1)}h`,
      icon: Clock,
      color: "from-blue-500 to-cyan-600",
    },
    {
      label: "Topics This Week",
      value: topicsThisWeek.size.toString(),
      icon: Brain,
      color: "from-emerald-500 to-green-600",
    },
    {
      label: "Next Session",
      value: formatNextSession(),
      icon: AlertCircle,
      color: "from-orange-500 to-red-600",
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((index) => (
          <Card key={index} className="p-6 space-y-4 border-none animate-pulse">
            <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className="p-6 space-y-4 bg-gradient-to-br from-white/5 to-white/10 border-none"
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
