import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { Session } from '@/types/session';
import { sessionsApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { eventTypeColors } from '@/types/schedule';
import './CalendarView.css';

interface CalendarViewProps {
  isModalOpen?: boolean;
  setIsModalOpen?: (open: boolean) => void;
}

export function CalendarView({ isModalOpen: externalModalOpen, setIsModalOpen: setExternalModalOpen }: CalendarViewProps = {}) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch sessions
  const fetchSessions = async () => {
    setLoading(true);
    try {
      const response = await sessionsApi.getSessions();
      setSessions(response.data);
    } catch (err) {
      console.error('Error fetching sessions:', err);
      toast({
        title: 'Error',
        description: 'Failed to load sessions for calendar.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // Convert sessions to FullCalendar events
  const events = sessions.map((session) => ({
    id: session.id,
    title: session.title,
    start: session.startTime,
    end: session.endTime,
    backgroundColor: eventTypeColors[session.category as keyof typeof eventTypeColors] || '#F97316',
    borderColor: eventTypeColors[session.category as keyof typeof eventTypeColors] || '#F97316',
    extendedProps: {
      description: session.description,
      status: session.status,
      category: session.category,
      priority: session.priority,
    },
  }));

  // Handle event click
  const handleEventClick = (clickInfo: any) => {
    const event = clickInfo.event;
    const props = event.extendedProps;
    const description = props.description || 'No description';
    const status = props.status || 'UNKNOWN';

    toast({
      title: event.title,
      description: `${description}\nStatus: ${status.replace('_', ' ')}\n${new Date(event.start).toLocaleString()}`,
    });
  };

  // Handle date click - quick add session
  const handleDateClick = (clickInfo: any) => {
    const dateStr = clickInfo.dateStr;
    toast({
      title: 'Create Session',
      description: `Selected ${dateStr}. Use New Session button to create.`,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500 mr-3" />
        <span className="text-muted-foreground">Loading calendar...</span>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="inline-flex h-20 w-20 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-950/40 dark:to-orange-950/20 items-center justify-center mb-6 border-2 border-orange-200 dark:border-orange-900/30">
          <CalendarIcon className="h-10 w-10 text-orange-500" />
        </div>
        <h3 className="text-xl font-semibold mb-3">No sessions to display</h3>
        <p className="text-muted-foreground max-w-md mx-auto mb-6">
          Create your first study session to see it on the calendar.
        </p>
      </div>
    );
  }

  return (
    <div className="calendar-view">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,listWeek'
        }}
        buttonText={{
          today: 'Today',
          month: 'Month',
          week: 'Week',
          list: 'List'
        }}
        events={events}
        eventClick={handleEventClick}
        dateClick={handleDateClick}
        editable={true}
        selectable={true}
        height="auto"
        eventDisplay="block"
        eventColor="#F97316"
        dayMaxEvents={3}
        moreLinkClick="popover"
        moreLinkText={(num) => `+${num} more`}
        allDaySlot={false}
        slotMinTime="06:00:00"
        slotMaxTime="24:00:00"
        weekends={true}
      />
    </div>
  );
}

// Import icon for empty state
import { Calendar as CalendarIcon } from 'lucide-react';
