/**
 * SessionFormModal Component
 * 
 * A comprehensive form modal for creating and editing study sessions.
 * This component combines functionality from previous CreateEventModal and CreateSessionForm
 * components, with improved handling of session status and progress tracking.
 */

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { StudyEvent, EventType, eventTypeColors } from "@/types/schedule";
import { Session, SessionStatus } from "@/types/session";
import { TopicSelector } from "../topics/TopicsSelector";
import { sessionsApi } from "@/services/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import {
  AlertCircle,
  Clock,
  BookOpen,
  Calendar,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FormData {
  type: EventType;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  topicId: string;
  completionPercentage: number;
  actualDurationMinutes: number;
  notes: string;
}

interface SessionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: StudyEvent | SessionFormData) => void;
  selectedDate: Date | null;
  editingSession?: Session; // Optional session being edited
}

// Interface that matches what SessionList expects
export interface SessionFormData {
  title: string;
  description: string;
  start: Date;
  end: Date;
  type: EventType;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  topicId?: string;
}

export function SessionFormModal({
  isOpen,
  onClose,
  onSubmit,
  selectedDate,
  editingSession
}: SessionFormModalProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("details");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  const [formData, setFormData] = useState<FormData>({
    type: 'Deep Work',
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    priority: 'MEDIUM',
    topicId: '',
    completionPercentage: 0,
    actualDurationMinutes: 0,
    notes: ''
  });
  
  // Reset form when modal opens/closes or selected date changes
  useEffect(() => {
    if (isOpen && selectedDate && !editingSession) {
      // Creating a new session
      setActiveTab("details");
      setFormData({
        type: 'Deep Work',
        title: '',
        description: '',
        date: format(selectedDate, 'yyyy-MM-dd'),
        startTime: format(selectedDate, 'HH:mm'),
        endTime: format(new Date(selectedDate.getTime() + 60 * 60 * 1000), 'HH:mm'), // Default 1 hour
        priority: 'MEDIUM',
        topicId: '',
        completionPercentage: 0,
        actualDurationMinutes: 0,
        notes: ''
      });
    } else if (isOpen && editingSession) {
      // Editing an existing session
      const startDate = new Date(editingSession.startTime);
      const endDate = new Date(editingSession.endTime);
      
      setFormData({
        type: editingSession.category as EventType,
        title: editingSession.title,
        description: editingSession.description || '',
        date: format(startDate, 'yyyy-MM-dd'),
        startTime: format(startDate, 'HH:mm'),
        endTime: format(endDate, 'HH:mm'),
        priority: editingSession.priority as 'LOW' | 'MEDIUM' | 'HIGH',
        topicId: editingSession.topicId || '',
        completionPercentage: editingSession.completionPercentage || 0,
        actualDurationMinutes: editingSession.actualDurationMinutes || 0,
        notes: editingSession.notes || ''
      });
      
      // If session is in progress or completed, switch to the progress tab
      if (editingSession.status === 'IN_PROGRESS' || editingSession.status === 'COMPLETED') {
        setActiveTab("progress");
      } else {
        setActiveTab("details");
      }
    }
    
    // Clear validation errors when opening/closing
    setValidationErrors([]);
  }, [isOpen, selectedDate, editingSession]);
  
  const validateForm = (): boolean => {
    const errors: string[] = [];
    
    if (!formData.title.trim()) errors.push("Title is required");
    if (!formData.type) errors.push("Session type is required");
    if (!formData.date) errors.push("Date is required");
    if (!formData.startTime) errors.push("Start time is required");
    if (!formData.endTime) errors.push("End time is required");
    
    // Check if end time is after start time
    const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
    const endDateTime = new Date(`${formData.date}T${formData.endTime}`);
    
    if (endDateTime <= startDateTime) {
      errors.push("End time must be after start time");
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: Number(value) }));
  };
  
  const handleSelectChange = (value: string, name: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSliderChange = (value: number[]) => {
    setFormData(prev => ({ ...prev, completionPercentage: value[0] }));
  };
  
  const handleTopicChange = (topicId: string) => {
    setFormData(prev => ({ ...prev, topicId }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please correct the errors before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const startDate = new Date(`${formData.date}T${formData.startTime}`);
      const endDate = new Date(`${formData.date}T${formData.endTime}`);
      
      // Create a StudyEvent object from form data
      const newEvent: StudyEvent = {
        id: editingSession ? editingSession.id : Math.random().toString(36).substring(2, 9), // Use existing ID if editing
        title: formData.title,
        start: startDate,
        end: endDate,
        type: formData.type,
        description: formData.description,
        backgroundColor: eventTypeColors[formData.type],
        borderColor: eventTypeColors[formData.type],
        priority: formData.priority,
        topicId: formData.topicId
      };
      
      // If editing a session that is in progress or completed, update the progress
      if (editingSession && (editingSession.status === 'IN_PROGRESS' || editingSession.status === 'COMPLETED')) {
        if (editingSession.status === 'COMPLETED') {
          // Complete the session with actual duration and notes
          await sessionsApi.completeSession(editingSession.id, {
            actualDurationMinutes: formData.actualDurationMinutes,
            notes: formData.notes
          });
        } else {
          // Update progress for in-progress session
          await sessionsApi.updateSessionProgress(editingSession.id, {
            completionPercentage: formData.completionPercentage,
            actualDurationMinutes: formData.actualDurationMinutes,
            notes: formData.notes
          });
        }
      }
      
      onSubmit(newEvent);
      onClose();
      
      toast({
        title: editingSession ? "Session Updated" : "Session Created",
        description: editingSession 
          ? "Your session has been updated successfully." 
          : "Your new study session has been created.",
      });
    } catch (error) {
      console.error("Error submitting session:", error);
      toast({
        title: "Error",
        description: "There was a problem saving your session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingSession 
              ? `Edit Session: ${editingSession.title}` 
              : 'Schedule New Learning Session'}
          </DialogTitle>
        </DialogHeader>
        
        {validationErrors.length > 0 && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc pl-5">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Details</span>
            </TabsTrigger>
            <TabsTrigger value="progress" disabled={!editingSession} className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>Progress</span>
            </TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit}>
            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="title" className="text-sm font-medium">Title *</label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="What are you learning?"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="type" className="text-sm font-medium">Session Type *</label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleSelectChange(value, 'type')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a session type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(eventTypeColors).map((type) => (
                        <SelectItem key={type} value={type}>
                          <div className="flex items-center">
                            <div
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: eventTypeColors[type as EventType] }}
                            />
                            {type}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="priority" className="text-sm font-medium">Priority</label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => handleSelectChange(value as 'LOW' | 'MEDIUM' | 'HIGH', 'priority')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="date" className="text-sm font-medium">Date *</label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="startTime" className="text-sm font-medium">Start Time *</label>
                  <Input
                    id="startTime"
                    name="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="endTime" className="text-sm font-medium">End Time *</label>
                  <Input
                    id="endTime"
                    name="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="topicId" className="text-sm font-medium">Topic</label>
                  <TopicSelector 
                    value={formData.topicId} 
                    onChange={handleTopicChange}
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="description" className="text-sm font-medium">Description</label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="What you'll be studying (optional)"
                    rows={3}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="progress" className="space-y-6 mt-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Completion Percentage</label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Slider
                        value={[formData.completionPercentage]}
                        onValueChange={handleSliderChange}
                        max={100}
                        step={5}
                      />
                    </div>
                    <div className="w-12 text-right font-medium">
                      {formData.completionPercentage}%
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="actualDurationMinutes" className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Actual Duration (minutes)</span>
                  </label>
                  <Input
                    id="actualDurationMinutes"
                    name="actualDurationMinutes"
                    type="number"
                    min={0}
                    value={formData.actualDurationMinutes}
                    onChange={handleNumberChange}
                    placeholder="How long did you actually study?"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="notes" className="text-sm font-medium">Notes</label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="What did you learn? Any challenges or insights?"
                    rows={4}
                  />
                </div>
              </div>
            </TabsContent>
            
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : editingSession ? "Update Session" : "Create Session"}
              </Button>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
} 