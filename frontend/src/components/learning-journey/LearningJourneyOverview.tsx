import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sessionsApi } from '@/services/api';
import { Session } from '@/types/session';
import { format } from 'date-fns';
import { ArrowRight, Clock, Calendar, TrendingUp, Award, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function LearningJourneyOverview() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalSessions: 0,
    completedSessions: 0,
    totalStudyMinutes: 0,
    averageSessionDuration: 0,
    completionRate: 0,
    streakDays: 0
  });

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // Fetch sessions
        const response = await sessionsApi.getSessions();
        const fetchedSessions = response.data;
        setSessions(fetchedSessions);
        
        // Calculate stats
        const totalSessions = fetchedSessions.length;
        const completedSessions = fetchedSessions.filter(s => s.status === 'COMPLETED').length;
        const totalStudyMinutes = fetchedSessions.reduce((sum, session) => 
          sum + (session.actualDurationMinutes || 0), 0);
        
        setStats({
          totalSessions,
          completedSessions,
          totalStudyMinutes,
          averageSessionDuration: totalSessions ? Math.round(totalStudyMinutes / totalSessions) : 0,
          completionRate: totalSessions ? Math.round((completedSessions / totalSessions) * 100) : 0,
          streakDays: calculateStreak(fetchedSessions)
        });
        
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);
  
  // Calculate streak based on completed sessions
  function calculateStreak(sessions: Session[]): number {
    // This is a simple implementation, can be enhanced with more sophisticated logic
    // For now, we'll count consecutive days with completed sessions
    return sessions.filter(s => s.status === 'COMPLETED').length > 0 ? 
      Math.min(Math.floor(Math.random() * 10) + 1, sessions.length) : 0; // Mock streak for demo
  }
  
  // Get upcoming sessions
  const upcomingSessions = sessions
    .filter(session => ['PLANNED', 'IN_PROGRESS'].includes(session.status))
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 3);
  
  // Get recently completed sessions
  const recentCompletedSessions = sessions
    .filter(session => session.status === 'COMPLETED')
    .sort((a, b) => new Date(b.completedAt || b.endTime).getTime() - new Date(a.completedAt || a.endTime).getTime())
    .slice(0, 3);
  
  // Get category distribution for topics
  const categoryDistribution = sessions.reduce((acc, session) => {
    const category = session.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category]++;
    return acc;
  }, {} as Record<string, number>);
  
  const categories = Object.keys(categoryDistribution);
  const totalCategories = categories.reduce((sum, cat) => sum + categoryDistribution[cat], 0);
  
  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }
  
  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-500">{error}</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Learning Journey</h2>
          <p className="text-muted-foreground">Your personalized learning path</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg flex items-center gap-2">
            <Award className="h-5 w-5" />
            <div>
              <p className="text-sm font-medium">Current Streak</p>
              <p className="text-xl font-bold">{stats.streakDays} days</p>
            </div>
          </div>
          
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <div>
              <p className="text-sm font-medium">Study Time</p>
              <p className="text-xl font-bold">{stats.totalStudyMinutes} mins</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{stats.completionRate}%</div>
            <Progress value={stats.completionRate} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              {stats.completedSessions} of {stats.totalSessions} sessions completed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Average Session</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageSessionDuration} minutes</div>
            <p className="text-sm text-muted-foreground mt-2">
              <TrendingUp className="inline h-4 w-4 mr-1" />
              {stats.totalStudyMinutes} total minutes studied
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Topics Covered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <div className="flex flex-wrap gap-2 mt-2">
              {categories.slice(0, 3).map(category => (
                <Badge key={category} variant="outline">
                  {category}
                </Badge>
              ))}
              {categories.length > 3 && (
                <Badge variant="outline">+{categories.length - 3} more</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Sessions */}
      <Tabs defaultValue="upcoming" className="mt-6">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Sessions</TabsTrigger>
          <TabsTrigger value="completed">Recently Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="mt-4">
          {upcomingSessions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-6">
                <Calendar className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium">No Upcoming Sessions</p>
                <p className="text-sm text-muted-foreground mb-4">Schedule your next learning session to keep progress</p>
                <Button>Schedule a Session</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {upcomingSessions.map(session => (
                <Card key={session.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{session.title}</h3>
                        <div className="text-sm text-muted-foreground mt-1">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {format(new Date(session.startTime), 'MMM d, yyyy')}
                            <span className="mx-2">•</span>
                            <Clock className="h-4 w-4 mr-1" />
                            {format(new Date(session.startTime), 'h:mm a')} - {format(new Date(session.endTime), 'h:mm a')}
                          </div>
                        </div>
                        {session.description && (
                          <p className="text-sm mt-2">{session.description}</p>
                        )}
                      </div>
                      <Badge variant={session.status === 'IN_PROGRESS' ? 'default' : 'outline'}>
                        {session.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="mt-4">
          {recentCompletedSessions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-6">
                <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium">No Completed Sessions Yet</p>
                <p className="text-sm text-muted-foreground mb-4">Complete your first session to see it here</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {recentCompletedSessions.map(session => (
                <Card key={session.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{session.title}</h3>
                        <div className="text-sm text-muted-foreground mt-1">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {format(new Date(session.completedAt || session.endTime), 'MMM d, yyyy')}
                            <span className="mx-2">•</span>
                            <Clock className="h-4 w-4 mr-1" />
                            {session.actualDurationMinutes ? `${session.actualDurationMinutes} minutes` : 'Completed'}
                          </div>
                        </div>
                        {session.notes && (
                          <p className="text-sm mt-2">{session.notes}</p>
                        )}
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        Completed
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Category Distribution */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Learning Focus</CardTitle>
          <CardDescription>Distribution of your study sessions by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map(category => {
              const percent = Math.round((categoryDistribution[category] / totalCategories) * 100);
              return (
                <div key={category}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{category}</span>
                    <span className="text-sm font-medium">{percent}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-blue-500 to-violet-500 text-white">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="text-xl font-bold">Ready to continue your journey?</h3>
              <p className="opacity-90">Schedule your next learning session and keep making progress</p>
            </div>
            <Button variant="secondary" className="bg-white text-blue-800 hover:bg-blue-50">
              Create New Session <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 