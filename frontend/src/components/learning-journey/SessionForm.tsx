import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Session, SessionStatus, CreateSessionRequest } from "@/types/session";
import { sessionsApi } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { AxiosError } from "axios";


// Form schema
const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().optional(),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  status: z.string().min(1, "Status is required"),
  priority: z.string().min(1, "Priority is required"),
  category: z.string().min(1, "Category is required"),
  topicId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface SessionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  session?: Session | null;
}

// Add a helper function to create and validate ISO date strings
const createValidDateString = (date: Date) => {
  if (!date || isNaN(date.getTime())) {
    console.error("Invalid date object:", date);
    throw new Error("Invalid date");
  }
  return date.toISOString();
};

export default function SessionForm({ isOpen, onClose, onSuccess, session }: SessionFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      startTime: new Date().toISOString().slice(0, 16),
      endTime: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16),
      status: "PLANNED",
      priority: "MEDIUM",
      category: "STUDY",
      topicId: "",
    },
  });

  // Set form values when editing a session
  useEffect(() => {
    if (session) {
      const startTime = new Date(session.startTime).toISOString().slice(0, 16);
      const endTime = new Date(session.endTime).toISOString().slice(0, 16);
      
      form.reset({
        title: session.title,
        description: session.description || "",
        startTime,
        endTime,
        status: session.status,
        priority: session.priority,
        category: session.category,
        topicId: session.topicId || "",
      });
    }
  }, [session, form]);

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      
      // Parse datetime-local strings ("2025-03-24T14:30") into Date objects
      const startDateTime = new Date(values.startTime);
      const endDateTime = new Date(values.endTime);
      
      // Validate dates
      if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        toast({
          title: "Invalid Date",
          description: "Please check your date and time entries",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // Create request with valid ISO strings
      const sessionRequest: CreateSessionRequest = {
        title: values.title,
        description: values.description,
        startTime: createValidDateString(startDateTime),
        endTime: createValidDateString(endDateTime),
        status: values.status as SessionStatus,
        priority: values.priority,
        category: values.category,
        topicId: values.topicId,
      };
      
      console.log("Submitting session with data:", sessionRequest);
      
      // Send to API
      if (session) {
        await sessionsApi.updateSession(session.id, sessionRequest);
        toast({
          title: "Session Updated",
          description: "Your session has been updated successfully",
        });
      } else {
        await sessionsApi.createSession(sessionRequest);
        toast({
          title: "Session Created",
          description: "Your session has been created successfully",
        });
      }
      
      // Reset form and close
      form.reset();
      onSuccess();
    } catch (error: unknown) {
      console.error("Error submitting session:", error);
      
      let errorMessage = "Failed to submit session. Please try again later.";
      
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          console.error("Response data:", axiosError.response.data);
          console.error("Response status:", axiosError.response.status);
          
          if (axiosError.response.status === 401) {
            errorMessage = "Authentication error. Please log in again.";
          } else if (axiosError.response.status === 403) {
            errorMessage = "You don't have permission to perform this action.";
          } else if (axiosError.response.status === 400 && 
                    axiosError.response.data && 
                    typeof axiosError.response.data === 'object' && 
                    'message' in axiosError.response.data) {
            const data = axiosError.response.data as { message: string };
            errorMessage = `Validation error: ${data.message}`;
          } else if (axiosError.response.status >= 500) {
            errorMessage = "Server error. Please try again later.";
          }
        } else if (axiosError.request) {
          errorMessage = "Network error: Could not connect to the server. Please check your connection.";
        } else if (axiosError.message) {
          errorMessage = `Error: ${axiosError.message}`;
        }
      } else if (error instanceof Error) {
        errorMessage = `Error: ${error.message}`;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{session ? "Edit Session" : "Create New Session"}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Session title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="What will you learn in this session?" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PLANNED">Planned</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        <SelectItem value="MISSED">Missed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="LOW">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="STUDY">Study</SelectItem>
                      <SelectItem value="PRACTICE">Practice</SelectItem>
                      <SelectItem value="PROJECT">Project</SelectItem>
                      <SelectItem value="RESEARCH">Research</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {session ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>{session ? "Update Session" : "Create Session"}</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 