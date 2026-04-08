import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, ArrowRight, ChevronRight, BookOpen, Code, Database } from 'lucide-react';

// This is a mock data representation - in a real app, this would come from an API
const roadmapData = [
  {
    id: 'path-1',
    title: 'Frontend Development',
    description: 'Master modern frontend technologies',
    progress: 65,
    icon: <Code className="h-5 w-5" />,
    color: 'blue',
    milestones: [
      { id: 'm1', title: 'HTML & CSS Basics', completed: true, duration: '2 weeks' },
      { id: 'm2', title: 'JavaScript Fundamentals', completed: true, duration: '3 weeks' },
      { id: 'm3', title: 'React Fundamentals', completed: true, duration: '4 weeks' },
      { id: 'm4', title: 'Advanced React Patterns', completed: false, duration: '3 weeks', current: true },
      { id: 'm5', title: 'State Management', completed: false, duration: '2 weeks' },
      { id: 'm6', title: 'Testing & Deployment', completed: false, duration: '2 weeks' }
    ]
  },
  {
    id: 'path-2',
    title: 'Backend Development',
    description: 'Build scalable server-side applications',
    progress: 30,
    icon: <Database className="h-5 w-5" />,
    color: 'green',
    milestones: [
      { id: 'm7', title: 'RESTful API Design', completed: true, duration: '2 weeks' },
      { id: 'm8', title: 'Node.js & Express', completed: true, duration: '3 weeks' },
      { id: 'm9', title: 'Authentication & Authorization', completed: false, duration: '2 weeks', current: true },
      { id: 'm10', title: 'Database Integration', completed: false, duration: '3 weeks' },
      { id: 'm11', title: 'Performance Optimization', completed: false, duration: '2 weeks' }
    ]
  },
  {
    id: 'path-3',
    title: 'Full Stack Integration',
    description: 'Connect frontend and backend systems',
    progress: 10,
    icon: <BookOpen className="h-5 w-5" />,
    color: 'purple',
    milestones: [
      { id: 'm12', title: 'API Integration', completed: true, duration: '2 weeks' },
      { id: 'm13', title: 'Full Stack Authentication', completed: false, duration: '2 weeks', current: true },
      { id: 'm14', title: 'Data Flow & State Sync', completed: false, duration: '3 weeks' },
      { id: 'm15', title: 'Deployment Pipeline', completed: false, duration: '2 weeks' },
      { id: 'm16', title: 'Monitoring & Logging', completed: false, duration: '1 week' }
    ]
  }
];

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  duration: string;
  current?: boolean;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  progress: number;
  icon: React.ReactNode;
  color: string;
  milestones: Milestone[];
}

export function LearningJourneyRoadmap() {
  const [expandedPath, setExpandedPath] = useState<string | null>(null);
  const [paths] = useState<LearningPath[]>(roadmapData);

  const togglePath = (pathId: string) => {
    setExpandedPath(expandedPath === pathId ? null : pathId);
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100 text-blue-800';
      case 'green':
        return 'bg-green-100 text-green-800';
      case 'purple':
        return 'bg-purple-100 text-purple-800';
      case 'red':
        return 'bg-red-100 text-red-800';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Learning Roadmap</h2>
        <p className="text-muted-foreground">Your personalized learning path to mastery</p>
      </div>

      <div className="space-y-4">
        {paths.map((path) => (
          <Card key={path.id} className="overflow-hidden">
            <CardHeader 
              className="py-4 cursor-pointer"
              onClick={() => togglePath(path.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`rounded-full p-2 ${getColorClass(path.color)}`}>
                    {path.icon}
                  </div>
                  <div>
                    <CardTitle>{path.title}</CardTitle>
                    <CardDescription>{path.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-medium">{path.progress}% Complete</div>
                    <Progress value={path.progress} className="w-32 h-2 mt-1" />
                  </div>
                  <ChevronRight className={`h-5 w-5 transition-transform ${expandedPath === path.id ? 'rotate-90' : ''}`} />
                </div>
              </div>
            </CardHeader>

            {expandedPath === path.id && (
              <CardContent className="pt-0 pb-4">
                <div className="ml-4 pl-8 border-l border-dashed border-gray-300">
                  {path.milestones.map((milestone, index) => (
                    <div 
                      key={milestone.id} 
                      className={`relative py-3 ${index < path.milestones.length - 1 ? 'border-b border-gray-100' : ''}`}
                    >
                      {/* Milestone indicator dot */}
                      <div className="absolute -left-10 mt-1">
                        {milestone.completed ? (
                          <div className="bg-green-100 text-green-800 rounded-full p-1">
                            <CheckCircle2 className="h-4 w-4" />
                          </div>
                        ) : milestone.current ? (
                          <div className="bg-blue-100 text-blue-800 rounded-full p-1">
                            <Clock className="h-4 w-4" />
                          </div>
                        ) : (
                          <div className="bg-gray-100 rounded-full p-1">
                            <div className="h-4 w-4"></div>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{milestone.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="h-3 w-3 text-gray-500" />
                            <span className="text-sm text-gray-500">{milestone.duration}</span>
                          </div>
                        </div>
                        
                        <div>
                          {milestone.completed ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Completed
                            </Badge>
                          ) : milestone.current ? (
                            <Badge variant="default">
                              In Progress
                            </Badge>
                          ) : (
                            <Badge variant="outline">
                              Upcoming
                            </Badge>
                          )}
                          
                          {!milestone.completed && (
                            <Button size="sm" variant="ghost" className="ml-2">
                              Start <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
      
      <Card className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="text-xl font-bold text-blue-800">Want to customize your roadmap?</h3>
              <p className="text-blue-600">Define your own learning goals and milestones</p>
            </div>
            <Button>
              Customize Roadmap <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 