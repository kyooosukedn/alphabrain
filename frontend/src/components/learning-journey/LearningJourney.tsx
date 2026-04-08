import { useState, useEffect } from "react";
import { Session } from "@/types/session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, RefreshCw, ServerOff, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { sessionsApi } from "@/services/api";
import SessionList from "./SessionList";
import SessionForm from "./SessionForm";
import axios, { AxiosError } from "axios";
import { checkBackendHealth } from "@/config/axiosConfig";

export default function LearningJourney() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [backendStatus, setBackendStatus] = useState<{ isHealthy: boolean, message: string } | null>(null);
  const [checkingBackend, setCheckingBackend] = useState(false);
  const { toast } = useToast();

  // Calculate session statistics
  const getSessionStats = () => {
    const completed = sessions.filter(s => s.status === "COMPLETED").length;
    const inProgress = sessions.filter(s => s.status === "IN_PROGRESS").length;
    const planned = sessions.filter(s => s.status === "PLANNED").length;
    const totalDuration = sessions.reduce((total, session) => {
      if (session.status === "COMPLETED" && session.actualDurationMinutes) {
        return total + session.actualDurationMinutes;
      }
      return total;
    }, 0);
    
    return { completed, inProgress, planned, totalDuration };
  };

  // Check backend health
  const checkBackendConnection = async () => {
    setCheckingBackend(true);
    try {
      const status = await checkBackendHealth();
      setBackendStatus(status);
      return status.isHealthy;
    } catch (err) {
      console.error("Error checking backend health:", err);
      setBackendStatus({
        isHealthy: false,
        message: "Could not verify backend status"
      });
      return false;
    } finally {
      setCheckingBackend(false);
    }
  };

  // Fetch sessions from API
  const fetchSessions = async () => {
    setIsLoading(true);
    setError(null);
    
    // First check if backend is healthy
    const isBackendHealthy = await checkBackendConnection();
    
    try {
      // Ensure we're using the correct API endpoint with detailed error handling
      console.log("Fetching sessions from API");
      const response = await sessionsApi.getSessions();
      console.log("API response:", response);
      setSessions(response.data);
      
      // If we get here, the API is working even if health checks failed
      if (!isBackendHealthy && backendStatus) {
        setBackendStatus({
          isHealthy: true,
          message: "Backend is functioning despite health checks failing"
        });
      }
      
    } catch (err) {
      console.error("Error fetching sessions:", err);
      // Provide detailed error information
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError;
        if (axiosError.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error("Response data:", axiosError.response.data);
          console.error("Response status:", axiosError.response.status);
          
          if (axiosError.response.status === 500) {
            setError(`Server error (500): The backend encountered an internal error. This could be due to a database issue or configuration problem. Please check the backend logs for more details.`);
          } else {
            setError(`Server error: ${axiosError.response.status}. ${
              axiosError.response.data && typeof axiosError.response.data === 'object' && 'message' in axiosError.response.data
                ? (axiosError.response.data as { message: string }).message
                : 'Please try again later.'
            }`);
          }
        } else if (axiosError.request) {
          // The request was made but no response was received
          console.error("No response received:", axiosError.request);
          setError("Network error: Could not connect to the server. Please check your connection and ensure the backend server is running.");
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error message:", axiosError.message);
          setError(`Error: ${axiosError.message}`);
        }
      } else {
        setError(`Unexpected error: ${err instanceof Error ? err.message : String(err)}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh sessions data
  const refreshSessions = async () => {
    setIsRefreshing(true);
    try {
      await fetchSessions();
      toast({
        title: "Refreshed",
        description: "Session data has been updated",
      });
    } catch {
      // Error is already handled in fetchSessions
    } finally {
      setIsRefreshing(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchSessions();
  }, []);

  // Session stats
  const stats = getSessionStats();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Learning Sessions</h1>
          <p className="text-muted-foreground">Track and manage your learning sessions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshSessions}
            disabled={isRefreshing || checkingBackend}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            disabled={!backendStatus?.isHealthy}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            New Session
          </Button>
        </div>
      </div>

      {/* Backend Status Message */}
      {backendStatus && !backendStatus.isHealthy && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-2">
              <div className="text-amber-600">
                <ServerOff className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-amber-600">Backend Connection Issue</p>
                <p className="text-sm text-amber-600">{backendStatus.message}</p>
                <div className="mt-2">
                  <p className="text-xs text-amber-600 mb-1">Troubleshooting steps:</p>
                  <ul className="list-disc list-inside text-xs text-amber-600">
                    <li>Ensure the backend server is running</li>
                    <li>Check if the correct API URL is configured</li>
                    <li>Verify your network connection</li>
                  </ul>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2 border-amber-300 text-amber-600 hover:bg-amber-100"
                  onClick={checkBackendConnection}
                  disabled={checkingBackend}
                >
                  {checkingBackend ? 'Checking...' : 'Check Connection'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error message display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-2">
              <div className="text-red-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-red-600">Error loading sessions</p>
                <p className="text-sm text-red-600">{error}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2 border-red-300 text-red-600 hover:bg-red-100"
                  onClick={refreshSessions}
                  disabled={isRefreshing}
                >
                  {isRefreshing ? 'Trying...' : 'Try Again'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overview Dashboard */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Learning Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(stats.totalDuration / 60 * 10) / 10}</div>
          </CardContent>
        </Card>
      </div>

      {/* Sessions List */}
      <div className="mt-6">
        <SessionList 
          sessions={sessions} 
          isLoading={isLoading} 
          onRefresh={refreshSessions} 
        />
      </div>

      {/* Create Session Modal */}
      {isCreateModalOpen && (
        <SessionForm
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {
            setIsCreateModalOpen(false);
            refreshSessions();
          }}
        />
      )}
    </div>
  );
} 