import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { sessionsApi } from '../../services/api';
import { topicsApi } from '../../services/api';
import { useQuery } from '@tanstack/react-query';

// UI components
import { Card } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Progress } from '../../components/ui/progress';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const StudyAnalyticsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Fetch session analytics data
  const { data: analyticsData, isLoading: isLoadingAnalytics, error: analyticsError } = useQuery({
    queryKey: ['sessionAnalytics'],
    queryFn: async () => {
      const response = await sessionsApi.getSessionAnalytics();
      return response.data;
    }
  });
  
  // Fetch topic-specific analytics data
  const { data: topicAnalyticsData, isLoading: isLoadingTopicAnalytics, error: topicAnalyticsError } = useQuery({
    queryKey: ['topicSessionAnalytics'],
    queryFn: async () => {
      try {
        // The API now returns analytics for all topics
        const response = await sessionsApi.getSessionAnalyticsByTopic();
        return response.data;
      } catch (error) {
        console.error('Error fetching topic analytics:', error);
        return {};
      }
    },
    retry: false
  });
  
  if (isLoadingAnalytics || isLoadingTopicAnalytics) {
    return <div className="flex items-center justify-center h-64">Loading analytics data...</div>;
  }
  
  if (analyticsError || topicAnalyticsError) {
    return (
      <div className="text-center p-4 text-red-500">
        Error loading analytics data. Please try again later.
        {analyticsError && <p>{String(analyticsError)}</p>}
        {topicAnalyticsError && <p>{String(topicAnalyticsError)}</p>}
      </div>
    );
  }
  
  if (!analyticsData) {
    return <div className="text-center p-4">No analytics data available</div>;
  }
  
  // Format data for charts
  const statusData = Object.entries(analyticsData.sessionsByStatus || {}).map(([name, value]) => ({
    name,
    value: Number(value)
  }));
  
  const dayOfWeekData = Object.entries(analyticsData.sessionsByDayOfWeek || {}).map(([name, value]) => ({
    name,
    sessions: Number(value)
  }));
  
  const topicData = topicAnalyticsData ? Object.entries(topicAnalyticsData).map(([topicId, data]) => ({
    topicId,
    completionRate: data.completionRate,
    totalSessions: data.totalSessions,
    completedSessions: data.completedSessions,
    totalPlannedMinutes: data.totalPlannedMinutes / 60, // Convert to hours
    totalActualMinutes: data.totalActualMinutes / 60 // Convert to hours
  })) : [];
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Study Analytics Dashboard</h1>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="text-sm font-medium text-gray-500">Total Sessions</div>
          <div className="text-2xl font-bold">{analyticsData.totalSessions}</div>
          <p className="text-xs text-gray-500">
            {analyticsData.completedSessions} completed
          </p>
        </Card>
        
        <Card className="p-4">
          <div className="text-sm font-medium text-gray-500">Study Time</div>
          <div className="text-2xl font-bold">
            {Math.round(analyticsData.totalActualMinutes / 60)} hrs
          </div>
          <p className="text-xs text-gray-500">
            Planned: {Math.round(analyticsData.totalPlannedMinutes / 60)} hrs
          </p>
        </Card>
        
        <Card className="p-4">
          <div className="text-sm font-medium text-gray-500">Current Streak</div>
          <div className="text-2xl font-bold">{analyticsData.currentStreak} days</div>
          <p className="text-xs text-gray-500">
            Keep it going!
          </p>
        </Card>
        
        <Card className="p-4">
          <div className="text-sm font-medium text-gray-500">Productivity Score</div>
          <div className="text-2xl font-bold">{Math.round(analyticsData.productivityScore)}%</div>
          <Progress value={analyticsData.productivityScore} className="h-2 mt-2" />
        </Card>
      </div>
      
      {/* Tabs for different analytics views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="topics">Topics</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Session Status Distribution */}
            <Card className="p-4">
              <div className="text-lg font-medium mb-2">Session Status Distribution</div>
              <div className="text-sm text-gray-500 mb-4">Breakdown of sessions by status</div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
            
            {/* Sessions by Day of Week */}
            <Card className="p-4">
              <div className="text-lg font-medium mb-2">Sessions by Day of Week</div>
              <div className="text-sm text-gray-500 mb-4">When you study the most</div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dayOfWeekData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sessions" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </TabsContent>
        
        {/* Sessions Tab */}
        <TabsContent value="sessions" className="space-y-4">
          <Card className="p-4">
            <div className="text-lg font-medium mb-2">Planned vs. Actual Study Time</div>
            <div className="text-sm text-gray-500 mb-4">How your actual study time compares to planned time</div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'Study Time', planned: analyticsData.totalPlannedMinutes / 60, actual: analyticsData.totalActualMinutes / 60 }
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="planned" fill="#8884d8" name="Planned Hours" />
                  <Bar dataKey="actual" fill="#82ca9d" name="Actual Hours" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>
        
        {/* Topics Tab */}
        <TabsContent value="topics" className="space-y-4">
          {topicData.length > 0 ? (
            <>
              <Card className="p-4">
                <div className="text-lg font-medium mb-2">Topic Completion Rates</div>
                <div className="text-sm text-gray-500 mb-4">Completion rates by topic</div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topicData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="topicId" />
                      <YAxis label={{ value: 'Completion Rate (%)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="completionRate" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="text-lg font-medium mb-2">Study Time by Topic</div>
                <div className="text-sm text-gray-500 mb-4">Hours spent on each topic</div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topicData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="topicId" />
                      <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="totalPlannedMinutes" fill="#8884d8" name="Planned Hours" />
                      <Bar dataKey="totalActualMinutes" fill="#82ca9d" name="Actual Hours" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </>
          ) : (
            <div className="text-center p-4">No topic-specific data available</div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudyAnalyticsDashboard;