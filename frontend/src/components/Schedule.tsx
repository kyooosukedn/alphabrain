import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, LayoutGrid, Calendar as CalendarIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SessionList } from './schedule/SessionList';
import { ScheduleStats } from './schedule/ScheduleStats';

export default function Schedule() {
  const [activeView, setActiveView] = useState<'calendar' | 'list'>('list');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Schedule</h1>
          <p className="text-muted-foreground">Plan and organize your study sessions</p>
        </div>
        
        <div className="flex gap-2">
          <Link to="/dashboard">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <Button 
            variant="default" 
            onClick={() => setIsModalOpen(true)}
          >
            New Session
          </Button>
        </div>
      </div>
      
      <ScheduleStats />
      
      <Tabs defaultValue="list" className="w-full" onValueChange={(value) => setActiveView(value as 'calendar' | 'list')}>
        <TabsList className="mb-4">
          <TabsTrigger value="list" className="flex items-center gap-1">
            <LayoutGrid className="h-4 w-4" />
            List View
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-1">
            <CalendarIcon className="h-4 w-4" />
            Calendar View
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="mt-4">
          <SessionList isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        </TabsContent>
        
        <TabsContent value="calendar" className="mt-4">
          <div className="text-center py-10 border rounded-md border-dashed">
            <CalendarIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium">Calendar View Coming Soon</h3>
            <p className="text-muted-foreground">We're working on a beautiful calendar view for your sessions.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}