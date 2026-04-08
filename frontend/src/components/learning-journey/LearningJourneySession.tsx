import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, BookOpen, CheckCircle, X, AlertTriangle, MoreHorizontal } from 'lucide-react';
import { Session, SessionStatus } from '@/types/session';
import { sessionsApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { SessionFormModal } from '../schedule/SessionFormModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StudyEvent, SessionFormData } from '@/types/schedule';

interface LearningJourneySessionsProps {
  isModalOpen?: boolean;
  setIsModalOpen?: Dispatch<SetStateAction<boolean>>;
  onSessionSubmit?: (event: StudyEvent | SessionFormData) => void;
}

export function LearningJourneySessions({ 
  isModalOpen: externalModalOpen, 
  setIsModalOpen: setExternalModalOpen,
  onSessionSubmit
}: LearningJourneySessionsProps = {}) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [internalModalOpen, setInternalModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [editingSession, setEditingSession] = useState<Session | undefined>(undefined);
  const { toast } = useToast();

  // Use external modal state if provided, otherwise use internal state
  const isModalOpen = externalModalOpen !== undefined ? externalModalOpen : internalModalOpen;
  const setIsModalOpen = setExternalModalOpen || setInternalModalOpen;

  // Fetch sessions
  const fetchSessions = async () => {
    setLoading(true);
    try {
      const response = await sessionsApi.getSessions();
      setSessions(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setError('Failed to load sessions. Please try again later.');
      toast({
        title: 'Error',
        description: 'Failed to load sessions. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // Handle session submission
  const handleSessionSubmit = async (formData: StudyEvent | SessionFormData) => {
    try {
      // If external submit handler is provided, use it
      if (onSessionSubmit) {
        onSessionSubmit(formData);
        setIsModalOpen(false);
        return;
      }
      
      const eventWithId = 'id' in formData 
        ? formData 
        : { ...formData, id: `temp-${Date.now()}` };
      
      // Convert the event data to match the API's expected format
      const sessionData = {
        title: eventWithId.title,
        description: eventWithId.description || '',
        startTime: (eventWithId.start || eventWithId.startTime).toISOString(),
        endTime: (eventWithId.end || eventWithId.endTime).toISOString(),
        status: 'PLANNED',
        type: eventWithId.type || 'LECTURE',
        priority: eventWithId.priority || 'MEDIUM',
        category: eventWithId.category || 'STUDY',
        topicId: eventWithId.topicId || null
      };
      
      // Create or update the session with the API
      if ('id' in formData && formData.id && !formData.id.startsWith('temp-')) {
        await sessionsApi.updateSession(formData.id, sessionData);
      } else {
        await sessionsApi.createSession(sessionData);
      }
      
      // Handle form submission through the SessionFormModal
      toast({
        title: 'Success',
        description: editingSession ? 'Session updated successfully' : 'New session created successfully',
      });
      
      // Refresh sessions after update
      fetchSessions();
      
      // Reset editing session
      setEditingSession(undefined);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving session:', err);
      toast({
        title: 'Error',
        description: 'Failed to save session. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Rest of the component remains the same...
} 