import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Timer, BookMarked, Target } from "lucide-react";
import type { StudySession } from '@/types/dashboard';

interface StudySessionCardProps {
  session: StudySession;
  onContinue?: (sessionId: string) => void;
}

export function StudySessionCard({ session, onContinue }: StudySessionCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-primary/10 hover:border-primary/20">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${session.color}`} />
            <h3 className="font-semibold">{session.subject}</h3>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Timer className="w-4 h-4" />
            <span>{session.timeLeft}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{session.progress}%</span>
            </div>
            <Progress value={session.progress} className="h-2" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Target className="w-4 h-4" />
              <span>{session.completedTopics}/{session.totalTopics} Topics</span>
            </div>
            {onContinue && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onContinue(session.id)}
                className="hover:bg-primary/10"
              >
                Continue
              </Button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {session.topics.map((topic, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
