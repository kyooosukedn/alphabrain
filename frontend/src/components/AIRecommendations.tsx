import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { checkAIStatus } from '../store/slices/aiRecommendationsSlice';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import {
  Sparkles,
  Route,
  Footprints,
  Loader2,
  AlertCircle,
  BookOpen,
  Clock,
  BarChart3,
} from 'lucide-react';

// ─── Demo data shown when AI backend is not yet enabled ───

const demoLearningPaths = [
  {
    id: '1',
    title: 'Frontend Development Path',
    description:
      'Learn HTML, CSS, JavaScript and modern frameworks like React to build responsive web applications. Start with fundamental web technologies and progress to advanced state management and performance optimization.',
    difficulty: 2,
    estimatedHours: 120,
  },
  {
    id: '2',
    title: 'Backend Development Path',
    description:
      'Master server-side programming with Java and Spring Boot to build robust APIs and services. Learn about data persistence, authentication, and cloud deployment strategies.',
    difficulty: 3,
    estimatedHours: 160,
  },
  {
    id: '3',
    title: 'DevOps & Cloud Path',
    description:
      'Understand CI/CD pipelines, containerization with Docker, and cloud deployment on AWS or GCP. Essential for shipping reliable software at scale.',
    difficulty: 3,
    estimatedHours: 80,
  },
];

const demoRoadmap = {
  title: 'Full-Stack Developer Roadmap',
  description:
    'Complete learning journey to becoming a full-stack developer with skills in both frontend and backend technologies. Covers all essential technologies and concepts needed for modern web development.',
  category: 'Web Development',
  difficulty: 'Advanced',
  estimatedHours: 300,
  completionPercentage: 35,
  milestones: [
    { label: 'HTML & CSS Fundamentals', done: true },
    { label: 'JavaScript & TypeScript', done: true },
    { label: 'React & State Management', done: false },
    { label: 'Node.js / Spring Boot APIs', done: false },
    { label: 'Database & ORM', done: false },
    { label: 'Deployment & DevOps', done: false },
  ],
};

const demoNextSteps = [
  {
    id: 'step1',
    title: 'Learn React Hooks',
    description:
      'Master the fundamentals of React Hooks to manage state and side effects in functional components. Focus on useState, useEffect, and useContext hooks first.',
    difficulty: 2,
    estimatedMinutes: 90,
  },
  {
    id: 'step2',
    title: 'Spring Security Implementation',
    description:
      'Implement authentication and authorization in your Spring Boot applications using Spring Security. Learn to configure JWT-based authentication.',
    difficulty: 3,
    estimatedMinutes: 120,
  },
  {
    id: 'step3',
    title: 'Write Integration Tests',
    description:
      'Set up integration tests for your REST API endpoints using MockMvc or WebTestClient. Ensure your controllers, services, and repositories work together correctly.',
    difficulty: 2,
    estimatedMinutes: 60,
  },
];

// ─── Helpers ───

function difficultyLabel(level: number): string {
  if (level <= 1) return 'Beginner';
  if (level === 2) return 'Intermediate';
  return 'Advanced';
}

function difficultyColor(level: number): string {
  if (level <= 1) return 'text-green-400';
  if (level === 2) return 'text-yellow-400';
  return 'text-red-400';
}

// ─── Component ───

const AIRecommendations: React.FC = () => {
  const dispatch = useAppDispatch();
  const { statusMessage, aiEnabled, loading, error } = useAppSelector(
    (state) => state.aiRecommendations
  );

  useEffect(() => {
    dispatch(checkAIStatus());
  }, [dispatch]);

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
        <p className="text-slate-400">Checking AI recommendation status...</p>
      </div>
    );
  }

  // Network error — backend unreachable
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <AlertCircle className="h-8 w-8 text-destructive mb-4" />
        <p className="text-slate-300 mb-2">Could not reach the AI service.</p>
        <p className="text-sm text-slate-500 mb-4">{error}</p>
        <Button variant="outline" size="sm" onClick={() => dispatch(checkAIStatus())}>
          Retry
        </Button>
      </div>
    );
  }

  // AI is not enabled on the backend — show demo preview
  return (
    <div className="space-y-6">
      {/* Status banner */}
      {!aiEnabled && (
        <Alert className="bg-violet-500/10 border-violet-500/30">
          <Sparkles className="h-4 w-4 text-violet-400" />
          <AlertDescription className="text-slate-300">
            <span className="font-medium text-violet-300">Preview Mode</span> — AI
            recommendations powered by Gemini are coming soon.{' '}
            {statusMessage && (
              <span className="text-slate-500 text-sm">({statusMessage})</span>
            )}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="learningPaths" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="learningPaths" className="gap-1.5">
            <Route className="h-4 w-4" /> Learning Paths
          </TabsTrigger>
          <TabsTrigger value="roadmap" className="gap-1.5">
            <BarChart3 className="h-4 w-4" /> Roadmap
          </TabsTrigger>
          <TabsTrigger value="nextSteps" className="gap-1.5">
            <Footprints className="h-4 w-4" /> Next Steps
          </TabsTrigger>
        </TabsList>

        {/* ─── Learning Paths Tab ─── */}
        <TabsContent value="learningPaths">
          <div className="grid gap-4">
            {demoLearningPaths.map((path) => (
              <Card key={path.id} className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-violet-400" />
                    {path.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-400 mb-3">{path.description}</p>
                  <div className="flex items-center gap-4 text-xs">
                    <span className={difficultyColor(path.difficulty)}>
                      {difficultyLabel(path.difficulty)}
                    </span>
                    <span className="text-slate-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {path.estimatedHours} hrs
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ─── Roadmap Tab ─── */}
        <TabsContent value="roadmap">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg text-white">{demoRoadmap.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-400">{demoRoadmap.description}</p>

              <div className="flex items-center gap-4 text-xs">
                <span className="text-slate-500">Category: {demoRoadmap.category}</span>
                <span className="text-yellow-400">{demoRoadmap.difficulty}</span>
                <span className="text-slate-500 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {demoRoadmap.estimatedHours} hrs
                </span>
              </div>

              {/* Progress */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-300">Overall Progress</span>
                  <span className="text-sm text-slate-500">
                    {demoRoadmap.completionPercentage}%
                  </span>
                </div>
                <Progress value={demoRoadmap.completionPercentage} className="h-2" />
              </div>

              {/* Milestones */}
              <div className="space-y-2 pt-2">
                <span className="text-sm font-medium text-slate-300">Milestones</span>
                {demoRoadmap.milestones.map((m) => (
                  <div
                    key={m.label}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        m.done ? 'bg-green-500' : 'bg-slate-600'
                      }`}
                    />
                    <span className={m.done ? 'text-slate-300' : 'text-slate-500'}>
                      {m.label}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── Next Steps Tab ─── */}
        <TabsContent value="nextSteps">
          <div className="grid gap-4">
            {demoNextSteps.map((step) => (
              <Card key={step.id} className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <Footprints className="h-5 w-5 text-green-400" />
                    {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-400 mb-3">{step.description}</p>
                  <div className="flex items-center gap-4 text-xs">
                    <span className={difficultyColor(step.difficulty)}>
                      {difficultyLabel(step.difficulty)}
                    </span>
                    <span className="text-slate-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {step.estimatedMinutes} min
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIRecommendations;
