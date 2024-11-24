import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  BookOpen, 
  Brain, 
  Clock, 
  Target, 
  Trophy,
  Calendar,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { MetricCard } from "./dashboard/MetricCard";
import { StudySessionCard } from "./dashboard/StudySessionCard";
import { STUDY_METRICS, MOCK_SESSIONS } from "@/data/mockData";
import type { StudySession } from '@/types/dashboard';

export default function Dashboard() {
  const [activeSessions] = useState<StudySession[]>(MOCK_SESSIONS);
  const [showAlert, setShowAlert] = useState(true);
  const [selectedTab, setSelectedTab] = useState("current");

  const handleStartStudying = () => {
    console.log("Starting new study session");
  };

  const handleContinueSession = (sessionId: string) => {
    console.log("Continuing session:", sessionId);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Welcome Alert */}
      {showAlert && (
        <Alert className="bg-primary/5 border-primary/20 animate-fadeIn">
          <AlertDescription className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="font-medium">Excellent progress!</p>
                <p className="text-sm text-muted-foreground">
                  You're on track to reach your weekly study goal.
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowAlert(false)}
              className="hover:bg-primary/10"
            >
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Header*/}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
              Welcome back, Student!
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Ready to continue your learning journey?
          </p>
        </div>
        <Button 
          size="lg" 
          className="group relative overflow-hidden"
          onClick={handleStartStudying}
        >
          <span className="relative flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Start Studying
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </Button>
      </div>

      {/* Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {STUDY_METRICS.map((metric, index) => (
          <MetricCard key={index} metric={metric} />
        ))}
      </div>

      {/* Study Sessions Tabs */}
      <Tabs 
        value={selectedTab} 
        onValueChange={setSelectedTab}
        className="space-y-6"
      >
        <TabsList className="w-full justify-start bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50 border">
          <TabsTrigger 
            value="current"
            className="flex-1 md:flex-none data-[state=active]:bg-primary/10"
          >
            Current Studies
          </TabsTrigger>
          <TabsTrigger 
            value="upcoming"
            className="flex-1 md:flex-none data-[state=active]:bg-primary/10"
          >
            Upcoming
          </TabsTrigger>
          <TabsTrigger 
            value="completed"
            className="flex-1 md:flex-none data-[state=active]:bg-primary/10"
          >
            Completed
          </TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {activeSessions.map((session) => (
              <StudySessionCard 
                key={session.id} 
                session={session} 
                onContinue={handleContinueSession}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Add upcoming sessions here */}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Add completed sessions here */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}