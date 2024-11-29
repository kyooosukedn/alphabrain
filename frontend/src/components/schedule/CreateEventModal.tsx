import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { format } from "date-fns";
import React from "react";

const eventTypes = {
  'Deep Work': '#8b5cf6',
  'Customer Interview': '#3b82f6',
  'Book Review': '#10b981',
  'TD Monthly Newsletter': '#f59e0b',
  'Record Video': '#ec4899'
} as const;

type EventType = keyof typeof eventTypes;

interface FormData {
  type: EventType | '';
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
}

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: any) => void;
  selectedDate: Date | null;
}

export function CreateEventModal({
  isOpen,
  onClose,
  onSubmit,
  selectedDate,
}: CreateEventModalProps) {
  const defaultStartTime = selectedDate 
    ? format(selectedDate, 'HH:mm')
    : '09:00';
  
  const defaultEndTime = selectedDate
    ? format(new Date(selectedDate.getTime() + 60 * 60 * 1000), 'HH:mm')
    : '10:00';

  const [formData, setFormData] = useState<FormData>({
    type: '',
    title: '',
    description: '',
    date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
    startTime: defaultStartTime,
    endTime: defaultEndTime,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.type || !formData.title || !formData.date) {
      return;
    }

    const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
    const endDateTime = new Date(`${formData.date}T${formData.endTime}`);

    const newEvent = {
      id: Math.random().toString(36).substring(2, 9),
      title: formData.title,
      start: startDateTime,
      end: endDateTime,
      type: formData.type,
      description: formData.description,
      backgroundColor: eventTypes[formData.type],
      borderColor: eventTypes[formData.type],
    };

    onSubmit(newEvent);
    onClose();
    setFormData({
      type: '',
      title: '',
      description: '',
      date: '',
      startTime: '09:00',
      endTime: '10:00',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Activity/Subject</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="type" className="text-sm font-medium">
              Activity Type
            </label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData({ ...formData, type: value as EventType })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(eventTypes).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Event title"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Event description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="date" className="text-sm font-medium">
                Date
              </label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="startTime" className="text-sm font-medium">
                Start Time
              </label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="endTime" className="text-sm font-medium">
                End Time
              </label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Block</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
