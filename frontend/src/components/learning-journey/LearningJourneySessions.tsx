import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, BookOpen, CheckCircle, X, AlertTriangle, MoreHorizontal } from 'lucide-react';
import { Session, SessionStatus, CreateSessionRequest } from '@/types/session';
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
      
      // Create a properly formatted session request object that matches backend expectations
      const sessionRequest: CreateSessionRequest = {
        title: formData.title,
        description: formData.description || '',
        status: 'PLANNED' as SessionStatus,
        priority: ('priority' in formData) ? formData.priority || 'MEDIUM' : 'MEDIUM',
        startTime: '',
        endTime: '',
        category: 'STUDY'
      };
      
      // Check if start property exists and is not null/undefined
      if ('start' in formData && formData.start) {
        sessionRequest.startTime = formData.start instanceof Date 
          ? formData.start.toISOString() 
          : new Date(formData.start).toISOString();
      } else if ('startTime' in formData && formData.startTime && typeof formData.startTime !== 'object') {
        sessionRequest.startTime = new Date(formData.startTime as string).toISOString();
      } else {
        toast({
          title: 'Error',
          description: 'Start time is required for a session',
          variant: 'destructive',
        });
        return;
      }
      
      // Check if end property exists and is not null/undefined
      if ('end' in formData && formData.end) {
        sessionRequest.endTime = formData.end instanceof Date 
          ? formData.end.toISOString() 
          : new Date(formData.end).toISOString();
      } else if ('endTime' in formData && formData.endTime && typeof formData.endTime !== 'object') {
        sessionRequest.endTime = new Date(formData.endTime as string).toISOString();
      } else {
        toast({
          title: 'Error',
          description: 'End time is required for a session',
          variant: 'destructive',
        });
        return;
      }
      
      // Set category/type based on the available property
      if ('category' in formData && formData.category) {
        sessionRequest.category = formData.category;
      } else if ('type' in formData && formData.type) {
        sessionRequest.category = formData.type;
      }
      
      // Set topicId if available
      if ('topicId' in formData && formData.topicId) {
        sessionRequest.topicId = formData.topicId;
      }
      
      // Create or update the session with the API
      if ('id' in formData && formData.id && !formData.id.startsWith('temp-')) {
        try {
          const response = await sessionsApi.updateSession(formData.id, sessionRequest);
          console.log('Session updated successfully:', response.data);
          
          toast({
            title: 'Success',
            description: 'Session updated successfully',
          });
        } catch (error) {
          console.error('Error updating session:', error);
          toast({
            title: 'Error',
            description: 'Failed to update session. Please try again.',
            variant: 'destructive',
          });
          throw error; // Re-throw to be caught by the outer catch block
        }
      } else {
        try {
          const response = await sessionsApi.createSession(sessionRequest);
          console.log('Session created successfully:', response.data);
          
          toast({
            title: 'Success',
            description: 'New session created successfully',
          });
        } catch (error) {
          console.error('Error creating session:', error);
          toast({
            title: 'Error',
            description: 'Failed to create session. Please try again.',
            variant: 'destructive',
          });
          throw error; // Re-throw to be caught by the outer catch block
        }
      }
      
      // Refresh sessions after successful update
      await fetchSessions();
      setEditingSession(undefined);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error in session submission:', err);
      // Main error toast is already shown in the inner catch blocks
    }
  };

  // Update session status
  const updateSessionStatus = async (session: Session, newStatus: SessionStatus) => {
    try {
      await sessionsApi.updateSessionStatus(session.id, newStatus);
      toast({
        title: 'Status Updated',
        description: `Session is now ${newStatus.toLowerCase().replace('_', ' ')}`,
      });
      fetchSessions(); // Refresh sessions after status update
    } catch (error) {
      console.error('Error updating session status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update session status',
        variant: 'destructive',
      });
    }
  };

  // Delete session
  const deleteSession = async (sessionId: string) => {
    try {
      await sessionsApi.deleteSession(sessionId);
      toast({
        title: 'Session Deleted',
        description: 'The session has been deleted successfully',
      });
      fetchSessions(); // Refresh the sessions list
    } catch (error) {
      console.error('Error deleting session:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete session',
        variant: 'destructive',
      });
    }
  };

  // Handle edit button click
  const handleEditClick = (session: Session) => {
    setEditingSession(session);
    setSelectedDate(new Date(session.startTime));
    setIsModalOpen(true);
  };

  // Get status badge color
  const getStatusBadgeClass = (status: SessionStatus) => {
    switch (status) {
      case 'PLANNED':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'MISSED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status icon
  const getStatusIcon = (status: SessionStatus) => {
    switch (status) {
      case 'PLANNED':
        return <Calendar className="h-4 w-4" />;
      case 'IN_PROGRESS':
        return <Clock className="h-4 w-4" />;
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4" />;
      case 'CANCELLED':
        return <X className="h-4 w-4" />;
      case 'MISSED':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading sessions...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Learning Sessions</h2>
        <Button 
          onClick={() => {
            setEditingSession(undefined);
            setSelectedDate(new Date());
            setIsModalOpen(true);
          }}
        >
          Add Learning Session
        </Button>
      </div>

      <div className="text-sm text-muted-foreground">All your recorded learning activities</div>

      {sessions.length === 0 ? (
        <Card className="text-center p-8">
          <div className="pt-6">
            <div className="flex flex-col items-center">
              <Calendar className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No Learning Sessions Yet</h3>
              <p className="text-muted-foreground mb-4">Start tracking your learning journey by adding your first session.</p>
              <Button 
                onClick={() => {
                  setEditingSession(undefined);
                  setSelectedDate(new Date());
                  setIsModalOpen(true);
                }}
              >
                Create Your First Session
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {sessions.map(session => (
            <Card key={session.id} className="overflow-hidden">
              <div className="p-0">
                <div className="flex flex-col sm:flex-row">
                  <div className={`w-full sm:w-2 ${
                    session.category === 'frontend' ? 'bg-blue-500' : 
                    session.category === 'backend' ? 'bg-green-500' : 
                    'bg-purple-500'
                  }`}></div>
                  <div className="flex-1 p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-lg">{session.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Clock className="h-4 w-4" />
                          <span>
                            {session.actualDurationMinutes 
                              ? `${session.actualDurationMinutes} minutes` 
                              : `${format(new Date(session.startTime), 'h:mm a')} - ${format(new Date(session.endTime), 'h:mm a')}`}
                          </span>
                          <span className="mx-1">•</span>
                          <Calendar className="h-4 w-4" />
                          <span>{format(new Date(session.startTime), 'MMM d, yyyy')}</span>
                          
                          {session.topicId && (
                            <>
                              <span className="mx-1">•</span>
                              <BookOpen className="h-4 w-4" />
                              <span>Topic: {session.topicId}</span>
                            </>
                          )}
                        </div>
                        {session.description && (
                          <p className="text-sm mt-2">{session.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-2 sm:mt-0">
                        <Badge className={getStatusBadgeClass(session.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(session.status)}
                            {session.status.toLowerCase().replace('_', ' ')}
                          </span>
                        </Badge>
                        <Badge variant="outline">{session.priority}</Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditClick(session)}>
                              Edit
                            </DropdownMenuItem>
                            {session.status === 'PLANNED' && (
                              <DropdownMenuItem onClick={() => updateSessionStatus(session, 'IN_PROGRESS')}>
                                Start Session
                              </DropdownMenuItem>
                            )}
                            {session.status === 'IN_PROGRESS' && (
                              <DropdownMenuItem onClick={() => updateSessionStatus(session, 'COMPLETED')}>
                                Mark as Completed
                              </DropdownMenuItem>
                            )}
                            {session.status !== 'CANCELLED' && session.status !== 'COMPLETED' && (
                              <DropdownMenuItem onClick={() => updateSessionStatus(session, 'CANCELLED')}>
                                Cancel Session
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => deleteSession(session.id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <SessionFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSession(undefined);
        }}
        onSubmit={handleSessionSubmit}
        selectedDate={selectedDate}
        editingSession={editingSession}
      />
    </div>
  );
} 