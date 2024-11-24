import { Card } from "@/components/ui/card";
import { Calendar, Clock, Brain, AlertCircle } from "lucide-react";
import type { StudyEvent } from "@/types/schedule";

interface ScheduleStatsProps {
  events: StudyEvent[];
}

export function ScheduleStats({ events }: ScheduleStatsProps) {
  const stats = [
    {
      label: "Upcoming Sessions",
      value: events.length.toString(),
      icon: Calendar,
      color: "from-violet-500 to-purple-600",
    },
    {
      label: "Study Hours Planned",
      value: `${events
        .reduce(
          (acc, event) =>
            acc + (event.end.getTime() - event.start.getTime()) / (1000 * 60 * 60),
          0
        )
        .toFixed(1)}h`,
      icon: Clock,
      color: "from-blue-500 to-cyan-600",
    },
    {
      label: "Subjects This Week",
      value: new Set(events.map((e) => e.subject)).size.toString(),
      icon: Brain,
      color: "from-emerald-500 to-green-600",
    },
    {
      label: "Next Session",
      value: events.length > 0 ? "Today" : "No sessions",
      icon: AlertCircle,
      color: "from-orange-500 to-red-600",
    },
  ];

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
