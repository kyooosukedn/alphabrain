import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Clock, Edit, Trash } from "lucide-react";
import { Session, SessionStatus } from "@/types/session";
import { sessionsApi } from "@/services/api";
import SessionForm from "./SessionForm";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SessionListProps {
  topicId?: string;
  sessions?: Session[];
  isLoading?: boolean;
  onRefresh?: () => Promise<void>;
}

export default function SessionList({ topicId, sessions: externalSessions, isLoading: externalLoading, onRefresh }: SessionListProps) {
  const [internalSessions, setInternalSessions] = useState<Session[]>([]);
  const [isInternalLoading, setIsInternalLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const { toast } = useToast();
  
  // Use either external or internal state
  const sessions = externalSessions || internalSessions;
  const isLoading = externalLoading !== undefined ? externalLoading : isInternalLoading;

  const fetchSessions = async () => {
    if (externalSessions) return; // Don't fetch if sessions are provided externally
    
    setIsInternalLoading(true);
    setError(null);
    try {
      const response = topicId
        ? await sessionsApi.getSessionsByTopic(topicId)
        : await sessionsApi.getSessions();
      
      console.log("Fetched sessions:", response.data);
      setInternalSessions(response.data);
    } catch (err) {
      console.error("Error fetching sessions:", err);
      setError("Failed to load sessions. Please try again later.");
      toast({
        title: "Error",
        description: "Failed to load sessions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsInternalLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [topicId, externalSessions]);

  const handleStatusChange = async (id: string, status: SessionStatus) => {
    try {
      await sessionsApi.updateSessionStatus(id, status);
      toast({
        title: "Status Updated",
        description: "Session status has been updated successfully",
      });
      if (onRefresh) {
        await onRefresh();
      } else {
        await fetchSessions();
      }
    } catch (err) {
      console.error("Error updating session status:", err);
      toast({
        title: "Error",
        description: "Failed to update session status",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this session?")) return;
    
    try {
      await sessionsApi.deleteSession(id);
      toast({
        title: "Session Deleted",
        description: "Session has been deleted successfully",
      });
      if (onRefresh) {
        await onRefresh();
      } else {
        await fetchSessions();
      }
    } catch (err) {
      console.error("Error deleting session:", err);
      toast({
        title: "Error",
        description: "Failed to delete session",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (session: Session) => {
    setSelectedSession(session);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedSession(null);
  };

  const handleFormSuccess = async () => {
    setIsFormOpen(false);
    setSelectedSession(null);
    if (onRefresh) {
      await onRefresh();
    } else {
      await fetchSessions();
    }
  };

  const getStatusBadgeVariant = (status: SessionStatus): "default" | "destructive" | "outline" | "secondary" => {
    switch (status) {
      case "COMPLETED":
        return "default";
      case "IN_PROGRESS":
        return "secondary";
      case "PLANNED":
        return "outline";
      case "CANCELLED":
        return "destructive";
      default:
        return "outline";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      // Check if dateString is valid
      if (!dateString || dateString === 'undefined' || dateString === 'null') {
        console.warn('Invalid date string:', dateString);
        return 'No date specified';
      }
      
      // Try to create Date object and validate it
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.warn('Invalid date format:', dateString);
        return 'Invalid date';
      }
      
      // Format the date if it's valid
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error, dateString);
      return 'Date error';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 w-3/4 bg-gray-200 animate-pulse rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-4 w-1/3 bg-gray-200 animate-pulse rounded"></div>
                <div className="flex gap-2 mt-4">
                  <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh || fetchSessions} 
          className="mt-2"
        >
          Try Again
        </Button>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {sessions.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-6">
              <p className="text-muted-foreground">No sessions found.</p>
              <Button 
                onClick={() => setIsFormOpen(true)} 
                className="mt-4"
              >
                Create Your First Session
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        sessions.map((session) => (
          <Card key={session.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{session.title}</CardTitle>
                <Badge variant={getStatusBadgeVariant(session.status as SessionStatus)}>
                  {session.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {session.description && (
                <p className="text-sm text-muted-foreground mb-2">
                  {session.description}
                </p>
              )}
              <div className="flex items-center text-sm text-muted-foreground mb-4">
                <Clock className="h-3 w-3 mr-1" />
                <span>
                  {formatDate(session.startTime)} - {formatDate(session.endTime)}
                </span>
              </div>
              <div className="flex gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(session)}
                >
                  <Edit className="h-3 w-3 mr-1" /> Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(session.id)}
                >
                  <Trash className="h-3 w-3 mr-1" /> Delete
                </Button>
                {session.status !== "COMPLETED" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusChange(session.id, "COMPLETED")}
                  >
                    Mark Complete
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}

      <SessionForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        session={selectedSession}
      />
    </div>
  );
}