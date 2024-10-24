import { useState, useEffect } from 'react';
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
  CheckCircle2,
  Timer,
  Zap,
  Star,
  TrendingUp,
  Activity,
  BookMarked,
  GraduationCap
} from "lucide-react";

// Enhanced types with more metadata
interface StudyMetric {
  label: string;
  value: string | number;
  change?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
  description?: string;
}

interface StudySession {
  id: string;
  subject: string;
  progress: number;
  timeLeft: string;
  dueDate: string;
  lastStudied?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topics: string[];
  color: string;
  streakDays: number;
  completedTopics: number;
  totalTopics: number;
}

// Enhanced Metric Card with gradient backgrounds and animations
function MetricCard({ metric }: { metric: StudyMetric }) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = metric.icon;
  
  return (
    <Card
      className={`group relative overflow-hidden transition-all duration-500 
        ${isHovered ? 'shadow-xl scale-105' : 'shadow-md'}
        bg-gradient-to-br from-background to-background/50
        border border-primary/10 hover:border-primary/20`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium tracking-tight">
          {metric.label}
        </CardTitle>
        <Icon className={`h-5 w-5 transition-all duration-500 ${
          isHovered ? 'scale-110 text-primary' : 'text-muted-foreground'
        }`} />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-2xl font-bold tracking-tight">{metric.value}</div>
          {metric.change && (
            <div className={`text-xs flex items-center gap-1 transition-colors duration-300 ${
              metric.trend === 'up' ? 'text-green-500' : 
              metric.trend === 'down' ? 'text-red-500' : 
              'text-muted-foreground'
            }`}>
              <TrendingUp className={`h-3 w-3 ${
                metric.trend === 'up' ? 'rotate-0' : 
                metric.trend === 'down' ? 'rotate-180' : ''
              }`} />
              {metric.change}
            </div>
          )}
          {metric.description && (
            <p className="text-xs text-muted-foreground mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {metric.description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Enhanced Study Session Card with rich interactions and visual feedback
function StudySessionCard({ 
  session, 
  onContinue 
}: { 
  session: StudySession;
  onContinue: (sessionId: string) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(session.progress);

  // Animate progress on hover
  useEffect(() => {
    if (isHovered) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newValue = prev + 0.1;
          return newValue > session.progress ? session.progress : newValue;
        });
      }, 10);
      return () => clearInterval(interval);
    } else {
      setProgress(session.progress);
    }
  }, [isHovered, session.progress]);

  return (
    <Card
      className={`group relative overflow-hidden transition-all duration-500
        ${isHovered ? 'shadow-xl scale-105' : 'shadow-md'}
        bg-gradient-to-br from-background to-background/50`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              {session.subject}
            </CardTitle>
            <CardDescription>
              {session.completedTopics} of {session.totalTopics} topics completed
            </CardDescription>
          </div>
          <Button 
            variant={isHovered ? "default" : "outline"}
            size="sm" 
            onClick={() => onContinue(session.id)}
            className="transition-all duration-300 group/button"
          >
            Continue
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/button:translate-x-1" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="relative">
            <Progress 
              value={progress} 
              className="h-2 transition-all duration-500"
            />
            {isHovered && (
              <div className="absolute -right-2 -top-1 transition-opacity duration-300">
                <Star className="h-4 w-4 text-primary animate-pulse" />
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Timer className="h-4 w-4 text-primary" />
              <span>{session.timeLeft}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{session.dueDate}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Activity className="h-4 w-4 text-primary" />
              <span>{session.difficulty} difficulty</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Zap className="h-4 w-4 text-primary" />
              <span>{session.streakDays} day streak</span>
            </div>
          </div>
        </div>

        {session.topics.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {session.topics.map((topic, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary transition-all duration-300 hover:bg-primary/20"
              >
                {topic}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Rich mock data
const STUDY_METRICS: StudyMetric[] = [
  {
    label: "Study Streak",
    value: "7 days",
    change: "+2 days from last week",
    icon: Trophy,
    trend: 'up',
    color: 'yellow-500',
    description: 'Keep going! Your longest streak was 12 days.'
  },
{
    label: "Focus Time",
    value: "12.5 hours",
    change: "30% increase",
    icon: Clock,
    trend: 'up',
    color: 'blue-500',
    description: 'You\'re studying more efficiently than last week!'
},
  {
    label: "Mastery Score",
    value: "24/30",
    change: "+3 this week",
    icon: Brain,
    trend: 'up',
    color: 'purple-500',
    description: 'Exceptional progress in difficult topics'
  },
  {
    label: "Next Milestone",
    value: "3 days",
    change: "On track",
    icon: Target,
    trend: 'neutral',
    color: 'green-500',
    description: 'Complete 5 more topics to unlock achievements'
  }
];

const MOCK_SESSIONS: StudySession[] = [
  {
    id: "1",
    subject: "Advanced Mathematics",
    progress: 67,
    timeLeft: "2h left",
    dueDate: "Due tomorrow",
    lastStudied: "Today, 2 hours ago",
    difficulty: 'hard',
    topics: ['Calculus', 'Linear Algebra', 'Statistics'],
    color: 'blue-500',
    streakDays: 5,
    completedTopics: 8,
    totalTopics: 12
  },
  {
    id: "2",
    subject: "Quantum Physics",
    progress: 45,
    timeLeft: "4h left",
    dueDate: "Due in 3 days",
    lastStudied: "Yesterday",
    difficulty: 'medium',
    topics: ['Quantum Mechanics', 'Wave Theory'],
    color: 'purple-500',
    streakDays: 3,
    completedTopics: 4,
    totalTopics: 8
  }
];

// Enhanced Dashboard Component
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
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95 p-8 space-y-8">
      {/* Enhanced Welcome Alert */}
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

      {/* Enhanced Header Section */}
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

      {/* Enhanced Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {STUDY_METRICS.map((metric, index) => (
          <MetricCard key={index} metric={metric} />
        ))}
      </div>

      {/* Enhanced Study Sessions Tabs */}
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

        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Studies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <BookMarked className="h-5 w-5 text-primary" />
                <p>You have 3 upcoming study sessions scheduled.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed Studies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                <p>You've completed 12 study sessions this week!</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}