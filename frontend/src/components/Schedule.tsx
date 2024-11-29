import { useState, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { Plus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import React from 'react';
import { CreateEventModal } from './schedule/CreateEventModal';

// Event types and their colors
const eventTypes = {
  'Deep Work': '#8b5cf6',
  'Customer Interview': '#3b82f6',
  'Book Review': '#10b981',
  'TD Monthly Newsletter': '#f59e0b',
  'Record Video': '#ec4899'
} as const;

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  backgroundColor?: string;
  borderColor?: string;
  type?: keyof typeof eventTypes;
  description?: string;
}

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: CalendarEvent) => void;
  selectedDate: Date | null;
}

export default function Schedule() {
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Deep work',
      start: new Date('2024-11-29T09:00:00'),
      end: new Date('2024-11-29T10:30:00'),
      backgroundColor: eventTypes['Deep Work'],
      borderColor: eventTypes['Deep Work'],
      type: 'Deep Work'
    },
    {
      id: '2',
      title: 'Customer interviews',
      start: new Date('2024-11-29T11:00:00'),
      end: new Date('2024-11-29T15:00:00'),
      backgroundColor: eventTypes['Customer Interview'],
      borderColor: eventTypes['Customer Interview'],
      type: 'Customer Interview'
    },
    {
      id: '3',
      title: 'TD Monthly Newsletter',
      start: new Date('2024-11-29T13:00:00'),
      end: new Date('2024-11-29T14:00:00'),
      backgroundColor: eventTypes['TD Monthly Newsletter'],
      borderColor: eventTypes['TD Monthly Newsletter'],
      type: 'TD Monthly Newsletter'
    }
  ]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateSelect = useCallback((selectInfo: any) => {
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect(); // clear date selection

    const startDate = new Date(selectInfo.start);
    setSelectedDate(startDate);
    setIsCreateModalOpen(true);
  }, []);

  const handleEventAdd = useCallback((event: CalendarEvent) => {
    setEvents(prev => [...prev, event]);
  }, []);

  const handleEventClick = useCallback((clickInfo: any) => {
    // You can implement event viewing/editing here
    console.log('Event clicked:', clickInfo.event);
  }, []);

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

      {/* Calendar */}
      <div className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        "fc fc-media-screen fc-direction-ltr fc-theme-standard"
      )}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
          }}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          events={events}
          select={handleDateSelect}
          eventClick={handleEventClick}
          height="auto"
          aspectRatio={2}
          slotMinTime="06:00:00"
          slotMaxTime="22:00:00"
          nowIndicator={true}
          businessHours={{
            daysOfWeek: [1, 2, 3, 4, 5],
            startTime: '09:00',
            endTime: '17:00',
          }}
          slotDuration="00:30:00"
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false,
            hour12: false
          }}
          allDaySlot={false}
          slotLabelFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }}
        />
      </div>

      {/* Create event modal */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleEventAdd}
        selectedDate={selectedDate}
      />
    </div>
  );
}