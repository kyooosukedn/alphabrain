import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Timer
} from "lucide-react";

// Types remain the same
interface StudyMetric {
  label: string;
  value: string | number;
  change?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: 'up' | 'down';
}

interface StudySession {
  id: string;
  subject: string;
  progress: number;
  timeLeft: string;
  dueDate: string;
  lastStudied?: string;
  color?: string;
}

// Enhanced Metric Card with hover effects and animations
function MetricCard({ metric }: { metric: StudyMetric }) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = metric.icon;
  
  return (
    <Card
      className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {metric.label}
        </CardTitle>
        <Icon className={`h-4 w-4 transition-transform duration-300 ${
          isHovered ? 'scale-110 text-primary' : 'text-muted-foreground'
        }`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{metric.value}</div>
        {metric.change && (
          <p className={`text-xs flex items-center gap-1 ${
            metric.trend === 'up' ? 'text-green-500' : 
            metric.trend === 'down' ? 'text-red-500' : 
            'text-muted-foreground'
          }`}>
            {metric.change}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// Enhanced Study Session Card with interactive elements
function StudySessionCard({ 
  session, 
  onContinue 
}: { 
  session: StudySession;
  onContinue: (sessionId: string) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(session.timeLeft);

  // Simulated countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      // Update time remaining (simplified for demo)
      setTimeRemaining(prev => 
        prev.includes('h') ? 
        `${parseInt(prev) - 1}h left` : 
        prev
      );
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Card
      className={`transition-all duration-300 ${
        isHovered ? 'shadow-lg ring-2 ring-primary ring-opacity-50' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              session.color || 'bg-primary'
            }`} />
            <span>{session.subject}</span>
          </div>
          <Button 
            variant={isHovered ? "default" : "outline"}
            size="sm" 
            onClick={() => onContinue(session.id)}
            className="transition-all duration-300"
          >
            Continue {isHovered && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">
              {session.progress}%
            </span>
          </div>
          <Progress 
            value={session.progress} 
            className="h-2 transition-all duration-500"
          />
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            <Timer className="h-4 w-4 text-orange-500" />
            <span className={`${
              timeRemaining.includes('1h') ? 'text-orange-500 font-medium' : ''
            }`}>
              {timeRemaining}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-blue-500" />
            <span>{session.dueDate}</span>
          </div>
        </div>
        {session.lastStudied && (
          <div className="text-xs text-muted-foreground">
            Last studied: {session.lastStudied}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Enhanced constants with more metadata
const STUDY_METRICS: StudyMetric[] = [
  {
    label: "Study Streak",
    value: "7 days",
    change: "+2 days from last week",
    icon: Trophy,
    trend: 'up'
  },
  {
    label: "Study Time",
    value: "12.5 hours",
    change: "This week",
    icon: Clock,
    trend: 'up'
  },
  {
    label: "Topics Mastered",
    value: 24,
    change: "+3 this week",
    icon: Brain,
    trend: 'up'
  },
  {
    label: "Next Goal",
    value: "3 days",
    change: "Until completion",
    icon: Target
  }
];

const MOCK_SESSIONS: StudySession[] = [
  {
    id: "1",
    subject: "Mathematics",
    progress: 67,
    timeLeft: "2h left",
    dueDate: "Due tomorrow",
    lastStudied: "Today, 2 hours ago",
    color: "bg-blue-500"
  },
  {
    id: "2",
    subject: "Physics",
    progress: 45,
    timeLeft: "4h left",
    dueDate: "Due in 3 days",
    lastStudied: "Yesterday",
    color: "bg-purple-500"
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
    <div className="flex flex-col gap-8">
      {/* Welcome Alert */}
      {showAlert && (
        <Alert className="bg-primary/5 border-primary/20">
          <AlertDescription className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Welcome back! You're on track to reach your weekly study goal.
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowAlert(false)}
            >
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Enhanced Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
            Welcome back, Student!
          </h1>
          <p className="text-muted-foreground">
            Let's continue your learning journey.
          </p>
        </div>
        <Button 
          size="lg" 
          className="gap-2 transition-all duration-300 hover:gap-3"
          onClick={handleStartStudying}
        >
          <BookOpen className="w-4 h-4" /> 
          Start Studying
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {STUDY_METRICS.map((metric, index) => (
          <MetricCard key={index} metric={metric} />
        ))}
      </div>

      {/* Enhanced Study Sessions Tabs */}
      <Tabs 
        value={selectedTab} 
        onValueChange={setSelectedTab}
        className="space-y-4"
      >
        <TabsList className="w-full justify-start">
          <TabsTrigger value="current" className="flex-1 md:flex-none">
            Current Studies
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="flex-1 md:flex-none">
            Upcoming
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex-1 md:flex-none">
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
              <p>You have 3 upcoming study sessions scheduled.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed Studies</CardTitle>
            </CardHeader>
            <CardContent>
              <p>You've completed 12 study sessions this week!</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}   