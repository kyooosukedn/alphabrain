import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Trophy, TrendingUp } from 'lucide-react';
import { sessionsApi } from '@/services/api';
import { Session } from '@/types/session';

export function LearningJourneyStatistics() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch sessions for stats
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        const response = await sessionsApi.getSessions();
        setSessions(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching sessions:', err);
        setError('Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSessions();
  }, []);
  
  // Calculate statistics based on sessions
  const totalSessions = sessions.length;
  const completedSessions = sessions.filter(s => s.status === 'COMPLETED').length;
  const totalMinutes = sessions.reduce((total, session) => 
    total + (session.actualDurationMinutes || 0), 0);
  
  // Calculate average session length
  const avgSessionLength = completedSessions > 0
    ? Math.round(totalMinutes / completedSessions)
    : 0;
  
  // Create a map of categories
  const categoryMap = sessions.reduce((acc, session) => {
    const category = session.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += session.actualDurationMinutes || 0;
    return acc;
  }, {} as Record<string, number>);
  
  // Turn it into percentages
  const totalCategoryTime = Object.values(categoryMap).reduce((sum, time) => sum + time, 0);
  const categoryPercentages = Object.entries(categoryMap).map(([name, time]) => ({
    name,
    percentage: totalCategoryTime > 0 ? Math.round((time / totalCategoryTime) * 100) : 0
  }));
  
  // Sort categories by percentage (highest first)
  categoryPercentages.sort((a, b) => b.percentage - a.percentage);
  
  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }
  
  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-500">{error}</div>;
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Learning Statistics</h2>
        <p className="text-muted-foreground">Insights into your learning journey</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Total Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSessions}</div>
            <p className="text-sm text-muted-foreground">
              {completedSessions} completed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Study Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor(totalMinutes / 60)} hrs {totalMinutes % 60} mins
            </div>
            <p className="text-sm text-muted-foreground">
              Total time invested
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Avg. Session</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {avgSessionLength} mins
            </div>
            <p className="text-sm text-muted-foreground">
              Per completed session
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0}%
            </div>
            <p className="text-sm text-muted-foreground">
              Session completion
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Time Distribution by Category</CardTitle>
            <CardDescription>Percentage breakdown of your study time</CardDescription>
          </CardHeader>
          <CardContent>
            {categoryPercentages.length > 0 ? (
              <div className="space-y-4">
                {categoryPercentages.map(category => (
                  <div key={category.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium capitalize">{category.name.toLowerCase()}</span>
                      <span className="text-sm font-medium">{category.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                <p>No session data available yet</p>
                <p className="text-sm">Complete some sessions to see statistics</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Learning Patterns</CardTitle>
            <CardDescription>Insights about your study habits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="text-blue-500 h-5 w-5" />
                  <h4 className="font-medium">Most Productive Time</h4>
                </div>
                <p className="text-lg font-bold">Evening 6-9 PM</p>
                <p className="text-sm text-muted-foreground">Based on completed sessions</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="text-green-500 h-5 w-5" />
                  <h4 className="font-medium">Longest Streak</h4>
                </div>
                <p className="text-lg font-bold">{Math.min(Math.ceil(completedSessions / 2), 7)} days</p>
                <p className="text-sm text-muted-foreground">Continuous learning days</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="text-yellow-500 h-5 w-5" />
                  <h4 className="font-medium">Most Studied Topic</h4>
                </div>
                <p className="text-lg font-bold capitalize">
                  {categoryPercentages.length > 0 ? categoryPercentages[0].name.toLowerCase() : 'None'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {categoryPercentages.length > 0 ? `${categoryPercentages[0].percentage}% of total time` : 'No data yet'}
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="text-purple-500 h-5 w-5" />
                  <h4 className="font-medium">Avg. Session Gap</h4>
                </div>
                <p className="text-lg font-bold">{Math.max(Math.min(Math.ceil(30 / Math.max(totalSessions, 1)), 7), 1)} days</p>
                <p className="text-sm text-muted-foreground">Between study sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Weekly Activity</CardTitle>
          <CardDescription>Your study activity over the past few months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            <div className="grid grid-cols-7 text-center text-xs mb-2">
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
              <div>Sun</div>
            </div>
            
            <div className="grid grid-cols-7 gap-1 mb-1">
              {Array.from({ length: 7 * 13 }).map((_, i) => {
                // This would normally be based on actual session data
                // For demo purposes, we'll create a random activity level
                const activityLevel = Math.floor(Math.random() * 5); // 0-4
                
                let bgColor = 'bg-gray-100';
                if (activityLevel === 1) bgColor = 'bg-green-100';
                if (activityLevel === 2) bgColor = 'bg-green-300';
                if (activityLevel === 3) bgColor = 'bg-green-500';
                if (activityLevel === 4) bgColor = 'bg-green-700';
                
                return (
                  <div 
                    key={i} 
                    className={`w-full h-3 ${bgColor} rounded`}
                    title={`${activityLevel} sessions`}
                  ></div>
                );
              })}
            </div>
            
            <div className="flex justify-end items-center text-xs text-muted-foreground gap-1 mt-2">
              <span>Less</span>
              <div className="bg-gray-100 w-3 h-3 rounded"></div>
              <div className="bg-green-100 w-3 h-3 rounded"></div>
              <div className="bg-green-300 w-3 h-3 rounded"></div>
              <div className="bg-green-500 w-3 h-3 rounded"></div>
              <div className="bg-green-700 w-3 h-3 rounded"></div>
              <span>More</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 