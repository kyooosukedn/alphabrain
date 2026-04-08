import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TopicManager } from '@/components/topics/TopicManager';
import { useQuery } from '@tanstack/react-query';
import { sessionsApi } from '@/services/api';
import SessionList from '@/components/learning-journey/SessionList';
import SessionForm from '@/components/learning-journey/SessionForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function LearningRoadmap() {
  const [activeTab, setActiveTab] = useState('topics');
  const [isSessionFormOpen, setIsSessionFormOpen] = useState(false);
  
  // Fetch sessions
  const { 
    data: sessions = [], 
    isLoading: isLoadingSessions,
    refetch: refetchSessions
  } = useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      try {
        const response = await sessionsApi.getSessions();
        return response.data;
      } catch (error) {
        console.error('Failed to load sessions:', error);
        return [];
      }
    }
  });

  const handleRefreshSessions = async () => {
    await refetchSessions();
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Learning Roadmap</h1>
        {activeTab === 'sessions' && (
          <Button onClick={() => setIsSessionFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Session
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="topics">Topics</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-6">
        {activeTab === 'topics' && (
          <TopicManager />
        )}
        
        {activeTab === 'sessions' && (
          <SessionList 
            sessions={sessions} 
            isLoading={isLoadingSessions}
            onRefresh={handleRefreshSessions}
          />
        )}
      </div>

      {/* Session Form Modal */}
      <SessionForm
        isOpen={isSessionFormOpen}
        onClose={() => setIsSessionFormOpen(false)}
        onSuccess={() => {
          setIsSessionFormOpen(false);
          handleRefreshSessions();
        }}
        session={null}
      />
    </div>
  );
}
