import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, BookOpen, Edit, Trash2, Play, CheckCircle, X, AlertTriangle } from 'lucide-react';
import { Session, SessionStatus } from '@/types/session';
import { sessionsApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { SessionFormModal, SessionFormData } from './SessionFormModal';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EventType, eventTypeColors } from '@/types/schedule';
import { StudyEvent } from '@/types/schedule';

interface SessionListProps {
  isModalOpen?: boolean;
  setIsModalOpen?: Dispatch<SetStateAction<boolean>>;
}

export function SessionList({ isModalOpen: externalModalOpen, setIsModalOpen: setExternalModalOpen }: SessionListProps = {}) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [internalModalOpen, setInternalModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [editingSession, setEditingSession] = useState<Session | undefined>(undefined);
  const [sessionToDelete, setSessionToDelete] = useState<Session | null>(null);
  const { toast } = useToast();

  // Use external modal state if provided, otherwise use internal state
  const isModalOpen = externalModalOpen !== undefined ? externalModalOpen : internalModalOpen;
  const setShowModal = setExternalModalOpen || setInternalModalOpen;

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
  const handleSessionSubmit = async (formData: SessionFormData | StudyEvent) => {
    try {
      // Common fields for both types
      let title = '';
      let description = '';
      let startTime: Date;
      let endTime: Date;
      let type: EventType = 'Deep Work';
      let priority: 'LOW' | 'MEDIUM' | 'HIGH' = 'MEDIUM';
      let topicId: string = '';

      // Extract data based on type
      if ('start' in formData && formData.start instanceof Date) {
        // It's SessionFormData or StudyEvent
        title = formData.title;
        description = formData.description || '';
        startTime = formData.start;
        endTime = formData.end;
        type = formData.type || 'Deep Work';
        priority = formData.priority || 'MEDIUM';
        topicId = formData.topicId || '';
      } else {
        // Should never reach here with our current types, but handle it safely
        console.error('Invalid form data format');
        toast({
          title: 'Error',
          description: 'Invalid form data format. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      // If editing existing session
      if (editingSession) {
        await sessionsApi.updateSession(editingSession.id, {
          title,
          description,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          status: editingSession.status,
          priority,
          category: type,
          topicId,
        });
        toast({
          title: 'Success',
          description: 'Session updated successfully',
        });
      } else {
        // Creating new session
        await sessionsApi.createSession({
          title,
          description,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          status: 'PLANNED',
          priority,
          category: type,
          topicId,
        });
        toast({
          title: 'Success',
          description: 'New session created successfully',
        });
      }
      
      // Refresh sessions after update
      fetchSessions();
      
      // Close the modal if we're using external state
      if (setExternalModalOpen) {
        setExternalModalOpen(false);
      } else {
        setInternalModalOpen(false);
      }
      
      // Reset editing session
      setEditingSession(undefined);
    } catch (err) {
      console.error('Error saving session:', err);
      toast({
        title: 'Error',
        description: 'Failed to save session. Please try again.',
        variant: 'destructive',
      });
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
  const deleteSession = async () => {
    if (!sessionToDelete) return;
    
    try {
      await sessionsApi.deleteSession(sessionToDelete.id);
      toast({
        title: 'Session Deleted',
        description: 'The session has been deleted successfully',
      });
      setSessionToDelete(null);
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
    setShowModal(true);
  };

  // Get status badge color
  const getStatusBadgeColor = (status: SessionStatus) => {
    switch (status) {
      case 'PLANNED':
        return 'bg-blue-500';
      case 'IN_PROGRESS':
        return 'bg-yellow-500';
      case 'COMPLETED':
        return 'bg-green-500';
      case 'CANCELLED':
        return 'bg-red-500';
      case 'MISSED':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Get status icon
  const getStatusIcon = (status: SessionStatus) => {
    switch (status) {
      case 'PLANNED':
        return <Calendar className="h-4 w-4" />;
      case 'IN_PROGRESS':
        return <Play className="h-4 w-4" />;
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Study Sessions</h2>
        <Button onClick={() => { 
          setEditingSession(undefined);
          setSelectedDate(new Date());
          setShowModal(true);
        }}>
          Create New Session
        </Button>
      </div>

      {loading && <p className="text-center py-4">Loading sessions...</p>}
      
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {!loading && !error && sessions.length === 0 && (
        <div className="text-center py-8">
          <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No Study Sessions Yet</h3>
          <p className="text-gray-500 mb-4">Create your first study session to start tracking your learning progress.</p>
          <Button onClick={() => {
            setEditingSession(undefined);
            setSelectedDate(new Date());
            setShowModal(true);
          }}>
            Create Your First Session
          </Button>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sessions.map((session) => (
          <Card key={session.id} className="overflow-hidden border border-gray-200 hover:border-primary transition-colors">
            <div 
              className="h-2" 
              style={{ 
                backgroundColor: eventTypeColors[session.category as EventType] || '#6d28d9' 
              }}
            />
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="mr-2">{session.title}</CardTitle>
                <Badge 
                  className={`${getStatusBadgeColor(session.status)} text-white flex items-center gap-1`}
                >
                  {getStatusIcon(session.status)}
                  {session.status.replace('_', ' ')}
                </Badge>
              </div>
              <CardDescription>
                {format(new Date(session.startTime), 'MMM d, yyyy')} • {format(new Date(session.startTime), 'h:mm a')} - {format(new Date(session.endTime), 'h:mm a')}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pb-2">
              {session.description && (
                <p className="text-sm text-gray-600 mb-2">{session.description}</p>
              )}
              
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className="flex items-center gap-1 bg-gray-50">
                  <Clock className="h-3 w-3" />
                  {Math.round((new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / (1000 * 60))} min
                </Badge>
                
                <Badge variant="outline" className="flex items-center gap-1 bg-gray-50">
                  {session.priority}
                </Badge>
                
                {session.completionPercentage !== undefined && session.completionPercentage > 0 && (
                  <Badge variant="outline" className="flex items-center gap-1 bg-gray-50">
                    {session.completionPercentage}% complete
                  </Badge>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="pt-2 flex justify-between">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleEditClick(session)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">Actions</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                  
                  {session.status !== 'IN_PROGRESS' && (
                    <DropdownMenuItem onClick={() => updateSessionStatus(session, 'IN_PROGRESS')}>
                      <Play className="h-4 w-4 mr-2" />
                      Start Session
                    </DropdownMenuItem>
                  )}
                  
                  {session.status !== 'COMPLETED' && (
                    <DropdownMenuItem onClick={() => updateSessionStatus(session, 'COMPLETED')}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Completed
                    </DropdownMenuItem>
                  )}
                  
                  {session.status !== 'CANCELLED' && (
                    <DropdownMenuItem onClick={() => updateSessionStatus(session, 'CANCELLED')}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel Session
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem 
                    className="text-red-600" 
                    onClick={() => setSessionToDelete(session)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Session
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {/* Session Form Modal */}
      <SessionFormModal 
        isOpen={isModalOpen}
        onClose={() => {
          setShowModal(false);
          setEditingSession(undefined);
        }}
        onSubmit={handleSessionSubmit}
        selectedDate={selectedDate}
        editingSession={editingSession}
      />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!sessionToDelete} onOpenChange={() => setSessionToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the session "{sessionToDelete?.title}". 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteSession} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 