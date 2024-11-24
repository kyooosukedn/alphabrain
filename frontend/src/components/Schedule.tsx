import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScheduleStats } from './schedule/ScheduleStats';
import { CreateSessionForm } from './schedule/CreateSessionForm';
import type { StudyEvent } from '@/types/schedule';

// Import FullCalendar styles
import '../styles/fullcalendar.css';

// Subject colors for different study subjects
const subjectColors = {
  Mathematics: '#8b5cf6',
  Physics: '#3b82f6',
  Chemistry: '#10b981',
  Biology: '#f59e0b',
  Literature: '#ec4899'
};

export default function Schedule() {
  // State for managing study events and modal
  const [events, setEvents] = useState<StudyEvent[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Handle calendar date selection
  const handleDateSelect = (selectInfo: any) => {
    const startDate = new Date(selectInfo.start);
    setSelectedDate(startDate);
    setIsCreateModalOpen(true);
  };

  // Add new study event
  const handleEventAdd = (event: StudyEvent) => {
    if (!event.start || !event.end) {
      return;
    }
    setEvents(prevEvents => [...prevEvents, event]);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header with title and add button */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Schedule</h2>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Session
        </Button>
      </div>

      {/* Statistics display */}
      <ScheduleStats events={events} />

      {/* Calendar */}
      <div className="rounded-lg border bg-card text-foreground">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          events={events}
          select={handleDateSelect}
          height="auto"
          aspectRatio={2}
          slotMinTime="06:00:00"
          slotMaxTime="22:00:00"
        />
      </div>

      {/* Create session modal */}
      <CreateSessionForm
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleEventAdd}
        selectedDate={selectedDate}
      />
    </div>
  );
}